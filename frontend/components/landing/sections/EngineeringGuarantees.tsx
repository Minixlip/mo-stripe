import { architectureSignals, employerHighlights } from '../data';
import { EmployerHighlightCard } from '../ui';

export function EngineeringGuarantees() {
  return (
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
          <EmployerHighlightCard
            key={highlight.title}
            {...highlight}
          />
        ))}
      </div>
    </section>
  );
}
