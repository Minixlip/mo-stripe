import {
  EngineeringGuarantees,
  HeroColumn,
  LedgerShowcase,
  NavigationHeader,
  SiteFooter,
} from '@/components/landing';

export default function Home() {
  return (
    <div className="page-surface min-h-screen">
      <div className="mx-auto flex w-full max-w-[1960px] flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <main className="py-5 lg:py-6 xl:py-8">
          <section className="grid items-start gap-8 xl:gap-10 2xl:gap-14 xl:grid-cols-[minmax(560px,0.84fr)_minmax(940px,1.16fr)] 2xl:grid-cols-[minmax(620px,0.86fr)_minmax(1080px,1.14fr)]">
            <HeroColumn />
            <LedgerShowcase />
          </section>

          <EngineeringGuarantees />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
