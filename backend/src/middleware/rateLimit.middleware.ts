import type { NextFunction, Request, Response } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { logWarn } from '../lib/logger.js';

type RateLimitedRequest = Request & {
  rateLimit?: {
    resetTime?: Date;
    key?: string;
  };
};

function getEnvNumber(name: string, fallback: number) {
  const rawValue = process.env[name];
  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

function getClientIpKey(req: Request) {
  return ipKeyGenerator(req.ip ?? req.socket.remoteAddress ?? '127.0.0.1');
}

function getNormalizedEmail(req: Request) {
  const email = req.body?.email;

  if (typeof email !== 'string') {
    return null;
  }

  return email.trim().toLowerCase();
}

function buildRetryAfterSeconds(req: RateLimitedRequest, windowMs: number) {
  const resetTime = req.rateLimit?.resetTime;

  if (!resetTime) {
    return Math.ceil(windowMs / 1000);
  }

  return Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000));
}

function createRateLimitExceededHandler(message: string, limiterName: string) {
  return (
    req: RateLimitedRequest,
    res: Response,
    _next: NextFunction,
    options: { windowMs: number },
  ) => {
    const retryAfterSeconds = buildRetryAfterSeconds(req, options.windowMs);

    logWarn('rate_limit_exceeded', {
      requestId: req.requestId ?? null,
      method: req.method,
      path: req.originalUrl,
      limiter: limiterName,
      retryAfterSeconds,
      rateLimitKey: req.rateLimit?.key ?? null,
    });

    return res.status(429).json({
      error: message,
      retryAfterSeconds,
      requestId: req.requestId ?? null,
    });
  };
}

function createLimiter(config: {
  identifier: string;
  windowMs: number;
  limit: number;
  message: string;
  keyGenerator: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
}) {
  return rateLimit({
    windowMs: config.windowMs,
    limit: config.limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    requestPropertyName: 'rateLimit',
    identifier: config.identifier,
    skipSuccessfulRequests: config.skipSuccessfulRequests ?? false,
    keyGenerator: (req) => config.keyGenerator(req),
    handler: createRateLimitExceededHandler(config.message, config.identifier),
  });
}

export const loginRateLimiter = createLimiter({
  identifier: 'auth-login',
  windowMs: getEnvNumber('LOGIN_RATE_LIMIT_WINDOW_MS', 10 * 60 * 1000),
  limit: getEnvNumber('LOGIN_RATE_LIMIT_MAX', 5),
  message: 'Too many login attempts. Please wait before retrying.',
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const email = getNormalizedEmail(req);
    const ipKey = getClientIpKey(req);

    return email ? `login:${ipKey}:${email}` : `login:${ipKey}`;
  },
});

export const registerRateLimiter = createLimiter({
  identifier: 'auth-register',
  windowMs: getEnvNumber('REGISTER_RATE_LIMIT_WINDOW_MS', 60 * 60 * 1000),
  limit: getEnvNumber('REGISTER_RATE_LIMIT_MAX', 10),
  message: 'Too many registration attempts. Please wait before retrying.',
  keyGenerator: (req) => `register:${getClientIpKey(req)}`,
});

export const moneyWriteRateLimiter = createLimiter({
  identifier: 'money-write',
  windowMs: getEnvNumber('MONEY_WRITE_RATE_LIMIT_WINDOW_MS', 60 * 1000),
  limit: getEnvNumber('MONEY_WRITE_RATE_LIMIT_MAX', 30),
  message: 'Too many money movement requests. Please wait before retrying.',
  keyGenerator: (req) =>
    req.auth?.userId
      ? `money:user:${req.auth.userId}`
      : `money:ip:${getClientIpKey(req)}`,
});

export const statementRateLimiter = createLimiter({
  identifier: 'statement-read',
  windowMs: getEnvNumber('STATEMENT_RATE_LIMIT_WINDOW_MS', 60 * 1000),
  limit: getEnvNumber('STATEMENT_RATE_LIMIT_MAX', 20),
  message: 'Too many statement requests. Please wait before retrying.',
  keyGenerator: (req) =>
    req.auth?.userId
      ? `statement:user:${req.auth.userId}`
      : `statement:ip:${getClientIpKey(req)}`,
});
