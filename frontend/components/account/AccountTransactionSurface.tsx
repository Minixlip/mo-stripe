'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import type {
  AccountActivityEntry,
  AccountTransactionDetail,
} from '@/lib/account/account';

type AccountTransactionSurfaceProps = {
  history: AccountActivityEntry[];
  accountCreatedAt: string;
  email: string;
  initialTransactionDetail: AccountTransactionDetail | null;
};

type LedgerLine = {
  id: string;
  amount: string;
  label: string;
  meta: string;
  positive: boolean;
  muted?: boolean;
  transactionId: string | null;
};

const AUTH_API_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000';

const gbpFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

const longDateFormatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

const detailedDateFormatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

function formatCurrencyFromPence(amount: number) {
  return gbpFormatter.format(amount / 100);
}

function formatSignedCurrencyFromPence(amount: number, incoming: boolean) {
  return `${incoming ? '+' : '-'} ${formatCurrencyFromPence(amount)}`;
}

function maskAccountId(id: string | null) {
  if (!id) {
    return 'external';
  }

  return `*${id.slice(-4).toUpperCase()}`;
}

function getEntryLabel(item: AccountActivityEntry) {
  if (item.type === 'DEPOSIT' && item.systemGenerated) {
    return 'OPENING_DEPOSIT';
  }

  if (item.type === 'WITHDRAWAL') {
    return 'CASH_OUT';
  }

  if (item.type === 'TRANSFER') {
    return item.incoming ? 'TRANSFER_IN' : 'TRANSFER_OUT';
  }

  return 'DEPOSIT';
}

function getEntrySummary(item: AccountActivityEntry) {
  if (item.type === 'DEPOSIT' && item.systemGenerated) {
    return 'Bootstrap credit posted during registration.';
  }

  if (item.type === 'WITHDRAWAL') {
    return 'Funds debited from your personal ledger.';
  }

  if (item.type === 'TRANSFER') {
    return item.incoming
      ? 'Atomic transfer received from another registered user.'
      : 'Atomic transfer sent to another registered user.';
  }

  return 'Funds credited to your personal ledger.';
}

function buildLedgerLines(
  history: AccountActivityEntry[],
  accountCreatedAt: string,
  email: string,
): LedgerLine[] {
  const transactionLines = history.map((item) => ({
    id: item.id,
    amount: formatSignedCurrencyFromPence(item.amount, item.incoming),
    label: getEntryLabel(item),
    meta: item.counterpartyEmail
      ? `${longDateFormatter.format(new Date(item.createdAt))} / ${item.counterpartyEmail}`
      : longDateFormatter.format(new Date(item.createdAt)),
    positive: item.incoming,
    muted: item.systemGenerated,
    transactionId: item.id,
  }));

  return [
    {
      id: 'account-opened',
      amount: 'SYSTEM',
      label: 'ACCOUNT_OPENED',
      meta: longDateFormatter.format(new Date(accountCreatedAt)),
      positive: true,
      muted: true,
      transactionId: null,
    },
    ...transactionLines,
    {
      id: 'session-verified',
      amount: 'LIVE',
      label: 'SESSION_VERIFIED',
      meta: email,
      positive: true,
      muted: true,
      transactionId: null,
    },
  ];
}

function isAccountTransactionDetailPayload(
  payload: unknown,
): payload is { transaction: AccountTransactionDetail } {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const transaction = (payload as { transaction?: unknown }).transaction;

  if (typeof transaction !== 'object' || transaction === null) {
    return false;
  }

  const record = transaction as Record<string, unknown>;

  return (
    typeof record.id === 'string' &&
    typeof record.amount === 'number' &&
    typeof record.type === 'string' &&
    typeof record.incoming === 'boolean' &&
    typeof record.systemGenerated === 'boolean' &&
    typeof record.createdAt === 'string' &&
    (typeof record.counterpartyEmail === 'string' ||
      record.counterpartyEmail === null) &&
    (typeof record.fromAccountId === 'string' || record.fromAccountId === null) &&
    (typeof record.toAccountId === 'string' || record.toAccountId === null)
  );
}

function getErrorMessage(payload: unknown) {
  if (typeof payload !== 'object' || payload === null) {
    return 'Unable to load transaction details.';
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.error === 'string') {
    return record.error;
  }

  if (typeof record.message === 'string') {
    return record.message;
  }

  return 'Unable to load transaction details.';
}

