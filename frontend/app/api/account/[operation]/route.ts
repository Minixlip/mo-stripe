import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_API_URL,
  AUTH_COOKIE_NAME,
  getCurrentAuthToken,
} from '@/lib/auth/backend';

const allowedOperations = new Set(['deposit', 'withdraw', 'transfer']);

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ operation: string }> },
) {
  const { operation } = await context.params;

  if (!allowedOperations.has(operation)) {
    return NextResponse.json({ error: 'Route not found.' }, { status: 404 });
  }

  const token = await getCurrentAuthToken();

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required.' },
      { status: 401 },
    );
  }

  const payload = await request.json().catch(() => null);
  const idempotencyKey = request.headers.get('idempotency-key');
  const headers = new Headers({
    'Content-Type': 'application/json',
    Cookie: `${AUTH_COOKIE_NAME}=${token}`,
  });

  if (idempotencyKey) {
    headers.set('Idempotency-Key', idempotencyKey);
  }

  const upstreamResponse = await fetch(`${AUTH_API_URL}/account/${operation}`, {
    method: 'POST',
    headers,
    cache: 'no-store',
    body: JSON.stringify(payload),
  }).catch(() => null);

  if (!upstreamResponse) {
    return NextResponse.json(
      { error: 'Unable to reach the banking API.' },
      { status: 502 },
    );
  }

  const upstreamPayload = await upstreamResponse.json().catch(() => null);
  const response = NextResponse.json(upstreamPayload, {
    status: upstreamResponse.status,
  });
  const replayed = upstreamResponse.headers.get('idempotency-replayed');

  if (replayed) {
    response.headers.set('Idempotency-Replayed', replayed);
  }

  return response;
}
