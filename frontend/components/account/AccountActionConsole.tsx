'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  TransferIcon,
} from '@/components/landing/ui';

const AUTH_API_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000';

type ActionMode = 'deposit' | 'withdraw' | 'transfer';

type AccountActionConsoleProps = {
  currentEmail: string;
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
    title: string;
    helper: string;
    submitLabel: string;
  }
> = {
  deposit: {
    endpoint: '/account/deposit',
    title: 'Deposit funds',
    helper: 'Amounts are entered in GBP and converted to pence by the backend.',
    submitLabel: 'Post deposit',
  },
  withdraw: {
    endpoint: '/account/withdraw',
    title: 'Withdraw funds',
    helper: 'Overdrafts are blocked by the backend at commit time.',
    submitLabel: 'Post withdrawal',
  },
  transfer: {
    endpoint: '/account/transfer',
    title: 'Transfer funds',
    helper:
      'Transfers move funds to another registered user by email in one atomic database transaction.',
    submitLabel: 'Execute transfer',
  },
};

export function AccountActionConsole({
  currentEmail,
}: AccountActionConsoleProps) {
  const router = useRouter();
  const [mode, setMode] = useState<ActionMode>('deposit');
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const config = actionConfig[mode];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
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

        setAmount('');
        setRecipientEmail('');
        setFeedback(
          mode === 'transfer'
            ? 'Transfer committed and ledger updated.'
            : mode === 'deposit'
              ? 'Deposit committed and balance updated.'
              : 'Withdrawal committed and balance updated.',
        );
        router.refresh();
      } catch {
        setErrorMessage('Unable to reach the banking API.');
      }
    });
  };

  return (
    <div
      id="action-console"
      className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] p-5"
    >
      <div className="mono-ui flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/65">
        <span>Quick actions</span>
        <span>live</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setMode('deposit')}
          className={[
            'mono-ui inline-flex items-center justify-center gap-3 border px-4 py-4 text-[13px] uppercase tracking-[0.12em] transition-colors duration-150',
            mode === 'deposit'
              ? 'border-[#0A0A0A] bg-[#F4F3EF] text-[#0A0A0A]'
              : 'border-[#0A0A0A] bg-[rgba(255,255,255,0.82)] text-[#0A0A0A] hover:bg-[#FFFFFF]',
          ].join(' ')}
        >
          <ArrowRightIcon className="h-3.5 w-3.5 rotate-[-45deg]" />
          Deposit
        </button>

        <button
          type="button"
          onClick={() => setMode('withdraw')}
          className={[
            'mono-ui inline-flex items-center justify-center gap-3 border px-4 py-4 text-[13px] uppercase tracking-[0.12em] transition-colors duration-150',
            mode === 'withdraw'
              ? 'border-[#0A0A0A] bg-[#F4F3EF] text-[#0A0A0A]'
              : 'border-[#0A0A0A] bg-[rgba(255,255,255,0.82)] text-[#0A0A0A] hover:bg-[#FFFFFF]',
          ].join(' ')}
        >
          <ArrowUpRightIcon className="h-3.5 w-3.5" />
          Withdraw
        </button>

        <button
          type="button"
          onClick={() => setMode('transfer')}
          className={[
            'mono-ui inline-flex items-center justify-center gap-3 border px-4 py-4 text-[13px] uppercase tracking-[0.12em] transition-colors duration-150',
            mode === 'transfer'
              ? 'border-[#0A0A0A] bg-[#C7F000] text-[#0A0A0A]'
              : 'border-[#0A0A0A] bg-[rgba(255,255,255,0.82)] text-[#0A0A0A] hover:bg-[#FFFFFF]',
          ].join(' ')}
        >
          <TransferIcon className="h-4 w-4" />
          Transfer
        </button>
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
            {config.title}
          </div>
          <p className="text-[14px] leading-6 text-[#0A0A0A]/65">
            {config.helper}
          </p>
        </div>

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
            className="w-full rounded-none border border-[#0A0A0A] bg-[#F4F3EF]/72 px-4 py-3 text-[15px] text-[#0A0A0A] outline-none transition-colors duration-150 placeholder:text-[#0A0A0A]/38 focus:bg-[#FFFFFF]"
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
              className="w-full rounded-none border border-[#0A0A0A] bg-[#F4F3EF]/72 px-4 py-3 text-[15px] text-[#0A0A0A] outline-none transition-colors duration-150 placeholder:text-[#0A0A0A]/38 focus:bg-[#FFFFFF]"
            />
          </label>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="text-[14px] leading-6 text-[#0A0A0A]/65">
            {mode === 'transfer'
              ? `Sender: ${currentEmail}`
              : 'All actions post directly against your personal ledger.'}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="key-press mono-ui inline-flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-5 py-3 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? 'Posting...' : config.submitLabel}
          </button>
        </div>
      </form>

      {feedback ? (
        <p className="mt-4 border border-[#0A0A0A] bg-[#F4F3EF] px-4 py-3 text-[14px] leading-6 text-[#0A0A0A]">
          {feedback}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mt-4 border border-[#0A0A0A] bg-[#0A0A0A] px-4 py-3 text-[14px] leading-6 text-[#F4F3EF]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
