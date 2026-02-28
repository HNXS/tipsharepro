/**
 * Sample data seeded into the database for new organizations.
 * Matches the frontend demo data so new users see a populated distribution table.
 */

import { Decimal } from '@prisma/client/runtime/library';

// Badge colors must match the frontend CATEGORY_COLOR_MAP hex values
// so that hexToCategoryColor() maps them to the correct category group.
// boh=#E85D04, foh=#8E44AD, bar=#35A0D2, support=#82B536
export const SAMPLE_JOB_CATEGORIES = [
  // BOH (Kitchen) — weight 3.00, hex #E85D04
  { name: 'Lead Cook',    weight: new Decimal(3.00), badgeColor: '#E85D04' },
  { name: 'Line Cook',    weight: new Decimal(3.00), badgeColor: '#E85D04' },
  { name: 'Pastry Chef',  weight: new Decimal(3.00), badgeColor: '#E85D04' },
  { name: 'Pantry Chef',  weight: new Decimal(3.00), badgeColor: '#E85D04' },
  // FOH (Non-Tipped) — weight 2.00, hex #8E44AD
  { name: 'Host/Hostess', weight: new Decimal(2.00), badgeColor: '#8E44AD' },
  { name: 'Busser',       weight: new Decimal(2.00), badgeColor: '#8E44AD' },
  { name: 'Cashier',      weight: new Decimal(2.00), badgeColor: '#8E44AD' },
  { name: 'Runner',       weight: new Decimal(2.00), badgeColor: '#8E44AD' },
  // Bar — weight 4.00, hex #35A0D2
  { name: 'Bartender',    weight: new Decimal(4.00), badgeColor: '#35A0D2' },
  { name: 'Barista',      weight: new Decimal(4.00), badgeColor: '#35A0D2' },
  { name: 'Bar Back',     weight: new Decimal(4.00), badgeColor: '#35A0D2' },
  // Support — weight 1.00, hex #82B536
  { name: 'Dishwasher',   weight: new Decimal(1.00), badgeColor: '#82B536' },
  { name: 'Prep Cook',    weight: new Decimal(1.00), badgeColor: '#82B536' },
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
