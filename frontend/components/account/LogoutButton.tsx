'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type LogoutButtonProps = {
  compact?: boolean;
};

export function LogoutButton({ compact = false }: LogoutButtonProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/logout', {
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
        className={
          compact
            ? 'mono-ui inline-flex items-center justify-center border border-[#0A0A0A] bg-[rgba(255,255,255,0.7)] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A] transition-colors duration-150 hover:bg-[#FFFFFF] disabled:cursor-not-allowed disabled:opacity-70'
            : 'key-press mono-ui inline-flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-4 py-3 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-70'
        }
      >
        {isPending ? 'Signing out...' : 'Sign out'}
      </button>

      {errorMessage ? (
        <p
          className={
            compact
              ? 'max-w-[14rem] text-[12px] leading-5 text-[#0A0A0A]/68'
              : 'text-[14px] leading-6 text-[#0A0A0A]/68'
          }
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
