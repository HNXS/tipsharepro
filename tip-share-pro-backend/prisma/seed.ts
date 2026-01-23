import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@tipsharepro.com' },
    update: {},
    create: {
      email: 'demo@tipsharepro.com',
      password: hashedPassword,
      name: 'Demo User',
      companyName: 'Demo Restaurant',
      role: 'admin',
    },
  });

  console.log('Created demo user:', demoUser.email);
  console.log('Demo credentials: demo@tipsharepro.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
