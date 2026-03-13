DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Account" account
    LEFT JOIN (
      SELECT
        "accountId",
        COALESCE(
          SUM(
            CASE
              WHEN "direction" = 'CREDIT' THEN "amount"
              ELSE -"amount"
            END
          ),
          0
        ) AS "derivedBalance"
      FROM "LedgerPosting"
      GROUP BY "accountId"
    ) posting_balance ON posting_balance."accountId" = account."id"
    WHERE account."balance" <> COALESCE(posting_balance."derivedBalance", 0)
  ) THEN
    RAISE EXCEPTION
      'Cannot drop Account.balance because one or more snapshot balances do not match ledger postings.';
  END IF;
END $$;

ALTER TABLE "Account"
DROP COLUMN "balance";
