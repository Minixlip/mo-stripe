import { type Request, type Response } from 'express';
import { formatValidationError } from '../lib/formatValidationError.js';
import { getAccountMonthlyStatement } from '../services/account.service.js';
import { getAuthenticatedUser } from '../types/auth.js';
import { AccountMonthlyStatementQuerySchema } from '../validators/account.schema.js';

export const getAccountMonthlyStatementController = async (
  req: Request,
  res: Response,
) => {
  const safeInput = AccountMonthlyStatementQuerySchema.safeParse({
    month: Array.isArray(req.query.month) ? req.query.month[0] : req.query.month,
  });

  if (!safeInput.success) {
    return res.status(400).json({ error: formatValidationError(safeInput.error) });
  }

  const auth = getAuthenticatedUser(req);
  const result = await getAccountMonthlyStatement(auth.userId, safeInput.data.month);

  if (!result.success) {
    return res.status(result.statusCode).json({ error: result.message });
  }

  return res.status(200).json(result.data);
};
