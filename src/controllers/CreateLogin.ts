import { type Response, type Request } from 'express';
import { processLogin } from '../services/login.service.js';

export const createLogin = async (req: Request, res: Response) => {
  const result = await processLogin(req.body);
  return res.status(200).json({ message: 'LOGGING IN!' });
};
