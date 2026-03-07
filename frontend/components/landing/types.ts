import type { ReactNode } from 'react';

export type IconProps = {
  className?: string;
};

export type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
};

export type UtilityIconName = 'download' | 'activity' | 'branch';

export type UtilityCardData = {
  icon: UtilityIconName;
  label: string;
  value: string;
};

export type ArchitectureLayer = {
  step: string;
  name: string;
  note: string;
};

export type ArchitectureNote = {
  label: string;
  value: string;
};

export type ProcessingCheck = {
  label: string;
  detail: string;
  status: string;
};

export type Transaction = {
  amount: string;
  label: string;
  positive: boolean;
  muted?: boolean;
};

export type Account = {
  name: string;
  masked: string;
  balance: string;
};

export type HighlightRow = {
  label: string;
  value: string;
  tone?: 'default' | 'accent' | 'muted';
};

export type EmployerHighlight = {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  system: string;
  mode: string;
  invariant: string;
  proofLabel: string;
  proofValue: string;
  footer: string;
  rows: HighlightRow[];
};
