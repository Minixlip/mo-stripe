import { type Request, type Response } from 'express';
import { AUTH_COOKIE_NAME } from '../lib/authCookie.js';
import { processSession } from '../services/session.service.js';

export const getSession = async (req: Request, res: Response) => {
  const result = await processSession(req.cookies[AUTH_COOKIE_NAME]);

  if (!result.success) {
    return res.status(401).json({ error: result.message });
  }

  return res.status(200).json(result.data);
};
