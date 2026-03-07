import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
};

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
};

type UtilityCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

type HighlightRow = {
  label: string;
  value: string;
  tone?: "default" | "accent" | "muted";
};

type EmployerHighlightCardProps = {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  proofLabel: string;
  proofValue: string;
  footer: string;
  rows: HighlightRow[];
};

const navigationItems = ["Product", "Pricing", "Docs", "Security"];

const metrics = [
  { label: "UPTIME", value: "99.99%" },
  { label: "SETTLEMENT", value: "T+0" },
  { label: "LEDGER LINES", value: "1px" },
  { label: "NUMERALS", value: "TABULAR" },
];

const transactions = [
  { amount: "+ $ 1,040.00", label: "INVOICE_PAID", positive: true, muted: true },
  { amount: "- $ 12.50", label: "COFFEE", positive: false },
  { amount: "+ $ 500.00", label: "DEPOSIT", positive: true },
  { amount: "- $ 80.00", label: "SOFTWARE", positive: false },
  { amount: "- $ 15.99", label: "SUBSCRIPTION", positive: false },
  { amount: "+ $ 2,200.00", label: "PAYROLL", positive: true },
  { amount: "- $ 105.00", label: "UTILITIES", positive: false },
  { amount: "- $ 45.20", label: "AWS_BILLING", positive: false },
  { amount: "- $ 120.50", label: "WHOLE_FOODS", positive: false },
  { amount: "+ $ 500.00", label: "PEER_TRANSFER", positive: true, muted: true },
];

const accounts = [
  { name: "Checking", masked: "*4092", balance: "$ 14,092.50" },
  { name: "Savings", masked: "*9982", balance: "$ 110,000.00" },
];

const utilityCards = [
  { label: "EXPORT", value: "CSV / JSON", icon: <DownloadIcon className="h-4 w-4" /> },
  { label: "WEBHOOKS", value: "real-time", icon: <ActivityIcon className="h-4 w-4" /> },
  { label: "AUDIT TRAIL", value: "immutable", icon: <BranchIcon className="h-4 w-4" /> },
];

const architectureSignals = [
  { label: "APPEND-ONLY", value: "reliable audit trail" },
  { label: "ALL-OR-NOTHING", value: "single transaction outcome" },
  { label: "RETRY-SAFE", value: "duplicate protection built in" },
  { label: "FK-GUARDED", value: "strict relational integrity" },
];

const employerHighlights: EmployerHighlightCardProps[] = [
  {
    index: "01",
    eyebrow: "AUDIT GUARANTEE",
    title: "Immutable Ledger",
    description:
      "Every transaction is append-only to guarantee a reliable audit trail.",
    proofLabel: "write mode",
    proofValue: "append_only",
    footer: "history preserved",
    rows: [
      { label: "ENTRY POLICY", value: "WRITE ONCE", tone: "accent" },
      { label: "REVERSALS", value: "COMPENSATING ENTRY" },
      { label: "TRACE", value: "FULL LINEAGE" },
    ],
  },
  {
    index: "02",
    eyebrow: "TRANSFER SAFETY",
    title: "Atomic Transfers",
    description:
      "Database transactions ensure transfers succeed or fail as a single operation.",
    proofLabel: "txn scope",
    proofValue: "all_or_nothing",
    footer: "no partial movement",
    rows: [
      { label: "DEBIT", value: "LOCKED" },
      { label: "CREDIT", value: "LOCKED" },
      { label: "COMMIT", value: "SHARED OUTCOME", tone: "accent" },
    ],
  },
  {
    index: "03",
    eyebrow: "REPLAY CONTROL",
    title: "Idempotent Requests",
    description:
      "Safe retry mechanisms prevent duplicate financial operations.",
    proofLabel: "request key",
    proofValue: "retry_safe",
    footer: "duplicate prevention",
    rows: [
      { label: "REQUEST ID", value: "REUSED ON RETRY" },
      { label: "MATCH POLICY", value: "SAME INPUT REQUIRED" },
      { label: "RESPONSE", value: "SINGLE EFFECT", tone: "accent" },
    ],
  },
  {
    index: "04",
    eyebrow: "DATA INTEGRITY",
    title: "Relational Data Model",
    description:
      "Accounts, users, and transactions modeled with strict relational integrity.",
    proofLabel: "model",
    proofValue: "fk_constrained",
    footer: "schema enforced",
    rows: [
      { label: "USERS", value: "OWN ACCOUNTS" },
      { label: "ACCOUNTS", value: "OWN TRANSACTIONS" },
      { label: "DELETES", value: "RULE-GUARDED", tone: "accent" },
    ],
  },
];

