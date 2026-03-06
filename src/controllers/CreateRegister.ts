import { type Response, type Request } from 'express';
import { processRegister } from '../services/register.service.js';

export const createRegister = async (req: Request, res: Response) => {
  const result = await processRegister(req.body);
  return res.status(200).json(result);
};
