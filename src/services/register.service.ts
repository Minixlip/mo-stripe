import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bycrypt from 'bcrypt';
import { adapter } from '../../prisma/seed';
import jwt from 'jsonwebtoken';

type RegistrationData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const prisma = new PrismaClient({ adapter });

export const processRegister = async (data: RegistrationData) => {
  const { email, password } = data;

  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (foundUser) throw new Error('Email already in use.');

    const hashedPassword = await bycrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    if (newUser) {
      let data = {
        time: newUser.createdAt,
        userId: newUser.id,
      };
      const token = jwt.sign(data, jwtSecretKey as string);
      return { sucess: true, message: token };
    }
  } catch (error) {
    return { sucess: true, message: error };
  }
};
