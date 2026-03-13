import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_API_URL,
  AUTH_COOKIE_NAME,
  extractAuthTokenFromSetCookie,
  getFrontendAuthCookieOptions,
} from '@/lib/auth/backend';

function getErrorMessage(payload: unknown, fallbackMessage: string) {
  if (typeof payload === 'object' && payload !== null) {
    const record = payload as Record<string, unknown>;

    if (typeof record.error === 'string') {
      return record.error;
    }

    if (typeof record.message === 'string') {
      return record.message;
    }
  }

  return fallbackMessage;
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  const upstreamResponse = await fetch(`${AUTH_API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify(payload),
  }).catch(() => null);

  if (!upstreamResponse) {
    return NextResponse.json(
      { error: 'Unable to reach the authentication server.' },
      { status: 502 },
    );
  }

  const upstreamPayload = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      { error: getErrorMessage(upstreamPayload, 'Registration failed.') },
      { status: upstreamResponse.status },
    );
  }

  const token = extractAuthTokenFromSetCookie(
    upstreamResponse.headers.get('set-cookie'),
  );

  if (!token) {
    return NextResponse.json(
      { error: 'Registration succeeded but no session cookie was issued.' },
      { status: 502 },
    );
  }

  const response = NextResponse.json(
    upstreamPayload ?? { message: 'Successful registration' },
    { status: upstreamResponse.status },
  );

  response.cookies.set(AUTH_COOKIE_NAME, token, getFrontendAuthCookieOptions());

  return response;
}
