import { type Request, type Response } from 'express';
import { formatValidationError } from '../lib/formatValidationError.js';
import { getAccountTransactionDetail } from '../services/account.service.js';
import { getAuthenticatedUser } from '../types/auth.js';
import { AccountTransactionParamsSchema } from '../validators/account.schema.js';

export const getAccountTransactionController = async (
  req: Request,
  res: Response,
) => {
  const safeInput = AccountTransactionParamsSchema.safeParse(req.params);

  if (!safeInput.success) {
    return res.status(400).json({ error: formatValidationError(safeInput.error) });
  }

  const auth = getAuthenticatedUser(req);
  const result = await getAccountTransactionDetail(
    auth.userId,
    safeInput.data.transactionId,
  );

  if (!result.success) {
    return res.status(result.statusCode).json({ error: result.message });
  }

  return res.status(200).json(result.data);
};
