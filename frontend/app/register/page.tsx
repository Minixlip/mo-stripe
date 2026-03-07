import type { Metadata } from 'next';
import { AuthPage } from '@/components/auth';

export const metadata: Metadata = {
  title: 'mo-stripe | Register',
  description: 'Operator registration page for mo-stripe.',
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
