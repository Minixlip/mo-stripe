export type ActivityItem = {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  incoming: boolean;
  systemGenerated: boolean;
  createdAt: Date;
  counterpartyEmail: string | null;
};

export type TransactionRecord = {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  fromAccountId: string | null;
  toAccountId: string | null;
  createdAt: Date;
  fromAccount: { user: { email: string } } | null;
  toAccount: { user: { email: string } } | null;
};

export type TransactionDetailItem = ActivityItem & {
  fromAccountId: string | null;
  toAccountId: string | null;
};

export type BalanceEffectRecord = {
  amount: number;
  fromAccountId: string | null;
  toAccountId: string | null;
};

export type MonthlyStatementSummary = {
  openingBalance: number;
  closingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalIncomingTransfers: number;
  totalOutgoingTransfers: number;
  netFlow: number;
  transactionCount: number;
};

export type MonthlyStatementData = {
  month: string;
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  account: {
    id: string;
    createdAt: Date;
  };
  summary: MonthlyStatementSummary;
  transactions: TransactionDetailItem[];
};

export const ACCOUNT_MUTATION_OPERATIONS = {
  DEPOSIT: 'ACCOUNT_DEPOSIT',
  WITHDRAW: 'ACCOUNT_WITHDRAW',
  TRANSFER: 'ACCOUNT_TRANSFER',
} as const;

export type AccountMutationOperation =
  (typeof ACCOUNT_MUTATION_OPERATIONS)[keyof typeof ACCOUNT_MUTATION_OPERATIONS];

export type IdempotencyContext = {
  key: string;
  requestHash: string;
};

export type AccountMutationSuccessData = {
  message: string;
  balance: number;
};

export type AccountMutationErrorData = {
  error: string;
};

export type AccountMutationResponseBody =
  | AccountMutationSuccessData
  | AccountMutationErrorData;

export type AccountOverviewResult =
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

export type AccountMutationResult =
  | {
      success: true;
      statusCode: number;
      replayed: boolean;
      data: AccountMutationSuccessData;
    }
  | {
      success: false;
      statusCode: number;
      replayed: boolean;
      message: string;
    };

export type AccountTransactionsResult =
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

export type AccountTransactionDetailResult =
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

export type AccountMonthlyStatementResult =
  | {
      success: true;
      data: {
        statement: MonthlyStatementData;
      };
    }
  | {
      success: false;
      statusCode: number;
      message: string;
    };

export type TransferInput = {
  amount: number;
  recipientEmail: string;
};
