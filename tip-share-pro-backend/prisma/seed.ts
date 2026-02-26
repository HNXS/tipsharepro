import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo organization
  const demoOrg = await prisma.organization.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Demo Restaurant',
      subscriptionStatus: 'DEMO',
      settings: {},
    },
  });
  console.log('Created organization:', demoOrg.name);

  // Create demo location
  const demoLocation = await prisma.location.upsert({
    where: {
      organizationId_number: {
        organizationId: demoOrg.id,
        number: '001',
      }
    },
    update: {},
    create: {
      organizationId: demoOrg.id,
      name: 'Main Location',
      number: '001',
      status: 'ACTIVE',
    },
  });
  console.log('Created location:', demoLocation.name);

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const demoUser = await prisma.user.upsert({
    where: {
      organizationId_email: {
        organizationId: demoOrg.id,
        email: 'demo@tipsharepro.com',
      }
    },
    update: {},
    create: {
      organizationId: demoOrg.id,
      locationId: demoLocation.id,
      email: 'demo@tipsharepro.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created demo user:', demoUser.email);
  console.log('');
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
