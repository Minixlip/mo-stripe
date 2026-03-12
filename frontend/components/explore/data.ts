import type { EmployerHighlight } from '@/components/landing/types';

export const exploreSignals = [
  {
    label: 'Project Goal',
    value: 'learn backend engineering through a fintech-style product',
  },
  {
    label: 'Runtime',
    value: 'Node.js, Express, TypeScript, Next.js',
  },
  {
    label: 'Persistence',
    value: 'Prisma ORM over PostgreSQL on Supabase',
  },
  {
    label: 'Current Scope',
    value: 'single personal account with authenticated money movement',
  },
] as const;

export const engineeringHighlights: EmployerHighlight[] = [
  {
    index: '01',
    eyebrow: 'AUTH BOUNDARY',
    title: 'Cookie-Backed Sessions',
    description:
      'Registration and login mint a JWT into an httpOnly cookie. Protected routes trust the backend middleware, not client-supplied identity.',
    system: 'auth_boundary',
    mode: 'jwt + cookie',
    invariant: 'server-trusted identity',
    proofLabel: 'session model',
    proofValue: 'http_only',
    footer: 'identity resolved on backend',
    rows: [
      { label: 'INPUT', value: 'ZOD VALIDATED' },
      { label: 'PASSWORD', value: 'BCRYPT HASHED' },
      { label: 'COOKIE', value: 'HTTPONLY', tone: 'accent' },
    ],
  },
  {
    index: '02',
    eyebrow: 'MONEY MODEL',
    title: 'Amounts Stored as Pence',
    description:
      'Balances and transaction amounts use integer minor units, which avoids floating point drift and keeps arithmetic deterministic.',
    system: 'money_model',
    mode: 'minor units',
    invariant: 'decimal safe',
    proofLabel: 'storage shape',
    proofValue: 'int_pence',
    footer: 'math remains exact',
    rows: [
      { label: 'BALANCE', value: 'INT' },
      { label: 'AMOUNT', value: 'INT' },
      { label: 'DISPLAY', value: 'FORMAT IN UI', tone: 'accent' },
    ],
  },
  {
    index: '03',
    eyebrow: 'POSTING SAFETY',
    title: 'Atomic Balance Updates',
    description:
      'Withdrawals and transfers run inside database transactions so debits, credits, and transaction writes share one commit outcome.',
    system: 'posting_service',
    mode: 'prisma transaction',
    invariant: 'no split outcome',
    proofLabel: 'commit path',
    proofValue: 'all_or_nothing',
    footer: 'partial movement blocked',
    rows: [
      { label: 'DEBIT', value: 'BALANCE GUARDED' },
      { label: 'LEDGER WRITE', value: 'SAME COMMIT' },
      { label: 'ROLLBACK', value: 'ON FAILURE', tone: 'accent' },
    ],
  },
  {
    index: '04',
    eyebrow: 'READ SURFACE',
    title: 'Audit-Friendly Views',
    description:
      'The account dashboard reads authenticated summary, history, and per-transaction detail endpoints so the UI is backed by persisted ledger data.',
    system: 'account_read_model',
    mode: 'owned queries',
    invariant: 'history aligned',
    proofLabel: 'detail access',
    proofValue: 'ownership_checked',
    footer: 'balance and history stay coherent',
    rows: [
      { label: 'SUMMARY', value: 'GET /account' },
      { label: 'HISTORY', value: 'GET /transactions' },
      { label: 'DETAIL', value: 'OWNED ROW ONLY', tone: 'accent' },
    ],
  },
];

export const scopeNotes = [
  {
    label: 'Current Product Shape',
    detail:
      'Each user gets one personal account. Registration also provisions a 5,000 GBP demo balance and records the opening transaction.',
  },
  {
    label: 'Why It Is Deliberate',
    detail:
      'This keeps the domain small enough to focus on auth, transaction correctness, and relational integrity before adding more entities.',
  },
  {
    label: 'Tradeoff',
    detail:
      'It is not a full banking core yet. The app now writes append-only ledger postings, but business ownership models, reversals, and balance derivation purely from postings are still future steps.',
  },
] as const;

