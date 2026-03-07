import { ActivityIcon, BranchIcon, DownloadIcon } from './icons';
import type { UtilityCardData } from './types';

const utilityIcons = {
  activity: ActivityIcon,
  branch: BranchIcon,
  download: DownloadIcon,
};

export function UtilityCard({ icon, label, value }: UtilityCardData) {
  const Icon = utilityIcons[icon];

  return (
    <div className="flex items-start justify-between gap-4 bg-[rgba(255,255,255,0.52)] px-4 py-5">
      <div>
        <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/60">
          {label}
        </div>
        <div className="mono-ui mt-3 text-[1.05rem] uppercase tracking-[0.08em] text-[#0A0A0A]">
          {value}
        </div>
      </div>
      <span className="mt-1 text-[#0A0A0A]">
        <Icon className="h-4 w-4" />
      </span>
    </div>
  );
}
