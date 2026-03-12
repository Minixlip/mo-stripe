import { prisma } from '../../../prisma/client.js';
import type {
  AccountMonthlyStatementResult,
  AccountOverviewResult,
  AccountTransactionDetailResult,
  AccountTransactionsResult,
} from './account.types.js';
import {
  buildMonthlyStatementSummary,
  getAccountTransactionDetailSelect,
  getAccountTransactionSelect,
  getMonthRange,
  getNetBalanceEffect,
  getUserAccount,
  getUserAccountId,
  mapTransactionActivity,
  mapTransactionDetail,
} from './account.shared.js';

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
        ledgerPostings: {
          some: {
            accountId: account.id,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 14,
      select: getAccountTransactionSelect(account.id),
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
        ledgerPostings: {
          some: {
            accountId: account.id,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: getAccountTransactionSelect(account.id),
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
        ledgerPostings: {
          some: {
            accountId: account.id,
          },
        },
      },
      select: getAccountTransactionDetailSelect(account.id),
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

export const getAccountMonthlyStatement = async (
  userId: string,
  month: string,
): Promise<AccountMonthlyStatementResult> => {
  try {
    const account = await getUserAccount(userId);

    if (!account) {
      return {
        success: false,
        statusCode: 404,
        message: 'Account not found.',
      };
    }

    const { periodStart, periodEnd, periodEndExclusive } = getMonthRange(month);

    const [monthTransactions, laterTransactions] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: {
          ledgerPostings: {
            some: {
              accountId: account.id,
            },
          },
          createdAt: {
            gte: periodStart,
            lt: periodEndExclusive,
          },
        },
        orderBy: { createdAt: 'asc' },
        select: getAccountTransactionDetailSelect(account.id),
      }),
      prisma.ledgerPosting.findMany({
        where: {
          accountId: account.id,
          createdAt: {
            gte: periodEndExclusive,
          },
        },
        orderBy: { createdAt: 'asc' },
        select: {
          amount: true,
          direction: true,
        },
      }),
    ]);

    const statementTransactions = monthTransactions.map((transaction) =>
      mapTransactionDetail(account.id, transaction),
    );
    const laterNetEffect = getNetBalanceEffect(laterTransactions);
    const closingBalance = account.balance - laterNetEffect;
    const monthNetEffect = statementTransactions.reduce(
      (total, transaction) =>
        total + (transaction.incoming ? transaction.amount : -transaction.amount),
      0,
    );
    const openingBalance = closingBalance - monthNetEffect;

    return {
      success: true,
      data: {
        statement: {
          month,
          generatedAt: new Date(),
          periodStart,
          periodEnd,
          account: {
            id: account.id,
            createdAt: account.createdAt,
          },
          summary: buildMonthlyStatementSummary(
            statementTransactions,
            openingBalance,
            closingBalance,
          ),
          transactions: statementTransactions,
        },
      },
    };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: 'Unable to load monthly statement.',
    };
  }
};
