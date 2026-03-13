import { NextResponse } from 'next/server';
import {
  AUTH_API_URL,
  AUTH_COOKIE_NAME,
  getCurrentAuthToken,
  getFrontendAuthCookieOptions,
} from '@/lib/auth/backend';

export async function POST() {
  const token = await getCurrentAuthToken();

  if (token) {
    await fetch(`${AUTH_API_URL}/logout`, {
      method: 'POST',
      headers: {
        Cookie: `${AUTH_COOKIE_NAME}=${token}`,
      },
      cache: 'no-store',
    }).catch(() => null);
  }

  const response = NextResponse.json({ message: 'Successful logout' });

  response.cookies.set(AUTH_COOKIE_NAME, '', {
    ...getFrontendAuthCookieOptions(),
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
