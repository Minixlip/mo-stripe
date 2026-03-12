import Link from 'next/link';
import { LogoutButton } from '@/components/account/LogoutButton';
import { getCurrentSession } from '@/lib/auth/session';
import { navigationItems } from '../data';
import { ArrowRightIcon, ButtonLink } from '../ui';

export async function NavigationHeader() {
  const session = await getCurrentSession();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-4 py-4 backdrop-blur-[2px]">
      <Link
        href="/"
        className="flex items-center gap-3"
      >
        <div className="mono-ui grid h-11 w-11 place-items-center border border-[#0A0A0A] bg-[#F4F3EF] text-[11px] font-semibold uppercase">
          m-s
        </div>
        <span className="mono-ui text-[12px] font-semibold tracking-[-0.03em] text-[#0A0A0A]">
          mo-stripe
        </span>
      </Link>

      <nav className="mono-ui hidden items-center gap-8 text-[12px] text-[#0A0A0A]/80 lg:flex">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="transition-colors duration-150 hover:text-[#0A0A0A]"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        {session ? (
          <>
            <div className="mono-ui flex max-w-[18rem] items-center gap-3 border border-[#0A0A0A] bg-[rgba(255,255,255,0.7)] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]">
              <span className="text-[#0A0A0A]/55">operator</span>
              <span className="truncate text-[12px] normal-case tracking-normal">
                {session.email}
              </span>
            </div>
            <ButtonLink
              href="/account"
              icon={<ArrowRightIcon className="h-3.5 w-3.5" />}
            >
              Access Ledger
            </ButtonLink>
            <LogoutButton compact />
          </>
        ) : (
          <>
            <ButtonLink
              href="/login"
              variant="secondary"
            >
              Sign in
            </ButtonLink>
            <ButtonLink
              href="/account"
              icon={<ArrowRightIcon className="h-3.5 w-3.5" />}
            >
              Access Ledger
            </ButtonLink>
          </>
        )}
      </div>
    </header>
  );
}
