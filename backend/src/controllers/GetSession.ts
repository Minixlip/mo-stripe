import { type Request, type Response } from 'express';
import { getAuthenticatedUser } from '../types/auth.js';

export const getSession = (req: Request, res: Response) => {
  const auth = getAuthenticatedUser(req);

  return res.status(200).json({ email: auth.email });
};
