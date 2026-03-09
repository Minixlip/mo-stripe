import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/client.js';
import { createAuthToken } from '../lib/authToken.js';

type RegistrationData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterResult =
  | {
      success: true;
      token: string;
    }
  | {
      success: false;
      statusCode: number;
      message: string;
    };

export const processRegister = async (
  data: RegistrationData,
): Promise<RegisterResult> => {
  const { email, password } = data;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email: normalizedEmail, password: hashedPassword },
    });
    const token = createAuthToken(newUser.id);

    return { success: true, token };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        statusCode: 409,
        message: 'Email already in use.',
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: 'Unable to create account.',
    };
  }
};
