import type { Metadata } from 'next';
import { AuthPage } from '@/components/auth';
import { redirectIfAuthenticated } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'mo-stripe | Register',
  description: 'Operator registration page for mo-stripe.',
};

export default async function RegisterPage() {
  await redirectIfAuthenticated();
  return <AuthPage mode="register" />;
}
