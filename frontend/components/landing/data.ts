import type {
  Account,
  ArchitectureLayer,
  ArchitectureNote,
  EmployerHighlight,
  NavigationItem,
  ProcessingCheck,
  Transaction,
  UtilityCardData,
} from './types';

export const navigationItems: NavigationItem[] = [
  { label: 'Overview', href: '/explore-more' },
  { label: 'Architecture', href: '/explore-more#architecture' },
  { label: 'Docs', href: '/docs' },
  { label: 'Money Flow', href: '/explore-more#money-flow' },
  { label: 'Security', href: '/explore-more#security' },
];

export const techStack = [
  'Node.js',
  'Express',
  'TypeScript',
  'Prisma',
  'Zod',
  'bcrypt',
  'jsonwebtoken',
  'PostgreSQL',
  'Supabase',
  'Next.js',
];

export const architectureLayers: ArchitectureLayer[] = [
  { step: '01', name: 'Frontend Dashboard', note: 'operator console' },
  { step: '02', name: 'Express API Layer', note: 'routing + validation' },
  { step: '03', name: 'Service Layer', note: 'business orchestration' },
  { step: '04', name: 'Ledger Engine', note: 'posting + transfer rules' },
  { step: '05', name: 'PostgreSQL / Prisma', note: 'durable persistence' },
];

export const architectureNotes: ArchitectureNote[] = [
  { label: 'EDGE', value: 'Express + Zod' },
  { label: 'DOMAIN', value: 'service orchestration' },
  { label: 'STORAGE', value: 'Prisma to Postgres' },
];

export const processingChecks: ProcessingCheck[] = [
  { label: 'schema validation', detail: 'Zod contract', status: 'pass' },
  { label: 'idempotency key', detail: 'retry safe', status: 'locked' },
  { label: 'posting rules', detail: 'debit = credit', status: 'balanced' },
  { label: 'audit write', detail: 'append only', status: 'logged' },
];

export const transactions: Transaction[] = [
  {
    amount: '+ $ 1,040.00',
    label: 'INVOICE_PAID',
    positive: true,
    muted: true,
  },
  { amount: '- $ 12.50', label: 'COFFEE', positive: false },
  { amount: '+ $ 500.00', label: 'DEPOSIT', positive: true },
  { amount: '- $ 80.00', label: 'SOFTWARE', positive: false },
  { amount: '- $ 15.99', label: 'SUBSCRIPTION', positive: false },
  { amount: '+ $ 2,200.00', label: 'PAYROLL', positive: true },
  { amount: '- $ 105.00', label: 'UTILITIES', positive: false },
  { amount: '- $ 45.20', label: 'AWS_BILLING', positive: false },
  { amount: '- $ 120.50', label: 'WHOLE_FOODS', positive: false },
  { amount: '+ $ 500.00', label: 'PEER_TRANSFER', positive: true, muted: true },
];

export const accounts: Account[] = [
  { name: 'Checking', masked: '*4092', balance: '$ 14,092.50' },
  { name: 'Savings', masked: '*9982', balance: '$ 110,000.00' },
];

export const utilityCards: UtilityCardData[] = [
  {
    label: 'EXPORT',
    value: 'CSV / JSON',
    icon: 'download',
  },
  {
    label: 'WEBHOOKS',
    value: 'real-time',
    icon: 'activity',
  },
  {
    label: 'AUDIT TRAIL',
    value: 'immutable',
    icon: 'branch',
  },
];

export const architectureSignals = [
  { label: 'APPEND-ONLY', value: 'reliable audit trail' },
  { label: 'ALL-OR-NOTHING', value: 'single transaction outcome' },
  { label: 'RETRY-SAFE', value: 'duplicate protection built in' },
  { label: 'FK-GUARDED', value: 'strict relational integrity' },
];

export const employerHighlights: EmployerHighlight[] = [
  {
    index: '01',
    eyebrow: 'AUDIT GUARANTEE',
    title: 'Immutable Ledger',
    description:
      'Every transaction is append-only to guarantee a reliable audit trail.',
    system: 'ledger_writer',
    mode: 'append stream',
    invariant: 'seq monotonic',
    proofLabel: 'write mode',
    proofValue: 'append_only',
    footer: 'history preserved',
    rows: [
      { label: 'ENTRY POLICY', value: 'WRITE ONCE', tone: 'accent' },
      { label: 'REVERSALS', value: 'COMPENSATING ENTRY' },
      { label: 'TRACE', value: 'FULL LINEAGE' },
    ],
  },
  {
    index: '02',
    eyebrow: 'TRANSFER SAFETY',
    title: 'Atomic Transfers',
    description:
      'Database transactions ensure transfers succeed or fail as a single operation.',
    system: 'transfer_service',
    mode: 'db transaction',
    invariant: 'no split outcome',
    proofLabel: 'txn scope',
    proofValue: 'all_or_nothing',
    footer: 'no partial movement',
    rows: [
      { label: 'DEBIT', value: 'LOCKED' },
      { label: 'CREDIT', value: 'LOCKED' },
      { label: 'COMMIT', value: 'SHARED OUTCOME', tone: 'accent' },
    ],
  },
  {
    index: '03',
    eyebrow: 'REPLAY CONTROL',
    title: 'Idempotent Requests',
    description:
      'Safe retry mechanisms prevent duplicate financial operations.',
    system: 'request_gateway',
    mode: 'idempotency key',
    invariant: 'same key, same effect',
    proofLabel: 'request key',
    proofValue: 'retry_safe',
    footer: 'duplicate prevention',
    rows: [
      { label: 'REQUEST ID', value: 'REUSED ON RETRY' },
      { label: 'MATCH POLICY', value: 'SAME INPUT REQUIRED' },
      { label: 'RESPONSE', value: 'SINGLE EFFECT', tone: 'accent' },
    ],
  },
  {
    index: '04',
    eyebrow: 'DATA INTEGRITY',
    title: 'Relational Data Model',
    description:
      'Accounts, users, and transactions modeled with strict relational integrity.',
    system: 'schema_core',
    mode: 'foreign keys',
    invariant: 'orphans blocked',
    proofLabel: 'model',
    proofValue: 'fk_constrained',
    footer: 'schema enforced',
    rows: [
      { label: 'USERS', value: 'OWN ACCOUNTS' },
      { label: 'ACCOUNTS', value: 'OWN TRANSACTIONS' },
      { label: 'DELETES', value: 'RULE-GUARDED', tone: 'accent' },
    ],
  },
];
