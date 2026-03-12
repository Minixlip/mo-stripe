import type { ErrorRequestHandler, RequestHandler } from 'express';
import { logError, logWarn } from '../lib/logger.js';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

export const notFoundHandler: RequestHandler = (req, res) => {
  logWarn('route_not_found', {
    requestId: req.requestId ?? null,
    method: req.method,
    path: req.originalUrl,
  });

  return res.status(404).json({
    error: 'Route not found.',
    requestId: req.requestId ?? null,
  });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400 &&
    'body' in error
      ? 400
      : 500;

  const message =
    statusCode === 400 ? 'Invalid JSON payload.' : 'Internal server error.';

  logError('unhandled_request_error', {
    requestId: req.requestId ?? null,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: getErrorMessage(error),
    stack:
      error instanceof Error && process.env.NODE_ENV !== 'production'
        ? error.stack
        : undefined,
  });

  return res.status(statusCode).json({
    error: message,
    requestId: req.requestId ?? null,
  });
};
