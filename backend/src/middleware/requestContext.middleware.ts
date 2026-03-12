import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { logInfo } from '../lib/logger.js';

function getRequestId(req: Request) {
  const headerValue = req.get('X-Request-Id')?.trim();

  if (headerValue && headerValue.length <= 128) {
    return headerValue;
  }

  return randomUUID();
}

function maskIdempotencyKey(value: string | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length <= 8) {
    return trimmed;
  }

  return `${trimmed.slice(0, 8)}...`;
}

export function attachRequestContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = getRequestId(req);
  const startedAt = process.hrtime.bigint();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    logInfo('http_request', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      userId: req.auth?.userId ?? null,
      idempotencyKey: maskIdempotencyKey(req.get('Idempotency-Key')),
      ip: req.ip,
    });
  });

  next();
}
