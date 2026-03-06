import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client.js';

type RegistrationData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const processRegister = async (data: RegistrationData) => {
  const { email, password } = data;

  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    if (!jwtSecretKey) {
      throw new Error('JWT_SECRET_KEY is missing.');
    }

    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    if (foundUser) throw new Error('Email already in use.');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    if (!newUser) {
      throw new Error('INTERNAL_SERVER_ERROR');
    }

    const tokenData = {
      time: newUser.createdAt,
      userId: newUser.id,
    };
    const token = jwt.sign(tokenData, jwtSecretKey);

    return { sucess: true, message: token };
  } catch (error) {
    return {
      sucess: false,
      message:
        error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR',
    };
  }
};
