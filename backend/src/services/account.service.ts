import { prisma } from '../../prisma/client.js';

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
        activity: Array<{
          id: string;
          amount: number;
          type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
          incoming: boolean;
          systemGenerated: boolean;
          createdAt: Date;
        }>;
      };
    }
  | {
      success: false;
      statusCode: number;
      message: string;
    };

export const getAccountOverview = async (
  userId: string,
  email: string,
): Promise<AccountOverviewResult> => {
  try {
    const account = await prisma.account.findUnique({
      where: { userId },
      select: {
        id: true,
        balance: true,
        createdAt: true,
      },
    });

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
      take: 10,
      select: {
        id: true,
        amount: true,
        type: true,
        fromAccountId: true,
        toAccountId: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: {
        email,
        account,
        activity: transactions.map((transaction) => ({
          id: transaction.id,
          amount: transaction.amount,
          type: transaction.type,
          incoming: transaction.toAccountId === account.id,
          systemGenerated:
            transaction.fromAccountId === null || transaction.toAccountId === null,
          createdAt: transaction.createdAt,
        })),
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
