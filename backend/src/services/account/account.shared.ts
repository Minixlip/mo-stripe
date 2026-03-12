import { prisma } from '../../../prisma/client.js';
import type {
  ActivityItem,
  BalanceEffectRecord,
  MonthlyStatementSummary,
  TransactionDetailItem,
  TransactionRecord,
} from './account.types.js';

export const accountTransactionSelect = {
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

export async function getUserAccount(userId: string) {
  return prisma.account.findUnique({
    where: { userId },
    select: {
      id: true,
      balance: true,
      createdAt: true,
    },
  });
}

export async function getUserAccountId(userId: string) {
  return prisma.account.findUnique({
    where: { userId },
    select: {
      id: true,
    },
  });
}

export function mapTransactionActivity(
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

export function mapTransactionDetail(
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

export function getMonthRange(month: string) {
  const [yearPart, monthPart] = month.split('-');
  const year = Number(yearPart);
  const monthIndex = Number(monthPart) - 1;
  const periodStart = new Date(Date.UTC(year, monthIndex, 1));
  const periodEndExclusive = new Date(Date.UTC(year, monthIndex + 1, 1));
  const periodEnd = new Date(periodEndExclusive.getTime() - 1);

  return {
    periodStart,
    periodEnd,
    periodEndExclusive,
  };
}

export function getNetBalanceEffect(
  accountId: string,
  transactions: BalanceEffectRecord[],
) {
  return transactions.reduce((total, transaction) => {
    if (transaction.toAccountId === accountId) {
      return total + transaction.amount;
    }

    return total - transaction.amount;
  }, 0);
}

export function buildMonthlyStatementSummary(
  transactions: TransactionDetailItem[],
  openingBalance: number,
  closingBalance: number,
): MonthlyStatementSummary {
  const totalDeposits = transactions.reduce((total, transaction) => {
    if (transaction.type !== 'DEPOSIT' || !transaction.incoming) {
      return total;
    }

    return total + transaction.amount;
  }, 0);

  const totalWithdrawals = transactions.reduce((total, transaction) => {
    if (transaction.type !== 'WITHDRAWAL' || transaction.incoming) {
      return total;
    }

    return total + transaction.amount;
  }, 0);

  const totalIncomingTransfers = transactions.reduce((total, transaction) => {
    if (transaction.type !== 'TRANSFER' || !transaction.incoming) {
      return total;
    }

    return total + transaction.amount;
  }, 0);

  const totalOutgoingTransfers = transactions.reduce((total, transaction) => {
    if (transaction.type !== 'TRANSFER' || transaction.incoming) {
      return total;
    }

    return total + transaction.amount;
  }, 0);

  return {
    openingBalance,
    closingBalance,
    totalDeposits,
    totalWithdrawals,
    totalIncomingTransfers,
    totalOutgoingTransfers,
    netFlow: closingBalance - openingBalance,
    transactionCount: transactions.length,
  };
}
