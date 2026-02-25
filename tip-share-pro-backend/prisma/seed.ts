import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Default job categories matching frontend types.ts
const CATEGORY_DEFS = [
  { name: 'Lead Cook',    weight: 3, badgeColor: '#E85D04' },
  { name: 'Line Cook',    weight: 3, badgeColor: '#E85D04' },
  { name: 'Pastry Chef',  weight: 3, badgeColor: '#E85D04' },
  { name: 'Pantry Chef',  weight: 3, badgeColor: '#E85D04' },
  { name: 'Host/Hostess', weight: 2, badgeColor: '#8E44AD' },
  { name: 'Busser',       weight: 2, badgeColor: '#8E44AD' },
  { name: 'Cashier',      weight: 2, badgeColor: '#8E44AD' },
  { name: 'Runner',       weight: 2, badgeColor: '#8E44AD' },
  { name: 'Bartender',    weight: 4, badgeColor: '#35A0D2' },
  { name: 'Barista',      weight: 4, badgeColor: '#35A0D2' },
  { name: 'Bar Back',     weight: 4, badgeColor: '#35A0D2' },
  { name: 'Dishwasher',   weight: 1, badgeColor: '#82B536' },
  { name: 'Prep Cook',    weight: 1, badgeColor: '#82B536' },
];

// Default sample employees matching frontend types.ts
const EMPLOYEE_DEFS = [
  { name: 'Maria Santos',    category: 'Line Cook',    rateCents: 2200 },
  { name: 'James Wilson',    category: 'Bartender',    rateCents: 2400 },
  { name: 'Sarah Johnson',   category: 'Host/Hostess', rateCents: 1600 },
  { name: 'Mike Chen',       category: 'Busser',       rateCents: 1550 },
  { name: 'Lisa Park',       category: 'Dishwasher',   rateCents: 1600 },
  { name: 'Tom Rodriguez',   category: 'Line Cook',    rateCents: 2000 },
  { name: 'Amy Martinez',    category: 'Host/Hostess', rateCents: 1500 },
  { name: 'Dan Torres',      category: 'Busser',       rateCents: 1500 },
  { name: 'Katie Middleton', category: 'Bartender',    rateCents: 2200 },
  { name: 'Chris Lee',       category: 'Dishwasher',   rateCents: 1550 },
];

async function main() {
  console.log('Seeding database...');

  // Check if already seeded
  const existingOrgs = await prisma.organization.count();
  if (existingOrgs > 0) {
    console.log('Database already has data. Skipping seed.');
    console.log(`  Organizations: ${existingOrgs}`);
    const userCount = await prisma.user.count();
    console.log(`  Users: ${userCount}`);
    return;
  }

  // Create demo organization with default settings
  const demoOrg = await prisma.organization.create({
    data: {
      name: 'Demo Restaurant',
      subscriptionStatus: 'DEMO',
      settings: {
        contributionMethod: 'ALL_SALES',
        contributionRate: 3.25,
        estimatedMonthlySales: 100000,
        payPeriodType: 'BI_WEEKLY',
      },
    },
  });
  console.log('Created organization:', demoOrg.name);

  // Create demo location
  const demoLocation = await prisma.location.create({
    data: {
      organizationId: demoOrg.id,
      name: 'Main Location',
      number: '001',
      status: 'ACTIVE',
    },
  });
  console.log('Created location:', demoLocation.name);

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.create({
    data: {
      organizationId: demoOrg.id,
      locationId: demoLocation.id,
      email: 'demo@tipsharepro.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created demo user:', demoUser.email);

  // Seed job categories
  const categories: Record<string, string> = {};
  for (const cat of CATEGORY_DEFS) {
    const created = await prisma.jobCategory.create({
      data: {
        organizationId: demoOrg.id,
        name: cat.name,
        weight: cat.weight,
        badgeColor: cat.badgeColor,
      },
    });
    categories[cat.name] = created.id;
  }
  console.log(`Created ${CATEGORY_DEFS.length} job categories`);

  // Seed employees
  const now = new Date();
  for (const emp of EMPLOYEE_DEFS) {
    await prisma.employee.create({
      data: {
        organizationId: demoOrg.id,
        locationId: demoLocation.id,
        jobCategoryId: categories[emp.category],
        name: emp.name,
        hourlyRateCents: emp.rateCents,
        hiredAt: now,
      },
    });
  }
  console.log(`Created ${EMPLOYEE_DEFS.length} sample employees`);

  console.log('');
  console.log('Seed complete!');
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
