import type { ButtonLinkProps } from '../types';

export function ButtonLink({
  children,
  href,
  icon,
  variant = 'primary',
}: ButtonLinkProps) {
  const baseClasses =
    'mono-ui inline-flex items-center justify-center gap-3 border px-4 py-3 text-[13px] uppercase tracking-[0.12em] transition-colors duration-150';
  const variantClasses =
    variant === 'primary'
      ? 'key-press border-[#0A0A0A] bg-[#C7F000] text-[#0A0A0A]'
      : 'border-[#0A0A0A] bg-[rgba(255,255,255,0.7)] text-[#0A0A0A] hover:bg-[#FFFFFF]';

  return (
    <a
      href={href}
      className={`${baseClasses} ${variantClasses}`}
    >
      <span>{children}</span>
      {icon ? (
        <span className="grid h-5 w-5 place-items-center border border-current bg-transparent">
          {icon}
        </span>
      ) : null}
    </a>
  );
}
