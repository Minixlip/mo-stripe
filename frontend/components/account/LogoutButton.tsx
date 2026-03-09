'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000';

export function LogoutButton() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch(`${AUTH_API_URL}/logout`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          setErrorMessage('Unable to clear the backend session.');
          return;
        }

        router.replace('/login');
        router.refresh();
      } catch {
        setErrorMessage('Unable to reach the authentication server.');
      }
    });
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className="key-press mono-ui inline-flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-4 py-3 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? 'Signing out...' : 'Sign out'}
      </button>

      {errorMessage ? (
        <p className="text-[14px] leading-6 text-[#0A0A0A]/68">{errorMessage}</p>
      ) : null}
    </div>
  );
}
