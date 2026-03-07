import { processingChecks } from './data';

export function ProcessingChecksPanel() {
  return (
    <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.5)] backdrop-blur-[2px]">
      <div className="mono-ui flex items-center justify-between gap-4 border-b border-[#0A0A0A] px-4 py-3 text-[11px] uppercase tracking-[0.12em]">
        <span className="text-[#0A0A0A]/60">PRE-COMMIT CHECKS</span>
        <span className="flex items-center gap-2 text-[#0A0A0A]/80">
          <span className="h-2 w-2 rounded-full border border-[#0A0A0A] bg-[#C7F000]" />
          live path
        </span>
      </div>

      <div className="border-b border-[#0A0A0A] px-4 py-4">
        <p className="max-w-[42rem] text-[14px] leading-6 text-[#0A0A0A]/60">
          Every transfer walks the same control path before it reaches the
          ledger engine, so validation, replay protection, and posting rules are
          enforced consistently.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-[#0A0A0A] xl:grid-cols-4">
        {processingChecks.map((check) => (
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
    </section>
  );
}
