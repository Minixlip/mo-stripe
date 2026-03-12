import { SiteFooter } from '@/components/landing';
import { ButtonLink, SystemArchitecturePanel } from '@/components/landing/ui';
import { ArrowRightIcon, ArrowUpRightIcon } from '@/components/landing/ui';
import {
  currentCapabilities,
  dataModelCards,
  docsSignals,
  endpointGroups,
  GITHUB_REPO_URL,
  invariants,
  quickStartSteps,
  authFlow,
} from '@/components/docs/data';

export default function DocsPage() {
  return (
    <div className="page-surface min-h-screen">
      <div className="mx-auto flex w-full max-w-[1960px] flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <main className="py-5 lg:py-6 xl:py-8">
          <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.54)] backdrop-blur-[2px]">
            <div className="grid gap-px bg-[#0A0A0A] xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
              <div className="bg-[rgba(255,255,255,0.58)] px-5 py-6 lg:px-6 lg:py-7">
                <div className="mono-ui inline-flex items-center gap-4 border border-[#0A0A0A] bg-[#F4F3EF] px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]">
                  <span>Project Documentation</span>
                  <span className="text-[#0A0A0A]/58">mo-stripe</span>
                </div>

                <div className="mt-6 max-w-[54rem] space-y-4">
                  <h1 className="text-balance text-[clamp(3.4rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#0A0A0A]">
                    Technical reference.
                  </h1>
                  <p className="max-w-[44rem] text-[clamp(1.15rem,2.3vw,1.7rem)] leading-[1.5] tracking-[-0.04em] text-[#0A0A0A]/62">
                    This page documents how the project works today: the
                    runtime stack, the request flow, the data model, the current
                    API surface, and the financial rules the backend enforces.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <ButtonLink
                    href="/explore-more"
                    icon={<ArrowRightIcon className="h-3.5 w-3.5" />}
                  >
                    Explore reasoning
                  </ButtonLink>
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mono-ui inline-flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[rgba(255,255,255,0.7)] px-4 py-3 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] transition-colors duration-150 hover:bg-[#FFFFFF]"
                  >
                    <span>GitHub repo</span>
                    <span className="grid h-5 w-5 place-items-center border border-current">
                      <ArrowUpRightIcon className="h-3.5 w-3.5" />
                    </span>
                  </a>
                </div>
              </div>

              <div className="grid gap-px bg-[#0A0A0A] sm:grid-cols-2">
                {docsSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="bg-[rgba(255,255,255,0.58)] px-5 py-5"
                  >
                    <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                      {signal.label}
                    </div>
                    <div className="mt-4 max-w-[26rem] text-[15px] leading-7 text-[#0A0A0A]/74">
                      {signal.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="setup"
            className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)]"
          >
            <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]">
              <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <span>Quick Start</span>
                <span className="text-[#0A0A0A]/58">local development</span>
              </div>

              <div className="space-y-4 p-5">
                {quickStartSteps.map((step, index) => (
                  <article
                    key={step.label}
                    className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-4 py-4"
                  >
                    <div className="mono-ui flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
                      <span>{step.label}</span>
                      <span>{`0${index + 1}`}</span>
                    </div>
                    <div className="mono-ui mt-4 border border-[#0A0A0A] bg-[#F4F3EF]/78 px-3 py-3 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                      {step.command}
                    </div>
                    <p className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/72">
                      {step.detail}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <SystemArchitecturePanel />
          </section>

          <section
            id="auth"
            className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]"
          >
            <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]">
              <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <span>Authentication Flow</span>
                <span className="text-[#0A0A0A]/58">identity boundary</span>
              </div>

              <div className="space-y-1 p-5">
                {authFlow.map((item, index) => (
                  <div key={item.step}>
                    <div className="border border-[#0A0A0A] bg-[#F4F3EF]/78 px-4 py-4">
                      <div className="mono-ui flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/55">
                        <span>{`step ${item.step}`}</span>
                        <span>{item.title}</span>
                      </div>
                      <p className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/72">
                        {item.detail}
                      </p>
                    </div>
                    {index < authFlow.length - 1 ? (
                      <div className="mono-ui flex items-center gap-2 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/48">
                        <span className="text-[#C7F000]">v</span>
                        <span>handoff</span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section
              id="data-model"
              className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]"
            >
              <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <span>Data Model</span>
                <span className="text-[#0A0A0A]/58">core entities</span>
              </div>

              <div className="grid gap-4 p-5">
                {dataModelCards.map((card) => (
                  <article
                    key={card.title}
                    className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-4 py-4"
                  >
                    <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                      {card.title}
                    </div>
                    <div className="mt-4 space-y-3">
                      {card.points.map((point) => (
                        <p
                          key={`${card.title}-${point}`}
                          className="text-[15px] leading-7 text-[#0A0A0A]/72"
                        >
                          {point}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <section
            id="api"
            className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
          >
            <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]">
              <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <span>System Invariants</span>
                <span className="text-[#0A0A0A]/58">current guarantees</span>
              </div>

              <div className="grid gap-px bg-[#0A0A0A]">
                {invariants.map((item) => (
                  <div
                    key={item}
                    className="bg-[rgba(255,255,255,0.58)] px-5 py-4"
                  >
                    <p className="text-[15px] leading-7 text-[#0A0A0A]/74">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]">
              <div className="mono-ui flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                <span>Endpoint Reference</span>
                <span className="text-[#0A0A0A]/58">REST surface</span>
              </div>

              <div className="space-y-4 p-5">
                {endpointGroups.map((group) => (
                  <article
                    key={group.title}
                    className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)]"
                  >
                    <div className="mono-ui border-b border-[#0A0A0A] px-4 py-4 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                      {group.title}
                    </div>
                    <div className="grid gap-px bg-[#0A0A0A] md:grid-cols-[minmax(240px,0.66fr)_minmax(0,1.34fr)]">
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
            id="repo"
            className="mt-6 overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.5)] backdrop-blur-[2px]"
          >
            <div className="grid gap-px bg-[#0A0A0A] xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)]">
              <div className="bg-[rgba(255,255,255,0.58)] px-5 py-5">
                <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                  Repository
                </div>
                <h2 className="mt-4 max-w-[22rem] text-[clamp(2rem,3vw,3.2rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-[#0A0A0A]">
                  Source code and change history.
                </h2>
                <p className="mt-4 max-w-[28rem] text-[16px] leading-7 text-[#0A0A0A]/58">
                  The GitHub repository is part of the portfolio story because
                  it shows the actual implementation, commit history, and the
                  progression from auth setup into financial operations.
                </p>
              </div>

              <div className="grid gap-px bg-[#0A0A0A] sm:grid-cols-2 xl:grid-cols-4">
                {currentCapabilities.map((item) => (
                  <article
                    key={item.label}
                    className="bg-[rgba(255,255,255,0.58)] px-5 py-5"
                  >
                    <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                      {item.label}
                    </div>
                    <p className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/72">
                      {item.detail}
                    </p>
                  </article>
                ))}
                <article className="bg-[rgba(255,255,255,0.58)] px-5 py-5">
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                    GitHub
                  </div>
                  <div className="mt-4 space-y-4">
                    <p className="text-[15px] leading-7 text-[#0A0A0A]/72">
                      Browse the project here:
                    </p>
                    <a
                      href={GITHUB_REPO_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="mono-ui inline-flex items-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-4 py-3 text-[12px] uppercase tracking-[0.12em] text-[#0A0A0A]"
                    >
                      <span>Open repo</span>
                      <span className="grid h-5 w-5 place-items-center border border-current">
                        <ArrowUpRightIcon className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
