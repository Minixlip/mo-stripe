import { type Response, type Request } from 'express';
import { processRegister } from '../services/register.service.js';
import { AuthSchema } from '../validators/auth.schema.js';
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from '../lib/authCookie.js';

export const createRegister = async (req: Request, res: Response) => {
  const safeInput = AuthSchema.safeParse(req.body);

  if (!safeInput.success) {
    return res.status(400).json({ error: safeInput.error });
  }

  if (safeInput.data.confirmPassword !== safeInput.data.password) {
    return res
      .status(400)
      .json({ error: 'Password & Confirmed Password Do Not Match' });
  }

  const result = await processRegister(safeInput.data);

  if (result?.sucess) {
    res.cookie(AUTH_COOKIE_NAME, result.message, getAuthCookieOptions());
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result?.message });
  }
};
