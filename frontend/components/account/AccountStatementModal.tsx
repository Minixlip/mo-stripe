'use client';

import { useEffect, useState } from 'react';
import type { AccountMonthlyStatement } from '@/lib/account/account';
import { AccountDialog } from './AccountDialog';
import {
  formatCurrencyFromPence,
  formatNetCurrencyFromPence,
  formatSignedCurrencyFromPence,
  formatStatementMonth,
  getCurrentMonthValue,
  getEntryLabel,
  longDateFormatter,
  maskAccountId,
} from './accountDisplay';

const AUTH_API_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000';

type AccountStatementModalProps = {
  open: boolean;
  defaultMonth: string;
  minimumMonth: string;
  onClose: () => void;
};

function escapeCsvValue(value: string | number | boolean | null) {
  if (value === null) {
    return '';
  }

  const stringValue = String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

function serializeStatementToCsv(statement: AccountMonthlyStatement) {
  const summaryRows = [
    ['section', 'field', 'value'],
    ['summary', 'month', statement.month],
    ['summary', 'period_start', statement.periodStart],
    ['summary', 'period_end', statement.periodEnd],
    ['summary', 'account_id', statement.account.id],
    ['summary', 'opening_balance_pence', statement.summary.openingBalance],
    ['summary', 'closing_balance_pence', statement.summary.closingBalance],
    ['summary', 'total_deposits_pence', statement.summary.totalDeposits],
    ['summary', 'total_withdrawals_pence', statement.summary.totalWithdrawals],
    [
      'summary',
      'total_incoming_transfers_pence',
      statement.summary.totalIncomingTransfers,
    ],
    [
      'summary',
      'total_outgoing_transfers_pence',
      statement.summary.totalOutgoingTransfers,
    ],
    ['summary', 'net_flow_pence', statement.summary.netFlow],
    ['summary', 'transaction_count', statement.summary.transactionCount],
    [],
    [
      'transaction_id',
      'created_at',
      'type',
      'direction',
      'amount_pence',
      'amount_gbp',
      'counterparty_email',
      'system_generated',
      'from_account_id',
      'to_account_id',
    ],
  ];

  const transactionRows = statement.transactions.map((transaction) => [
    transaction.id,
    transaction.createdAt,
    transaction.type,
    transaction.incoming ? 'incoming' : 'outgoing',
    transaction.amount,
    (transaction.amount / 100).toFixed(2),
    transaction.counterpartyEmail ?? '',
    transaction.systemGenerated,
    transaction.fromAccountId ?? '',
    transaction.toAccountId ?? '',
  ]);

  return [...summaryRows, ...transactionRows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
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

  return 'Unable to load monthly statement.';
}

function isAccountMonthlyStatement(payload: unknown): payload is AccountMonthlyStatement {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const statement = payload as Record<string, unknown>;
  const account = statement.account;
  const summary = statement.summary;

  return (
    typeof statement.month === 'string' &&
    typeof statement.generatedAt === 'string' &&
    typeof statement.periodStart === 'string' &&
    typeof statement.periodEnd === 'string' &&
    typeof account === 'object' &&
    account !== null &&
    typeof (account as Record<string, unknown>).id === 'string' &&
    typeof (account as Record<string, unknown>).createdAt === 'string' &&
    typeof summary === 'object' &&
    summary !== null &&
    typeof (summary as Record<string, unknown>).openingBalance === 'number' &&
    typeof (summary as Record<string, unknown>).closingBalance === 'number' &&
    typeof (summary as Record<string, unknown>).totalDeposits === 'number' &&
    typeof (summary as Record<string, unknown>).totalWithdrawals === 'number' &&
    typeof (summary as Record<string, unknown>).totalIncomingTransfers === 'number' &&
    typeof (summary as Record<string, unknown>).totalOutgoingTransfers === 'number' &&
    typeof (summary as Record<string, unknown>).netFlow === 'number' &&
    typeof (summary as Record<string, unknown>).transactionCount === 'number' &&
    Array.isArray(statement.transactions)
  );
}

function isAccountMonthlyStatementPayload(
  payload: unknown,
): payload is { statement: AccountMonthlyStatement } {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    isAccountMonthlyStatement((payload as { statement?: unknown }).statement)
  );
}

export function AccountStatementModal({
  open,
  defaultMonth,
  minimumMonth,
  onClose,
}: AccountStatementModalProps) {
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [statement, setStatement] = useState<AccountMonthlyStatement | null>(null);
  const [requestState, setRequestState] = useState<'idle' | 'loading' | 'error'>(
    'idle',
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;

    void (async () => {
      setRequestState('loading');
      setErrorMessage(null);

      try {
        const response = await fetch(
          `${AUTH_API_URL}/account/statements/monthly?month=${selectedMonth}`,
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
          setStatement(null);
          setRequestState('error');
          setErrorMessage(getErrorMessage(payload));
          return;
        }

        if (!isAccountMonthlyStatementPayload(payload)) {
          setStatement(null);
          setRequestState('error');
          setErrorMessage('Statement payload is invalid.');
          return;
        }

        setStatement(payload.statement);
        setRequestState('idle');
      } catch {
        if (!active) {
          return;
        }

        setStatement(null);
        setRequestState('error');
        setErrorMessage('Unable to reach the banking API.');
      }
    })();

    return () => {
      active = false;
    };
  }, [open, selectedMonth]);

  const currentMonth = getCurrentMonthValue();
  const fileSuffix = statement?.month ?? selectedMonth;

  function handleDownloadJson() {
    if (!statement) {
      return;
    }

    downloadFile(
      `${JSON.stringify(statement, null, 2)}\n`,
      `mo-stripe-statement-${fileSuffix}.json`,
      'application/json',
    );
  }

  function handleDownloadCsv() {
    if (!statement) {
      return;
    }

    downloadFile(
      serializeStatementToCsv(statement),
      `mo-stripe-statement-${fileSuffix}.csv`,
      'text/csv;charset=utf-8',
    );
  }

  return (
    <AccountDialog
      open={open}
      onClose={onClose}
      eyebrow="Monthly statement"
      title="Export ledger month"
      subtitle="Choose a month, inspect the account summary, and export the same canonical dataset as JSON or CSV."
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <label className="block space-y-2">
            <span className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
              Statement month
            </span>
            <input
              type="month"
              value={selectedMonth}
              min={minimumMonth}
              max={currentMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-full rounded-none border border-[#0A0A0A] bg-[#FFFFFF]/75 px-4 py-3 text-[15px] text-[#0A0A0A] outline-none transition-colors duration-150 focus:bg-[#FFFFFF]"
            />
          </label>

          <div className="border border-[#0A0A0A] bg-[#FFFFFF]/55 px-4 py-4">
            <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
              Export contract
            </div>
            <p className="mt-3 text-[14px] leading-6 text-[#0A0A0A]/68">
              JSON remains the canonical machine export and keeps money in
              integer pence. CSV is generated from the same monthly statement so
              both formats describe the same ledger month.
            </p>
          </div>
        </div>

        {requestState === 'loading' ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="h-24 border border-[#0A0A0A] bg-[#FFFFFF]/60" />
              <div className="h-24 border border-[#0A0A0A] bg-[#FFFFFF]/60" />
              <div className="h-24 border border-[#0A0A0A] bg-[#FFFFFF]/60" />
              <div className="h-24 border border-[#0A0A0A] bg-[#FFFFFF]/60" />
            </div>
            <div className="h-64 border border-[#0A0A0A] bg-[#FFFFFF]/60" />
          </div>
        ) : requestState === 'error' ? (
          <div className="border border-[#0A0A0A] bg-[#0A0A0A] px-4 py-4 text-[14px] leading-6 text-[#F4F3EF]">
            {errorMessage}
          </div>
        ) : statement ? (
          <>
            <section className="border border-[#0A0A0A] bg-[#FFFFFF]/62 p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                    Statement window
                  </div>
                  <div className="mt-4 text-[clamp(2rem,3.8vw,3.3rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-[#0A0A0A]">
                    {formatStatementMonth(statement.month)}
                  </div>
                </div>

                <div className="mono-ui border border-[#0A0A0A] bg-[#F4F3EF] px-3 py-3 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/72">
                  {maskAccountId(statement.account.id)}
                </div>
              </div>

              <p className="mt-5 text-[15px] leading-7 text-[#0A0A0A]/68">
                Period start{' '}
                <span className="mono-ui text-[#0A0A0A]">
                  {longDateFormatter.format(new Date(statement.periodStart))}
                </span>{' '}
                through{' '}
                <span className="mono-ui text-[#0A0A0A]">
                  {longDateFormatter.format(new Date(statement.periodEnd))}
                </span>
                . Generated at{' '}
                <span className="mono-ui text-[#0A0A0A]">
                  {longDateFormatter.format(new Date(statement.generatedAt))}
                </span>
                .
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="min-w-0 border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-4">
                <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                  Opening
                </div>
                <div className="mono-ui ledger-value mt-4 text-[clamp(1rem,2vw,1.45rem)] font-semibold tracking-[-0.05em] text-[#0A0A0A]">
                  {formatCurrencyFromPence(statement.summary.openingBalance)}
                </div>
              </div>
              <div className="min-w-0 border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-4">
                <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                  Closing
                </div>
                <div className="mono-ui ledger-value mt-4 text-[clamp(1rem,2vw,1.45rem)] font-semibold tracking-[-0.05em] text-[#0A0A0A]">
                  {formatCurrencyFromPence(statement.summary.closingBalance)}
                </div>
              </div>
              <div className="min-w-0 border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-4">
                <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                  Net flow
                </div>
                <div className="mono-ui ledger-value mt-4 text-[clamp(1rem,2vw,1.45rem)] font-semibold tracking-[-0.05em] text-[#0A0A0A]">
                  {formatNetCurrencyFromPence(statement.summary.netFlow)}
                </div>
              </div>
              <div className="min-w-0 border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-4">
                <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                  Posted lines
                </div>
                <div className="mono-ui ledger-value mt-4 text-[clamp(1rem,2vw,1.45rem)] font-semibold tracking-[-0.05em] text-[#0A0A0A]">
                  {statement.summary.transactionCount}
                </div>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="min-w-0 border border-[#0A0A0A] bg-[#F4F3EF]/82 px-4 py-4">
                <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                  Deposits
                </div>
                <div className="mono-ui ledger-value mt-3 text-[clamp(0.95rem,1.7vw,1rem)] uppercase tracking-[0.12em] text-[#0A0A0A]">
                  {formatCurrencyFromPence(statement.summary.totalDeposits)}
                </div>
              </div>
              <div className="min-w-0 border border-[#0A0A0A] bg-[#F4F3EF]/82 px-4 py-4">
                <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                  Withdrawals
                </div>
                <div className="mono-ui ledger-value mt-3 text-[clamp(0.95rem,1.7vw,1rem)] uppercase tracking-[0.12em] text-[#0A0A0A]">
                  {formatCurrencyFromPence(statement.summary.totalWithdrawals)}
                </div>
              </div>
              <div className="min-w-0 border border-[#0A0A0A] bg-[#F4F3EF]/82 px-4 py-4">
                <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                  Transfer in
                </div>
                <div className="mono-ui ledger-value mt-3 text-[clamp(0.95rem,1.7vw,1rem)] uppercase tracking-[0.12em] text-[#0A0A0A]">
                  {formatCurrencyFromPence(
                    statement.summary.totalIncomingTransfers,
                  )}
                </div>
              </div>
              <div className="min-w-0 border border-[#0A0A0A] bg-[#F4F3EF]/82 px-4 py-4">
                <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                  Transfer out
                </div>
                <div className="mono-ui ledger-value mt-3 text-[clamp(0.95rem,1.7vw,1rem)] uppercase tracking-[0.12em] text-[#0A0A0A]">
                  {formatCurrencyFromPence(
                    statement.summary.totalOutgoingTransfers,
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div className="border border-[#0A0A0A] bg-[#FFFFFF]/62">
                <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-4 py-4 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
                  <span>Statement lines</span>
                  <span>{statement.summary.transactionCount}</span>
                </div>

                <div className="max-h-[22rem] space-y-3 overflow-y-auto p-4">
                  {statement.transactions.length === 0 ? (
                    <div className="border border-[#0A0A0A] bg-[#F4F3EF]/82 px-4 py-4 text-[14px] leading-6 text-[#0A0A0A]/68">
                      No ledger entries were posted in this month.
                    </div>
                  ) : (
                    statement.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="border border-[#0A0A0A] bg-[#FFFFFF]/72 px-4 py-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span
                            className={[
                              'mono-ui text-[12px] uppercase tracking-[0.08em]',
                              transaction.incoming
                                ? 'text-[#167c5a]'
                                : 'text-[#0A0A0A]/78',
                            ].join(' ')}
                          >
                            {formatSignedCurrencyFromPence(
                              transaction.amount,
                              transaction.incoming,
                            )}
                          </span>
                          <span className="mono-ui text-[12px] uppercase tracking-[0.08em] text-[#0A0A0A]/72">
                            {getEntryLabel(transaction)}
                          </span>
                        </div>
                        <div className="mono-ui mt-3 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/42">
                          {longDateFormatter.format(new Date(transaction.createdAt))}
                          {transaction.counterpartyEmail
                            ? ` / ${transaction.counterpartyEmail}`
                            : ''}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  disabled={!statement}
                  className="key-press mono-ui inline-flex min-h-[56px] w-full items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-5 py-3 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Download CSV
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  disabled={!statement}
                  className="mono-ui inline-flex min-h-[56px] w-full items-center justify-center gap-3 border border-[#0A0A0A] bg-[#FFFFFF]/82 px-5 py-3 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] transition-colors duration-150 hover:bg-[#FFFFFF] disabled:cursor-not-allowed disabled:text-[#0A0A0A]/32"
                >
                  Download JSON
                </button>

                <div className="border border-[#0A0A0A] bg-[#FFFFFF]/55 px-4 py-4">
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
                    Why both
                  </div>
                  <p className="mt-3 text-[14px] leading-6 text-[#0A0A0A]/68">
                    CSV is easier to inspect or import into spreadsheets. JSON
                    preserves the exact statement contract for programmatic use.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="border border-[#0A0A0A] bg-[#FFFFFF]/62 px-4 py-5 text-[15px] leading-7 text-[#0A0A0A]/68">
            Choose a month to generate a statement.
          </div>
        )}
      </div>
    </AccountDialog>
  );
}
