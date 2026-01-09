/**
 * Database Seed Script
 *
 * Populates the database with sample data for development and testing.
 */

import { PrismaClient, UserRole, EmployeeStatus, PayPeriodStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: 'Demo Restaurant Group',
      subscriptionStatus: 'TRIAL',
      trialEndsAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
      settings: {
        contributionRate: 3.25,
        payPeriodType: 'BIWEEKLY',
        autoArchiveDays: 3,
      },
    },
  });
  console.log(`Created organization: ${org.name}`);

  // Create location
  const location = await prisma.location.create({
    data: {
      organizationId: org.id,
      name: 'Downtown',
      number: '001',
      status: 'ACTIVE',
    },
  });
  console.log(`Created location: ${location.name}`);

  // Create job categories with weights
  const categories = await Promise.all([
    prisma.jobCategory.create({
      data: {
        organizationId: org.id,
        name: 'Server',
        weight: 1.0,
        badgeColor: '#4A90D9',
      },
    }),
    prisma.jobCategory.create({
      data: {
        organizationId: org.id,
        name: 'Busser',
        weight: 1.5,
        badgeColor: '#7ED321',
      },
    }),
    prisma.jobCategory.create({
      data: {
        organizationId: org.id,
        name: 'Host',
        weight: 1.25,
        badgeColor: '#9B59B6',
      },
    }),
    prisma.jobCategory.create({
      data: {
        organizationId: org.id,
        name: 'Cook',
        weight: 2.5,
        badgeColor: '#E8C150',
      },
    }),
    prisma.jobCategory.create({
      data: {
        organizationId: org.id,
        name: 'Bartender',
        weight: 1.75,
        badgeColor: '#E85D35',
      },
    }),
  ]);
  console.log(`Created ${categories.length} job categories`);

  // Create admin user
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: {
      organizationId: org.id,
      email: 'admin@demo.tipsharepro.com',
      passwordHash,
      role: UserRole.ADMIN,
      twoFactorEnabled: false,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create manager
  const manager = await prisma.user.create({
    data: {
      organizationId: org.id,
      locationId: location.id,
      email: 'manager@demo.tipsharepro.com',
      passwordHash,
      role: UserRole.MANAGER,
      twoFactorEnabled: false,
    },
  });
  console.log(`Created manager user: ${manager.email}`);

  // Create employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        organizationId: org.id,
        locationId: location.id,
        jobCategoryId: categories[0].id, // Server
        name: 'Maria Santos',
        hourlyRateCents: 1850, // $18.50
        status: EmployeeStatus.ACTIVE,
        hiredAt: new Date('2024-01-15'),
      },
    }),
    prisma.employee.create({
      data: {
        organizationId: org.id,
        locationId: location.id,
        jobCategoryId: categories[0].id, // Server
        name: 'James Wilson',
        hourlyRateCents: 1750, // $17.50
        status: EmployeeStatus.ACTIVE,
        hiredAt: new Date('2024-02-01'),
      },
    }),
    prisma.employee.create({
      data: {
        organizationId: org.id,
        locationId: location.id,
        jobCategoryId: categories[1].id, // Busser
        name: 'Carlos Mendez',
        hourlyRateCents: 1500, // $15.00
        status: EmployeeStatus.ACTIVE,
        hiredAt: new Date('2024-03-10'),
      },
    }),
    prisma.employee.create({
      data: {
        organizationId: org.id,
        locationId: location.id,
        jobCategoryId: categories[2].id, // Host
        name: 'Emily Chen',
        hourlyRateCents: 1600, // $16.00
        status: EmployeeStatus.ACTIVE,
        hiredAt: new Date('2024-01-20'),
      },
    }),
    prisma.employee.create({
      data: {
        organizationId: org.id,
        locationId: location.id,
        jobCategoryId: categories[3].id, // Cook
        name: 'Jose Rodriguez',
        hourlyRateCents: 2200, // $22.00
        status: EmployeeStatus.ACTIVE,
        hiredAt: new Date('2023-11-01'),
      },
    }),
    prisma.employee.create({
      data: {
        organizationId: org.id,
        locationId: location.id,
        jobCategoryId: categories[3].id, // Cook
        name: 'Ana Martinez',
        hourlyRateCents: 2000, // $20.00
        status: EmployeeStatus.ACTIVE,
        hiredAt: new Date('2024-02-15'),
      },
    }),
    prisma.employee.create({
      data: {
        organizationId: org.id,
        locationId: location.id,
        jobCategoryId: categories[4].id, // Bartender
        name: 'David Lee',
        hourlyRateCents: 1900, // $19.00
        status: EmployeeStatus.ACTIVE,
        hiredAt: new Date('2024-01-08'),
      },
    }),
  ]);
  console.log(`Created ${employees.length} employees`);

  // Create a pay period
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 14); // 2 weeks ago
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13); // 14-day period

  const payPeriod = await prisma.payPeriod.create({
    data: {
      organizationId: org.id,
      locationId: location.id,
      startDate,
      endDate,
      status: PayPeriodStatus.ACTIVE,
    },
  });
  console.log(`Created pay period: ${startDate.toDateString()} - ${endDate.toDateString()}`);

  // Create sample daily entries
  const serverEmployees = employees.filter(e =>
    e.jobCategoryId === categories[0].id || e.jobCategoryId === categories[4].id
  );

  for (const server of serverEmployees) {
    for (let day = 0; day < 14; day++) {
      const entryDate = new Date(startDate);
      entryDate.setDate(startDate.getDate() + day);

      // Skip some random days (employees don't work every day)
      if (Math.random() > 0.7) continue;

      const salesCents = Math.floor(80000 + Math.random() * 120000); // $800-$2000
      const actualContribCents = Math.floor(salesCents * 0.0325); // 3.25%

      await prisma.dailyEntry.create({
        data: {
          payPeriodId: payPeriod.id,
          employeeId: server.id,
          date: entryDate,
          salesCents,
          calculatedContribCents: actualContribCents,
          actualContribCents,
          enteredById: manager.id,
        },
      });
    }
  }
  console.log('Created sample daily entries');

  console.log('\n=== Seed Complete ===');
  console.log(`Organization: ${org.name}`);
  console.log(`Admin login: admin@demo.tipsharepro.com / password123`);
  console.log(`Manager login: manager@demo.tipsharepro.com / password123`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
