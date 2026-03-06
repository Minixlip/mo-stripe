import { type Response, type Request } from 'express';
import { processLogin } from '../services/login.service.js';
import { LoginSchema } from '../validators/auth.schema.js';

export const createLogin = async (req: Request, res: Response) => {
  const safeInput = LoginSchema.safeParse(req.body);

  if (!safeInput.success) {
    return res.status(400).json({ error: safeInput.error });
  }

  const result = await processLogin(safeInput.data);

  if (!result.success) {
    return res.status(401).json({ error: result.message });
  }

  if (result.success) {
    return res
      .status(200)
      .json({ message: 'Successful login', token: result.message });
  }
};
