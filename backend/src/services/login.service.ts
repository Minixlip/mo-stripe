import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/client.js';
import { createAuthToken } from '../lib/authToken.js';

type LoginData = {
  email: string;
  password: string;
};

type LoginResult =
  | {
      success: true;
      token: string;
    }
  | {
      success: false;
      statusCode: number;
      message: string;
    };

export const processLogin = async (data: LoginData): Promise<LoginResult> => {
  const { email, password } = data;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const findUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!findUser) {
      return {
        success: false,
        statusCode: 401,
        message: 'Invalid email or password.',
      };
    }

    const passwordMatches = await bcrypt.compare(password, findUser.password);

    if (!passwordMatches) {
      return {
        success: false,
        statusCode: 401,
        message: 'Invalid email or password.',
      };
    }

    const token = createAuthToken(findUser.id);

    return { success: true, token };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: 'Unable to log in.',
    };
  }
};
