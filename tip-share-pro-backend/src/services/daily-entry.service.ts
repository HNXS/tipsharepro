/**
 * Daily Entry Service
 *
 * Handles daily contribution entry business logic including:
 * - CRUD operations for daily entries
 * - Contribution calculation (salesCents × contributionRate)
 * - Running totals and summaries
 * - Date navigation
 */

import { PrismaClient, DailyEntry, Employee, PayPeriod } from '@prisma/client';
import { NotFoundError, ValidationError, CalculationError } from '../utils/errors';
import { logger } from '../utils/logger';

// ============================================================================
// Types
// ============================================================================

export interface DailyEntryWithEmployee extends DailyEntry {
  employee: Employee & {
    jobCategory: {
      id: string;
      name: string;
      badgeColor: string;
    };
  };
  enteredBy?: {
    id: string;
    email: string;
  } | null;
}

export interface DailyEntrySummary {
  totalSalesCents: number;
  totalCalculatedContribCents: number;
  totalActualContribCents: number;
  daysEntered: number;
  daysTotal: number;
}

export interface PayPeriodInfo {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface DailyEntryResponse {
  id: string;
  employeeId: string;
  employeeName: string;
  jobCategory: {
    id: string;
    name: string;
    badgeColor: string;
  };
  date: string;
  sales: number | null;           // Dollars for display
  calculatedContribution: number | null;  // Dollars for display
  actualContribution: number | null;      // Dollars for display
  enteredBy: string | null;
  updatedAt: string;
}

export interface DailyEntriesResult {
  payPeriod: PayPeriodInfo;
  entries: DailyEntryResponse[];
  summary: DailyEntrySummary;
}

export interface BulkUpsertEntry {
  employeeId: string;
  salesCents: number | null;
  actualContribCents: number | null;
}

export interface BulkUpsertResult {
  created: number;
  updated: number;
  entries: DailyEntryResponse[];
  runningTotals: DailyEntrySummary;
}

export interface DateNavigationInfo {
  currentDate: string;
  previousDate: string | null;
  nextDate: string | null;
  isFirstDay: boolean;
  isLastDay: boolean;
  dayNumber: number;
  totalDays: number;
}

// ============================================================================
// Service Class
// ============================================================================

export class DailyEntryService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Get organization settings including contribution rate.
   */
  private async getContributionRate(organizationId: string): Promise<number> {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { settings: true },
    });

    if (!org) {
      throw new NotFoundError('Organization', organizationId);
    }

    const settings = org.settings as { contributionRate?: number } | null;
    return settings?.contributionRate ?? 3.25; // Default 3.25%
  }

  /**
   * Calculate contribution based on sales and rate.
   *
   * @param salesCents - Sales amount in cents
   * @param contributionRate - Rate as percentage (e.g., 3.25)
   * @returns Calculated contribution in cents
   */
  private calculateContribution(salesCents: number, contributionRate: number): number {
    // contributionRate is a percentage (e.g., 3.25 means 3.25%)
    // Formula: salesCents × (rate / 100)
    const contribution = Math.round(salesCents * (contributionRate / 100));
    return contribution;
  }

  /**
   * Validate that a pay period exists and is not archived.
   */
  private async validatePayPeriod(payPeriodId: string): Promise<PayPeriod & { organization: { id: string } }> {
    const payPeriod = await this.prisma.payPeriod.findUnique({
      where: { id: payPeriodId },
      include: { organization: { select: { id: true } } },
    });

    if (!payPeriod) {
      throw new NotFoundError('PayPeriod', payPeriodId);
    }

    if (payPeriod.status === 'ARCHIVED') {
      throw new ValidationError('Cannot modify entries in an archived pay period');
    }

    return payPeriod;
  }

  /**
   * Validate that a date falls within the pay period.
   */
  private validateDateInPeriod(date: Date, payPeriod: PayPeriod): void {
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    const startDate = new Date(payPeriod.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(payPeriod.endDate);
    endDate.setHours(23, 59, 59, 999);

    if (entryDate < startDate || entryDate > endDate) {
      throw new ValidationError(
        `Date ${entryDate.toISOString().split('T')[0]} is outside pay period ` +
        `(${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]})`
      );
    }
  }

  /**
   * Format a DailyEntry for API response.
   */
  private formatEntryResponse(entry: DailyEntryWithEmployee): DailyEntryResponse {
    return {
      id: entry.id,
      employeeId: entry.employeeId,
      employeeName: entry.employee.name,
      jobCategory: {
        id: entry.employee.jobCategory.id,
        name: entry.employee.jobCategory.name,
        badgeColor: entry.employee.jobCategory.badgeColor,
      },
      date: entry.date.toISOString().split('T')[0],
      sales: entry.salesCents !== null ? entry.salesCents / 100 : null,
      calculatedContribution: entry.calculatedContribCents !== null
        ? entry.calculatedContribCents / 100
        : null,
      actualContribution: entry.actualContribCents !== null
        ? entry.actualContribCents / 100
        : null,
      enteredBy: entry.enteredBy?.email || null,
      updatedAt: entry.updatedAt.toISOString(),
    };
  }

  /**
   * Calculate summary statistics for entries.
   */
  private calculateSummary(
    entries: Array<{ salesCents: number | null; calculatedContribCents: number | null; actualContribCents: number | null }>,
    totalDays: number
  ): DailyEntrySummary {
    const uniqueDates = new Set<string>();
    let totalSalesCents = 0;
    let totalCalculatedContribCents = 0;
    let totalActualContribCents = 0;

    for (const entry of entries) {
      totalSalesCents += entry.salesCents || 0;
      totalCalculatedContribCents += entry.calculatedContribCents || 0;
      totalActualContribCents += entry.actualContribCents || 0;
    }

    return {
      totalSalesCents,
      totalCalculatedContribCents,
      totalActualContribCents,
      daysEntered: entries.length > 0 ? Math.ceil(entries.length / 10) : 0, // Rough estimate
      daysTotal: totalDays,
    };
  }

  /**
   * Get all entries for a pay period.
   */
  async getEntriesForPeriod(
    payPeriodId: string,
    options?: {
      date?: string;
      employeeId?: string;
    }
  ): Promise<DailyEntriesResult> {
    const payPeriod = await this.prisma.payPeriod.findUnique({
      where: { id: payPeriodId },
      include: {
        dailyEntries: {
          where: {
            ...(options?.date && { date: new Date(options.date) }),
            ...(options?.employeeId && { employeeId: options.employeeId }),
          },
          include: {
            employee: {
              include: {
                jobCategory: {
                  select: { id: true, name: true, badgeColor: true },
                },
              },
            },
            enteredBy: {
              select: { id: true, email: true },
            },
          },
          orderBy: [
            { date: 'asc' },
            { employee: { name: 'asc' } },
          ],
        },
      },
    });

    if (!payPeriod) {
      throw new NotFoundError('PayPeriod', payPeriodId);
    }

    // Calculate total days in period
    const startDate = new Date(payPeriod.startDate);
    const endDate = new Date(payPeriod.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Count unique dates with entries
    const uniqueDates = new Set(
      payPeriod.dailyEntries.map(e => e.date.toISOString().split('T')[0])
    );

    const entries = payPeriod.dailyEntries.map(entry =>
      this.formatEntryResponse(entry as DailyEntryWithEmployee)
    );

    // Calculate summary
    const summary: DailyEntrySummary = {
      totalSalesCents: payPeriod.dailyEntries.reduce((sum, e) => sum + (e.salesCents || 0), 0),
      totalCalculatedContribCents: payPeriod.dailyEntries.reduce((sum, e) => sum + (e.calculatedContribCents || 0), 0),
      totalActualContribCents: payPeriod.dailyEntries.reduce((sum, e) => sum + (e.actualContribCents || 0), 0),
      daysEntered: uniqueDates.size,
      daysTotal: totalDays,
    };

    return {
      payPeriod: {
        id: payPeriod.id,
        startDate: payPeriod.startDate.toISOString().split('T')[0],
        endDate: payPeriod.endDate.toISOString().split('T')[0],
        status: payPeriod.status,
      },
      entries,
      summary,
    };
  }

  /**
   * Get entries for a specific date within a pay period.
   */
  async getEntriesForDate(
    payPeriodId: string,
    dateString: string
  ): Promise<{
    payPeriod: PayPeriodInfo;
    date: string;
    entries: DailyEntryResponse[];
    navigation: DateNavigationInfo;
    runningTotals: DailyEntrySummary;
  }> {
    const payPeriod = await this.validatePayPeriod(payPeriodId);

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    this.validateDateInPeriod(date, payPeriod);

    // Get entries for this date
    const entries = await this.prisma.dailyEntry.findMany({
      where: {
        payPeriodId,
        date,
      },
      include: {
        employee: {
          include: {
            jobCategory: {
              select: { id: true, name: true, badgeColor: true },
            },
          },
        },
        enteredBy: {
          select: { id: true, email: true },
        },
      },
      orderBy: { employee: { name: 'asc' } },
    });

    // Get all entries for running totals
    const allEntries = await this.prisma.dailyEntry.findMany({
      where: { payPeriodId },
      select: { salesCents: true, calculatedContribCents: true, actualContribCents: true, date: true },
    });

    // Calculate navigation info
    const startDate = new Date(payPeriod.startDate);
    const endDate = new Date(payPeriod.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dayNumber = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate previous and next dates
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const navigation: DateNavigationInfo = {
      currentDate: dateString,
      previousDate: prevDate >= startDate ? prevDate.toISOString().split('T')[0] : null,
      nextDate: nextDate <= endDate ? nextDate.toISOString().split('T')[0] : null,
      isFirstDay: date.getTime() === startDate.getTime(),
      isLastDay: date.getTime() === endDate.getTime(),
      dayNumber,
      totalDays,
    };

    // Calculate running totals
    const uniqueDates = new Set(allEntries.map(e => e.date.toISOString().split('T')[0]));
    const runningTotals: DailyEntrySummary = {
      totalSalesCents: allEntries.reduce((sum, e) => sum + (e.salesCents || 0), 0),
      totalCalculatedContribCents: allEntries.reduce((sum, e) => sum + (e.calculatedContribCents || 0), 0),
      totalActualContribCents: allEntries.reduce((sum, e) => sum + (e.actualContribCents || 0), 0),
      daysEntered: uniqueDates.size,
      daysTotal: totalDays,
    };

    return {
      payPeriod: {
        id: payPeriod.id,
        startDate: payPeriod.startDate.toISOString().split('T')[0],
        endDate: payPeriod.endDate.toISOString().split('T')[0],
        status: payPeriod.status,
      },
      date: dateString,
      entries: entries.map(e => this.formatEntryResponse(e as DailyEntryWithEmployee)),
      navigation,
      runningTotals,
    };
  }

  /**
   * Bulk upsert daily entries for a specific date.
   *
   * This is the main data entry endpoint that:
   * 1. Validates the pay period and date
   * 2. Calculates contributions based on sales
   * 3. Allows overriding calculated contributions with actual amounts
   * 4. Returns updated running totals
   */
  async bulkUpsertEntries(
    payPeriodId: string,
    dateString: string,
    entries: BulkUpsertEntry[],
    enteredById?: string
  ): Promise<BulkUpsertResult> {
    const payPeriod = await this.validatePayPeriod(payPeriodId);

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    this.validateDateInPeriod(date, payPeriod);

    // Get contribution rate
    const contributionRate = await this.getContributionRate(payPeriod.organization.id);

    logger.info(
      { payPeriodId, date: dateString, entryCount: entries.length, contributionRate },
      'Bulk upserting daily entries'
    );

    // Validate all employees exist and are active
    const employeeIds = entries.map(e => e.employeeId);
    const employees = await this.prisma.employee.findMany({
      where: {
        id: { in: employeeIds },
        status: 'ACTIVE',
      },
      select: { id: true },
    });

    const existingEmployeeIds = new Set(employees.map(e => e.id));
    const invalidEmployees = employeeIds.filter(id => !existingEmployeeIds.has(id));

    if (invalidEmployees.length > 0) {
      throw new ValidationError(
        `Invalid or inactive employee IDs: ${invalidEmployees.join(', ')}`,
        invalidEmployees.map(id => ({ field: 'employeeId', message: `Employee ${id} not found or inactive` }))
      );
    }

    // Process entries
    let created = 0;
    let updated = 0;
    const processedEntries: DailyEntryWithEmployee[] = [];

    for (const entry of entries) {
      // Calculate contribution from sales if provided
      const calculatedContribCents = entry.salesCents !== null
        ? this.calculateContribution(entry.salesCents, contributionRate)
        : null;

      // Use actual contribution if provided, otherwise use calculated
      const actualContribCents = entry.actualContribCents ?? calculatedContribCents;

      // Upsert the entry
      const result = await this.prisma.dailyEntry.upsert({
        where: {
          payPeriodId_employeeId_date: {
            payPeriodId,
            employeeId: entry.employeeId,
            date,
          },
        },
        create: {
          payPeriodId,
          employeeId: entry.employeeId,
          date,
          salesCents: entry.salesCents,
          calculatedContribCents,
          actualContribCents,
          enteredById,
        },
        update: {
          salesCents: entry.salesCents,
          calculatedContribCents,
          actualContribCents,
          enteredById,
        },
        include: {
          employee: {
            include: {
              jobCategory: {
                select: { id: true, name: true, badgeColor: true },
              },
            },
          },
          enteredBy: {
            select: { id: true, email: true },
          },
        },
      });

      // Track if this was a create or update
      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++;
      } else {
        updated++;
      }

      processedEntries.push(result as DailyEntryWithEmployee);
    }

    // Get running totals for the entire period
    const allEntries = await this.prisma.dailyEntry.findMany({
      where: { payPeriodId },
      select: { salesCents: true, calculatedContribCents: true, actualContribCents: true, date: true },
    });

    const startDate = new Date(payPeriod.startDate);
    const endDate = new Date(payPeriod.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const uniqueDates = new Set(allEntries.map(e => e.date.toISOString().split('T')[0]));

    const runningTotals: DailyEntrySummary = {
      totalSalesCents: allEntries.reduce((sum, e) => sum + (e.salesCents || 0), 0),
      totalCalculatedContribCents: allEntries.reduce((sum, e) => sum + (e.calculatedContribCents || 0), 0),
      totalActualContribCents: allEntries.reduce((sum, e) => sum + (e.actualContribCents || 0), 0),
      daysEntered: uniqueDates.size,
      daysTotal: totalDays,
    };

    logger.info(
      { payPeriodId, created, updated, totalSalesCents: runningTotals.totalSalesCents },
      'Bulk upsert completed'
    );

    return {
      created,
      updated,
      entries: processedEntries.map(e => this.formatEntryResponse(e)),
      runningTotals,
    };
  }

  /**
   * Delete a single daily entry.
   */
  async deleteEntry(entryId: string): Promise<{ success: boolean; deletedEntry: DailyEntryResponse }> {
    // Get the entry first to check it exists
    const entry = await this.prisma.dailyEntry.findUnique({
      where: { id: entryId },
      include: {
        payPeriod: true,
        employee: {
          include: {
            jobCategory: {
              select: { id: true, name: true, badgeColor: true },
            },
          },
        },
        enteredBy: {
          select: { id: true, email: true },
        },
      },
    });

    if (!entry) {
      throw new NotFoundError('DailyEntry', entryId);
    }

    if (entry.payPeriod.status === 'ARCHIVED') {
      throw new ValidationError('Cannot delete entries from an archived pay period');
    }

    // Delete the entry
    await this.prisma.dailyEntry.delete({
      where: { id: entryId },
    });

    logger.info({ entryId, payPeriodId: entry.payPeriodId }, 'Daily entry deleted');

    return {
      success: true,
      deletedEntry: this.formatEntryResponse(entry as DailyEntryWithEmployee),
    };
  }

  /**
   * Get contributing employees for a date (servers/bartenders who have sales).
   * This helps populate the daily entry form.
   */
  async getContributingEmployeesForDate(
    payPeriodId: string,
    dateString: string
  ): Promise<{
    employees: Array<{
      id: string;
      name: string;
      jobCategory: { id: string; name: string; badgeColor: string };
      existingEntry: DailyEntryResponse | null;
    }>;
  }> {
    const payPeriod = await this.validatePayPeriod(payPeriodId);

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    this.validateDateInPeriod(date, payPeriod);

    // Get all active employees for the location
    const employees = await this.prisma.employee.findMany({
      where: {
        locationId: payPeriod.locationId,
        status: 'ACTIVE',
      },
      include: {
        jobCategory: {
          select: { id: true, name: true, badgeColor: true },
        },
        dailyEntries: {
          where: {
            payPeriodId,
            date,
          },
          include: {
            enteredBy: {
              select: { id: true, email: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return {
      employees: employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        jobCategory: {
          id: emp.jobCategory.id,
          name: emp.jobCategory.name,
          badgeColor: emp.jobCategory.badgeColor,
        },
        existingEntry: emp.dailyEntries.length > 0
          ? this.formatEntryResponse({
              ...emp.dailyEntries[0],
              employee: {
                ...emp,
                jobCategory: emp.jobCategory,
              },
            } as DailyEntryWithEmployee)
          : null,
      })),
    };
  }
}

// Export singleton factory
export function createDailyEntryService(prisma: PrismaClient): DailyEntryService {
  return new DailyEntryService(prisma);
}
