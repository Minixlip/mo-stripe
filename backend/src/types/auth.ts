import type { Request } from 'express';

export type AuthenticatedUser = {
  userId: string;
  email: string;
};

export type AuthenticatedRequest = Request & {
  auth: AuthenticatedUser;
};

export function getAuthenticatedUser(req: Request): AuthenticatedUser {
  if (!req.auth) {
    throw new Error('Authenticated user is missing from the request.');
  }

  return req.auth;
}
