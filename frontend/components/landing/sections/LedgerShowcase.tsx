import { accounts, transactions, utilityCards } from '../data';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ButtonLink,
  ProcessingChecksPanel,
  ShieldIcon,
  TransferIcon,
  UtilityCard,
} from '../ui';

export function LedgerShowcase() {
  const rollingTransactions = [...transactions, ...transactions];

  return (
    <section
      aria-label="Architectural ledger preview"
      className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.5)] backdrop-blur-[2px]"
    >
      <div className="mono-ui flex flex-wrap items-center justify-between gap-3 border-b border-[#0A0A0A] px-4 py-4 text-[12px] uppercase tracking-[0.08em]">
        <div className="flex items-center gap-3 text-[#0A0A0A]">
          <span className="h-2.5 w-2.5 rounded-full border border-[#0A0A0A] bg-[#C7F000]" />
          <span>Cascading Feed</span>
          <span className="text-[#0A0A0A]/55">receipt-roll</span>
        </div>
        <div className="flex items-center gap-6 text-[#0A0A0A]/80">
          <span>USD</span>
          <span>09:41</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(390px,0.96fr)_minmax(460px,1.04fr)] 2xl:grid-cols-[minmax(450px,0.98fr)_minmax(560px,1.02fr)]">
        <div className="border-b border-[#0A0A0A] p-4 lg:border-b-0 lg:border-r">
          <div className="relative border border-[#0A0A0A] bg-[#F4F3EF]/80 p-5">
            <div className="absolute right-5 top-5">
              <span className="mono-ui inline-flex items-center gap-2 border border-[#0A0A0A] bg-[#FFFFFF] px-3 py-2 text-[11px] uppercase tracking-[0.1em]">
                <ShieldIcon className="h-3.5 w-3.5" />
                audited
              </span>
            </div>

            <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
              TOTAL BALANCE
            </div>
            <div className="mono-ui mt-5 text-[24px] font-medium leading-none">
              $
            </div>
            <div className="mono-ui mt-4 text-[clamp(1.9rem,3vw,3.15rem)] font-semibold leading-none tracking-[-0.07em] text-[#0A0A0A]">
              124,092.50
            </div>
            <div className="mt-6 h-px w-full bg-[#0A0A0A]" />

            <div className="mono-ui mt-5 grid gap-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/80">
              <div className="flex items-center justify-between gap-4">
                <span>NET FLOW</span>
                <span className="text-[#0A0A0A]">+ $ 3,842.30</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>LAST SETTLED</span>
                <span className="text-[#0A0A0A]">2026-03-07</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ButtonLink
              href="#"
              icon={<ArrowUpRightIcon className="h-3.5 w-3.5" />}
              variant="secondary"
            >
              Deposit
            </ButtonLink>
            <ButtonLink
              href="#"
              icon={<ArrowRightIcon className="h-3.5 w-3.5 rotate-[-45deg]" />}
              variant="secondary"
            >
              Withdraw
            </ButtonLink>
          </div>

          <a
            href="#"
            className="key-press mono-ui mt-4 flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-4 py-3 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A]"
          >
            <TransferIcon className="h-4 w-4" />
            Transfer
          </a>

          <div className="mt-4 border border-[#0A0A0A] bg-[#F4F3EF]/80 p-4">
            <div className="mono-ui flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em]">
              <span className="text-[#0A0A0A]/60">ACCOUNTS</span>
              <a
                href="#"
                className="text-[#0A0A0A]/80 underline-offset-4 hover:underline"
              >
                + new
              </a>
            </div>

            <div className="mt-4 space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.name}
                  className="flex items-center justify-between gap-4 border border-[#0A0A0A] bg-[#FFFFFF]/40 px-4 py-4"
                >
                  <div className="mono-ui text-[12px] uppercase tracking-[0.08em] text-[#0A0A0A]">
                    <div>{account.name}</div>
                    <div className="mt-2 text-[#0A0A0A]/60">
                      {account.masked}
                    </div>
                  </div>
                  <div className="mono-ui text-right text-[12px] font-semibold uppercase tracking-[0.06em] text-[#0A0A0A]">
                    {account.balance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mono-ui mb-4 flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.12em]">
            <span className="text-[#0A0A0A]/80">THE RECEIPT ROLL</span>
            <span className="flex items-center gap-2 text-[#0A0A0A]/80">
              <span>lines / minute: 18</span>
            </span>
          </div>

          <div className="overflow-hidden border border-[#0A0A0A] bg-[#F4F3EF]/80">
            <div className="mono-ui flex items-center justify-between gap-4 border-b border-[#0A0A0A] px-4 py-3 text-[11px] uppercase tracking-[0.12em]">
              <span>STATUS</span>
              <span>LIVE</span>
            </div>

            <div className="relative h-[31.5rem] overflow-hidden px-3 py-3 sm:h-[34rem]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#F4F3EF] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F4F3EF] to-transparent" />

              <div className="ledger-roll-track space-y-3">
                {rollingTransactions.map((transaction, index) => (
                  <div
                    key={`${transaction.label}-${index}`}
                    className="mono-ui flex items-center justify-between gap-4 border border-[#0A0A0A] bg-[#FFFFFF]/30 px-4 py-3 text-[12px] uppercase tracking-[0.06em]"
                  >
                    <span
                      className={[
                        'font-medium',
                        transaction.muted
                          ? 'text-[#98bfb7]'
                          : transaction.positive
                            ? 'text-[#167c5a]'
                            : 'text-[#0A0A0A]/80',
                      ].join(' ')}
                    >
                      {transaction.amount}
                    </span>
                    <span
                      className={
                        transaction.muted
                          ? 'text-[#0A0A0A]/30'
                          : 'text-[#0A0A0A]/80'
                      }
                    >
                      {transaction.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mono-ui mt-4 text-[11px] leading-6 uppercase tracking-[0.08em] text-[#0A0A0A]/65">
            Tip: numbers use tabular numerals for perfect alignment.{' '}
            <a
              href="#"
              className="text-[#0A0A0A] underline underline-offset-4"
            >
              View sample ledger
            </a>
            .
          </p>
        </div>
      </div>

      <div className="grid gap-px border-t border-[#0A0A0A] bg-[#0A0A0A] md:grid-cols-3">
        {utilityCards.map((card) => (
          <UtilityCard
            key={card.label}
            {...card}
          />
        ))}
      </div>

      <div className="p-2">
        <ProcessingChecksPanel />
      </div>
    </section>
  );
}
