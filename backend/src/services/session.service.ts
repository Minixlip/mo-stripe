import { prisma } from '../../prisma/client.js';
import { verifyAuthToken } from '../lib/authToken.js';
import type { AuthenticatedUser } from '../types/auth.js';

type SessionResult =
  | {
      success: true;
      data: AuthenticatedUser;
    }
  | {
      success: false;
      statusCode: number;
      message: string;
    };

export const resolveAuthenticatedUser = async (
  token: string | undefined,
): Promise<SessionResult> => {
  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: 'Authentication required.',
    };
  }

  try {
    const payload = verifyAuthToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return {
        success: false,
        statusCode: 401,
        message: 'Invalid session.',
      };
    }

    return {
      success: true,
      data: { userId: user.id, email: user.email },
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'JWT_SECRET_KEY is missing.') {
      return {
        success: false,
        statusCode: 500,
        message: 'Authentication is unavailable.',
      };
    }

    return {
      success: false,
      statusCode: 401,
      message: 'Invalid session.',
    };
  }
};
