import { type Request, type Response } from 'express';
import { withdrawFromAccount } from '../services/account.service.js';
import { getAuthenticatedUser } from '../types/auth.js';
import { AccountAmountSchema } from '../validators/account.schema.js';
import { formatValidationError } from '../lib/formatValidationError.js';

export const createWithdrawal = async (req: Request, res: Response) => {
  const safeInput = AccountAmountSchema.safeParse(req.body);

  if (!safeInput.success) {
    return res.status(400).json({ error: formatValidationError(safeInput.error) });
  }

  const auth = getAuthenticatedUser(req);
  const result = await withdrawFromAccount(auth.userId, safeInput.data.amount);

  if (!result.success) {
    return res.status(result.statusCode).json({ error: result.message });
  }

  return res.status(201).json(result.data);
};
