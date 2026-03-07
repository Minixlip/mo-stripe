import type { AuthMode } from './types';
import { authContentByMode } from './data';
import { AuthConsolePanel, AuthExperience } from './sections';

type AuthPageProps = {
  mode: AuthMode;
};

export function AuthPage({ mode }: AuthPageProps) {
  const content = authContentByMode[mode];

  return (
    <div className="page-surface min-h-screen">
      <div className="mx-auto flex w-full max-w-[1860px] flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <main className="py-5 lg:py-6 xl:py-8">
          <section className="grid items-start gap-8 xl:gap-10 2xl:gap-14 xl:grid-cols-[minmax(520px,0.76fr)_minmax(780px,1.08fr)] 2xl:grid-cols-[minmax(580px,0.78fr)_minmax(900px,1.06fr)]">
            <AuthExperience content={content} />
            <AuthConsolePanel content={content} />
          </section>
        </main>
      </div>
    </div>
  );
}
