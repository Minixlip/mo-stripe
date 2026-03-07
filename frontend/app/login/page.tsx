import type { Metadata } from 'next';
import { AuthPage } from '@/components/auth';

export const metadata: Metadata = {
  title: 'mo-stripe | Sign in',
  description: 'Operator sign-in page for mo-stripe.',
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
