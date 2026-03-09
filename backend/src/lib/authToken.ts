import jwt from 'jsonwebtoken';

export type AuthTokenPayload = {
  userId: string;
  iat?: number;
  exp?: number;
};

export function verifyAuthToken(token: string): AuthTokenPayload {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  if (!jwtSecretKey) {
    throw new Error('JWT_SECRET_KEY is missing.');
  }

  const payload = jwt.verify(token, jwtSecretKey);

  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload.userId !== 'string'
  ) {
    throw new Error('Invalid authentication token.');
  }

  return payload as AuthTokenPayload;
}
