import { type Request, type Response } from 'express';
import { transferBetweenAccounts } from '../services/account.service.js';
import { getAuthenticatedUser } from '../types/auth.js';
import { AccountTransferSchema } from '../validators/account.schema.js';
import { formatValidationError } from '../lib/formatValidationError.js';

export const createTransfer = async (req: Request, res: Response) => {
  const safeInput = AccountTransferSchema.safeParse(req.body);

  if (!safeInput.success) {
    return res.status(400).json({ error: formatValidationError(safeInput.error) });
  }

  const auth = getAuthenticatedUser(req);
  const result = await transferBetweenAccounts(
    auth.userId,
    auth.email,
    safeInput.data,
  );

  if (!result.success) {
    return res.status(result.statusCode).json({ error: result.message });
  }

  return res.status(201).json(result.data);
};
