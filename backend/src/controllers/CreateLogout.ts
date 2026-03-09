import { type Request, type Response } from 'express';

export const createLogout = async (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });

  return res.status(200).json({ message: 'Successful logout' });
};
