export type AuthMode = 'login' | 'register';

export type AuthField = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  helper?: string;
};

export type AuthFlowStep = {
  step: string;
  title: string;
  note: string;
};

export type AuthCheck = {
  label: string;
  detail: string;
  status: string;
};

export type AuthTraceEvent = {
  amount: string;
  label: string;
  tone?: 'accent' | 'muted' | 'default';
};

export type AuthUtilityCard = {
  label: string;
  value: string;
  meta: string;
};

export type AuthSignal = {
  label: string;
  value: string;
};

export type AuthContent = {
  eyebrow: string;
  badgeNote: string;
  title: string;
  subtitle: string;
  description: string;
  panelLabel: string;
  panelMode: string;
  formHint: string;
  submitLabel: string;
  switchPrompt: string;
  switchLabel: string;
  switchHref: string;
  auxiliaryLabel: string;
  auxiliaryHref: string;
  consentLabel: string;
  fields: AuthField[];
  flowSteps: AuthFlowStep[];
  checks: AuthCheck[];
  traceEvents: AuthTraceEvent[];
  utilityCards: AuthUtilityCard[];
  signals: AuthSignal[];
  footerNote: string;
};
