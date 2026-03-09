import 'server-only';

import { cookies } from 'next/headers';

export const AUTH_COOKIE_NAME = 'token';
export const AUTH_API_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000';

export async function getAuthenticatedApiHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;

  if (!token) {
    return null;
  }

  return {
    Cookie: `${AUTH_COOKIE_NAME}=${token}`,
  };
}
