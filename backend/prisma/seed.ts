import bcrypt from 'bcrypt';
import { prisma } from './client.js';
import { INITIAL_ACCOUNT_BALANCE_PENCE } from '../src/lib/account.js';

const users = [
  { email: 'Mohammedshihab6969@gmail.com', password: 'Chicken123!' },
  { email: 'Mohammedshihab6868@gmail.com', password: 'Chicken123!' },
];

async function seed() {
  await Promise.all(
    users.map(async ({ email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: { email, password: hashedPassword },
      });

      const existingAccount = await prisma.account.findUnique({
        where: { userId: user.id },
      });

      if (existingAccount) {
        await prisma.account.update({
          where: { id: existingAccount.id },
          data: { balance: INITIAL_ACCOUNT_BALANCE_PENCE },
        });
        return;
      }

      await prisma.$transaction(async (tx) => {
        const account = await tx.account.create({
          data: {
            userId: user.id,
            balance: INITIAL_ACCOUNT_BALANCE_PENCE,
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
      });
    }),
  );

  console.log(`Seeded ${users.length} users`);
}

seed()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
