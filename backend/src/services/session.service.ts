import { prisma } from '../../prisma/client.js';
import { verifyAuthToken } from '../lib/authToken.js';

export const processSession = async (token: string | undefined) => {
  try {
    if (!token) {
      throw new Error('Missing authentication token.');
    }

    const payload = verifyAuthToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { email: true },
    });

    if (!user) {
      throw new Error('Session user not found.');
    }

    return {
      success: true,
      message: 'Session is valid.',
      data: {
        email: user.email,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR',
    };
  }
};
