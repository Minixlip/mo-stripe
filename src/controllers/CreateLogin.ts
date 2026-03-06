import { type Response, type Request } from 'express';
import { processLogin } from '../services/login.service.js';
import { AuthSchema } from '../validators/auth.schema.js';

export const createLogin = async (req: Request, res: Response) => {
  const safeInput = AuthSchema.safeParse(req.body);

  if (!safeInput.success) {
    return res.status(400).json({ error: safeInput.error });
  }
  const result = await processLogin(safeInput);
  return res.status(200).json({ message: 'LOGGING IN!' });
};
