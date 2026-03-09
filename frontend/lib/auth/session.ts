import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE_NAME = 'token';

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function getCurrentSession() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  return {
    hasToken: true,
  };
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
