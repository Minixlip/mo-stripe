import type { AuthContent } from '../types';

type AuthExperienceProps = {
  content: AuthContent;
};

export function AuthExperience({ content }: AuthExperienceProps) {
  return (
    <div className="flex min-h-full flex-col gap-6 lg:gap-8">
      <div className="space-y-5 lg:space-y-6 lg:pt-4">
        <div className="mono-ui inline-flex items-center gap-6 border border-[#0A0A0A] bg-[rgba(255,255,255,0.42)] px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/80">
          <span>{content.eyebrow}</span>
          <span className="tracking-[0.02em]">{content.badgeNote}</span>
        </div>

        <div className="max-w-[44rem] space-y-4">
          <h1 className="text-balance text-[clamp(3.6rem,6.8vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#0A0A0A]">
            {content.title}
          </h1>
          <p className="text-[clamp(1.6rem,3.6vw,2.5rem)] font-medium leading-none tracking-[-0.07em] text-[#0A0A0A]">
            {content.subtitle}
          </p>
          <p className="max-w-[36rem] text-[18px] leading-8 text-[#0A0A0A]/55">
            {content.description}
          </p>
        </div>
      </div>

      <section className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.46)] px-4 py-4">
        <div className="mono-ui flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.12em]">
          <span className="text-[#0A0A0A]/60">ACCESS PATH</span>
          <span className="text-[#0A0A0A]/55">control flow</span>
        </div>

        <div className="mt-5 space-y-1">
          {content.flowSteps.map((step, index) => (
            <div key={step.step}>
              <div className="border border-[#0A0A0A] bg-[#F4F3EF]/78 px-4 py-3">
                <div className="mono-ui flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.12em] text-[#0A0A0A]/55">
                  <span>stage {step.step}</span>
                  <span>{step.note}</span>
                </div>
                <div className="mt-2 text-[1.05rem] font-medium tracking-[-0.04em] text-[#0A0A0A]">
                  {step.title}
                </div>
              </div>

              {index < content.flowSteps.length - 1 ? (
                <div className="mono-ui flex items-center gap-2 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/48">
                  <span className="text-[#C7F000]">v</span>
                  <span>handoff</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-px bg-[#0A0A0A] sm:grid-cols-3">
          {content.signals.map((signal) => (
            <div
              key={signal.label}
              className="bg-[rgba(255,255,255,0.46)] px-4 py-4"
            >
              <div className="mono-ui text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
                {signal.label}
              </div>
              <div className="mt-3 text-[15px] leading-6 text-[#0A0A0A]/72">
                {signal.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mono-ui flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#0A0A0A] pt-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#C7F000]" />
          Access path monitored
        </span>
        <span>{content.footerNote}</span>
      </div>
    </div>
  );
}
