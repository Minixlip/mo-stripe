DROP INDEX IF EXISTS "Account_userId_type_key";

ALTER TABLE "Account" DROP COLUMN IF EXISTS "type";

WITH created_accounts AS (
  INSERT INTO "Account" ("id", "balance", "createdAt", "userId")
  SELECT gen_random_uuid()::text, 500000, CURRENT_TIMESTAMP, "User"."id"
  FROM "User"
  LEFT JOIN "Account" ON "Account"."userId" = "User"."id"
  WHERE "Account"."id" IS NULL
  RETURNING "id"
)
INSERT INTO "Transaction" ("id", "amount", "type", "toAccountId", "createdAt")
SELECT gen_random_uuid()::text, 500000, 'DEPOSIT', created_accounts."id", CURRENT_TIMESTAMP
FROM created_accounts;

CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

DROP TYPE IF EXISTS "AccountType";
