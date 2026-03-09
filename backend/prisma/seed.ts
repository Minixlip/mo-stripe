import bcrypt from 'bcrypt';
import { prisma } from './client.js';

const users = [
  { email: 'Mohammedshihab6969@gmail.com', password: 'Chicken123!' },
  { email: 'Mohammedshihab6868@gmail.com', password: 'Chicken123!' },
];

async function seed() {
  await Promise.all(
    users.map(async ({ email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: { email, password: hashedPassword },
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
