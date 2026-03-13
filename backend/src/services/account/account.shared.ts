import { Prisma } from '@prisma/client';
import { prisma } from '../../../prisma/client.js';
import type {
  ActivityItem,
  BalanceEffectRecord,
  MonthlyStatementSummary,
  TransactionDetailItem,
  TransactionDetailRecord,
  TransactionRecord,
} from './account.types.js';

function getOwnedLedgerPosting(
  accountId: string,
  transaction: TransactionRecord,
) {
  const ownedLedgerPosting = transaction.ledgerPostings.find(
    (posting) => posting.accountId === accountId,
  );

  if (!ownedLedgerPosting) {
    throw new Error('OWNED_LEDGER_POSTING_NOT_FOUND');
  }

  return ownedLedgerPosting;
}

type PrismaLedgerClient = Prisma.TransactionClient | typeof prisma;

export function getAccountTransactionSelect(accountId: string) {
  return Prisma.validator<Prisma.TransactionSelect>()({
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
    ledgerPostings: {
      where: {
        accountId,
      },
      select: {
        id: true,
        accountId: true,
        amount: true,
        direction: true,
        createdAt: true,
      },
    },
  });
}

export function getAccountTransactionDetailSelect(accountId: string) {
  return Prisma.validator<Prisma.TransactionSelect>()({
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
    ledgerPostings: {
      select: {
        id: true,
        accountId: true,
        amount: true,
        direction: true,
        createdAt: true,
        account: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          direction: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ] as Prisma.LedgerPostingOrderByWithRelationInput[],
    },
  });
}

function getSignedPostingAmount(posting: BalanceEffectRecord) {
  return posting.direction === 'CREDIT' ? posting.amount : -posting.amount;
}

export async function getLedgerBalance(
  client: PrismaLedgerClient,
  accountId: string,
  range?: {
    gte?: Date;
    lt?: Date;
  },
) {
  const where: Prisma.LedgerPostingWhereInput = { accountId };

  if (range?.gte || range?.lt) {
    const createdAt: Prisma.DateTimeFilter = {};

    if (range.gte) {
      createdAt.gte = range.gte;
    }

    if (range.lt) {
      createdAt.lt = range.lt;
    }

    where.createdAt = createdAt;
  }

  const postingsByDirection = await client.ledgerPosting.groupBy({
    by: ['direction'],
    where,
    _sum: {
      amount: true,
    },
  });

  return getNetBalanceEffect(
    postingsByDirection.map((posting) => ({
      amount: posting._sum.amount ?? 0,
      direction: posting.direction,
    })),
  );
}

export async function getUserAccount(userId: string) {
  const account = await prisma.account.findUnique({
    where: { userId },
    select: {
      id: true,
      createdAt: true,
    },
  });

  if (!account) {
    return null;
  }

  const balance = await getLedgerBalance(prisma, account.id);

  return {
    ...account,
    balance,
  };
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
  return transactions.map((transaction) => {
    const ownedLedgerPosting = getOwnedLedgerPosting(accountId, transaction);
    const incoming = ownedLedgerPosting.direction === 'CREDIT';

    return {
      id: transaction.id,
      amount: ownedLedgerPosting.amount,
      type: transaction.type,
      incoming,
      systemGenerated:
        transaction.fromAccountId === null || transaction.toAccountId === null,
      createdAt: transaction.createdAt,
      counterpartyEmail: incoming
        ? transaction.fromAccount?.user.email ?? null
        : transaction.toAccount?.user.email ?? null,
    };
  });
}

export function mapTransactionDetail(
  accountId: string,
  transaction: TransactionDetailRecord,
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
    ledgerPostings: transaction.ledgerPostings.map((posting) => ({
      id: posting.id,
      accountId: posting.accountId,
      amount: posting.amount,
      direction: posting.direction,
      createdAt: posting.createdAt,
      accountOwnerEmail: posting.account.user.email || null,
    })),
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
  transactions: BalanceEffectRecord[],
) {
  return transactions.reduce(
    (total, transaction) => total + getSignedPostingAmount(transaction),
    0,
  );
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
