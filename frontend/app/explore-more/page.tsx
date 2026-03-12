import { SiteFooter } from '@/components/landing';
import { ButtonLink, EmployerHighlightCard, SystemArchitecturePanel } from '@/components/landing/ui';
import { ArrowRightIcon, ArrowUpRightIcon } from '@/components/landing/ui';
import {
  apiGroups,
  engineeringHighlights,
  exploreSignals,
  moneyFlowCards,
  requestFlow,
  roadmapItems,
  scopeNotes,
  securityPractices,
} from '@/components/explore/data';

export default function ExploreMorePage() {
  return (
    <div className="page-surface min-h-screen">
      <div className="mx-auto flex w-full max-w-[1960px] flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <main className="py-5 lg:py-6 xl:py-8">
          <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.54)] backdrop-blur-[2px]">
            <div className="grid gap-px bg-[#0A0A0A] xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="bg-[rgba(255,255,255,0.58)] px-5 py-6 lg:px-6 lg:py-7">
                <div className="mono-ui inline-flex items-center gap-4 border border-[#0A0A0A] bg-[#F4F3EF] px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]">
                  <span>Engineering Deep Dive</span>
                  <span className="text-[#0A0A0A]/58">mo-stripe</span>
                </div>

                <div className="mt-6 max-w-[54rem] space-y-4">
                  <h1 className="text-balance text-[clamp(3.4rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#0A0A0A]">
                    Behind the ledger.
                  </h1>
                  <p className="max-w-[44rem] text-[clamp(1.15rem,2.3vw,1.7rem)] leading-[1.5] tracking-[-0.04em] text-[#0A0A0A]/62">
                    This page is the technical story behind the UI: how
                    authentication works, how money movement is constrained, why
                    balances are stored the way they are, and what still needs
                    to mature before the system looks more like a real fintech
                    backend.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <ButtonLink
                    href="/account"
                    icon={<ArrowRightIcon className="h-3.5 w-3.5" />}
                  >
                    Access Ledger
                  </ButtonLink>
                  <ButtonLink
                    href="/"
                    icon={<ArrowUpRightIcon className="h-3.5 w-3.5" />}
                    variant="secondary"
                  >
                    Back Home
                  </ButtonLink>
                </div>
              </div>

              <div className="grid gap-px bg-[#0A0A0A] sm:grid-cols-2">
                {exploreSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="bg-[rgba(255,255,255,0.58)] px-5 py-5"
                  >
                    <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                      {signal.label}
                    </div>
                    <div className="mt-4 max-w-[24rem] text-[15px] leading-7 text-[#0A0A0A]/74">
                      {signal.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="architecture"
            className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
          >
            <SystemArchitecturePanel />

            <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]">
              <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <span>Scope and Tradeoffs</span>
                <span className="text-[#0A0A0A]/58">v1 choices</span>
              </div>

              <div className="space-y-4 p-5">
                {scopeNotes.map((note, index) => (
                  <article
                    key={note.label}
                    className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-4 py-4"
                  >
                    <div className="mono-ui flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
                      <span>{note.label}</span>
                      <span>{`0${index + 1}`}</span>
                    </div>
                    <p className="mt-4 max-w-[42rem] text-[15px] leading-7 text-[#0A0A0A]/72">
                      {note.detail}
                    </p>
                  </article>
                ))}

                <div className="border border-[#0A0A0A] bg-[#F4F3EF]/76 px-4 py-4">
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
                    Why this matters
                  </div>
                  <p className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/72">
                    A good backend project is not only about adding more
                    features. It is about choosing a scope that makes the
                    important concepts visible: identity boundaries, data
                    ownership, atomic writes, and auditability.
                  </p>
                </div>
              </div>
            </section>
          </section>

          <section className="mt-6 overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.5)] backdrop-blur-[2px]">
            <div className="border-b border-[#0A0A0A] px-5 py-5">
              <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                What this project demonstrates
              </div>
              <h2 className="mt-4 max-w-[34rem] text-[clamp(2rem,3.2vw,3.5rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-[#0A0A0A]">
                Backend reasoning, not just UI output.
              </h2>
              <p className="mt-4 max-w-[44rem] text-[16px] leading-7 text-[#0A0A0A]/58">
                These panels focus on the decisions that matter in a banking or
                payment-style system: where identity is trusted, how money is
                represented, and how a write path becomes safe to expose.
              </p>
            </div>

            <div className="grid gap-px bg-[#0A0A0A] md:grid-cols-2 xl:grid-cols-4">
              {engineeringHighlights.map((highlight) => (
                <EmployerHighlightCard
                  key={highlight.title}
                  {...highlight}
                />
              ))}
            </div>
          </section>

          <section
            id="money-flow"
            className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]"
          >
            <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]">
              <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <span>Request Lifecycle</span>
                <span className="text-[#0A0A0A]/58">operator to database</span>
              </div>

              <div className="space-y-1 p-5">
                {requestFlow.map((item, index) => (
                  <div key={item.step}>
                    <div className="border border-[#0A0A0A] bg-[#F4F3EF]/78 px-4 py-4">
                      <div className="mono-ui flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/55">
                        <span>{`stage ${item.step}`}</span>
                        <span>{item.title}</span>
                      </div>
                      <p className="mt-4 max-w-[44rem] text-[15px] leading-7 text-[#0A0A0A]/72">
                        {item.detail}
                      </p>
                    </div>
                    {index < requestFlow.length - 1 ? (
                      <div className="mono-ui flex items-center gap-2 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/48">
                        <span className="text-[#C7F000]">v</span>
                        <span>handoff</span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]">
              <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <span>Money Movement</span>
                <span className="text-[#0A0A0A]/58">current write path</span>
              </div>

              <div className="grid gap-4 p-5">
                {moneyFlowCards.map((card) => (
                  <article
                    key={card.id}
                    className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-4 py-4"
                  >
                    <div className="mono-ui flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/58">
                      <span>{card.title}</span>
                      <span className="text-[#0A0A0A]">live route</span>
                    </div>
                    <p className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/72">
                      {card.detail}
                    </p>

                    <div className="mt-4 grid gap-px bg-[#0A0A0A] sm:grid-cols-3">
                      {card.notes.map((note) => (
                        <div
                          key={`${card.id}-${note}`}
                          className="mono-ui bg-[#F4F3EF]/76 px-3 py-3 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/68"
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <section
            id="security"
            className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]"
          >
            <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]">
              <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <span>Security and Correctness</span>
                <span className="text-[#0A0A0A]/58">boundary controls</span>
              </div>

              <div className="grid gap-px bg-[#0A0A0A] md:grid-cols-2">
                {securityPractices.map((practice) => (
                  <article
                    key={practice.label}
                    className="bg-[rgba(255,255,255,0.58)] px-5 py-5"
                  >
                    <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                      {practice.label}
                    </div>
                    <p className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/72">
                      {practice.detail}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="api-surface"
              className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]"
            >
              <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <span>API Surface</span>
                <span className="text-[#0A0A0A]/58">current endpoints</span>
              </div>

              <div className="space-y-4 p-5">
                {apiGroups.map((group) => (
                  <article
                    key={group.label}
                    className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)]"
                  >
                    <div className="mono-ui border-b border-[#0A0A0A] px-4 py-4 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                      {group.label}
                    </div>
                    <div className="grid gap-px bg-[#0A0A0A] md:grid-cols-[minmax(220px,0.62fr)_minmax(0,1.38fr)]">
                      <div className="space-y-px bg-[#0A0A0A]">
                        {group.routes.map((route) => (
                          <div
                            key={route}
                            className="mono-ui bg-[#F4F3EF]/76 px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]"
                          >
                            {route}
                          </div>
                        ))}
                      </div>
                      <div className="bg-[rgba(255,255,255,0.56)] px-4 py-4">
                        <p className="text-[15px] leading-7 text-[#0A0A0A]/72">
                          {group.detail}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <section
            id="roadmap"
            className="mt-6 overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.5)] backdrop-blur-[2px]"
          >
            <div className="grid gap-px border-b border-[#0A0A0A] bg-[#0A0A0A] xl:grid-cols-[minmax(320px,0.72fr)_minmax(0,1.28fr)]">
              <div className="bg-[rgba(255,255,255,0.58)] px-5 py-5">
                <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                  Next Engineering Steps
                </div>
                <h2 className="mt-4 max-w-[20rem] text-[clamp(2rem,3vw,3.3rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-[#0A0A0A]">
                  What turns this into a stronger fintech backend.
                </h2>
                <p className="mt-4 max-w-[28rem] text-[16px] leading-7 text-[#0A0A0A]/58">
                  The current app already demonstrates good backend instincts.
                  The next phase is about production-grade safeguards and deeper
                  financial modeling.
                </p>
              </div>

              <div className="grid gap-px bg-[#0A0A0A] sm:grid-cols-2 xl:grid-cols-4">
                {roadmapItems.map((item) => (
                  <article
                    key={item.title}
                    className="bg-[rgba(255,255,255,0.58)] px-5 py-5"
                  >
                    <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                      {item.title}
                    </div>
                    <p className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/72">
                      {item.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
