import { Prisma } from '@prisma/client';
import type {
  AccountMutationErrorData,
  AccountMutationResult,
  AccountMutationResponseBody,
  AccountMutationSuccessData,
  IdempotencyContext,
  TransferInput,
} from './account.types.js';
import { ACCOUNT_MUTATION_OPERATIONS } from './account.types.js';
import { getLedgerBalance } from './account.shared.js';
import { executeIdempotentRequest } from '../idempotency.service.js';

type MutationExecutionResult = {
  success: boolean;
  statusCode: number;
  body: AccountMutationResponseBody;
};

function toErrorBody(error: string): AccountMutationErrorData {
  return { error };
}

function toSuccessBody(
  message: string,
  balance: number,
): AccountMutationSuccessData {
  return { message, balance };
}

function mapMutationResult(
  result: Awaited<ReturnType<typeof executeIdempotentRequest<AccountMutationResponseBody>>>,
): AccountMutationResult {
  if (result.success && 'message' in result.body && 'balance' in result.body) {
    return {
      success: true,
      statusCode: result.statusCode,
      replayed: result.replayed,
      data: result.body,
    };
  }

  const errorMessage =
    'error' in result.body && typeof result.body.error === 'string'
      ? result.body.error
      : 'Unable to process request.';

  return {
    success: false,
    statusCode: result.statusCode,
    replayed: result.replayed,
    message: errorMessage,
  };
}

async function getAccountIdForUser(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  return tx.account.findUnique({
    where: { userId },
    select: { id: true },
  });
}

async function lockAccountRows(
  tx: Prisma.TransactionClient,
  accountIds: string[],
) {
  const uniqueSortedIds = [...new Set(accountIds)].sort();

  if (uniqueSortedIds.length === 0) {
    return;
  }

  await tx.$queryRaw`
    SELECT "id"
    FROM "Account"
    WHERE "id" IN (${Prisma.join(uniqueSortedIds)})
    ORDER BY "id"
    FOR UPDATE
  `;
}

async function executeDeposit(
  tx: Prisma.TransactionClient,
  userId: string,
  amount: number,
): Promise<MutationExecutionResult> {
  const account = await getAccountIdForUser(tx, userId);

  if (!account) {
    return {
      success: false,
      statusCode: 404,
      body: toErrorBody('Account not found.'),
    };
  }

  await lockAccountRows(tx, [account.id]);

  const transaction = await tx.transaction.create({
    data: {
      amount,
      type: 'DEPOSIT',
      toAccountId: account.id,
    },
    select: {
      id: true,
    },
  });

  await tx.ledgerPosting.create({
    data: {
      transactionId: transaction.id,
      accountId: account.id,
      amount,
      direction: 'CREDIT',
    },
  });

  const balance = await getLedgerBalance(tx, account.id);

  return {
    success: true,
    statusCode: 201,
    body: toSuccessBody('Deposit recorded.', balance),
  };
}

async function executeWithdrawal(
  tx: Prisma.TransactionClient,
  userId: string,
  amount: number,
): Promise<MutationExecutionResult> {
  const account = await getAccountIdForUser(tx, userId);

  if (!account) {
    return {
      success: false,
      statusCode: 404,
      body: toErrorBody('Account not found.'),
    };
  }

  await lockAccountRows(tx, [account.id]);

  const currentBalance = await getLedgerBalance(tx, account.id);

  if (currentBalance < amount) {
    return {
      success: false,
      statusCode: 409,
      body: toErrorBody('Insufficient funds.'),
    };
  }

  const transaction = await tx.transaction.create({
    data: {
      amount,
      type: 'WITHDRAWAL',
      fromAccountId: account.id,
    },
    select: {
      id: true,
    },
  });

  await tx.ledgerPosting.create({
    data: {
      transactionId: transaction.id,
      accountId: account.id,
      amount,
      direction: 'DEBIT',
    },
  });

  return {
    success: true,
    statusCode: 201,
    body: toSuccessBody('Withdrawal recorded.', currentBalance - amount),
  };
}

