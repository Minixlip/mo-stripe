import { techStack } from '../data';
import {
  ArrowUpRightIcon,
  ButtonLink,
  SquareIcon,
  SystemArchitecturePanel,
} from '../ui';

export function HeroColumn() {
  return (
    <div className="flex min-h-full min-w-0 flex-col gap-6 lg:gap-8">
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
            instrument. Crisp borders. Tabular numerals. A live feed that reads
            like a receipt roll.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <ButtonLink
            href="/explore-more"
            icon={<ArrowUpRightIcon className="h-3.5 w-3.5" />}
          >
            Explore More
          </ButtonLink>
          <ButtonLink
            href="/explore-more#api-surface"
            icon={<SquareIcon className="h-3.5 w-3.5" />}
            variant="secondary"
          >
            Read Docs
          </ButtonLink>
        </div>

        <div className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.42)] px-4 py-4">
          <div className="mono-ui flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.12em]">
            <span className="text-[#0A0A0A]/60">BUILT WITH</span>
            <span className="text-[#0A0A0A]/55">core stack</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="mono-ui border border-[#0A0A0A] bg-[#FFFFFF]/45 px-3 py-2 text-[11px] tracking-[0.04em] text-[#0A0A0A] transition-colors duration-150 hover:bg-[#FFFFFF]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <SystemArchitecturePanel />

      <div className="mono-ui flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#0A0A0A] pt-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#C7F000]" />
          Live feed
        </span>
        <span>Decimal alignment guaranteed</span>
        <span>Settlement visibility at T+0</span>
      </div>
    </div>
  );
}
