import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_API_URL,
  AUTH_COOKIE_NAME,
  getCurrentAuthToken,
} from '@/lib/auth/backend';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ transactionId: string }> },
) {
  const token = await getCurrentAuthToken();

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required.' },
      { status: 401 },
    );
  }

  const { transactionId } = await context.params;
  const upstreamResponse = await fetch(
    `${AUTH_API_URL}/account/transactions/${transactionId}`,
    {
      headers: {
        Cookie: `${AUTH_COOKIE_NAME}=${token}`,
      },
      cache: 'no-store',
    },
  ).catch(() => null);

  if (!upstreamResponse) {
    return NextResponse.json(
      { error: 'Unable to reach the banking API.' },
      { status: 502 },
    );
  }

  const upstreamPayload = await upstreamResponse.json().catch(() => null);

  return NextResponse.json(upstreamPayload, {
    status: upstreamResponse.status,
  });
}