export const requestFlow = [
  {
    step: '01',
    title: 'Register or log in',
    detail:
      'The backend validates credentials, hashes or compares the password, and issues a JWT inside an httpOnly cookie.',
  },
  {
    step: '02',
    title: 'Protected request enters Express',
    detail:
      'Cookie middleware and auth middleware verify the token, resolve the user, and attach trusted identity to the request.',
  },
  {
    step: '03',
    title: 'Service layer enforces invariants',
    detail:
      'Business logic checks account ownership, prevents overdrafts, and blocks self-transfer edge cases.',
  },
  {
    step: '04',
    title: 'Database transaction commits',
    detail:
      'Balance updates and transaction rows are written together, which prevents partial financial state.',
  },
  {
    step: '05',
    title: 'Read model reflects persisted state',
    detail:
      'The account page reads summary, history, and transaction detail from the API rather than inventing state client-side.',
  },
] as const;

export const moneyFlowCards = [
  {
    id: 'deposit',
    title: 'Deposit',
    detail:
      'Deposit requests convert GBP strings to pence, increment the account balance, and create a matching DEPOSIT transaction row.',
    notes: ['positive amount required', 'single-account credit', 'history write included'],
  },
  {
    id: 'withdraw',
    title: 'Withdraw',
    detail:
      'Withdrawals use a guarded update so the balance only decrements when sufficient funds are available at commit time.',
    notes: ['no overdraft', 'same-transaction history write', '409 on insufficient funds'],
  },
  {
    id: 'transfer',
    title: 'Transfer',
    detail:
      'Transfers resolve the recipient by email, block self-transfer, debit the sender, credit the recipient, and write one TRANSFER record.',
    notes: ['atomic debit and credit', 'ownership enforced', 'recipient must exist'],
  },
] as const;

export const securityPractices = [
  {
    label: 'Validation',
    detail:
      'Zod schemas guard auth payloads and amount inputs before they touch the service layer.',
  },
  {
    label: 'Authentication',
    detail:
      'JWTs are stored in cookies rather than local storage, reducing direct access from frontend JavaScript.',
  },
  {
    label: 'Authorization',
    detail:
      'Protected account routes derive `userId` from middleware and never trust a client-supplied owner identifier.',
  },
  {
    label: 'Error Contract',
    detail:
      'User-facing errors are normalized to readable API messages instead of leaking raw ORM or validation internals.',
  },
  {
    label: 'Idempotent Writes',
    detail:
      'Deposit, withdrawal, and transfer requests require an idempotency key so the backend can replay the original result instead of reapplying the mutation.',
  },
] as const;

export const apiGroups = [
  {
    label: 'Auth Surface',
    routes: [
      'POST /register',
      'POST /login',
      'POST /logout',
      'GET /session',
    ],
    detail:
      'This layer owns credential validation, password hashing, cookie issuance, and authenticated session lookup.',
  },
  {
    label: 'Account Surface',
    routes: [
      'GET /account',
      'GET /account/transactions',
      'GET /account/transactions/:transactionId',
      'GET /account/statements/monthly',
    ],
    detail:
      'This layer drives the dashboard read model, monthly statements, and ensures account history can only be read by the owning user.',
  },
  {
    label: 'Money Movement',
    routes: [
      'POST /account/deposit',
      'POST /account/withdraw',
      'POST /account/transfer',
    ],
    detail:
      'These handlers enforce amount validation, idempotency keys, overdraft prevention, transaction writes, and atomic transfers.',
  },
] as const;

export const roadmapItems = [
  {
    title: 'Refresh-token revocation',
    detail:
      'Logout currently clears the cookie only. A stronger session model would support true revocation and longer-lived refresh tokens.',
  },
  {
    title: 'Ledger-style postings',
    detail:
      'Each money movement now writes append-only debit and credit posting rows alongside the business transaction. A stronger next step would be deriving balances solely from those postings.',
  },
  {
    title: 'Automated tests',
    detail:
      'The backend now has integration coverage around auth cookies, idempotent writes, overdraft prevention, balanced transfer postings, and transaction ownership checks.',
  },
  {
    title: 'Reversals and reconciliation',
    detail:
      'Once the write path is stable, compensating entries and admin reconciliation become the next meaningful financial features.',
  },
] as const;
