import type { AuthUtilityCard as AuthUtilityCardType } from '../types';

type AuthUtilityCardProps = {
  card: AuthUtilityCardType;
};

export function AuthUtilityCard({ card }: AuthUtilityCardProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.52)] px-4 py-4">
      <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
        {card.label}
      </div>
      <div className="mono-ui mt-3 text-[0.98rem] uppercase tracking-[0.08em] text-[#0A0A0A]">
        {card.value}
      </div>
      <p className="mt-3 text-[13px] leading-5 text-[#0A0A0A]/58">
        {card.meta}
      </p>
    </div>
  );
}
