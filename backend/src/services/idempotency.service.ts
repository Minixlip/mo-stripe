import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client.js';

const IDEMPOTENCY_MISMATCH_MESSAGE =
  'This idempotency key has already been used for a different request.';
const IDEMPOTENCY_IN_PROGRESS_MESSAGE =
  'A request with this idempotency key is already being processed.';

type JsonObject = Prisma.InputJsonObject;

type IdempotentExecutionResult<TBody extends JsonObject> = {
  success: boolean;
  replayed: boolean;
  statusCode: number;
  body: TBody;
};

type ExecuteIdempotentRequestInput<TBody extends JsonObject> = {
  userId: string;
  key: string;
  operation: string;
  requestHash: string;
  execute: (
    tx: Prisma.TransactionClient,
  ) => Promise<{
    success: boolean;
    statusCode: number;
    body: TBody;
  }>;
};

type IdempotencyKeyClient = {
  idempotencyKey: Prisma.IdempotencyKeyDelegate;
};

type IdempotencyTransactionClient = Prisma.TransactionClient & IdempotencyKeyClient;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mapStoredIdempotencyRecord<TBody extends JsonObject>(
  record: {
    operation: string;
    requestHash: string;
    status: 'PENDING' | 'COMPLETED';
    responseStatus: number | null;
    responseBody: Prisma.JsonValue | null;
  },
  input: Pick<
    ExecuteIdempotentRequestInput<TBody>,
    'operation' | 'requestHash'
  >,
): IdempotentExecutionResult<TBody | { error: string }> {
  if (
    record.operation !== input.operation ||
    record.requestHash !== input.requestHash
  ) {
    return {
      success: false,
      replayed: false,
      statusCode: 409,
      body: { error: IDEMPOTENCY_MISMATCH_MESSAGE },
    };
  }

  if (
    record.status !== 'COMPLETED' ||
    record.responseStatus === null ||
    !isJsonObject(record.responseBody)
  ) {
    return {
      success: false,
      replayed: false,
      statusCode: 409,
      body: { error: IDEMPOTENCY_IN_PROGRESS_MESSAGE },
    };
  }

  return {
    success: record.responseStatus >= 200 && record.responseStatus < 300,
    replayed: true,
    statusCode: record.responseStatus,
    body: record.responseBody as TBody,
  };
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

export async function executeIdempotentRequest<TBody extends JsonObject>(
  input: ExecuteIdempotentRequestInput<TBody>,
): Promise<IdempotentExecutionResult<TBody | { error: string }>> {
  const idempotencyPrisma = prisma as typeof prisma & IdempotencyKeyClient;

  try {
    return await prisma.$transaction(async (tx) => {
      const idempotencyTx = tx as IdempotencyTransactionClient;
      const existing = await idempotencyTx.idempotencyKey.findUnique({
        where: {
          userId_key: {
            userId: input.userId,
            key: input.key,
          },
        },
        select: {
          operation: true,
          requestHash: true,
          status: true,
          responseStatus: true,
          responseBody: true,
        },
      });

      if (existing) {
        return mapStoredIdempotencyRecord(existing, input);
      }

      await idempotencyTx.idempotencyKey.create({
        data: {
          userId: input.userId,
          key: input.key,
          operation: input.operation,
          requestHash: input.requestHash,
          status: 'PENDING',
        },
      });

      const executionResult = await input.execute(tx);

      await idempotencyTx.idempotencyKey.update({
        where: {
          userId_key: {
            userId: input.userId,
            key: input.key,
          },
        },
        data: {
          status: 'COMPLETED',
          responseStatus: executionResult.statusCode,
          responseBody: executionResult.body,
          completedAt: new Date(),
        },
      });

      return {
        success: executionResult.success,
        replayed: false,
        statusCode: executionResult.statusCode,
        body: executionResult.body,
      };
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const existing = await idempotencyPrisma.idempotencyKey.findUnique({
      where: {
        userId_key: {
          userId: input.userId,
          key: input.key,
        },
      },
      select: {
        operation: true,
        requestHash: true,
        status: true,
        responseStatus: true,
        responseBody: true,
      },
    });

    if (!existing) {
      throw error;
    }

    return mapStoredIdempotencyRecord(existing, input);
  }
}
