export function SiteFooter() {
  return (
    <footer className="mono-ui mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#0A0A0A] pb-4 pt-4 text-[11px] uppercase tracking-[0.1em] text-[#0A0A0A]/60">
      <p>Copyright 2026 mo-stripe. Built with 1px discipline.</p>
      <div className="flex flex-wrap items-center gap-5">
        <span
          aria-disabled="true"
          className="cursor-default text-[#0A0A0A]/42"
        >
          Privacy
        </span>
        <span
          aria-disabled="true"
          className="cursor-default text-[#0A0A0A]/42"
        >
          Terms
        </span>
        <span
          aria-disabled="true"
          className="cursor-default text-[#0A0A0A]/42"
        >
          Status
        </span>
      </div>
    </footer>
  );
}
