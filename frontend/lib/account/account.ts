import 'server-only';

import { AUTH_API_URL, getAuthenticatedApiHeaders } from '@/lib/auth/backend';

export type AccountActivityEntry = {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  incoming: boolean;
  systemGenerated: boolean;
  createdAt: string;
  counterpartyEmail: string | null;
};

export type AccountTransactionDetail = AccountActivityEntry & {
  fromAccountId: string | null;
  toAccountId: string | null;
};

export type AccountOverview = {
  email: string;
  account: {
    id: string;
    balance: number;
    createdAt: string;
  };
  activity: AccountActivityEntry[];
};

function isAccountActivityEntry(payload: unknown): payload is AccountActivityEntry {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const transaction = payload as Record<string, unknown>;

  return (
    typeof transaction.id === 'string' &&
    typeof transaction.amount === 'number' &&
    typeof transaction.type === 'string' &&
    typeof transaction.incoming === 'boolean' &&
    typeof transaction.systemGenerated === 'boolean' &&
    typeof transaction.createdAt === 'string' &&
    (typeof transaction.counterpartyEmail === 'string' ||
      transaction.counterpartyEmail === null)
  );
}

function isAccountOverview(payload: unknown): payload is AccountOverview {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const record = payload as Record<string, unknown>;
  const account = record.account;

  return (
    typeof record.email === 'string' &&
    typeof account === 'object' &&
    account !== null &&
    typeof (account as Record<string, unknown>).id === 'string' &&
    typeof (account as Record<string, unknown>).balance === 'number' &&
    typeof (account as Record<string, unknown>).createdAt === 'string' &&
    Array.isArray(record.activity) &&
    record.activity.every(isAccountActivityEntry)
  );
}

function isAccountTransactionDetail(
  payload: unknown,
): payload is AccountTransactionDetail {
  if (!isAccountActivityEntry(payload)) {
    return false;
  }

  const transaction = payload as Record<string, unknown>;

  return (
    (typeof transaction.fromAccountId === 'string' ||
      transaction.fromAccountId === null) &&
    (typeof transaction.toAccountId === 'string' || transaction.toAccountId === null)
  );
}

function isAccountTransactionsPayload(
  payload: unknown,
): payload is { transactions: AccountActivityEntry[] } {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    Array.isArray((payload as { transactions?: unknown }).transactions) &&
    (payload as { transactions: unknown[] }).transactions.every(
      isAccountActivityEntry,
    )
  );
}

function isAccountTransactionDetailPayload(
  payload: unknown,
): payload is { transaction: AccountTransactionDetail } {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    isAccountTransactionDetail((payload as { transaction?: unknown }).transaction)
  );
}

async function fetchAuthenticatedAccountPayload<T>(
  path: string,
  isExpectedPayload: (payload: unknown) => payload is T,
) {
  const headers = await getAuthenticatedApiHeaders();

  if (!headers) {
    return null;
  }

  try {
    const response = await fetch(`${AUTH_API_URL}${path}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json().catch(() => null);

    if (!isExpectedPayload(payload)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAccountOverview() {
  return fetchAuthenticatedAccountPayload('/account', isAccountOverview);
}

export async function getAccountTransactions(limit = 24) {
  const payload = await fetchAuthenticatedAccountPayload(
    `/account/transactions?limit=${limit}`,
    isAccountTransactionsPayload,
  );

  return payload?.transactions ?? null;
}

export async function getAccountTransactionDetail(transactionId: string) {
  const payload = await fetchAuthenticatedAccountPayload(
    `/account/transactions/${transactionId}`,
    isAccountTransactionDetailPayload,
  );

  return payload?.transaction ?? null;
}
