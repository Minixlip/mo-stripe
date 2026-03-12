import { type Request, type Response } from 'express';
import {
  createIdempotencyRequestHash,
  getIdempotencyKeyFromRequest,
} from '../lib/idempotency.js';
import { transferBetweenAccounts } from '../services/account.service.js';
import { ACCOUNT_MUTATION_OPERATIONS } from '../services/account/account.types.js';
import { getAuthenticatedUser } from '../types/auth.js';
import { AccountTransferSchema } from '../validators/account.schema.js';
import { formatValidationError } from '../lib/formatValidationError.js';

export const createTransfer = async (req: Request, res: Response) => {
  const safeInput = AccountTransferSchema.safeParse(req.body);

  if (!safeInput.success) {
    return res.status(400).json({ error: formatValidationError(safeInput.error) });
  }

  const idempotencyKey = getIdempotencyKeyFromRequest(req);

  if (!idempotencyKey.success) {
    return res.status(400).json({ error: idempotencyKey.message });
  }

  const auth = getAuthenticatedUser(req);
  const result = await transferBetweenAccounts(
    auth.userId,
    auth.email,
    safeInput.data,
    {
      key: idempotencyKey.key,
      requestHash: createIdempotencyRequestHash(
        ACCOUNT_MUTATION_OPERATIONS.TRANSFER,
        safeInput.data,
      ),
    },
  );

  if (result.replayed) {
    res.setHeader('Idempotency-Replayed', 'true');
  }

  if (!result.success) {
    return res.status(result.statusCode).json({ error: result.message });
  }

  return res.status(result.statusCode).json(result.data);
};
