import {
  ActivityIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BranchIcon,
  DownloadIcon,
  ShieldIcon,
  TransferIcon,
} from '@/components/landing/ui';
import type { AccountOverview } from '@/lib/account/account';

type AccountDashboardProps = {
  overview: AccountOverview;
};

type LedgerLine = {
  id: string;
  amount: string;
  label: string;
  meta: string;
  positive: boolean;
  muted?: boolean;
};

const gbpFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

const compactDateFormatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const longDateFormatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

function formatCurrencyFromPence(amount: number) {
  return gbpFormatter.format(amount / 100);
}

function formatAmountForLedger(amount: number, incoming: boolean) {
  const formatted = formatCurrencyFromPence(amount);
  return `${incoming ? '+' : '-'} ${formatted}`;
}

function maskAccountId(id: string) {
  return `*${id.slice(-4).toUpperCase()}`;
}

function buildLedgerLines(overview: AccountOverview): LedgerLine[] {
  const transactionLines = overview.activity.map((item) => ({
    id: item.id,
    amount: formatAmountForLedger(item.amount, item.incoming),
    label:
      item.type === 'DEPOSIT' && item.systemGenerated ? 'OPENING_DEPOSIT' : item.type,
    meta: longDateFormatter.format(new Date(item.createdAt)),
    positive: item.incoming,
    muted: item.systemGenerated,
  }));

  return [
    {
      id: 'account-opened',
      amount: 'SYSTEM',
      label: 'ACCOUNT_OPENED',
      meta: longDateFormatter.format(new Date(overview.account.createdAt)),
      positive: true,
      muted: true,
    },
    ...transactionLines,
    {
      id: 'session-verified',
      amount: 'LIVE',
      label: 'SESSION_VERIFIED',
      meta: overview.email,
      positive: true,
      muted: true,
    },
  ];
}

const utilityCards = [
  {
    label: 'EXPORT',
    value: 'CSV / JSON',
    icon: DownloadIcon,
  },
  {
    label: 'WEBHOOKS',
    value: 'coming next',
    icon: ActivityIcon,
  },
  {
    label: 'AUDIT TRAIL',
    value: 'opening write',
    icon: BranchIcon,
  },
];

