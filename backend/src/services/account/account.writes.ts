import type { Prisma } from '@prisma/client';
import type {
  AccountMutationErrorData,
  AccountMutationResult,
  AccountMutationResponseBody,
  AccountMutationSuccessData,
  IdempotencyContext,
  TransferInput,
} from './account.types.js';
import { ACCOUNT_MUTATION_OPERATIONS } from './account.types.js';
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

async function executeDeposit(
  tx: Prisma.TransactionClient,
  userId: string,
  amount: number,
): Promise<MutationExecutionResult> {
  const account = await tx.account.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!account) {
    return {
      success: false,
      statusCode: 404,
      body: toErrorBody('Account not found.'),
    };
  }

  const updatedAccount = await tx.account.update({
    where: { id: account.id },
    data: {
      balance: {
        increment: amount,
      },
    },
    select: { balance: true },
  });

  await tx.transaction.create({
    data: {
      amount,
      type: 'DEPOSIT',
      toAccountId: account.id,
    },
  });

  return {
    success: true,
    statusCode: 201,
    body: toSuccessBody('Deposit recorded.', updatedAccount.balance),
  };
}

async function executeWithdrawal(
  tx: Prisma.TransactionClient,
  userId: string,
  amount: number,
): Promise<MutationExecutionResult> {
  const account = await tx.account.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!account) {
    return {
      success: false,
      statusCode: 404,
      body: toErrorBody('Account not found.'),
    };
  }

  const updated = await tx.account.updateMany({
    where: {
      id: account.id,
      balance: {
        gte: amount,
      },
    },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });

  if (updated.count === 0) {
    return {
      success: false,
      statusCode: 409,
      body: toErrorBody('Insufficient funds.'),
    };
  }

  const updatedAccount = await tx.account.findUnique({
    where: { id: account.id },
    select: { balance: true },
  });

  if (!updatedAccount) {
    throw new Error('ACCOUNT_BALANCE_LOOKUP_FAILED');
  }

  await tx.transaction.create({
    data: {
      amount,
      type: 'WITHDRAWAL',
      fromAccountId: account.id,
    },
  });

  return {
    success: true,
    statusCode: 201,
    body: toSuccessBody('Withdrawal recorded.', updatedAccount.balance),
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

  const senderAccount = await tx.account.findUnique({
    where: { userId },
    select: { id: true },
  });

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

  const updated = await tx.account.updateMany({
    where: {
      id: senderAccount.id,
      balance: {
        gte: input.amount,
      },
    },
    data: {
      balance: {
        decrement: input.amount,
      },
    },
  });

  if (updated.count === 0) {
    return {
      success: false,
      statusCode: 409,
      body: toErrorBody('Insufficient funds.'),
    };
  }

  await tx.account.update({
    where: { id: recipientAccount.id },
    data: {
      balance: {
        increment: input.amount,
      },
    },
  });

  const updatedSenderAccount = await tx.account.findUnique({
    where: { id: senderAccount.id },
    select: { balance: true },
  });

  if (!updatedSenderAccount) {
    throw new Error('ACCOUNT_BALANCE_LOOKUP_FAILED');
  }

  await tx.transaction.create({
    data: {
      amount: input.amount,
      type: 'TRANSFER',
      fromAccountId: senderAccount.id,
      toAccountId: recipientAccount.id,
    },
  });

  return {
    success: true,
    statusCode: 201,
    body: toSuccessBody('Transfer completed.', updatedSenderAccount.balance),
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