export default function Home() {
  const rollingTransactions = [...transactions, ...transactions];

  return (
    <div className="page-surface min-h-screen">
      <div className="mx-auto flex w-full max-w-[1960px] flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <header className="flex flex-wrap items-center justify-between gap-4 border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-4 py-4 backdrop-blur-[2px]">
          <a href="#" className="flex items-center gap-3">
            <div className="mono-ui grid h-11 w-11 place-items-center border border-[#0A0A0A] bg-[#F4F3EF] text-[11px] font-semibold uppercase">
              mo
            </div>
            <span className="mono-ui text-[12px] font-semibold tracking-[-0.03em] text-[#0A0A0A]">
              mo-stripe
            </span>
          </a>

          <nav className="mono-ui hidden items-center gap-8 text-[12px] text-[#0A0A0A]/80 lg:flex">
            {navigationItems.map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors duration-150 hover:text-[#0A0A0A]"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="#" variant="secondary">
              Sign in
            </ButtonLink>
            <ButtonLink href="#" icon={<ArrowRightIcon className="h-3.5 w-3.5" />}>
              Access Ledger
            </ButtonLink>
          </div>
        </header>

        <main className="py-5 lg:py-6 xl:py-8">
          <section className="grid items-start gap-8 xl:gap-10 2xl:gap-14 xl:grid-cols-[minmax(560px,0.84fr)_minmax(940px,1.16fr)] 2xl:grid-cols-[minmax(620px,0.86fr)_minmax(1080px,1.14fr)]">
            <div className="flex min-h-full flex-col gap-6 lg:gap-8">
              <div className="space-y-5 lg:space-y-6 lg:pt-4">
                <div className="mono-ui inline-flex items-center gap-6 border border-[#0A0A0A] bg-[rgba(255,255,255,0.42)] px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/80">
                  <span>ARCHITECTURAL LEDGER</span>
                  <span className="tracking-[0.02em]">v1.0</span>
                </div>

                <div className="max-w-[46rem] space-y-4">
                  <h1 className="text-balance text-[clamp(4.6rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.09em] text-[#0A0A0A]">
                    The Ledger.
                  </h1>
                  <p className="text-[clamp(1.85rem,4vw,3rem)] font-medium leading-none tracking-[-0.07em] text-[#0A0A0A]">
                    Your money, audited.
                  </p>
                  <p className="max-w-[38rem] text-[18px] leading-8 text-[#0A0A0A]/55">
                    A precise, monospaced view of balances and movement built like an
                    instrument. Crisp borders. Tabular numerals. A live feed that
                    reads like a receipt roll.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <ButtonLink href="#" icon={<ArrowUpRightIcon className="h-3.5 w-3.5" />}>
                    Explore More
                  </ButtonLink>
                  <ButtonLink href="#" icon={<SquareIcon className="h-3.5 w-3.5" />} variant="secondary">
                    Read Docs
                  </ButtonLink>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <MetricCard key={metric.label} label={metric.label} value={metric.value} />
                ))}
              </div>

              <div className="mono-ui flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#0A0A0A] pt-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C7F000]" />
                  Live feed
                </span>
                <span>Decimal alignment guaranteed</span>
                <span>Settlement visibility at T+0</span>
              </div>
            </div>

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
                    <div className="mono-ui mt-5 text-[24px] font-medium leading-none">$</div>
                    <div className="mono-ui mt-4 text-[clamp(1.9rem,3vw,3.15rem)] leading-none font-semibold tracking-[-0.07em] text-[#0A0A0A]">
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
                    <ButtonLink href="#" icon={<ArrowUpRightIcon className="h-3.5 w-3.5" />} variant="secondary">
                      Deposit
                    </ButtonLink>
                    <ButtonLink href="#" icon={<ArrowRightIcon className="h-3.5 w-3.5 rotate-[-45deg]" />} variant="secondary">
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
                      <a href="#" className="text-[#0A0A0A]/80 underline-offset-4 hover:underline">
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
                            <div className="mt-2 text-[#0A0A0A]/60">{account.masked}</div>
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
                                "font-medium",
                                transaction.muted
                                  ? "text-[#98bfb7]"
                                  : transaction.positive
                                    ? "text-[#167c5a]"
                                    : "text-[#0A0A0A]/80",
                              ].join(" ")}
                            >
                              {transaction.amount}
                            </span>
                            <span className={transaction.muted ? "text-[#0A0A0A]/30" : "text-[#0A0A0A]/80"}>
                              {transaction.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mono-ui mt-4 text-[11px] leading-6 uppercase tracking-[0.08em] text-[#0A0A0A]/65">
                    Tip: numbers use tabular numerals for perfect alignment.{" "}
                    <a href="#" className="text-[#0A0A0A] underline underline-offset-4">
                      View sample ledger
                    </a>
                    .
                  </p>
                </div>
              </div>

              <div className="grid gap-px border-t border-[#0A0A0A] bg-[#0A0A0A] md:grid-cols-3">
                {utilityCards.map((card) => (
                  <UtilityCard key={card.label} icon={card.icon} label={card.label} value={card.value} />
                ))}
              </div>
            </section>
            </section>

            <section className="mt-6 overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.5)] backdrop-blur-[2px]">
              <div className="grid gap-px border-b border-[#0A0A0A] bg-[#0A0A0A] xl:grid-cols-[minmax(360px,0.72fr)_minmax(0,1.28fr)]">
                <div className="bg-[rgba(255,255,255,0.52)] px-4 py-5 lg:px-5">
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                    ENGINEERING GUARANTEES
                  </div>
                  <h2 className="mt-4 max-w-[22rem] text-[clamp(2rem,3vw,3.2rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-[#0A0A0A]">
                    How the backend earns the interface.
                  </h2>
                  <p className="mt-4 max-w-[30rem] text-[16px] leading-7 text-[#0A0A0A]/58">
                    The hero above shows the product surface. These panels show the
                    operating guarantees behind it: audit safety, transfer integrity,
                    retry protection, and a strict relational core.
                  </p>
                </div>

                <div className="grid gap-px bg-[#0A0A0A] sm:grid-cols-2 xl:grid-cols-4">
                  {architectureSignals.map((signal) => (
                    <div
                      key={signal.label}
                      className="flex items-center justify-between gap-4 bg-[rgba(255,255,255,0.52)] px-4 py-4"
                    >
                      <div>
                        <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                          {signal.label}
                        </div>
                        <div className="mt-3 text-[15px] leading-6 text-[#0A0A0A]/72">
                          {signal.value}
                        </div>
                      </div>
                      <span className="h-2.5 w-2.5 rounded-full border border-[#0A0A0A] bg-[#C7F000]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-px bg-[#0A0A0A] md:grid-cols-2 xl:grid-cols-4">
                {employerHighlights.map((highlight) => (
                  <EmployerHighlightCard key={highlight.title} {...highlight} />
                ))}
              </div>
            </section>
          </main>

        <footer className="mono-ui mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#0A0A0A] pt-4 pb-4 text-[11px] uppercase tracking-[0.1em] text-[#0A0A0A]/60">
          <p>Copyright 2026 mo-stripe. Built with 1px discipline.</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#" className="transition-colors duration-150 hover:text-[#0A0A0A]">
              Privacy
            </a>
            <a href="#" className="transition-colors duration-150 hover:text-[#0A0A0A]">
              Terms
            </a>
            <a href="#" className="transition-colors duration-150 hover:text-[#0A0A0A]">
              Status
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ButtonLink({
  children,
  href,
  icon,
  variant = "primary",
}: ButtonLinkProps) {
  const baseClasses =
    "mono-ui inline-flex items-center justify-center gap-3 border px-4 py-3 text-[13px] uppercase tracking-[0.12em] transition-colors duration-150";
  const variantClasses =
    variant === "primary"
      ? "key-press border-[#0A0A0A] bg-[#C7F000] text-[#0A0A0A]"
      : "border-[#0A0A0A] bg-[rgba(255,255,255,0.7)] text-[#0A0A0A] hover:bg-[#FFFFFF]";

  return (
    <a href={href} className={`${baseClasses} ${variantClasses}`}>
      <span>{children}</span>
      {icon ? (
        <span className="grid h-5 w-5 place-items-center border border-current bg-transparent">
          {icon}
        </span>
      ) : null}
    </a>
  );
}

function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <div className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.42)] px-4 py-5">
      <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
        {label}
      </div>
      <div className="mono-ui mt-3 text-[1.65rem] font-semibold tracking-[-0.04em] text-[#0A0A0A]">
        {value}
      </div>
      {detail ? (
        <div className="mt-2 text-sm text-[#0A0A0A]/55">{detail}</div>
      ) : null}
    </div>
  );
}

function UtilityCard({ icon, label, value }: UtilityCardProps) {
  return (
    <div className="flex items-start justify-between gap-4 bg-[rgba(255,255,255,0.52)] px-4 py-5">
      <div>
        <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
          {label}
        </div>
        <div className="mono-ui mt-3 text-[1.05rem] uppercase tracking-[0.08em] text-[#0A0A0A]">
          {value}
        </div>
      </div>
      <span className="mt-1 text-[#0A0A0A]">{icon}</span>
    </div>
  );
}

function EmployerHighlightCard({
  index,
  eyebrow,
  title,
  description,
  proofLabel,
  proofValue,
  footer,
  rows,
}: EmployerHighlightCardProps) {
  return (
    <article className="flex h-full flex-col justify-between bg-[rgba(255,255,255,0.52)] px-4 py-5 transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-[rgba(255,255,255,0.68)]">
      <div>
        <div className="mono-ui flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em]">
          <span className="text-[#0A0A0A]/60">{eyebrow}</span>
          <span className="border border-[#0A0A0A] bg-[#FFFFFF]/70 px-2 py-1 text-[#0A0A0A]">
            {index}
          </span>
        </div>

        <h3 className="mt-6 text-[2rem] font-semibold leading-[0.92] tracking-[-0.07em] text-[#0A0A0A]">
          {title}
        </h3>
        <p className="mt-4 max-w-[18rem] text-[15px] leading-7 text-[#0A0A0A]/60">
          {description}
        </p>
      </div>

      <div className="mt-6">
        <div className="border border-[#0A0A0A] bg-[#F4F3EF]/78 p-3">
          <div className="mono-ui flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em]">
            <span className="text-[#0A0A0A]/60">{proofLabel}</span>
            <span className="text-[#0A0A0A]">{proofValue}</span>
          </div>

          <div className="mt-3 space-y-2">
            {rows.map((row) => (
              <div
                key={`${title}-${row.label}`}
                className="mono-ui flex items-center justify-between gap-4 border border-[#0A0A0A] bg-[#FFFFFF]/45 px-3 py-2 text-[11px] uppercase tracking-[0.1em]"
              >
                <span className="text-[#0A0A0A]/60">{row.label}</span>
                <span
                  className={
                    row.tone === "accent"
                      ? "text-[#167c5a]"
                      : row.tone === "muted"
                        ? "text-[#0A0A0A]/45"
                        : "text-[#0A0A0A]"
                  }
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mono-ui mt-3 flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
          <span>{footer}</span>
          <span>{proofValue}</span>
        </div>
      </div>
    </article>
  );
}

function ArrowRightIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19M12 5L19 12L12 19"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 17L17 7M9 7H17V15"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SquareIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6H18V18H6Z"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ShieldIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3L18 5.5V11C18 15.2 15.4 18.9 12 20C8.6 18.9 6 15.2 6 11V5.5L12 3Z"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
      <path
        d="M10.2 11.5L11.6 13L14.8 9.5"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TransferIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 7H19M19 7L15.5 3.5M19 7L15.5 10.5M17 17H5M5 17L8.5 13.5M5 17L8.5 20.5"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DownloadIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4V15M12 15L8 11M12 15L16 11M6 19H18"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ActivityIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13H8L10.5 6L13.5 18L16 11H20"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BranchIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 5A2 2 0 1 1 8 9A2 2 0 0 1 8 5ZM16 15A2 2 0 1 1 16 19A2 2 0 0 1 16 15ZM16 5A2 2 0 1 1 16 9A2 2 0 0 1 16 5Z"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
      <path
        d="M8 9V12C8 13.7 9.3 15 11 15H16M16 9V15"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}
