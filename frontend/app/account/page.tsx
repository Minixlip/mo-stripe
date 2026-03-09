import { LogoutButton } from '@/components/account/LogoutButton';
import { requireAuthenticatedSession } from '@/lib/auth/session';

export default async function Account() {
  await requireAuthenticatedSession();

  return (
    <div className="page-surface min-h-screen">
      <div className="mx-auto flex w-full max-w-[1860px] flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <main className="py-5 lg:py-6 xl:py-8">
          <section className="grid gap-6 xl:grid-cols-[minmax(420px,0.7fr)_minmax(720px,1.3fr)]">
            <div className="space-y-6">
              <div className="mono-ui inline-flex items-center gap-6 border border-[#0A0A0A] bg-[rgba(255,255,255,0.42)] px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/80">
                <span>OPERATOR SESSION</span>
                <span className="tracking-[0.02em]">verified</span>
              </div>

              <div className="max-w-[40rem] space-y-4">
                <h1 className="text-balance text-[clamp(3.4rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#0A0A0A]">
                  Account access granted.
                </h1>
                <p className="text-[clamp(1.4rem,3vw,2.25rem)] font-medium leading-none tracking-[-0.07em] text-[#0A0A0A]">
                  Session established, route unlocked.
                </p>
                <p className="max-w-[34rem] text-[18px] leading-8 text-[#0A0A0A]/55">
                  This page is only reachable when the session cookie exists. The
                  frontend is no longer verifying the JWT itself; the future
                  backend session-check endpoint will become the source of truth
                  for protected account data.
                </p>
              </div>

              <LogoutButton />
            </div>

            <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.5)] backdrop-blur-[2px]">
              <div className="mono-ui flex flex-wrap items-center justify-between gap-3 border-b border-[#0A0A0A] px-4 py-4 text-[12px] uppercase tracking-[0.08em]">
                <div className="flex items-center gap-3 text-[#0A0A0A]">
                  <span className="h-2.5 w-2.5 rounded-full border border-[#0A0A0A] bg-[#C7F000]" />
                  <span>Session ledger</span>
                  <span className="text-[#0A0A0A]/55">account-gate</span>
                </div>
                <div className="flex items-center gap-6 text-[#0A0A0A]/80">
                  <span>jwt</span>
                  <span>active</span>
                </div>
              </div>

              <div className="grid gap-px bg-[#0A0A0A] md:grid-cols-2">
                <div className="bg-[rgba(255,255,255,0.52)] px-4 py-5">
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                    Session cookie
                  </div>
                  <div className="mono-ui mt-4 break-all text-[1.15rem] uppercase tracking-[0.04em] text-[#0A0A0A]">
                    present
                  </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.52)] px-4 py-5">
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                    Token origin
                  </div>
                  <div className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/68">
                    Issued and persisted by the Express authentication layer as
                    an `httpOnly` cookie.
                  </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.52)] px-4 py-5">
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                    Ownership
                  </div>
                  <div className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/68">
                    Next only checks whether the backend cookie is present so it
                    can gate the route. Token verification and account identity
                    stay with the backend.
                  </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.52)] px-4 py-5">
                  <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
                    Route rule
                  </div>
                  <div className="mt-4 text-[15px] leading-7 text-[#0A0A0A]/68">
                    Missing session cookies are redirected to `/login` before the
                    account surface renders. Invalid-token handling will move to
                    your backend session-check endpoint.
                  </div>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
