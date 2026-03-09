import { type Response, type Request } from 'express';
import { processLogin } from '../services/login.service.js';
import { LoginSchema } from '../validators/auth.schema.js';
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from '../lib/authCookie.js';
import { formatValidationError } from '../lib/formatValidationError.js';

export const createLogin = async (req: Request, res: Response) => {
  const safeInput = LoginSchema.safeParse(req.body);

  if (!safeInput.success) {
    return res.status(400).json({ error: formatValidationError(safeInput.error) });
  }

  const result = await processLogin(safeInput.data);

  if (!result.success) {
    return res.status(result.statusCode).json({ error: result.message });
  }

  res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());
  return res.status(200).json({ message: 'Successful login' });
};
