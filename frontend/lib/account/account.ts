import 'server-only';

import { AUTH_API_URL, getAuthenticatedApiHeaders } from '@/lib/auth/backend';

export type AccountOverview = {
  email: string;
  account: {
    id: string;
    balance: number;
    createdAt: string;
  };
  activity: Array<{
    id: string;
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
    incoming: boolean;
    systemGenerated: boolean;
    createdAt: string;
  }>;
};

function isAccountOverview(payload: unknown): payload is AccountOverview {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const record = payload as Record<string, unknown>;
  const account = record.account;
  const activity = record.activity;

  return (
    typeof record.email === 'string' &&
    typeof account === 'object' &&
    account !== null &&
    typeof (account as Record<string, unknown>).id === 'string' &&
    typeof (account as Record<string, unknown>).balance === 'number' &&
    typeof (account as Record<string, unknown>).createdAt === 'string' &&
    Array.isArray(activity)
  );
}

export async function getAccountOverview() {
  const headers = await getAuthenticatedApiHeaders();

  if (!headers) {
    return null;
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/account`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json().catch(() => null);

    if (!isAccountOverview(payload)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
