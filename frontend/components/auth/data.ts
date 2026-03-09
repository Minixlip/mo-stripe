import type { AuthContent, AuthMode } from './types';

export const authContentByMode: Record<AuthMode, AuthContent> = {
  login: {
    eyebrow: 'SESSION ACCESS',
    badgeNote: 'secure-auth',
    title: 'Return to the console.',
    subtitle: 'Credentialed access, logged.',
    description:
      'Operator entry is validated, hashed credentials are checked, sessions are issued, and every login is tagged to the audit trail.',
    panelLabel: 'SESSION GATE',
    panelMode: 'operator login',
    formHint:
      'Use the account attached to your ledger workspace. The surface stays minimal; the control path stays strict.',
    submitLabel: 'Sign in',
    switchPrompt: 'Need an account?',
    switchLabel: 'Register',
    switchHref: '/register',
    auxiliaryLabel: 'Forgot password',
    auxiliaryHref: '#',
    consentLabel: 'Remember this device for 30 days',
    fields: [
      {
        name: 'email',
        label: 'Operator email',
        type: 'email',
        placeholder: 'John@gmail.com',
        autoComplete: 'email',
        helper: '',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
        autoComplete: 'current-password',
        helper: '',
      },
    ],
    flowSteps: [
      { step: '01', title: 'Frontend Dashboard', note: 'credential packet' },
      { step: '02', title: 'Express API Layer', note: 'zod + rate limit' },
      { step: '03', title: 'Service Layer', note: 'bcrypt verify + jwt issue' },
      { step: '04', title: 'Ledger Context', note: 'audit tag + redirect' },
    ],
    checks: [
      {
        label: 'schema validation',
        detail: 'credential payload',
        status: 'pass',
      },
      { label: 'hash compare', detail: 'bcrypt verified', status: 'match' },
      { label: 'session issue', detail: 'jwt scoped', status: 'minted' },
      { label: 'audit write', detail: 'login recorded', status: 'logged' },
    ],
    traceEvents: [
      { amount: '+ /auth/login', label: 'credential_packet', tone: 'accent' },
      { amount: '> zod.parse()', label: 'schema_gate', tone: 'default' },
      { amount: '> bcrypt.compare()', label: 'hash_check', tone: 'default' },
      { amount: '+ jwt issued', label: 'session_token', tone: 'accent' },
      { amount: '+ audit tag', label: 'access_logged', tone: 'muted' },
      {
        amount: '> redirect /ledger',
        label: 'operator_console',
        tone: 'accent',
      },
    ],
    utilityCards: [
      { label: 'HASH', value: 'bcrypt compare', meta: 'credential verify' },
      { label: 'TOKEN', value: 'JWT session', meta: 'scoped operator access' },
      {
        label: 'STORE',
        value: 'Supabase / Postgres',
        meta: 'durable session context',
      },
    ],
    signals: [
      { label: 'RATE-LIMITED', value: 'replay resistance on entry' },
      { label: 'JWT ISSUED', value: 'session scoped on success' },
      { label: 'AUDIT TAGGED', value: 'every login is attributable' },
    ],
    footerNote:
      'Session issue stays downstream of validation and credential proof.',
  },
  register: {
    eyebrow: 'ACCOUNT PROVISIONING',
    badgeNote: 'access-bootstrap',
    title: 'Provision your operator access.',
    subtitle: 'New account, same control path.',
    description:
      'Registration follows the same discipline as transfers: payload validation, password hashing, relational writes, and a clean session bootstrap with an opening GBP balance.',
    panelLabel: 'ACCOUNT SETUP',
    panelMode: 'register flow',
    formHint:
      'Registration now provisions one personal account automatically and seeds it with 5,000 GBP in demo funds.',
    submitLabel: 'Create account',
    switchPrompt: 'Already have access?',
    switchLabel: 'Sign in',
    switchHref: '/login',
    auxiliaryLabel: 'View security model',
    auxiliaryHref: '#',
    consentLabel:
      'I accept the terms, privacy policy, and audit logging notice',
    fields: [
      {
        name: 'email',
        label: 'email',
        type: 'email',
        placeholder: 'you@gmail.com',
        autoComplete: 'email',
        helper: 'Used for account uniqueness and session recovery.',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create a password',
        autoComplete: 'new-password',
        helper:
          'Must be min 8 characters and contain at least: Uppercase, Lowercase,Special character',
      },
      {
        name: 'confirmPassword',
        label: 'Confirm password',
        type: 'password',
        placeholder: 'Repeat password',
        autoComplete: 'new-password',
        helper: 'Must match before the relational write occurs.',
      },
    ],
    flowSteps: [
      { step: '01', title: 'Frontend Dashboard', note: 'account payload' },
      {
        step: '02',
        title: 'Express API Layer',
        note: 'zod + uniqueness check',
      },
      {
        step: '03',
        title: 'Service Layer',
        note: 'bcrypt hash + orchestration',
      },
      {
        step: '04',
        title: 'PostgreSQL / Prisma',
        note: 'user + account + opening deposit',
      },
    ],
    checks: [
      {
        label: 'schema validation',
        detail: 'typed registration input',
        status: 'pass',
      },
      { label: 'identity check', detail: 'email unique', status: 'reserved' },
      {
        label: 'password hash',
        detail: 'bcrypt cost applied',
        status: 'sealed',
      },
      {
        label: 'bootstrap write',
        detail: 'user and account persisted',
        status: 'committed',
      },
    ],
    traceEvents: [
      { amount: '+ /auth/register', label: 'account_payload', tone: 'accent' },
      { amount: '> zod.safeParse()', label: 'schema_gate', tone: 'default' },
      { amount: '> bcrypt.hash()', label: 'password_sealed', tone: 'default' },
      {
        amount: '+ opening deposit',
        label: 'account_bootstrap',
        tone: 'accent',
      },
      { amount: '+ jwt issued', label: 'session_bootstrap', tone: 'muted' },
      {
        amount: '> redirect /ledger',
        label: 'operator_console',
        tone: 'accent',
      },
    ],
    utilityCards: [
      {
        label: 'VALIDATION',
        value: 'Zod schema',
        meta: 'typed request contract',
      },
      {
        label: 'HASHING',
        value: 'bcrypt seal',
        meta: 'password never stored raw',
      },
      {
        label: 'PERSISTENCE',
        value: 'Prisma create',
        meta: 'strict relational write',
      },
    ],
    signals: [
      { label: 'UNIQUE EMAIL', value: 'duplicate identity blocked' },
      { label: 'HASHED FIRST', value: 'raw password never persists' },
      { label: 'RELATIONAL WRITE', value: 'user and session stay coherent' },
    ],
    footerNote:
      'Registration is treated like a first-class state transition, not a loose form post.',
  },
};
