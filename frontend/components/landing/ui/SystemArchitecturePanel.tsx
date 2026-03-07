import { architectureLayers, architectureNotes } from '../data';

export function SystemArchitecturePanel() {
  return (
    <section className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.46)] px-4 py-4">
      <div className="mono-ui flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.12em]">
        <span className="text-[#0A0A0A]/60">SYSTEM ARCHITECTURE</span>
        <span className="text-[#0A0A0A]/55">request path</span>
      </div>

      <p className="mt-4 max-w-[36rem] text-[15px] leading-7 text-[#0A0A0A]/58">
        Requests enter through the dashboard, pass across the API and service
        layers, are committed by the ledger engine, and persist through Prisma
        into PostgreSQL.
      </p>

      <div className="mt-5 space-y-1">
        {architectureLayers.map((layer, index) => (
          <div key={layer.name}>
            <div className="border border-[#0A0A0A] bg-[#F4F3EF]/78 px-4 py-3">
              <div className="mono-ui flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.12em] text-[#0A0A0A]/55">
                <span>stage {layer.step}</span>
                <span>{layer.note}</span>
              </div>
              <div className="mt-2 text-[1.05rem] font-medium tracking-[-0.04em] text-[#0A0A0A]">
                {layer.name}
              </div>
            </div>

            {index < architectureLayers.length - 1 ? (
              <div className="mono-ui flex items-center gap-2 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/48">
                <span className="text-[#C7F000]">v</span>
                <span>handoff</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-px bg-[#0A0A0A] sm:grid-cols-3">
        {architectureNotes.map((note) => (
          <div
            key={note.label}
            className="bg-[rgba(255,255,255,0.46)] px-4 py-4"
          >
            <div className="mono-ui text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
              {note.label}
            </div>
            <div className="mt-3 text-[15px] leading-6 text-[#0A0A0A]/72">
              {note.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
