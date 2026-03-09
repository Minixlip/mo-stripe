import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE_NAME = 'token';
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000';

type CurrentSession = {
  email: string;
};

function isCurrentSession(payload: unknown): payload is CurrentSession {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof (payload as { email?: unknown }).email === 'string'
  );
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/session`, {
      headers: {
        Cookie: `${AUTH_COOKIE_NAME}=${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json().catch(() => null);

    if (!isCurrentSession(payload)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function requireAuthenticatedSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/login');
  }

  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getCurrentSession();

  if (session) {
    redirect('/account');
  }
}
