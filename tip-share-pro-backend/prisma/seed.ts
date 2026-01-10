/**
 * Database Seed Script
 *
 * Populates the database with demo data matching the frontend application.
 * This creates a complete demo environment with:
 * - Organization with settings
 * - Location
 * - Job categories with weights
 * - Employees
 * - Pay period with daily entries
 * - Calculated distributions
 */

import { PrismaClient, UserRole, EmployeeStatus, PayPeriodStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// Demo configuration matching frontend
const DEMO_CONFIG = {
  companyName: "Tom's Restaurant Group",
  contributionMethod: 'ALL_SALES',
  contributionRate: 3.25,
  payPeriodType: 'BIWEEKLY',
  estimatedMonthlySales: 80000,
};

// Demo user credentials (as per PRD)
const DEMO_CREDENTIALS = {
  email: 'demo@tipsharepro.com',
  password: 'demo123',
};

// Job categories matching frontend DEFAULT_JOB_CATEGORIES
const JOB_CATEGORIES = [
  { name: 'Server', weight: 3.0, badgeColor: '#35A0D2' },
  { name: 'Bartender', weight: 3.25, badgeColor: '#1A4B7C' },
  { name: 'Cook', weight: 2.5, badgeColor: '#F59E0B' },
  { name: 'Busser', weight: 2.0, badgeColor: '#82B536' },
  { name: 'Host', weight: 2.0, badgeColor: '#7C3AED' },
  { name: 'Dishwasher', weight: 1.5, badgeColor: '#6B7280' },
];

// Employees matching frontend DEFAULT_EMPLOYEES
const EMPLOYEES = [
  { name: 'Sarah Johnson', categoryName: 'Server', hourlyRateCents: 1800, hoursWorked: 72 },
  { name: 'Mike Chen', categoryName: 'Server', hourlyRateCents: 1750, hoursWorked: 68 },
  { name: 'Lisa Park', categoryName: 'Server', hourlyRateCents: 1600, hoursWorked: 64 },
  { name: 'Tom Wilson', categoryName: 'Bartender', hourlyRateCents: 1900, hoursWorked: 56 },
  { name: 'Juan Martinez', categoryName: 'Cook', hourlyRateCents: 2200, hoursWorked: 80 },
  { name: 'Amy Rodriguez', categoryName: 'Busser', hourlyRateCents: 1500, hoursWorked: 60 },
  { name: 'Dan Torres', categoryName: 'Host', hourlyRateCents: 1400, hoursWorked: 45 },
  { name: 'Katie Middleton', categoryName: 'Server', hourlyRateCents: 1650, hoursWorked: 52 },
];

async function main() {
  console.log('🌱 Seeding database with demo data...\n');

  // Clear existing data for clean seed
  console.log('Clearing existing data...');
  await prisma.distribution.deleteMany();
  await prisma.dailyEntry.deleteMany();
  await prisma.payPeriod.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.jobCategory.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.twoFactorCode.deleteMany();
  await prisma.user.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.location.deleteMany();
  await prisma.organization.deleteMany();
  console.log('✓ Cleared existing data\n');

  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: DEMO_CONFIG.companyName,
      subscriptionStatus: 'DEMO',
      trialEndsAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
      settings: {
        contributionMethod: DEMO_CONFIG.contributionMethod,
        contributionRate: DEMO_CONFIG.contributionRate,
        payPeriodType: DEMO_CONFIG.payPeriodType,
        estimatedMonthlySales: DEMO_CONFIG.estimatedMonthlySales,
        autoArchiveDays: 1,
        roundingMode: 'NEAREST',
      },
    },
  });
  console.log(`✓ Created organization: ${org.name}`);

  // Create location
  const location = await prisma.location.create({
    data: {
      organizationId: org.id,
      name: 'Downtown',
      number: '001',
      status: 'ACTIVE',
    },
  });
  console.log(`✓ Created location: ${location.name}`);

  // Create job categories
  const categoryMap: Record<string, string> = {};
  for (const cat of JOB_CATEGORIES) {
    const created = await prisma.jobCategory.create({
      data: {
        organizationId: org.id,
        name: cat.name,
        weight: cat.weight,
        badgeColor: cat.badgeColor,
      },
    });
    categoryMap[cat.name] = created.id;
  }
  console.log(`✓ Created ${JOB_CATEGORIES.length} job categories`);

  // Create demo user (primary demo login)
  const demoPasswordHash = await bcrypt.hash(DEMO_CREDENTIALS.password, 10);
  const demoUser = await prisma.user.create({
    data: {
      organizationId: org.id,
      email: DEMO_CREDENTIALS.email,
      passwordHash: demoPasswordHash,
      role: UserRole.ADMIN,
      twoFactorEnabled: false,
    },
  });
  console.log(`✓ Created demo user: ${demoUser.email}`);

  // Create additional admin user
  const adminPasswordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: {
      organizationId: org.id,
      email: 'admin@demo.tipsharepro.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      twoFactorEnabled: false,
    },
  });
  console.log(`✓ Created admin user: ${admin.email}`);

  // Create manager
  const manager = await prisma.user.create({
    data: {
      organizationId: org.id,
      locationId: location.id,
      email: 'manager@demo.tipsharepro.com',
      passwordHash: adminPasswordHash,
      role: UserRole.MANAGER,
      twoFactorEnabled: false,
    },
  });
  console.log(`✓ Created manager user: ${manager.email}`);

  // Create employees
  const employeeRecords = [];
  for (const emp of EMPLOYEES) {
    const created = await prisma.employee.create({
      data: {
        organizationId: org.id,
        locationId: location.id,
        jobCategoryId: categoryMap[emp.categoryName],
        name: emp.name,
        hourlyRateCents: emp.hourlyRateCents,
        status: EmployeeStatus.ACTIVE,
        hiredAt: new Date('2024-01-15'),
      },
    });
    employeeRecords.push({
      ...created,
      hoursWorked: emp.hoursWorked,
      weight: JOB_CATEGORIES.find(c => c.name === emp.categoryName)!.weight,
    });
  }
  console.log(`✓ Created ${employeeRecords.length} employees`);

  // Create pay period (current bi-weekly period)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysFromMonday = (dayOfWeek + 6) % 7; // Days since last Monday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysFromMonday - 7); // Last Monday - 1 week
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13); // 14-day period
  endDate.setHours(23, 59, 59, 999);

  // Calculate total pool: (Monthly Sales / 2) * Contribution Rate
  const projectedPool = (DEMO_CONFIG.estimatedMonthlySales / 2) * (DEMO_CONFIG.contributionRate / 100);
  const totalPoolCents = Math.round(projectedPool * 100);

  const payPeriod = await prisma.payPeriod.create({
    data: {
      organizationId: org.id,
      locationId: location.id,
      startDate,
      endDate,
      status: PayPeriodStatus.ACTIVE,
      totalPoolCents,
      calculatedAt: new Date(),
    },
  });
  console.log(`✓ Created pay period: ${startDate.toDateString()} - ${endDate.toDateString()}`);
  console.log(`  Pool amount: $${(totalPoolCents / 100).toFixed(2)}`);

  // Create daily entries for contributing employees (servers and bartenders)
  const contributingEmployees = employeeRecords.filter(e =>
    ['Server', 'Bartender'].includes(EMPLOYEES.find(emp => emp.name === e.name)?.categoryName || '')
  );

  let totalContributions = 0;
  for (const employee of contributingEmployees) {
    // Distribute hours across the pay period
    const daysWorked = Math.ceil(employee.hoursWorked / 8);
    const hoursPerDay = employee.hoursWorked / daysWorked;

    for (let day = 0; day < daysWorked; day++) {
      const entryDate = new Date(startDate);
      entryDate.setDate(startDate.getDate() + (day * 2)); // Every other day

      const dailySalesCents = Math.round((80000 / 14 / contributingEmployees.length) * 100); // Distribute daily sales
      const dailyContribCents = Math.round(dailySalesCents * DEMO_CONFIG.contributionRate / 100);
      totalContributions += dailyContribCents;

      await prisma.dailyEntry.create({
        data: {
          payPeriodId: payPeriod.id,
          employeeId: employee.id,
          date: entryDate,
          salesCents: dailySalesCents,
          calculatedContribCents: dailyContribCents,
          actualContribCents: dailyContribCents,
          enteredById: manager.id,
        },
      });
    }
  }
  console.log(`✓ Created daily entries for ${contributingEmployees.length} contributing employees`);

  // Calculate distributions
  // Basis = Hours × Rate × Weight (NEVER exposed to API/UI)
  const employeesWithBasis = employeeRecords.map(emp => {
    const rateDollars = emp.hourlyRateCents / 100;
    const basis = Math.round(emp.hoursWorked * rateDollars * emp.weight * 100); // Store in cents
    return {
      ...emp,
      basis,
    };
  });

  const totalBasis = employeesWithBasis.reduce((sum, emp) => sum + emp.basis, 0);

  // Calculate shares and apply rounding adjustment
  const distributions = employeesWithBasis.map(emp => {
    const percentage = totalBasis > 0 ? (emp.basis / totalBasis) : 0;
    const shareCents = Math.round(totalPoolCents * percentage);
    return {
      employeeId: emp.id,
      hoursWorked: emp.hoursWorked,
      rateAtTimeCents: emp.hourlyRateCents,
      weightAtTime: emp.weight,
      basis: emp.basis,
      percentage,
      shareCents,
      receivedCents: shareCents, // Will be adjusted
    };
  });

  // Adjust for rounding to match pool exactly
  const totalShareCents = distributions.reduce((sum, d) => sum + d.shareCents, 0);
  let diffCents = totalPoolCents - totalShareCents;

  if (diffCents !== 0) {
    // Sort by fractional error and adjust
    const sortedDist = [...distributions].sort((a, b) => {
      const errorA = (totalPoolCents * a.percentage) - a.shareCents;
      const errorB = (totalPoolCents * b.percentage) - b.shareCents;
      return diffCents > 0 ? (errorB - errorA) : (errorA - errorB);
    });

    for (let i = 0; diffCents !== 0 && i < sortedDist.length; i++) {
      const adjustment = diffCents > 0 ? 1 : -1;
      const idx = distributions.findIndex(d => d.employeeId === sortedDist[i].employeeId);
      distributions[idx].receivedCents += adjustment;
      diffCents -= adjustment;
    }
  }

  // Insert distribution records
  for (const dist of distributions) {
    await prisma.distribution.create({
      data: {
        payPeriodId: payPeriod.id,
        employeeId: dist.employeeId,
        hoursWorked: new Decimal(dist.hoursWorked),
        rateAtTimeCents: dist.rateAtTimeCents,
        weightAtTime: new Decimal(dist.weightAtTime),
        basis: dist.basis,
        percentage: new Decimal(dist.percentage),
        shareCents: dist.shareCents,
        receivedCents: dist.receivedCents,
        varianceCents: 0,
      },
    });
  }

  const verifyTotal = distributions.reduce((sum, d) => sum + d.receivedCents, 0);
  console.log(`✓ Created ${distributions.length} distribution records`);
  console.log(`  Total distributed: $${(verifyTotal / 100).toFixed(2)} (matches pool: ${verifyTotal === totalPoolCents})`);

  // Create audit log entry for the distribution
  await prisma.auditLog.create({
    data: {
      organizationId: org.id,
      userId: admin.id,
      action: 'DISTRIBUTION_CALCULATED',
      entityType: 'PayPeriod',
      entityId: payPeriod.id,
      afterValues: {
        totalPoolCents,
        employeeCount: distributions.length,
        calculatedAt: new Date().toISOString(),
      },
    },
  });
  console.log('✓ Created audit log entry');

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('                    SEED COMPLETE                              ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n📍 Organization: ${org.name}`);
  console.log(`📍 Location: ${location.name}`);
  console.log(`💰 Pool Amount: $${(totalPoolCents / 100).toFixed(2)}`);
  console.log(`👥 Employees: ${employeeRecords.length}`);
  console.log(`\n🔐 Login Credentials:`);
  console.log(`   Demo:    ${DEMO_CREDENTIALS.email} / ${DEMO_CREDENTIALS.password}`);
  console.log(`   Admin:   admin@demo.tipsharepro.com / password123`);
  console.log(`   Manager: manager@demo.tipsharepro.com / password123`);
  console.log('\n📊 Distribution Preview:');
  console.log('   ─────────────────────────────────────────────────────────────');

  for (const dist of distributions) {
    const emp = employeeRecords.find(e => e.id === dist.employeeId);
    const cat = EMPLOYEES.find(e => e.name === emp?.name)?.categoryName || 'Unknown';
    console.log(`   ${emp?.name.padEnd(18)} | ${cat.padEnd(10)} | ${dist.hoursWorked.toString().padStart(3)}h | $${(dist.receivedCents / 100).toFixed(2).padStart(7)} | ${(dist.percentage * 100).toFixed(2).padStart(5)}%`);
  }

  console.log('   ─────────────────────────────────────────────────────────────');
  console.log(`   ${'TOTAL'.padEnd(18)} |            | ${employeeRecords.reduce((s, e) => s + e.hoursWorked, 0).toString().padStart(3)}h | $${(verifyTotal / 100).toFixed(2).padStart(7)} | 100.00%`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
