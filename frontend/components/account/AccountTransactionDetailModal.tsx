'use client';

import { useEffect, useState } from 'react';
import type { AccountTransactionDetail } from '@/lib/account/account';
import { AccountDialog } from './AccountDialog';
import {
  detailedDateFormatter,
  formatSignedCurrencyFromPence,
  getEntryLabel,
  getEntrySummary,
  maskAccountId,
} from './accountDisplay';

const AUTH_API_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000';

type AccountTransactionDetailModalProps = {
  open: boolean;
  transactionId: string | null;
  initialTransactionDetail: AccountTransactionDetail | null;
  onClose: () => void;
};

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
    (typeof record.toAccountId === 'string' || record.toAccountId === null) &&
    Array.isArray(record.ledgerPostings) &&
    record.ledgerPostings.every((posting) => {
      if (typeof posting !== 'object' || posting === null) {
        return false;
      }

      const postingRecord = posting as Record<string, unknown>;

      return (
        typeof postingRecord.id === 'string' &&
        typeof postingRecord.accountId === 'string' &&
        typeof postingRecord.amount === 'number' &&
        (postingRecord.direction === 'DEBIT' ||
          postingRecord.direction === 'CREDIT') &&
        typeof postingRecord.createdAt === 'string' &&
        (typeof postingRecord.accountOwnerEmail === 'string' ||
          postingRecord.accountOwnerEmail === null)
      );
    })
  );
}

function getErrorMessage(payload: unknown) {
  if (typeof payload === 'object' && payload !== null) {
    const record = payload as Record<string, unknown>;

    if (typeof record.error === 'string') {
      return record.error;
    }

    if (typeof record.message === 'string') {
      return record.message;
    }
  }

  return 'Unable to load transaction details.';
}

