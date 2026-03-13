import 'server-only';

import { cookies } from 'next/headers';

export const AUTH_COOKIE_NAME = 'token';
export const AUTH_API_URL =
  process.env.AUTH_API_URL ??
  process.env.NEXT_PUBLIC_AUTH_API_URL ??
  'http://localhost:4000';

export function getFrontendAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
}

export function extractAuthTokenFromSetCookie(setCookieHeader: string | null) {
  if (!setCookieHeader) {
    return null;
  }

  const tokenMatch = setCookieHeader.match(
    new RegExp(`(?:^|,)\\s*${AUTH_COOKIE_NAME}=([^;]+)`),
  );

  if (!tokenMatch?.[1]) {
    return null;
  }

  return decodeURIComponent(tokenMatch[1]);
}

export async function getCurrentAuthToken() {
  const cookieStore = await cookies();

  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function getAuthenticatedApiHeaders() {
  const token = await getCurrentAuthToken();

  if (!token) {
    return null;
  }

  return {
    Cookie: `${AUTH_COOKIE_NAME}=${token}`,
  };
}
