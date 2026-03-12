'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ActionMode } from './AccountActionConsole';
import { AccountDialog } from './AccountDialog';

const AUTH_API_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000';

type AccountActionModalProps = {
  currentEmail: string;
  mode: ActionMode;
  open: boolean;
  onClose: () => void;
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

const actionConfig: Record<
  ActionMode,
  {
    endpoint: string;
    eyebrow: string;
    title: string;
    helper: string;
    submitLabel: string;
  }
> = {
  deposit: {
    endpoint: '/account/deposit',
    eyebrow: 'Ledger action',
    title: 'Deposit funds',
    helper: 'Amounts are entered in GBP and converted to pence by the backend before the balance write is committed.',
    submitLabel: 'Post deposit',
  },
  withdraw: {
    endpoint: '/account/withdraw',
    eyebrow: 'Ledger action',
    title: 'Withdraw funds',
    helper: 'Withdrawals only commit when sufficient funds exist at the point of update.',
    submitLabel: 'Post withdrawal',
  },
  transfer: {
    endpoint: '/account/transfer',
    eyebrow: 'Ledger action',
    title: 'Transfer funds',
    helper:
      'Transfers resolve the recipient by email, then debit and credit both accounts inside one database transaction.',
    submitLabel: 'Execute transfer',
  },
};

export function AccountActionModal({
  currentEmail,
  mode,
  open,
  onClose,
}: AccountActionModalProps) {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const config = actionConfig[mode];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const payload =
          mode === 'transfer'
            ? { amount, recipientEmail }
            : { amount };

        const response = await fetch(`${AUTH_API_URL}${config.endpoint}`, {
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
            getErrorMessage(responsePayload, `Unable to ${mode} funds.`),
          );
          return;
        }

        onClose();
        router.refresh();
      } catch {
        setErrorMessage('Unable to reach the banking API.');
      }
    });
  };

  return (
    <AccountDialog
      open={open}
      onClose={onClose}
      eyebrow={config.eyebrow}
      title={config.title}
      subtitle={config.helper}
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
              Amount GBP
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="500.00"
              className="w-full rounded-none border border-[#0A0A0A] bg-[#FFFFFF]/75 px-4 py-3 text-[15px] text-[#0A0A0A] outline-none transition-colors duration-150 placeholder:text-[#0A0A0A]/36 focus:bg-[#FFFFFF]"
            />
          </label>

          {mode === 'transfer' ? (
            <label className="block space-y-2">
              <span className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
                Recipient email
              </span>
              <input
                type="email"
                value={recipientEmail}
                onChange={(event) => setRecipientEmail(event.target.value)}
                placeholder="operator@example.com"
                className="w-full rounded-none border border-[#0A0A0A] bg-[#FFFFFF]/75 px-4 py-3 text-[15px] text-[#0A0A0A] outline-none transition-colors duration-150 placeholder:text-[#0A0A0A]/36 focus:bg-[#FFFFFF]"
              />
            </label>
          ) : (
            <div className="border border-[#0A0A0A] bg-[#FFFFFF]/55 px-4 py-4">
              <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                Commit rule
              </div>
              <p className="mt-3 text-[14px] leading-6 text-[#0A0A0A]/68">
                {mode === 'deposit'
                  ? 'A matching DEPOSIT transaction row is written alongside the balance change.'
                  : 'The debit only succeeds if the balance check still passes at write time.'}
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="border border-[#0A0A0A] bg-[#FFFFFF]/55 px-4 py-4">
            <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
              Operator context
            </div>
            <div className="mt-3 text-[14px] leading-6 text-[#0A0A0A]/68">
              {mode === 'transfer'
                ? `Sender: ${currentEmail}`
                : 'The backend resolves your account from the authenticated session before it applies the write.'}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="key-press mono-ui inline-flex min-h-[56px] items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-5 py-3 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? 'Posting...' : config.submitLabel}
          </button>
        </div>

        {errorMessage ? (
          <div className="border border-[#0A0A0A] bg-[#0A0A0A] px-4 py-4 text-[14px] leading-6 text-[#F4F3EF]">
            {errorMessage}
          </div>
        ) : null}
      </form>
    </AccountDialog>
  );
}
