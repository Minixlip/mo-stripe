import { prisma } from '../../prisma/client.js';

type ActivityItem = {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  incoming: boolean;
  systemGenerated: boolean;
  createdAt: Date;
  counterpartyEmail: string | null;
};

type TransactionRecord = {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  fromAccountId: string | null;
  toAccountId: string | null;
  createdAt: Date;
  fromAccount: { user: { email: string } } | null;
  toAccount: { user: { email: string } } | null;
};

type TransactionDetailItem = ActivityItem & {
  fromAccountId: string | null;
  toAccountId: string | null;
};

type AccountOverviewResult =
  | {
      success: true;
      data: {
        email: string;
        account: {
          id: string;
          balance: number;
          createdAt: Date;
        };
        activity: ActivityItem[];
      };
    }
  | {
      success: false;
      statusCode: number;
      message: string;
    };

type AccountMutationResult =
  | {
      success: true;
      data: {
        message: string;
        balance: number;
      };
    }
  | {
      success: false;
      statusCode: number;
      message: string;
    };

type AccountTransactionsResult =
  | {
      success: true;
      data: {
        transactions: ActivityItem[];
      };
    }
  | {
      success: false;
      statusCode: number;
      message: string;
    };

type AccountTransactionDetailResult =
  | {
      success: true;
      data: {
        transaction: TransactionDetailItem;
      };
    }
  | {
      success: false;
      statusCode: number;
      message: string;
    };

type TransferInput = {
  amount: number;
  recipientEmail: string;
};

function mapTransactionActivity(
  accountId: string,
  transactions: TransactionRecord[],
): ActivityItem[] {
  return transactions.map((transaction) => ({
    id: transaction.id,
    amount: transaction.amount,
    type: transaction.type,
    incoming: transaction.toAccountId === accountId,
    systemGenerated:
      transaction.fromAccountId === null || transaction.toAccountId === null,
    createdAt: transaction.createdAt,
    counterpartyEmail:
      transaction.toAccountId === accountId
        ? transaction.fromAccount?.user.email ?? null
        : transaction.toAccount?.user.email ?? null,
  }));
}

function mapTransactionDetail(
  accountId: string,
  transaction: TransactionRecord,
): TransactionDetailItem {
  const activity = mapTransactionActivity(accountId, [transaction])[0];

  if (!activity) {
    throw new Error('TRANSACTION_MAPPING_FAILED');
  }

  return {
    id: activity.id,
    amount: activity.amount,
    type: activity.type,
    incoming: activity.incoming,
    systemGenerated: activity.systemGenerated,
    createdAt: activity.createdAt,
    counterpartyEmail: activity.counterpartyEmail,
    fromAccountId: transaction.fromAccountId,
    toAccountId: transaction.toAccountId,
  };
}

async function getUserAccount(userId: string) {
  return prisma.account.findUnique({
    where: { userId },
    select: {
      id: true,
      balance: true,
      createdAt: true,
    },
  });
}

async function getUserAccountId(userId: string) {
  return prisma.account.findUnique({
    where: { userId },
    select: {
      id: true,
    },
  });
}

const accountTransactionSelect = {
  id: true,
  amount: true,
  type: true,
  fromAccountId: true,
  toAccountId: true,
  createdAt: true,
  fromAccount: {
    select: {
      user: {
        select: {
          email: true,
        },
      },
    },
  },
  toAccount: {
    select: {
      user: {
        select: {
          email: true,
        },
      },
    },
  },
} as const;

export const getAccountOverview = async (
  userId: string,
  email: string,
): Promise<AccountOverviewResult> => {
  try {
    const account = await getUserAccount(userId);

    if (!account) {
      return {
        success: false,
        statusCode: 404,
        message: 'Account not found.',
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ fromAccountId: account.id }, { toAccountId: account.id }],
      },
      orderBy: { createdAt: 'desc' },
      take: 14,
      select: accountTransactionSelect,
    });

    return {
      success: true,
      data: {
        email,
        account,
        activity: mapTransactionActivity(account.id, transactions),
      },
    };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: 'Unable to load account.',
    };
  }
};

export const getAccountTransactions = async (
  userId: string,
  limit: number,
): Promise<AccountTransactionsResult> => {
  try {
    const account = await getUserAccountId(userId);

    if (!account) {
      return {
        success: false,
        statusCode: 404,
        message: 'Account not found.',
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ fromAccountId: account.id }, { toAccountId: account.id }],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: accountTransactionSelect,
    });

    return {
      success: true,
      data: {
        transactions: mapTransactionActivity(account.id, transactions),
      },
    };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: 'Unable to load transactions.',
    };
  }
};

export const getAccountTransactionDetail = async (
  userId: string,
  transactionId: string,
): Promise<AccountTransactionDetailResult> => {
  try {
    const account = await getUserAccountId(userId);

    if (!account) {
      return {
        success: false,
        statusCode: 404,
        message: 'Account not found.',
      };
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        OR: [{ fromAccountId: account.id }, { toAccountId: account.id }],
      },
      select: accountTransactionSelect,
    });

    if (!transaction) {
      return {
        success: false,
        statusCode: 404,
        message: 'Transaction not found.',
      };
    }

    return {
      success: true,
      data: {
        transaction: mapTransactionDetail(account.id, transaction),
      },
    };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: 'Unable to load transaction details.',
    };
  }
};

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
        throw new Error('ACCOUNT_NOT_FOUND');
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
    if (error instanceof Error && error.message === 'ACCOUNT_NOT_FOUND') {
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
        throw new Error('ACCOUNT_NOT_FOUND');
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
        throw new Error('INSUFFICIENT_FUNDS');
      }

      const updatedAccount = await tx.account.findUnique({
        where: { id: account.id },
        select: { balance: true },
      });

      if (!updatedAccount) {
        throw new Error('ACCOUNT_NOT_FOUND');
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
    if (error instanceof Error && error.message === 'ACCOUNT_NOT_FOUND') {
      return {
        success: false,
        statusCode: 404,
        message: 'Account not found.',
      };
    }

    if (error instanceof Error && error.message === 'INSUFFICIENT_FUNDS') {
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
        throw new Error('ACCOUNT_NOT_FOUND');
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
        throw new Error('RECIPIENT_NOT_FOUND');
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
        throw new Error('INSUFFICIENT_FUNDS');
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
        throw new Error('ACCOUNT_NOT_FOUND');
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
    if (error instanceof Error && error.message === 'ACCOUNT_NOT_FOUND') {
      return {
        success: false,
        statusCode: 404,
        message: 'Account not found.',
      };
    }

    if (error instanceof Error && error.message === 'RECIPIENT_NOT_FOUND') {
      return {
        success: false,
        statusCode: 404,
        message: 'Recipient account not found.',
      };
    }

    if (error instanceof Error && error.message === 'INSUFFICIENT_FUNDS') {
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
