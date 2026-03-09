import type { NextFunction, Request, Response } from 'express';
import { AUTH_COOKIE_NAME } from '../lib/authCookie.js';
import { resolveAuthenticatedUser } from '../services/session.service.js';

export const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await resolveAuthenticatedUser(req.cookies[AUTH_COOKIE_NAME]);

  if (!result.success) {
    return res.status(result.statusCode).json({ error: result.message });
  }

  req.auth = result.data;
  next();
};
