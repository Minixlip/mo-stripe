import { type Request, type Response } from 'express';
import { formatValidationError } from '../lib/formatValidationError.js';
import { getAccountTransactions } from '../services/account.service.js';
import { getAuthenticatedUser } from '../types/auth.js';
import { AccountTransactionsQuerySchema } from '../validators/account.schema.js';

export const getAccountTransactionsController = async (
  req: Request,
  res: Response,
) => {
  const safeInput = AccountTransactionsQuerySchema.safeParse({
    limit: Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit,
  });

  if (!safeInput.success) {
    return res.status(400).json({ error: formatValidationError(safeInput.error) });
  }

  const auth = getAuthenticatedUser(req);
  const result = await getAccountTransactions(auth.userId, safeInput.data.limit);

  if (!result.success) {
    return res.status(result.statusCode).json({ error: result.message });
  }

  return res.status(200).json(result.data);
};
