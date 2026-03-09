import { AccountDashboard } from '@/components/account/AccountDashboard';
import { getAccountOverview } from '@/lib/account/account';
import { requireAuthenticatedSession } from '@/lib/auth/session';

export default async function Account() {
  const session = await requireAuthenticatedSession();
  const overview = await getAccountOverview();

  if (!overview) {
    return (
      <div className="page-surface min-h-screen">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
          <main className="py-12">
            <section className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.58)] p-6 backdrop-blur-[2px] lg:p-8">
              <div className="mono-ui inline-flex items-center gap-3 border border-[#0A0A0A] bg-[#F4F3EF] px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]">
                <span>bootstrap pending</span>
              </div>

              <div className="mt-6 max-w-[46rem] space-y-4">
                <h1 className="text-[clamp(3rem,6vw,5.3rem)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#0A0A0A]">
                  Account data unavailable.
                </h1>
                <p className="text-[18px] leading-8 text-[#0A0A0A]/62">
                  The session is valid for{' '}
                  <span className="font-medium text-[#0A0A0A]">{session.email}</span>,
                  but the backend account summary could not be loaded. This
                  usually means the latest database migration has not been
                  applied yet.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return <AccountDashboard overview={overview} />;
}
