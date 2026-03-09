import { type Request, type Response } from 'express';
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from '../lib/authCookie.js';

export const createLogout = async (_req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, getAuthCookieOptions());

  return res.status(200).json({ message: 'Successful logout' });
};