export function AccountTransactionSurface({
  history,
  accountCreatedAt,
  email,
  initialTransactionDetail,
}: AccountTransactionSurfaceProps) {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(
    initialTransactionDetail?.id ?? history[0]?.id ?? null,
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<AccountTransactionDetail | null>(initialTransactionDetail);
  const [detailState, setDetailState] = useState<'idle' | 'loading' | 'error'>(
    initialTransactionDetail || !history[0] ? 'idle' : 'loading',
  );
  const [detailError, setDetailError] = useState<string | null>(null);

  const ledgerLines = buildLedgerLines(history, accountCreatedAt, email);
  const rollingLines =
    ledgerLines.length >= 6 ? [...ledgerLines, ...ledgerLines] : ledgerLines;
  const shouldAnimate = ledgerLines.length >= 6;

  const loadTransactionDetail = useEffectEvent(async (transactionId: string) => {
    setDetailState('loading');
    setDetailError(null);

    try {
      const response = await fetch(
        `${AUTH_API_URL}/account/transactions/${transactionId}`,
        {
          credentials: 'include',
          cache: 'no-store',
        },
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setSelectedTransaction(null);
        setDetailState('error');
        setDetailError(getErrorMessage(payload));
        return;
      }

      if (!isAccountTransactionDetailPayload(payload)) {
        setSelectedTransaction(null);
        setDetailState('error');
        setDetailError('Transaction detail payload is invalid.');
        return;
      }

      setSelectedTransaction(payload.transaction);
      setDetailState('idle');
    } catch {
      setSelectedTransaction(null);
      setDetailState('error');
      setDetailError('Unable to reach the banking API.');
    }
  });

  useEffect(() => {
    if (!selectedTransactionId) {
      return;
    }

    if (selectedTransaction?.id === selectedTransactionId) {
      return;
    }

    void loadTransactionDetail(selectedTransactionId);
  }, [selectedTransaction?.id, selectedTransactionId]);

  const focusTransaction = (transactionId: string, scrollToDetails: boolean) => {
    setSelectedTransactionId(transactionId);

    if (scrollToDetails) {
      document
        .getElementById('transaction-detail-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8">
      <aside
        id="receipt-roll"
        className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]"
      >
        <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full border border-[#0A0A0A] bg-[#C7F000]" />
            <span>The receipt roll</span>
          </div>
          <span className="text-[#0A0A0A]/65">
            entries / surface: {ledgerLines.length}
          </span>
        </div>

        <div className="mono-ui flex items-center justify-between gap-4 border-b border-[#0A0A0A] px-5 py-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/72">
          <span>Status</span>
          <span>Live</span>
        </div>

        <div className="relative h-[42rem] overflow-hidden p-4">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#F4F3EF] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F4F3EF] to-transparent" />

          <div className={shouldAnimate ? 'ledger-roll-track space-y-3' : 'space-y-3'}>
            {rollingLines.map((line, index) => {
              const isSelected = line.transactionId === selectedTransactionId;

              if (!line.transactionId) {
                return (
                  <div
                    key={`${line.id}-${index}`}
                    className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.7)] px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={[
                          'mono-ui text-[12px] font-medium uppercase tracking-[0.06em]',
                          line.muted
                            ? 'text-[#3e8b78]'
                            : line.positive
                              ? 'text-[#167c5a]'
                              : 'text-[#0A0A0A]/78',
                        ].join(' ')}
                      >
                        {line.amount}
                      </span>
                      <span className="mono-ui text-[12px] uppercase tracking-[0.08em] text-[#0A0A0A]/72">
                        {line.label}
                      </span>
                    </div>
                    <div className="mono-ui mt-3 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/42">
                      {line.meta}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={`${line.id}-${index}`}
                  type="button"
                  onClick={() => focusTransaction(line.transactionId!, true)}
                  className={[
                    'block w-full border px-4 py-4 text-left transition-colors duration-150',
                    isSelected
                      ? 'border-[#0A0A0A] bg-[#C7F000]/24'
                      : 'border-[#0A0A0A] bg-[rgba(255,255,255,0.7)] hover:bg-[#FFFFFF]',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={[
                        'mono-ui text-[12px] font-medium uppercase tracking-[0.06em]',
                        line.muted
                          ? 'text-[#3e8b78]'
                          : line.positive
                            ? 'text-[#167c5a]'
                            : 'text-[#0A0A0A]/78',
                      ].join(' ')}
                    >
                      {line.amount}
                    </span>
                    <span className="mono-ui text-[12px] uppercase tracking-[0.08em] text-[#0A0A0A]/72">
                      {line.label}
                    </span>
                  </div>
                  <div className="mono-ui mt-3 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/42">
                    {line.meta}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#0A0A0A] px-5 py-4 text-[14px] leading-6 text-[#0A0A0A]/65">
          <p>
            Tip: every line here is selectable. The detail panel reads the same
            transaction id that produced the balance change.
          </p>
          <a
            href="#transaction-detail-panel"
            className="mono-ui text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A] underline underline-offset-4"
          >
            Open details
          </a>
        </div>
      </aside>

      <section
        id="transaction-detail-panel"
        className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]"
      >
        <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
          <span>Transaction detail</span>
          <span className="text-[#0A0A0A]/62">
            {selectedTransaction ? selectedTransaction.id.slice(0, 8) : 'none'}
          </span>
        </div>

        {detailState === 'loading' ? (
          <div className="space-y-4 p-5">
            <div className="h-16 border border-[#0A0A0A] bg-[#F4F3EF]/72" />
            <div className="h-20 border border-[#0A0A0A] bg-[#F4F3EF]/72" />
            <div className="h-20 border border-[#0A0A0A] bg-[#F4F3EF]/72" />
          </div>
        ) : detailState === 'error' ? (
          <div className="p-5">
            <div className="border border-[#0A0A0A] bg-[#0A0A0A] px-4 py-4 text-[14px] leading-6 text-[#F4F3EF]">
              {detailError}
            </div>
          </div>
        ) : selectedTransaction ? (
          <div className="space-y-5 p-5">
            <div className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] p-5">
              <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
                Posting type
              </div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div className="mono-ui text-[1.8rem] font-semibold tracking-[-0.06em] text-[#0A0A0A]">
                  {getEntryLabel(selectedTransaction)}
                </div>
                <div
                  className={[
                    'mono-ui text-[1.1rem] uppercase tracking-[0.08em]',
                    selectedTransaction.incoming
                      ? 'text-[#167c5a]'
                      : 'text-[#0A0A0A]/82',
                  ].join(' ')}
                >
                  {formatSignedCurrencyFromPence(
                    selectedTransaction.amount,
                    selectedTransaction.incoming,
                  )}
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/68">
                {getEntrySummary(selectedTransaction)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-[#0A0A0A] bg-[#F4F3EF]/70 px-4 py-4">
                <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/55">
                  Counterparty
                </div>
                <div className="mono-ui mt-4 text-[1rem] font-medium tracking-[-0.04em] text-[#0A0A0A]">
                  {selectedTransaction.counterpartyEmail ?? 'system bootstrap'}
                </div>
              </div>

              <div className="border border-[#0A0A0A] bg-[#F4F3EF]/70 px-4 py-4">
                <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/55">
                  Created
                </div>
                <div className="mono-ui mt-4 text-[1rem] font-medium tracking-[-0.04em] text-[#0A0A0A]">
                  {detailedDateFormatter.format(
                    new Date(selectedTransaction.createdAt),
                  )}
                </div>
              </div>
            </div>

            <div className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-5 py-5">
              <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
                Routing
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                    From account
                  </div>
                  <div className="mono-ui mt-3 text-[1rem] font-medium text-[#0A0A0A]">
                    {maskAccountId(selectedTransaction.fromAccountId)}
                  </div>
                </div>
                <div>
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                    To account
                  </div>
                  <div className="mono-ui mt-3 text-[1rem] font-medium text-[#0A0A0A]">
                    {maskAccountId(selectedTransaction.toAccountId)}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-5 py-5">
              <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
                Integrity note
              </div>
              <p className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/68">
                This panel reads a transaction that already belongs to your
                account. The backend enforces ownership before returning the
                row, so detail lookups cannot cross account boundaries.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-4 py-5 text-[15px] leading-7 text-[#0A0A0A]/68">
              No transaction has been selected yet.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
