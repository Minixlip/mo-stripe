import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error('DIRECT_URL is missing in .env');
}

export const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seed() {
  const result = await prisma.user.createMany({
    data: [
      { email: 'Mohammedshihab6969@gmail.com', password: 'chicken123' },
      { email: 'Mohammedshihab6868@gmail.com', password: 'chicken123' },
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded ${result.count} users`);
}

seed()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
