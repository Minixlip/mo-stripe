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
    value: 'single personal account with ledger-backed, idempotent money movement',
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
    title: 'Idempotent Ledger Writes',
    description:
      'Financial write routes require an idempotency key and persist append-only debit and credit postings so retries stay safe and every balance change remains auditable.',
    system: 'ledger_write_path',
    mode: 'idempotent + atomic',
    invariant: 'retry safe',
    proofLabel: 'write contract',
    proofValue: 'key_required',
    footer: 'duplicate writes blocked',
    rows: [
      { label: 'HEADER', value: 'IDEMPOTENCY-KEY' },
      { label: 'POSTINGS', value: 'DEBIT + CREDIT' },
      { label: 'COMMIT', value: 'ALL OR NOTHING', tone: 'accent' },
    ],
  },
  {
    index: '04',
    eyebrow: 'OPERATIONS',
    title: 'Observable Backend Boundary',
    description:
      'Every request receives a request id, the API emits structured JSON access logs, exposes a health route, and runs CI-backed integration tests for the money-moving flows.',
    system: 'ops_surface',
    mode: 'health + logs + ci',
    invariant: 'traceable requests',
    proofLabel: 'service signal',
    proofValue: 'request_id',
    footer: 'runtime behavior is inspectable',
    rows: [
      { label: 'HEALTH', value: 'GET /HEALTH' },
      { label: 'RESPONSES', value: 'X-REQUEST-ID' },
      { label: 'CI', value: 'TESTED ON PUSH', tone: 'accent' },
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
      'Business logic checks account ownership, validates idempotency context, prevents overdrafts, and blocks self-transfer edge cases.',
  },
  {
    step: '04',
    title: 'Database transaction commits',
    detail:
      'Balance updates, transaction rows, and append-only ledger postings are written together, which prevents partial financial state.',
  },
  {
    step: '05',
    title: 'Response is correlated and logged',
    detail:
      'The API returns an `X-Request-Id`, emits a structured request log line, and the frontend then reads the persisted summary, history, and statement data.',
  },
] as const;

export const moneyFlowCards = [
  {
    id: 'deposit',
    title: 'Deposit',
    detail:
      'Deposit requests convert GBP strings to pence, increment the account balance, create a DEPOSIT transaction row, and append a matching CREDIT posting.',
    notes: ['positive amount required', 'idempotency enforced', 'credit posting written'],
  },
  {
    id: 'withdraw',
    title: 'Withdraw',
    detail:
      'Withdrawals use a guarded update so the balance only decrements when sufficient funds are available at commit time, then append a DEBIT posting.',
    notes: ['no overdraft', 'debit posting written', '409 on insufficient funds'],
  },
  {
    id: 'transfer',
    title: 'Transfer',
    detail:
      'Transfers resolve the recipient by email, block self-transfer, debit the sender, credit the recipient, write one TRANSFER record, and append both posting legs.',
    notes: ['atomic debit and credit', 'idempotent retry safe', 'recipient must exist'],
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
  {
    label: 'Integration Tests',
    detail:
      'The backend suite exercises auth cookies, write idempotency, overdraft prevention, balanced transfer postings, and transaction ownership over real HTTP routes.',
  },
  {
    label: 'Operational Signals',
    detail:
      'Each request gets a correlation id, logs as structured JSON, and the service exposes a health endpoint for runtime checks.',
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
    label: 'Operational Surface',
    routes: ['GET /health'],
    detail:
      'This route performs a lightweight database ping, while the wider HTTP layer adds request ids and structured access logs to every response cycle.',
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
      'These handlers enforce amount validation, idempotency keys, overdraft prevention, transaction writes, append-only ledger postings, and atomic transfers.',
  },
] as const;

export const roadmapItems = [
  {
    title: 'Refresh-token revocation',
    detail:
      'Logout currently clears the cookie only. A stronger session model would support true revocation and longer-lived refresh tokens.',
  },
  {
    title: 'Posting-derived balances',
    detail:
      'Each money movement already writes append-only debit and credit postings. The stronger next step is to derive balances directly from those postings instead of keeping a balance snapshot.',
  },
  {
    title: 'Rate limiting and abuse protection',
    detail:
      'The write path is now test-covered, but auth and money-moving routes still need rate limiting and abuse controls for a more production-like posture.',
  },
  {
    title: 'Reversals and reconciliation',
    detail:
      'Once the write path is stable, compensating entries and admin reconciliation become the next meaningful financial features.',
    },
  {
    title: 'Public deployment and metrics',
    detail:
      'The service now has request ids, logs, health checks, and CI. The next operational step is a public deployment target with metrics, alerts, and environment hardening.',
  },
] as const;
