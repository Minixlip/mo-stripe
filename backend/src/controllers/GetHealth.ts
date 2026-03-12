import { type Request, type Response } from 'express';
import { prisma } from '../../prisma/client.js';

export const getHealth = async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: 'ok',
      service: 'mo-stripe-api',
      database: 'up',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Number(process.uptime().toFixed(0)),
      requestId: req.requestId ?? null,
    });
  } catch {
    return res.status(503).json({
      status: 'degraded',
      service: 'mo-stripe-api',
      database: 'down',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Number(process.uptime().toFixed(0)),
      requestId: req.requestId ?? null,
    });
  }
};
