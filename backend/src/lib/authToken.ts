import jwt from 'jsonwebtoken';

export type AuthTokenPayload = {
  userId: string;
  iat?: number;
  exp?: number;
};

const AUTH_TOKEN_TTL = '31d';

function getJwtSecretKey() {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  if (!jwtSecretKey) {
    throw new Error('JWT_SECRET_KEY is missing.');
  }

  return jwtSecretKey;
}

export function createAuthToken(userId: string) {
  return jwt.sign({ userId }, getJwtSecretKey(), {
    expiresIn: AUTH_TOKEN_TTL,
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const payload = jwt.verify(token, getJwtSecretKey());

  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload.userId !== 'string'
  ) {
    throw new Error('Invalid authentication token.');
  }

  return payload as AuthTokenPayload;
}
