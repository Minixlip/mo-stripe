import Link from 'next/link';
import type { AuthContent } from '../types';
import { AuthField, AuthUtilityCard } from '../ui';

type AuthConsolePanelProps = {
  content: AuthContent;
};

export function AuthConsolePanel({ content }: AuthConsolePanelProps) {
  const rollingTrace = [...content.traceEvents, ...content.traceEvents];

  return (
    <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.5)] backdrop-blur-[2px]">
      <div className="mono-ui flex flex-wrap items-center justify-between gap-3 border-b border-[#0A0A0A] px-4 py-4 text-[12px] uppercase tracking-[0.08em]">
        <div className="flex items-center gap-3 text-[#0A0A0A]">
          <span className="h-2.5 w-2.5 rounded-full border border-[#0A0A0A] bg-[#C7F000]" />
          <span>{content.panelLabel}</span>
          <span className="text-[#0A0A0A]/55">{content.panelMode}</span>
        </div>
        <div className="flex items-center gap-6 text-[#0A0A0A]/80">
          <span>tls</span>
          <span>09:41</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(380px,0.88fr)_minmax(290px,0.72fr)] 2xl:grid-cols-[minmax(420px,0.92fr)_minmax(330px,0.68fr)]">
        <div className="border-b border-[#0A0A0A] p-4 lg:border-b-0 lg:border-r">
          <div className="border border-[#0A0A0A] bg-[#F4F3EF]/80 p-5">
            <div className="mono-ui flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em]">
              <span className="text-[#0A0A0A]/60">Operator form</span>
              <span className="text-[#0A0A0A]/80">live contract</span>
            </div>

            <p className="mt-4 max-w-[34rem] text-[15px] leading-7 text-[#0A0A0A]/58">
              {content.formHint}
            </p>

            <form
              action="#"
              className="mt-5 space-y-5"
            >
              {content.fields.map((field) => (
                <AuthField
                  key={field.name}
                  field={field}
                />
              ))}

              <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#0A0A0A] py-3">
                <label className="flex items-center gap-3 text-[14px] text-[#0A0A0A]/68">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded-none border border-[#0A0A0A] accent-[#C7F000]"
                  />
                  <span>{content.consentLabel}</span>
                </label>
                <Link
                  href={content.auxiliaryHref}
                  className="mono-ui text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A] underline underline-offset-4"
                >
                  {content.auxiliaryLabel}
                </Link>
              </div>

              <button
                type="submit"
                className="key-press mono-ui inline-flex w-full items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-4 py-3 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A]"
              >
                {content.submitLabel}
              </button>
            </form>

            <div className="mono-ui mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#0A0A0A] pt-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/65">
              <span>{content.switchPrompt}</span>
              <Link
                href={content.switchHref}
                className="text-[#0A0A0A] underline underline-offset-4"
              >
                {content.switchLabel}
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mono-ui mb-4 flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.12em]">
            <span className="text-[#0A0A0A]/80">SESSION TRACE</span>
            <span className="text-[#0A0A0A]/80">checks: {content.checks.length}</span>
          </div>

          <div className="overflow-hidden border border-[#0A0A0A] bg-[#F4F3EF]/80">
            <div className="mono-ui flex items-center justify-between gap-4 border-b border-[#0A0A0A] px-4 py-3 text-[11px] uppercase tracking-[0.12em]">
              <span>STATUS</span>
              <span>LIVE</span>
            </div>

            <div className="relative h-[28rem] overflow-hidden px-3 py-3 sm:h-[31rem]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#F4F3EF] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F4F3EF] to-transparent" />

              <div className="ledger-roll-track space-y-3">
                {rollingTrace.map((event, index) => (
                  <div
                    key={`${event.label}-${index}`}
                    className="mono-ui flex items-center justify-between gap-4 border border-[#0A0A0A] bg-[#FFFFFF]/30 px-4 py-3 text-[12px] uppercase tracking-[0.06em]"
                  >
                    <span
                      className={[
                        'font-medium',
                        event.tone === 'muted'
                          ? 'text-[#98bfb7]'
                          : event.tone === 'accent'
                            ? 'text-[#167c5a]'
                            : 'text-[#0A0A0A]/80',
                      ].join(' ')}
                    >
                      {event.amount}
                    </span>
                    <span
                      className={
                        event.tone === 'muted'
                          ? 'text-[#0A0A0A]/45'
                          : 'text-[#0A0A0A]/80'
                      }
                    >
                      {event.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-px bg-[#0A0A0A] sm:grid-cols-2">
            {content.checks.map((check) => (
              <div
                key={check.label}
                className="bg-[rgba(255,255,255,0.52)] px-4 py-4"
              >
                <div className="mono-ui text-[10px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
                  {check.label}
                </div>
                <div className="mt-3 text-[13px] leading-6 text-[#0A0A0A]/68">
                  {check.detail}
                </div>
                <div className="mono-ui mt-4 text-[10px] uppercase tracking-[0.12em] text-[#167c5a]">
                  {check.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-px border-t border-[#0A0A0A] bg-[#0A0A0A] md:grid-cols-3">
        {content.utilityCards.map((card) => (
          <AuthUtilityCard
            key={card.label}
            card={card}
          />
        ))}
      </div>
    </section>
  );
}
