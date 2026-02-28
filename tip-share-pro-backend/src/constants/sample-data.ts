/**
 * Sample data seeded into the database for new organizations.
 * Matches the frontend demo data so new users see a populated distribution table.
 */

import { Decimal } from '@prisma/client/runtime/library';

// Badge colors from job-category.service.ts BADGE_COLORS map
export const SAMPLE_JOB_CATEGORIES = [
  // BOH (Kitchen) — weight 3.00
  { name: 'Lead Cook',    weight: new Decimal(3.00), badgeColor: '#DC2626' },
  { name: 'Line Cook',    weight: new Decimal(3.00), badgeColor: '#EA580C' },
  { name: 'Pastry Chef',  weight: new Decimal(3.00), badgeColor: '#D97706' },
  { name: 'Pantry Chef',  weight: new Decimal(3.00), badgeColor: '#65A30D' },
  // FOH (Non-Tipped) — weight 2.00
  { name: 'Host/Hostess', weight: new Decimal(2.00), badgeColor: '#0284C7' },
  { name: 'Busser',       weight: new Decimal(2.00), badgeColor: '#7C3AED' },
  { name: 'Cashier',      weight: new Decimal(2.00), badgeColor: '#2563EB' },
  { name: 'Runner',       weight: new Decimal(2.00), badgeColor: '#4F46E5' },
  // Bar — weight 4.00
  { name: 'Bartender',    weight: new Decimal(4.00), badgeColor: '#C026D3' },
  { name: 'Barista',      weight: new Decimal(4.00), badgeColor: '#9333EA' },
  { name: 'Bar Back',     weight: new Decimal(4.00), badgeColor: '#E11D48' },
  // Support — weight 1.00
  { name: 'Dishwasher',   weight: new Decimal(1.00), badgeColor: '#64748B' },
  { name: 'Prep Cook',    weight: new Decimal(1.00), badgeColor: '#CA8A04' },
];

// Sample employees — reference category by name, resolved to ID during seeding
// hourlyRateCents stored as cents (e.g., 2200 = $22.00)
export const SAMPLE_EMPLOYEES: Array<{
  name: string;
  jobCategoryName: string;
  hourlyRateCents: number;
}> = [
  { name: 'Maria Santos',     jobCategoryName: 'Line Cook',     hourlyRateCents: 2200 },
  { name: 'James Wilson',     jobCategoryName: 'Bartender',     hourlyRateCents: 2400 },
  { name: 'Sarah Johnson',    jobCategoryName: 'Host/Hostess',  hourlyRateCents: 1600 },
  { name: 'Mike Chen',        jobCategoryName: 'Busser',        hourlyRateCents: 1550 },
  { name: 'Lisa Park',        jobCategoryName: 'Dishwasher',    hourlyRateCents: 1600 },
  { name: 'Tom Rodriguez',    jobCategoryName: 'Line Cook',     hourlyRateCents: 2000 },
  { name: 'Amy Martinez',     jobCategoryName: 'Host/Hostess',  hourlyRateCents: 1500 },
  { name: 'Dan Torres',       jobCategoryName: 'Busser',        hourlyRateCents: 1500 },
  { name: 'Katie Middleton',  jobCategoryName: 'Bartender',     hourlyRateCents: 2200 },
  { name: 'Chris Lee',        jobCategoryName: 'Dishwasher',    hourlyRateCents: 1550 },
];

// Default organization settings
export const SAMPLE_ORG_SETTINGS = {
  contributionMethod: 'ALL_SALES' as const,
  contributionRate: 3.25,
  payPeriodType: 'BIWEEKLY' as const,
  estimatedMonthlySales: 100000,
  autoArchiveDays: 1,
  roundingMode: 'NEAREST' as const,
};
