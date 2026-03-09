import { z } from 'zod';

const EmailSchema = z
  .string()
  .trim()
  .email()
  .transform((value) => value.toLowerCase());

const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character',
  );

export const AuthSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  confirmPassword: PasswordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});