export function AccountDashboard({ overview }: AccountDashboardProps) {
  const ledgerLines = buildLedgerLines(overview);
  const rollingLines =
    ledgerLines.length >= 6 ? [...ledgerLines, ...ledgerLines] : ledgerLines;
  const shouldAnimate = ledgerLines.length >= 6;
  const lastSettledAt = overview.activity[0]?.createdAt ?? overview.account.createdAt;
  const netFlow = overview.activity.reduce(
    (total, item) => total + (item.incoming ? item.amount : -item.amount),
    0,
  );

  return (
    <div className="page-surface min-h-screen">
      <div className="mx-auto flex w-full max-w-[1960px] flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <main className="py-5 lg:py-6 xl:py-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-5">
              <div className="mono-ui inline-flex flex-wrap items-center border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]">
                <span className="border-r border-[#0A0A0A] px-4 py-3">Dashboard</span>
                <span className="px-4 py-3">Personal</span>
              </div>

              <div className="max-w-[54rem] space-y-4">
                <h1 className="text-balance text-[clamp(3.3rem,6vw,5.7rem)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#0A0A0A]">
                  Ledger overview
                </h1>
                <p className="max-w-[52rem] text-[clamp(1.2rem,2.5vw,1.95rem)] leading-[1.45] tracking-[-0.05em] text-[#0A0A0A]/52">
                  High-precision balances, a single personal partition, and a
                  live receipt roll. Every amount aligns because every bootstrap
                  write is recorded.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                disabled
                className="key-press mono-ui inline-flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-6 py-4 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-100"
              >
                <TransferIcon className="h-4 w-4" />
                Transfer
              </button>

              <a
                href="#receipt-roll"
                className="mono-ui inline-flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[rgba(255,255,255,0.7)] px-6 py-4 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] transition-colors duration-150 hover:bg-[#FFFFFF]"
              >
                Transaction details
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.38fr)_minmax(360px,0.94fr)]">
            <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]">
              <div className="mono-ui flex flex-wrap items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <div className="flex items-center gap-3">
                  <span>Total balance</span>
                  <span className="text-[#0A0A0A]/55">GBP</span>
                </div>
                <span className="inline-flex items-center gap-2 border border-[#0A0A0A] bg-[#F4F3EF] px-4 py-3 text-[11px]">
                  <ShieldIcon className="h-3.5 w-3.5" />
                  audited
                </span>
              </div>

              <div className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
                <div className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] p-6">
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/62">
                    Current
                  </div>
                  <div className="mt-7 flex items-end gap-3">
                    <span className="mono-ui text-[clamp(2.8rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.08em] text-[#0A0A0A]">
                      {formatCurrencyFromPence(overview.account.balance)}
                    </span>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="border border-[#0A0A0A] bg-[#F4F3EF]/70 px-4 py-4">
                      <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/55">
                        Net flow
                      </div>
                      <div className="mono-ui mt-4 text-[1.45rem] font-semibold tracking-[-0.05em] text-[#0A0A0A]">
                        + {formatCurrencyFromPence(netFlow)}
                      </div>
                    </div>

                    <div className="border border-[#0A0A0A] bg-[#F4F3EF]/70 px-4 py-4">
                      <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/55">
                        Last settled
                      </div>
                      <div className="mono-ui mt-4 text-[1.45rem] font-semibold tracking-[-0.05em] text-[#0A0A0A]">
                        {compactDateFormatter.format(new Date(lastSettledAt))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-px w-full bg-[#0A0A0A]" />
                  <p className="mono-ui mt-6 text-[12px] uppercase tracking-[0.08em] text-[#0A0A0A]/72">
                    Precision mode: pence-backed ledger numerals.
                  </p>
                </div>

                <div className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] p-5">
                  <div className="mono-ui flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/65">
                    <span>Quick actions</span>
                    <span>live</span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                    <button
                      type="button"
                      disabled
                      className="mono-ui inline-flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[rgba(255,255,255,0.82)] px-4 py-4 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-100"
                    >
                      <ArrowRightIcon className="h-3.5 w-3.5 rotate-[-45deg]" />
                      Deposit
                    </button>

                    <button
                      type="button"
                      disabled
                      className="mono-ui inline-flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[rgba(255,255,255,0.82)] px-4 py-4 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-100"
                    >
                      <ArrowUpRightIcon className="h-3.5 w-3.5" />
                      Withdraw
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="key-press mono-ui mt-3 inline-flex w-full items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-4 py-4 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-100"
                  >
                    <TransferIcon className="h-4 w-4" />
                    Transfer
                  </button>

                  <div className="mt-5 h-px w-full bg-[#0A0A0A]/35" />

                  <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#0A0A0A]/72">
                    <p>
                      The bootstrap account is live and tied to{' '}
                      <span className="mono-ui text-[#0A0A0A]">{overview.email}</span>.
                    </p>
                    <p>
                      Funds movement routes are the next backend milestone, so
                      the action rail is intentionally staged but inactive.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#0A0A0A] p-6">
                <div className="mono-ui flex flex-wrap items-center justify-between gap-3 border border-[#0A0A0A] bg-[#F4F3EF]/70 px-5 py-4 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/65">
                  <span>Account partition</span>
                  <span className="underline underline-offset-4">primary personal</span>
                </div>

                <div className="mt-5 border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="space-y-4">
                      <div className="mono-ui text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A]">
                        Personal ledger
                      </div>
                      <div className="mono-ui text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]/62">
                        {maskAccountId(overview.account.id)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/55">
                        Balance
                      </div>
                      <div className="mono-ui mt-4 text-[1.9rem] font-semibold tracking-[-0.06em] text-[#0A0A0A]">
                        {formatCurrencyFromPence(overview.account.balance)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-[#0A0A0A]/28 pt-5 text-[15px] leading-7 text-[#0A0A0A]/72 sm:grid-cols-2">
                    <p>
                      Opening credit posted on{' '}
                      <span className="mono-ui text-[#0A0A0A]">
                        {longDateFormatter.format(
                          new Date(overview.account.createdAt),
                        )}
                      </span>
                      .
                    </p>
                    <p>
                      Account owner is resolved from the backend session, not
                      from client-supplied identifiers.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {utilityCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <div
                        key={card.label}
                        className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-4 py-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="mono-ui text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                            {card.label}
                          </div>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="mt-5 text-[15px] leading-7 text-[#0A0A0A]/72">
                          {card.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

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
                  {rollingLines.map((line, index) => (
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
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#0A0A0A] px-5 py-4 text-[14px] leading-6 text-[#0A0A0A]/65">
                <p>
                  Tip: the opening deposit is a real transaction entry, so the
                  balance and history stay aligned from day one.
                </p>
                <a
                  href="#"
                  className="mono-ui text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A] underline underline-offset-4"
                >
                  Open details
                </a>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
