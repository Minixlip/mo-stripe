# mo-stripe

`mo-stripe` is a simplified fintech-style platform inspired by systems like Stripe and modern banking APIs.

The purpose of the project is not only to build a polished interface, but to learn and demonstrate backend engineering concepts that matter in money movement systems:

- authentication boundaries
- relational data modeling
- atomic financial writes
- audit-friendly transaction history
- integration-tested financial invariants
- explicit tradeoffs and roadmap thinking

The project currently supports one personal account per user, cookie-backed authentication, account bootstrap on registration, deposits, withdrawals, transfers, monthly statements/exports, transaction history, and transaction detail inspection.

## What This Project Demonstrates

- JWT authentication stored in an `httpOnly` cookie instead of local storage
- protected Express routes that derive identity from middleware, not client payloads
- balances stored in integer pence rather than floating point values
- overdraft prevention on withdrawals
- atomic transfer execution using Prisma database transactions
- idempotency-key protection for retry-safe financial writes
- opening balances recorded as real transactions so balance and history stay aligned
- backend integration tests around auth, idempotency, overdrafts, and transfer postings
- GitHub Actions CI for backend tests plus frontend lint/build checks
- structured request logging, request IDs, and a health endpoint
- a Next.js dashboard that reads backend state through authenticated REST endpoints

## Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL

### Auth and Data

- bcrypt
- jsonwebtoken
- Supabase-hosted Postgres

## Current Product Scope

The current scope is intentionally narrow so the important backend ideas are easier to see.

- Each user has exactly one personal account.
- Registration creates the user, provisions the account, records the opening transaction, and issues the auth cookie.
- The opening balance is demo money: `5000 GBP`.
- The dashboard supports deposit, withdrawal, transfer, monthly statements, CSV/JSON exports, transaction history, and per-transaction detail views.

This is a deliberate product decision. It removes multi-entity complexity early so the project can focus on correctness, ownership, and system design.

## Architecture

At a high level, requests move through these layers:

1. Next.js frontend sends REST requests with `credentials: "include"`.
2. Express receives the request and validates input with Zod.
3. Auth middleware verifies the JWT cookie and resolves the user.
4. Service-layer functions enforce domain rules.
5. Prisma persists state into PostgreSQL.
6. The frontend reads the resulting account summary and transaction history back through authenticated endpoints.

### Core Models

#### User

- `id`
- `email`
- `password`
- `createdAt`

#### Account

- `id`
- `balance`
- `createdAt`
- `userId`

#### Transaction

- `id`
- `amount`
- `type`
- `fromAccountId`
- `toAccountId`
- `createdAt`

## Authentication Model

The auth flow is intentionally server-trusting:

- passwords are hashed with bcrypt
- login and registration sign a JWT
- the JWT is stored in an `httpOnly` cookie
- protected routes verify the cookie and attach trusted identity to the request
- the frontend does not need to read the token directly

Important limitation:

- logout clears the browser cookie, but this is not full token revocation
- true revocation would require a stronger session architecture such as token versioning, refresh tokens, or a denylist

## Financial Correctness Rules

These are the main invariants in the current version:

- Money is stored in integer minor units.
- Financial write routes require an `Idempotency-Key` and replay the stored response when the same request is retried.
- Withdrawals fail if the account balance is too low.
- Transfers are atomic: debit, credit, and transaction write share one database transaction.
- The opening balance is recorded as a transaction entry, not just a silent balance mutation.
- Transaction detail endpoints are ownership-checked so a user cannot inspect another account's transaction row.

## API Surface

### Auth

- `GET /health`
- `POST /register`
- `POST /login`
- `POST /logout`
- `GET /session`

### Account Reads

- `GET /account`
- `GET /account/transactions`
- `GET /account/transactions/:transactionId`
- `GET /account/statements/monthly`

### Money Movement

- `POST /account/deposit`
- `POST /account/withdraw`
- `POST /account/transfer`

All financial write endpoints require an `Idempotency-Key` header.

### Operational Signals

- Every response includes an `X-Request-Id` header.
- Backend requests are logged as structured JSON lines with method, path, status, duration, and request id.
- `GET /health` performs a lightweight database ping and returns service status.

## App Routes

- `/` landing page
- `/explore-more` engineering deep dive
- `/docs` technical documentation
- `/login` login page
- `/register` registration page
- `/account` authenticated ledger dashboard

## Local Development

There is no root `package.json` yet. Run the frontend and backend separately.

### 1. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DIRECT_URL=your_postgres_connection_string
JWT_SECRET_KEY=replace_with_a_long_random_secret
PORT=4000
NODE_ENV=development
```

Apply migrations and optional seed data:

```bash
npx prisma migrate deploy
npm run seed
```

Start the backend:

```bash
npm run dev
```

### 2. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_AUTH_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

### 3. Backend integration tests

The backend test suite truncates the database between runs, so point it at a disposable local Postgres instance.

```bash
cd backend
ALLOW_TEST_DB_RESET=true npm run test:integration
```

## Repository Structure

```text
mo-stripe/
  backend/
    prisma/
    src/
      controllers/
      middleware/
      routes/
      services/
      validators/
  frontend/
    app/
    components/
    lib/
```

## Current Limitations

- No refresh-token or token-revocation strategy
- No reversal or reconciliation workflows yet
- No multi-account or business-entity model yet

## Roadmap

The next meaningful upgrades would be:

1. deriving balances entirely from append-only ledger postings
2. compensating entries for reversals and refunds
3. more formal account/entity ownership models for business use cases
4. stronger session revocation and refresh-token architecture
5. request logging, metrics, and operational dashboards

## Why This Matters

This project is meant to show more than framework familiarity. It is meant to show that I can reason about:

- where trust boundaries live
- how to model ownership in a relational system
- how to keep financial state coherent
- how to scope a backend project deliberately instead of adding random features

That is the part of the project I want employers to see first.
