'use client';

import type { AccountActivityEntry } from '@/lib/account/account';
import {
  formatSignedCurrencyFromPence,
  getEntryLabel,
  longDateFormatter,
} from './accountDisplay';

type AccountTransactionSurfaceProps = {
  history: AccountActivityEntry[];
  accountCreatedAt: string;
  email: string;
  selectedTransactionId: string | null;
  onOpenTransaction: (transactionId: string) => void;
  onOpenLatestTransaction: () => void;
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

export function AccountTransactionSurface({
  history,
  accountCreatedAt,
  email,
  selectedTransactionId,
  onOpenTransaction,
  onOpenLatestTransaction,
}: AccountTransactionSurfaceProps) {
  const ledgerLines = buildLedgerLines(history, accountCreatedAt, email);
  const rollingLines =
    ledgerLines.length >= 6 ? [...ledgerLines, ...ledgerLines] : ledgerLines;
  const shouldAnimate = ledgerLines.length >= 6;

  return (
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
                onClick={() => onOpenTransaction(line.transactionId!)}
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
          Tip: select any real ledger line to inspect it in a cleaner modal
          view.
        </p>
        <button
          type="button"
          onClick={onOpenLatestTransaction}
          disabled={history.length === 0}
          className="mono-ui text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A] underline underline-offset-4 disabled:cursor-not-allowed disabled:text-[#0A0A0A]/32"
        >
          Open details
        </button>
      </div>
    </aside>
  );
}
