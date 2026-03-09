import 'server-only';

import { redirect } from 'next/navigation';
import { AUTH_API_URL, getAuthenticatedApiHeaders } from './backend';

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
  const headers = await getAuthenticatedApiHeaders();

  if (!headers) {
    return null;
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/session`, {
      headers,
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
