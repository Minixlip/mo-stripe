import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/client.js';
import { INITIAL_ACCOUNT_BALANCE_PENCE } from '../lib/account.js';
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

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email: normalizedEmail, password: hashedPassword },
      });

      const account = await tx.account.create({
        data: {
          userId: user.id,
        },
      });

      const openingTransaction = await tx.transaction.create({
        data: {
          amount: INITIAL_ACCOUNT_BALANCE_PENCE,
          type: 'DEPOSIT',
          toAccountId: account.id,
        },
        select: {
          id: true,
        },
      });

      await tx.ledgerPosting.create({
        data: {
          transactionId: openingTransaction.id,
          accountId: account.id,
          amount: INITIAL_ACCOUNT_BALANCE_PENCE,
          direction: 'CREDIT',
        },
      });

      return user;
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
