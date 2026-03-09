import type { Metadata } from 'next';
import { AuthPage } from '@/components/auth';
import { redirectIfAuthenticated } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'mo-stripe | Sign in',
  description: 'Operator sign-in page for mo-stripe.',
};

export default async function LoginPage() {
  await redirectIfAuthenticated();
  return <AuthPage mode="login" />;
}
