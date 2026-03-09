'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { AuthContent, AuthMode } from '../types';
import { AuthField } from './AuthField';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000';

type AuthFormProps = {
  content: AuthContent;
  mode: AuthMode;
};

function getErrorMessage(payload: unknown, fallbackMessage: string) {
  if (typeof payload === 'object' && payload !== null) {
    const record = payload as Record<string, unknown>;

    if (typeof record.error === 'string') {
      return record.error;
    }

    if (typeof record.message === 'string') {
      return record.message;
    }
  }

  return fallbackMessage;
}

export function AuthForm({ content, mode }: AuthFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const endpoint = mode === 'login' ? '/login' : '/register';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload =
      mode === 'login'
        ? {
            email: formData.get('email'),
            password: formData.get('password'),
          }
        : {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
          };

    startTransition(async () => {
      try {
        const response = await fetch(`${AUTH_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        });

        const responsePayload = await response.json().catch(() => null);

        if (!response.ok) {
          setErrorMessage(
            getErrorMessage(
              responsePayload,
              mode === 'login' ? 'Login failed.' : 'Registration failed.',
            ),
          );
          return;
        }

        router.replace('/account');
        router.refresh();
      } catch {
        setErrorMessage('Unable to reach the authentication server.');
      }
    });
  };

  return (
    <>
      {errorMessage ? (
        <div className="mt-5 border border-[#0A0A0A] bg-[#0A0A0A] px-4 py-3 text-[14px] leading-6 text-[#F4F3EF]">
          {errorMessage}
        </div>
      ) : null}

      <form
        className="mt-5 space-y-5"
        onSubmit={handleSubmit}
      >
        {content.fields.map((field) => (
          <AuthField
            key={field.name}
            field={field}
          />
        ))}

        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#0A0A0A] py-3">
          <label className="flex items-center gap-3 text-[14px] text-[#0A0A0A]/68">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-none border border-[#0A0A0A] accent-[#C7F000]"
            />
            <span>{content.consentLabel}</span>
          </label>
          <Link
            href={content.auxiliaryHref}
            className="mono-ui text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A] underline underline-offset-4"
          >
            {content.auxiliaryLabel}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="key-press mono-ui inline-flex w-full items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-4 py-3 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? 'Processing...' : content.submitLabel}
        </button>
      </form>
    </>
  );
}
