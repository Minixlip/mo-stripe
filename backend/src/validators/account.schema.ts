import { z } from 'zod';

const amountPattern = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/;

function parseAmountToPence(input: string) {
  const trimmed = input.trim();
  const [poundsPart, pencePart = ''] = trimmed.split('.');
  const normalizedPence = `${pencePart}00`.slice(0, 2);

  return Number(poundsPart) * 100 + Number(normalizedPence);
}

const AmountSchema = z
  .string()
  .trim()
  .regex(amountPattern, 'Enter a valid GBP amount.')
  .transform(parseAmountToPence)
  .refine((value) => value > 0, 'Amount must be greater than 0.');

export const AccountAmountSchema = z.object({
  amount: AmountSchema,
});

export const AccountTransferSchema = z.object({
  amount: AmountSchema,
  recipientEmail: z.string().trim().email().transform((value) => value.toLowerCase()),
});

export const AccountTransactionsQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((value) => (value === undefined ? 24 : Number(value)))
    .refine(
      (value) => Number.isInteger(value) && value >= 1 && value <= 50,
      'Limit must be an integer between 1 and 50.',
    ),
});

export const AccountTransactionParamsSchema = z.object({
  transactionId: z.string().uuid('Transaction id is invalid.'),
});

function isFutureMonth(value: string) {
  const [yearPart, monthPart] = value.split('-');
  const year = Number(yearPart);
  const monthIndex = Number(monthPart) - 1;
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonthIndex = now.getUTCMonth();

  return (
    year > currentYear ||
    (year === currentYear && monthIndex > currentMonthIndex)
  );
}

export const AccountMonthlyStatementQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format.')
    .refine((value) => !isFutureMonth(value), 'Month cannot be in the future.'),
});
