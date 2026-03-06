import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/client.js';

type LoginData = {
  email: string;
  password: string;
};

export const processLogin = async (data: LoginData) => {
  const { email, password } = data;

  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    if (!jwtSecretKey) {
      throw new Error('JWT_SECRET_KEY is missing.');
    }

    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!findUser) {
      throw new Error('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(password, findUser.password);

    if (!passwordMatches) {
      throw new Error('Invalid email or password.');
    }

    const tokenData = {
      time: findUser.createdAt,
      userId: findUser.id,
    };
    const token = jwt.sign(tokenData, jwtSecretKey);

    return { success: true, message: token };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR',
    };
  }
};
