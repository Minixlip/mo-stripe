import { type Response, type Request } from 'express';
import { processRegister } from '../services/register.service.js';
import { AuthSchema } from '../validators/auth.schema.js';
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from '../lib/authCookie.js';
import { formatValidationError } from '../lib/formatValidationError.js';

export const createRegister = async (req: Request, res: Response) => {
  const safeInput = AuthSchema.safeParse(req.body);

  if (!safeInput.success) {
    return res.status(400).json({ error: formatValidationError(safeInput.error) });
  }

  const result = await processRegister(safeInput.data);

  if (!result.success) {
    return res.status(result.statusCode).json({ error: result.message });
  }

  res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());
  return res.status(201).json({ message: 'Successful registration' });
};