async function executeTransfer(
  tx: Prisma.TransactionClient,
  userId: string,
  senderEmail: string,
  input: TransferInput,
): Promise<MutationExecutionResult> {
  if (input.recipientEmail === senderEmail) {
    return {
      success: false,
      statusCode: 400,
      body: toErrorBody('You cannot transfer funds to your own account.'),
    };
  }

  const senderAccount = await getAccountIdForUser(tx, userId);

  if (!senderAccount) {
    return {
      success: false,
      statusCode: 404,
      body: toErrorBody('Account not found.'),
    };
  }

  const recipientAccount = await tx.account.findFirst({
    where: {
      user: {
        email: input.recipientEmail,
      },
    },
    select: {
      id: true,
    },
  });

  if (!recipientAccount) {
    return {
      success: false,
      statusCode: 404,
      body: toErrorBody('Recipient account not found.'),
    };
  }

  await lockAccountRows(tx, [senderAccount.id, recipientAccount.id]);

  const senderBalance = await getLedgerBalance(tx, senderAccount.id);

  if (senderBalance < input.amount) {
    return {
      success: false,
      statusCode: 409,
      body: toErrorBody('Insufficient funds.'),
    };
  }

  const transaction = await tx.transaction.create({
    data: {
      amount: input.amount,
      type: 'TRANSFER',
      fromAccountId: senderAccount.id,
      toAccountId: recipientAccount.id,
    },
    select: {
      id: true,
    },
  });

  await tx.ledgerPosting.createMany({
    data: [
      {
        transactionId: transaction.id,
        accountId: senderAccount.id,
        amount: input.amount,
        direction: 'DEBIT',
      },
      {
        transactionId: transaction.id,
        accountId: recipientAccount.id,
        amount: input.amount,
        direction: 'CREDIT',
      },
    ],
  });

  return {
    success: true,
    statusCode: 201,
    body: toSuccessBody('Transfer completed.', senderBalance - input.amount),
  };
}

export const depositIntoAccount = async (
  userId: string,
  amount: number,
  idempotency: IdempotencyContext,
): Promise<AccountMutationResult> => {
  try {
    const result = await executeIdempotentRequest({
      userId,
      key: idempotency.key,
      operation: ACCOUNT_MUTATION_OPERATIONS.DEPOSIT,
      requestHash: idempotency.requestHash,
      execute: async (tx) => executeDeposit(tx, userId, amount),
    });

    return mapMutationResult(result);
  } catch {
    return {
      success: false,
      statusCode: 500,
      replayed: false,
      message: 'Unable to record deposit.',
    };
  }
};

export const withdrawFromAccount = async (
  userId: string,
  amount: number,
  idempotency: IdempotencyContext,
): Promise<AccountMutationResult> => {
  try {
    const result = await executeIdempotentRequest({
      userId,
      key: idempotency.key,
      operation: ACCOUNT_MUTATION_OPERATIONS.WITHDRAW,
      requestHash: idempotency.requestHash,
      execute: async (tx) => executeWithdrawal(tx, userId, amount),
    });

    return mapMutationResult(result);
  } catch {
    return {
      success: false,
      statusCode: 500,
      replayed: false,
      message: 'Unable to record withdrawal.',
    };
  }
};

export const transferBetweenAccounts = async (
  userId: string,
  senderEmail: string,
  input: TransferInput,
  idempotency: IdempotencyContext,
): Promise<AccountMutationResult> => {
  try {
    const result = await executeIdempotentRequest({
      userId,
      key: idempotency.key,
      operation: ACCOUNT_MUTATION_OPERATIONS.TRANSFER,
      requestHash: idempotency.requestHash,
      execute: async (tx) => executeTransfer(tx, userId, senderEmail, input),
    });

    return mapMutationResult(result);
  } catch {
    return {
      success: false,
      statusCode: 500,
      replayed: false,
      message: 'Unable to complete transfer.',
    };
  }
};
