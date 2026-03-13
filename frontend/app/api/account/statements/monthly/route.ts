import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_API_URL,
  AUTH_COOKIE_NAME,
  getCurrentAuthToken,
} from '@/lib/auth/backend';

export async function GET(request: NextRequest) {
  const token = await getCurrentAuthToken();

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required.' },
      { status: 401 },
    );
  }

  const upstreamUrl = new URL(`${AUTH_API_URL}/account/statements/monthly`);
  const month = request.nextUrl.searchParams.get('month');

  if (month) {
    upstreamUrl.searchParams.set('month', month);
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    headers: {
      Cookie: `${AUTH_COOKIE_NAME}=${token}`,
    },
    cache: 'no-store',
  }).catch(() => null);

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
