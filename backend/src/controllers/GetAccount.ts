import { type Request, type Response } from 'express';
import { getAccountOverview } from '../services/account.service.js';
import { getAuthenticatedUser } from '../types/auth.js';

export const getAccount = async (req: Request, res: Response) => {
  const auth = getAuthenticatedUser(req);
  const result = await getAccountOverview(auth.userId, auth.email);

  if (!result.success) {
    return res.status(result.statusCode).json({ error: result.message });
  }

  return res.status(200).json(result.data);
};