export function AccountTransactionDetailModal({
  open,
  transactionId,
  initialTransactionDetail,
  onClose,
}: AccountTransactionDetailModalProps) {
  const seededTransaction =
    initialTransactionDetail?.id === transactionId ? initialTransactionDetail : null;
  const [transaction, setTransaction] = useState<AccountTransactionDetail | null>(
    seededTransaction,
  );
  const [detailState, setDetailState] = useState<'idle' | 'loading' | 'error'>(
    seededTransaction || !transactionId ? 'idle' : 'loading',
  );
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !transactionId) {
      return;
    }

    if (seededTransaction) {
      return;
    }

    let active = true;

    void (async () => {
      try {
        const response = await fetch(
          `${AUTH_API_URL}/account/transactions/${transactionId}`,
          {
            credentials: 'include',
            cache: 'no-store',
          },
        );

        const payload = await response.json().catch(() => null);

        if (!active) {
          return;
        }

        if (!response.ok) {
          setTransaction(null);
          setDetailState('error');
          setDetailError(getErrorMessage(payload));
          return;
        }

        if (!isAccountTransactionDetailPayload(payload)) {
          setTransaction(null);
          setDetailState('error');
          setDetailError('Transaction detail payload is invalid.');
          return;
        }

        setTransaction(payload.transaction);
        setDetailState('idle');
        setDetailError(null);
      } catch {
        if (!active) {
          return;
        }

        setTransaction(null);
        setDetailState('error');
        setDetailError('Unable to reach the banking API.');
      }
    })();

    return () => {
      active = false;
    };
  }, [open, seededTransaction, transactionId]);

  return (
    <AccountDialog
      open={open}
      onClose={onClose}
      eyebrow="Ledger detail"
      title={transaction ? getEntryLabel(transaction) : 'Transaction detail'}
      subtitle={
        transaction
          ? 'This view is loaded from the owned transaction endpoint, so the modal only reflects persisted ledger data.'
          : 'Inspect the selected transaction in a cleaner, focused view.'
      }
    >
      {detailState === 'loading' ? (
        <div className="space-y-4">
          <div className="h-[4.5rem] border border-[#0A0A0A] bg-[#FFFFFF]/60" />
          <div className="h-24 border border-[#0A0A0A] bg-[#FFFFFF]/60" />
          <div className="h-24 border border-[#0A0A0A] bg-[#FFFFFF]/60" />
        </div>
      ) : detailState === 'error' ? (
        <div className="border border-[#0A0A0A] bg-[#0A0A0A] px-4 py-4 text-[14px] leading-6 text-[#F4F3EF]">
          {detailError}
        </div>
      ) : transaction ? (
        <div className="space-y-5">
          <section className="border border-[#0A0A0A] bg-[#FFFFFF]/62 p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                  Posting amount
                </div>
                <div
                  className={[
                    'mono-ui ledger-value mt-4 text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.07em]',
                    transaction.incoming ? 'text-[#167c5a]' : 'text-[#0A0A0A]',
                  ].join(' ')}
                >
                  {formatSignedCurrencyFromPence(
                    transaction.amount,
                    transaction.incoming,
                  )}
                </div>
              </div>

              <div className="mono-ui border border-[#0A0A0A] bg-[#F4F3EF] px-3 py-3 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/72">
                {transaction.id.slice(0, 8)}
              </div>
            </div>

            <p className="mt-5 max-w-[38rem] text-[15px] leading-7 text-[#0A0A0A]/68">
              {getEntrySummary(transaction)}
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-4">
              <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                Counterparty
              </div>
              <div className="mono-ui ledger-value mt-4 text-[1rem] font-medium tracking-[-0.04em] text-[#0A0A0A]">
                {transaction.counterpartyEmail ?? 'system bootstrap'}
              </div>
            </div>

            <div className="border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-4">
              <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                Created
              </div>
              <div className="mono-ui mt-4 text-[1rem] font-medium tracking-[-0.04em] text-[#0A0A0A]">
                {detailedDateFormatter.format(new Date(transaction.createdAt))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-4">
              <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                From account
              </div>
              <div className="mono-ui mt-4 text-[1rem] font-medium tracking-[-0.04em] text-[#0A0A0A]">
                {maskAccountId(transaction.fromAccountId)}
              </div>
            </div>

            <div className="border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-4">
              <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                To account
              </div>
              <div className="mono-ui mt-4 text-[1rem] font-medium tracking-[-0.04em] text-[#0A0A0A]">
                {maskAccountId(transaction.toAccountId)}
              </div>
            </div>
          </section>

          <section className="border border-[#0A0A0A] bg-[#FFFFFF]/62">
            <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-4 py-4 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
              <span>Ledger postings</span>
              <span>{transaction.ledgerPostings.length}</span>
            </div>

            <div className="space-y-3 p-4">
              {transaction.ledgerPostings.map((posting) => (
                <div
                  key={posting.id}
                  className="border border-[#0A0A0A] bg-[#F4F3EF]/82 px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="mono-ui text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/52">
                        {posting.direction}
                      </div>
                      <div className="mono-ui text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]/72">
                        {posting.accountOwnerEmail ?? 'current ledger'} /{' '}
                        {maskAccountId(posting.accountId)}
                      </div>
                    </div>

                    <div
                      className={[
                        'mono-ui ledger-value text-[1rem] font-medium tracking-[-0.04em]',
                        posting.direction === 'CREDIT'
                          ? 'text-[#167c5a]'
                          : 'text-[#0A0A0A]',
                      ].join(' ')}
                    >
                      {formatSignedCurrencyFromPence(
                        posting.amount,
                        posting.direction === 'CREDIT',
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="border border-[#0A0A0A] bg-[#F4F3EF]/82 px-4 py-4">
              <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                Transaction type
              </div>
              <div className="mono-ui mt-3 text-[12px] uppercase tracking-[0.12em] text-[#0A0A0A]">
                {transaction.type}
              </div>
            </div>
            <div className="border border-[#0A0A0A] bg-[#F4F3EF]/82 px-4 py-4">
              <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                Direction
              </div>
              <div className="mono-ui mt-3 text-[12px] uppercase tracking-[0.12em] text-[#0A0A0A]">
                {transaction.incoming ? 'incoming' : 'outgoing'}
              </div>
            </div>
            <div className="border border-[#0A0A0A] bg-[#F4F3EF]/82 px-4 py-4">
              <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                Origin
              </div>
              <div className="mono-ui mt-3 text-[12px] uppercase tracking-[0.12em] text-[#0A0A0A]">
                {transaction.systemGenerated ? 'system write' : 'user action'}
              </div>
            </div>
          </section>

          <section className="border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-4">
            <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
              Integrity note
            </div>
            <p className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/68">
              This modal only renders a transaction that already belongs to the
              authenticated account. The backend checks ownership before
              returning the row, so transaction detail lookups cannot cross
              account boundaries.
            </p>
          </section>
        </div>
      ) : (
        <div className="border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-5 text-[15px] leading-7 text-[#0A0A0A]/68">
          No transaction is currently selected.
        </div>
      )}
    </AccountDialog>
  );
}
