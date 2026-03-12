export const GITHUB_REPO_URL = 'https://github.com/Minixlip/mo-stripe';

export const docsSignals = [
  { label: 'Frontend', value: 'Next.js App Router, TypeScript, Tailwind CSS' },
  { label: 'Backend', value: 'Node.js, Express, TypeScript, Prisma ORM' },
  { label: 'Database', value: 'PostgreSQL on Supabase' },
  { label: 'Auth', value: 'bcrypt, JWT, httpOnly cookie, protected middleware' },
] as const;

export const quickStartSteps = [
  {
    label: 'Install dependencies',
    command: 'npm install',
    detail:
      'Run this in both `frontend/` and `backend/` so the app and API can build locally.',
  },
  {
    label: 'Configure environment',
    command: '.env',
    detail:
      'Set the backend JWT secret, the database URL, and the frontend API base URL for cookie-backed requests.',
  },
  {
    label: 'Apply database migrations',
    command: 'npx prisma migrate deploy',
    detail:
      'This ensures the single personal-account model, seeded opening balance flow, and transaction tables match the code.',
  },
  {
    label: 'Start both services',
    command: 'npm run dev',
    detail:
      'Run the backend on port 4000 and the frontend on port 3000 so the browser can send cookie-authenticated requests.',
  },
] as const;

export const authFlow = [
  {
    step: '01',
    title: 'Registration',
    detail:
      'A user submits email and password. The backend validates the payload, hashes the password with bcrypt, creates the user, creates the personal account, writes the opening transaction, and issues the session cookie.',
  },
  {
    step: '02',
    title: 'Login',
    detail:
      'Login validates the credentials, compares the bcrypt hash, signs a JWT, and sets it in an httpOnly cookie so frontend JavaScript does not need direct token access.',
  },
  {
    step: '03',
    title: 'Protected requests',
    detail:
      'The frontend sends requests with credentials included. Express middleware verifies the cookie, resolves the user, and attaches trusted identity to the request object.',
  },
  {
    step: '04',
    title: 'Logout',
    detail:
      'Logout clears the auth cookie using the same cookie identity used at login, which invalidates the browser session without needing a server-side session store.',
  },
] as const;

export const dataModelCards = [
  {
    title: 'User',
    points: [
      'Stores email, hashed password, and creation timestamp.',
      'Owns exactly one personal account in the current project scope.',
      'Acts as the identity root for protected routes and account ownership.',
    ],
  },
  {
    title: 'Account',
    points: [
      'Stores balance in integer pence instead of floating point currency values.',
      'Is created automatically during registration.',
      'Owns transaction relationships through incoming and outgoing references.',
    ],
  },
  {
    title: 'Transaction',
    points: [
      'Captures deposits, withdrawals, and transfers as persisted financial events.',
      'Links to `fromAccountId` and `toAccountId` as needed by the transaction type.',
      'Supports history inspection and keeps the balance story auditable.',
    ],
  },
] as const;

export const invariants = [
  'Money is stored as integer minor units.',
  'Protected routes derive `userId` from auth middleware, not request payloads.',
  'Withdrawals fail when funds are insufficient.',
  'Transfers commit debit, credit, and ledger write together.',
  'Opening balances are recorded as transactions, not hidden balance mutations.',
] as const;

export const endpointGroups = [
  {
    title: 'Authentication',
    routes: [
      'POST /register',
      'POST /login',
      'POST /logout',
      'GET /session',
    ],
    detail:
      'Handles credential lifecycle, cookie issuance, and session verification.',
  },
  {
    title: 'Account reads',
    routes: [
      'GET /account',
      'GET /account/transactions',
      'GET /account/transactions/:transactionId',
      'GET /account/statements/monthly',
    ],
    detail:
      'Drives the dashboard summary, history feed, transaction detail panel, and monthly statement export surface.',
  },
  {
    title: 'Money movement',
    routes: [
      'POST /account/deposit',
      'POST /account/withdraw',
      'POST /account/transfer',
    ],
    detail:
      'Applies the current financial rules, requires an `Idempotency-Key`, and persists the corresponding transaction rows.',
  },
] as const;

export const currentCapabilities = [
  {
    label: 'What works now',
    detail:
      'Registration, login, logout, protected session lookup, account summary, monthly statements, CSV/JSON exports, transaction history, deposit, withdrawal, transfer, and transaction detail inspection.',
  },
  {
    label: 'What is intentionally simple',
    detail:
      'The system uses one personal account per user and a demo opening balance to keep the learning scope focused.',
  },
  {
    label: 'What should come next',
    detail:
      'Integration tests for transaction invariants, a more formal ledger model, stronger token revocation, and compensating entries for reversals.',
  },
] as const;
