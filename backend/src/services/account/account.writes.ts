import { prisma } from '../../../prisma/client.js';
import type {
  AccountMutationResult,
  TransferInput,
} from './account.types.js';

const ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND';
const INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS';
const RECIPIENT_NOT_FOUND = 'RECIPIENT_NOT_FOUND';

export const depositIntoAccount = async (
  userId: string,
  amount: number,
): Promise<AccountMutationResult> => {
  try {
    const updatedBalance = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!account) {
        throw new Error(ACCOUNT_NOT_FOUND);
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

      return updatedAccount.balance;
    });

    return {
      success: true,
      data: {
        message: 'Deposit recorded.',
        balance: updatedBalance,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === ACCOUNT_NOT_FOUND) {
      return {
        success: false,
        statusCode: 404,
        message: 'Account not found.',
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: 'Unable to record deposit.',
    };
  }
};

export const withdrawFromAccount = async (
  userId: string,
  amount: number,
): Promise<AccountMutationResult> => {
  try {
    const updatedBalance = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!account) {
        throw new Error(ACCOUNT_NOT_FOUND);
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
        throw new Error(INSUFFICIENT_FUNDS);
      }

      const updatedAccount = await tx.account.findUnique({
        where: { id: account.id },
        select: { balance: true },
      });

      if (!updatedAccount) {
        throw new Error(ACCOUNT_NOT_FOUND);
      }

      await tx.transaction.create({
        data: {
          amount,
          type: 'WITHDRAWAL',
          fromAccountId: account.id,
        },
      });

      return updatedAccount.balance;
    });

    return {
      success: true,
      data: {
        message: 'Withdrawal recorded.',
        balance: updatedBalance,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === ACCOUNT_NOT_FOUND) {
      return {
        success: false,
        statusCode: 404,
        message: 'Account not found.',
      };
    }

    if (error instanceof Error && error.message === INSUFFICIENT_FUNDS) {
      return {
        success: false,
        statusCode: 409,
        message: 'Insufficient funds.',
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: 'Unable to record withdrawal.',
    };
  }
};

export const transferBetweenAccounts = async (
  userId: string,
  senderEmail: string,
  input: TransferInput,
): Promise<AccountMutationResult> => {
  try {
    if (input.recipientEmail === senderEmail) {
      return {
        success: false,
        statusCode: 400,
        message: 'You cannot transfer funds to your own account.',
      };
    }

    const updatedBalance = await prisma.$transaction(async (tx) => {
      const senderAccount = await tx.account.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!senderAccount) {
        throw new Error(ACCOUNT_NOT_FOUND);
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
        throw new Error(RECIPIENT_NOT_FOUND);
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
        throw new Error(INSUFFICIENT_FUNDS);
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
        throw new Error(ACCOUNT_NOT_FOUND);
      }

      await tx.transaction.create({
        data: {
          amount: input.amount,
          type: 'TRANSFER',
          fromAccountId: senderAccount.id,
          toAccountId: recipientAccount.id,
        },
      });

      return updatedSenderAccount.balance;
    });

    return {
      success: true,
      data: {
        message: 'Transfer completed.',
        balance: updatedBalance,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === ACCOUNT_NOT_FOUND) {
      return {
        success: false,
        statusCode: 404,
        message: 'Account not found.',
      };
    }

    if (error instanceof Error && error.message === RECIPIENT_NOT_FOUND) {
      return {
        success: false,
        statusCode: 404,
        message: 'Recipient account not found.',
      };
    }

    if (error instanceof Error && error.message === INSUFFICIENT_FUNDS) {
      return {
        success: false,
        statusCode: 409,
        message: 'Insufficient funds.',
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: 'Unable to complete transfer.',
    };
  }
};
