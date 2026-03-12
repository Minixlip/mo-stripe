import {
  EngineeringGuarantees,
  HeroColumn,
  LedgerShowcase,
  SiteFooter,
} from '@/components/landing';

export default function Home() {
  return (
    <div className="page-surface min-h-screen">
      <div className="mx-auto flex w-full max-w-[1960px] flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <main className="py-5 lg:py-6 xl:py-8">
          <section className="grid items-start gap-8 xl:gap-10 2xl:gap-14 xl:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)]">
            <div className="min-w-0">
              <HeroColumn />
            </div>
            <div className="min-w-0">
              <LedgerShowcase />
            </div>
          </section>

          <EngineeringGuarantees />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
