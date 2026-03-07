import type { EmployerHighlight } from './types';

export function EmployerHighlightCard({
  index,
  eyebrow,
  title,
  description,
  system,
  mode,
  invariant,
  proofLabel,
  proofValue,
  footer,
  rows,
}: EmployerHighlight) {
  return (
    <article className="group relative flex h-full flex-col justify-between bg-[rgba(255,255,255,0.52)] px-4 py-5 transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-[rgba(255,255,255,0.68)]">
      <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-[0.22] bg-[#C7F000] transition-transform duration-200 group-hover:scale-x-100" />

      <div className="space-y-5">
        <div className="mono-ui flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em]">
          <span className="text-[#0A0A0A]/60">{eyebrow}</span>
          <span className="border border-[#0A0A0A] bg-[#FFFFFF]/70 px-2 py-1 text-[#0A0A0A]">
            {index}
          </span>
        </div>

        <div className="mono-ui flex items-center justify-between gap-4 border-y border-[#0A0A0A] py-3 text-[11px] uppercase tracking-[0.12em]">
          <span className="flex items-center gap-2 text-[#0A0A0A]/80">
            <span className="h-2 w-2 rounded-full border border-[#0A0A0A] bg-[#C7F000]" />
            {system}
          </span>
          <span className="text-[#0A0A0A]/55">{mode}</span>
        </div>

        <div>
          <h3 className="text-[1.7rem] font-semibold leading-[0.94] tracking-[-0.06em] text-[#0A0A0A]">
            {title}
          </h3>
          <p className="mt-3 max-w-[18rem] text-[14px] leading-6 text-[#0A0A0A]/60">
            {description}
          </p>
        </div>

        <div className="border border-[#0A0A0A] bg-[#F4F3EF]/78">
          <div className="mono-ui flex items-center justify-between gap-4 border-b border-[#0A0A0A] px-3 py-3 text-[11px] uppercase tracking-[0.12em]">
            <span className="text-[#0A0A0A]/60">{proofLabel}</span>
            <span className="text-[#0A0A0A]">{proofValue}</span>
          </div>

          <div className="space-y-px bg-[#0A0A0A]">
            {rows.map((row) => (
              <div
                key={`${title}-${row.label}`}
                className="flex items-center gap-3 bg-[#FFFFFF]/45 px-3 py-2"
              >
                <span className="mono-ui text-[10px] uppercase tracking-[0.12em] text-[#0A0A0A]/40">
                  {index}
                </span>
                <div className="flex flex-1 items-center justify-between gap-4">
                  <span className="mono-ui text-[11px] uppercase tracking-[0.1em] text-[#0A0A0A]/60">
                    {row.label}
                  </span>
                  <span
                    className={[
                      'mono-ui text-[11px] uppercase tracking-[0.1em]',
                      row.tone === 'accent'
                        ? 'text-[#167c5a]'
                        : row.tone === 'muted'
                          ? 'text-[#0A0A0A]/45'
                          : 'text-[#0A0A0A]',
                    ].join(' ')}
                  >
                    {row.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mono-ui flex items-center justify-between gap-4 border-t border-[#0A0A0A] pt-3 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
          <span>{footer}</span>
          <span className="text-[#0A0A0A]">{invariant}</span>
        </div>
      </div>
    </article>
  );
}
