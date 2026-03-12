CREATE TYPE "LedgerPostingDirection" AS ENUM ('DEBIT', 'CREDIT');

CREATE TABLE "LedgerPosting" (
  "id" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "direction" "LedgerPostingDirection" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "transactionId" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,

  CONSTRAINT "LedgerPosting_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LedgerPosting_accountId_createdAt_idx" ON "LedgerPosting"("accountId", "createdAt");
CREATE INDEX "LedgerPosting_transactionId_idx" ON "LedgerPosting"("transactionId");
CREATE UNIQUE INDEX "LedgerPosting_transactionId_accountId_direction_key" ON "LedgerPosting"("transactionId", "accountId", "direction");

ALTER TABLE "LedgerPosting"
ADD CONSTRAINT "LedgerPosting_transactionId_fkey"
FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LedgerPosting"
ADD CONSTRAINT "LedgerPosting_accountId_fkey"
FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "LedgerPosting" ("id", "amount", "direction", "createdAt", "transactionId", "accountId")
SELECT
  gen_random_uuid()::text,
  "amount",
  'DEBIT',
  "createdAt",
  "id",
  "fromAccountId"
FROM "Transaction"
WHERE "fromAccountId" IS NOT NULL;

INSERT INTO "LedgerPosting" ("id", "amount", "direction", "createdAt", "transactionId", "accountId")
SELECT
  gen_random_uuid()::text,
  "amount",
  'CREDIT',
  "createdAt",
  "id",
  "toAccountId"
FROM "Transaction"
WHERE "toAccountId" IS NOT NULL;
