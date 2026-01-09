/**
 * Tip Calculation Engine Service
 *
 * This is the CORE of Tip Share Pro - the proprietary algorithm that
 * calculates fair tip distribution based on Hours × Rate × Weight.
 *
 * CRITICAL SECURITY NOTE:
 * The 'basis' value (Hours × Rate × Weight) must NEVER be exposed to
 * API responses or the client. It is stored for audit purposes only.
 */

import Decimal from 'decimal.js';
import { PrismaClient, PayPeriod, Employee, JobCategory, Distribution } from '@prisma/client';
import {
  EmployeeCalculationInput,
  EmployeeDistributionResult,
  InternalDistributionResult,
  PoolDistributionResult,
} from '../types/index';
import { CalculationError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

// Configure Decimal.js for financial precision
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

/**
 * Tip Calculation Engine
 *
 * Implements the Hours × Rate × Weight algorithm for fair tip distribution.
 */
export class TipCalculationService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Calculate the pool distribution for a pay period.
   *
   * Algorithm:
   * 1. Calculate basis for each employee: hours × rate × weight
   * 2. Sum all basis values to get totalBasis
   * 3. Calculate percentage for each: basis / totalBasis
   * 4. Calculate share for each: totalPool × percentage
   * 5. Apply rounding reconciliation to ensure total matches pool
   *
   * @param payPeriodId - The pay period to calculate
   * @param employeeHours - Map of employee IDs to hours worked
   * @returns Distribution results (without exposing basis)
   */
  async calculateDistribution(
    payPeriodId: string,
    employeeHours: Map<string, number>
  ): Promise<PoolDistributionResult> {
    // 1. Fetch pay period and validate
    const payPeriod = await this.prisma.payPeriod.findUnique({
      where: { id: payPeriodId },
      include: {
        location: true,
        dailyEntries: {
          include: {
            employee: {
              include: {
                jobCategory: true,
                location: true,
              },
            },
          },
        },
      },
    });

    if (!payPeriod) {
      throw new NotFoundError('PayPeriod', payPeriodId);
    }

    if (payPeriod.status === 'ARCHIVED') {
      throw new CalculationError('Cannot recalculate an archived pay period');
    }

    // 2. Calculate total pool from actual contributions
    const totalPoolCents = this.calculateTotalPool(payPeriod.dailyEntries);

    if (totalPoolCents === 0) {
      throw new CalculationError('Total pool is zero - no contributions recorded');
    }

    // 3. Get unique employees who participated
    const employeeMap = this.buildEmployeeMap(payPeriod.dailyEntries);

    // 4. Build calculation inputs
    const calculationInputs = this.buildCalculationInputs(
      employeeMap,
      employeeHours
    );

    if (calculationInputs.length === 0) {
      throw new CalculationError('No employees with hours found for calculation');
    }

    // 5. Run the core calculation
    const internalResults = this.runCalculation(calculationInputs, totalPoolCents);

    // 6. Apply rounding reconciliation
    const reconciledResults = this.reconcileRounding(internalResults, totalPoolCents);

    // 7. Store results in database
    await this.storeDistributionResults(payPeriodId, reconciledResults, totalPoolCents);

    // 8. Build and return public response (without basis)
    return this.buildPublicResponse(payPeriod, reconciledResults, totalPoolCents);
  }

  /**
   * Calculate total pool from all actual contributions.
   */
  private calculateTotalPool(
    dailyEntries: Array<{ actualContribCents: number | null }>
  ): number {
    return dailyEntries.reduce((sum, entry) => {
      return sum + (entry.actualContribCents || 0);
    }, 0);
  }

  /**
   * Build a map of unique employees from daily entries.
   */
  private buildEmployeeMap(
    dailyEntries: Array<{
      employee: Employee & {
        jobCategory: JobCategory;
        location: { id: string; name: string };
      };
    }>
  ): Map<string, EmployeeCalculationInput> {
    const employeeMap = new Map<string, EmployeeCalculationInput>();

    for (const entry of dailyEntries) {
      if (!employeeMap.has(entry.employee.id)) {
        employeeMap.set(entry.employee.id, {
          employeeId: entry.employee.id,
          employeeName: entry.employee.name,
          locationId: entry.employee.location.id,
          locationName: entry.employee.location.name,
          jobCategoryId: entry.employee.jobCategory.id,
          jobCategoryName: entry.employee.jobCategory.name,
          badgeColor: entry.employee.jobCategory.badgeColor,
          hoursWorked: 0, // Will be set from employeeHours
          hourlyRateCents: entry.employee.hourlyRateCents,
          weight: Number(entry.employee.jobCategory.weight),
        });
      }
    }

    return employeeMap;
  }

  /**
   * Build calculation inputs by merging employee data with hours worked.
   */
  private buildCalculationInputs(
    employeeMap: Map<string, EmployeeCalculationInput>,
    employeeHours: Map<string, number>
  ): EmployeeCalculationInput[] {
    const inputs: EmployeeCalculationInput[] = [];

    for (const [employeeId, employee] of employeeMap) {
      const hours = employeeHours.get(employeeId);
      if (hours !== undefined && hours > 0) {
        inputs.push({
          ...employee,
          hoursWorked: hours,
        });
      }
    }

    return inputs;
  }

  /**
   * THE CORE ALGORITHM
   *
   * Calculates the proprietary Hours × Rate × Weight distribution.
   * The 'basis' value is calculated here but marked as internal.
   */
  private runCalculation(
    employees: EmployeeCalculationInput[],
    totalPoolCents: number
  ): InternalDistributionResult[] {
    // Step 1: Calculate basis for each employee
    const resultsWithBasis = employees.map(emp => {
      // PROPRIETARY FORMULA: basis = hours × rate × weight
      const basis = new Decimal(emp.hoursWorked)
        .times(emp.hourlyRateCents)
        .times(emp.weight)
        .toNumber();

      return {
        ...emp,
        _basis: basis,
      };
    });

    // Step 2: Calculate total basis
    const totalBasis = resultsWithBasis.reduce((sum, emp) => sum + emp._basis, 0);

    if (totalBasis === 0) {
      throw new CalculationError('Total basis is zero - cannot calculate distribution');
    }

    // Step 3 & 4: Calculate percentage and share for each employee
    return resultsWithBasis.map(emp => {
      const percentage = new Decimal(emp._basis).dividedBy(totalBasis);
      const shareCents = percentage.times(totalPoolCents);

      // Convert to whole dollars (cents) for received amount
      const receivedCents = shareCents.round().toNumber();

      return {
        employeeId: emp.employeeId,
        employeeName: emp.employeeName,
        locationId: emp.locationId,
        locationName: emp.locationName,
        jobCategory: {
          id: emp.jobCategoryId,
          name: emp.jobCategoryName,
          badgeColor: emp.badgeColor,
        },
        hoursWorked: emp.hoursWorked,
        hourlyRate: emp.hourlyRateCents / 100, // Convert to dollars for display
        percentage: percentage.times(100).toDecimalPlaces(2).toNumber(), // 0-100%
        shareCents: shareCents.toDecimalPlaces(2).toNumber(),
        receivedCents: receivedCents,
        // Internal fields (never exposed via API)
        _basis: emp._basis,
        weightAtTime: emp.weight,
        rateAtTimeCents: emp.hourlyRateCents,
      };
    });
  }

  /**
   * Reconcile rounding to ensure total distributed exactly matches pool.
   *
   * Strategy: Adjust the largest share to absorb any rounding difference.
   * This ensures the total is always exact while minimizing impact on any
   * individual share.
   */
  private reconcileRounding(
    results: InternalDistributionResult[],
    totalPoolCents: number
  ): InternalDistributionResult[] {
    // Calculate current total of received amounts
    const currentTotal = results.reduce((sum, r) => sum + r.receivedCents, 0);
    const difference = totalPoolCents - currentTotal;

    if (difference === 0) {
      return results; // Perfect match, no reconciliation needed
    }

    logger.debug({ difference, totalPoolCents, currentTotal }, 'Reconciling rounding difference');

    // Find the employee with the largest share to absorb the difference
    // This minimizes the percentage impact
    let largestIndex = 0;
    let largestShare = 0;

    for (let i = 0; i < results.length; i++) {
      if (results[i].receivedCents > largestShare) {
        largestShare = results[i].receivedCents;
        largestIndex = i;
      }
    }

    // Apply the adjustment
    const adjusted = [...results];
    adjusted[largestIndex] = {
      ...adjusted[largestIndex],
      receivedCents: adjusted[largestIndex].receivedCents + difference,
    };

    // Verify the reconciliation
    const newTotal = adjusted.reduce((sum, r) => sum + r.receivedCents, 0);
    if (newTotal !== totalPoolCents) {
      throw new CalculationError(
        `Rounding reconciliation failed: expected ${totalPoolCents}, got ${newTotal}`
      );
    }

    return adjusted;
  }

  /**
   * Store distribution results in the database.
   */
  private async storeDistributionResults(
    payPeriodId: string,
    results: InternalDistributionResult[],
    totalPoolCents: number
  ): Promise<void> {
    // Use a transaction to ensure atomic updates
    await this.prisma.$transaction(async (tx) => {
      // Delete any existing distributions for this period
      await tx.distribution.deleteMany({
        where: { payPeriodId },
      });

      // Create new distribution records
      await tx.distribution.createMany({
        data: results.map(r => ({
          payPeriodId,
          employeeId: r.employeeId,
          hoursWorked: r.hoursWorked,
          rateAtTimeCents: r.rateAtTimeCents,
          weightAtTime: r.weightAtTime,
          basis: r._basis, // Stored for audit, never exposed
          percentage: r.percentage / 100, // Store as decimal (0.1523 not 15.23)
          shareCents: Math.round(r.shareCents),
          receivedCents: r.receivedCents,
          varianceCents: 0,
        })),
      });

      // Update pay period with calculation timestamp and total
      await tx.payPeriod.update({
        where: { id: payPeriodId },
        data: {
          totalPoolCents,
          calculatedAt: new Date(),
          status: 'ACTIVE',
        },
      });
    });

    logger.info(
      { payPeriodId, employeeCount: results.length, totalPoolCents },
      'Distribution calculated and stored'
    );
  }

  /**
   * Build the public response (without exposing basis).
   */
  private buildPublicResponse(
    payPeriod: PayPeriod,
    results: InternalDistributionResult[],
    totalPoolCents: number
  ): PoolDistributionResult {
    // Strip internal fields from results
    const publicResults: EmployeeDistributionResult[] = results.map(
      ({ _basis, weightAtTime, rateAtTimeCents, ...publicFields }) => publicFields
    );

    const totalHours = results.reduce((sum, r) => sum + r.hoursWorked, 0);
    const distributedCents = results.reduce((sum, r) => sum + r.receivedCents, 0);

    return {
      payPeriod: {
        id: payPeriod.id,
        startDate: payPeriod.startDate.toISOString().split('T')[0],
        endDate: payPeriod.endDate.toISOString().split('T')[0],
        status: payPeriod.status,
      },
      distribution: publicResults,
      summary: {
        totalParticipants: results.length,
        totalHours: Math.round(totalHours * 100) / 100,
        totalPoolCents,
        distributedCents,
        varianceCents: totalPoolCents - distributedCents, // Should be 0
      },
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get existing distribution for a pay period.
   */
  async getDistribution(payPeriodId: string): Promise<PoolDistributionResult | null> {
    const payPeriod = await this.prisma.payPeriod.findUnique({
      where: { id: payPeriodId },
      include: {
        distributions: {
          include: {
            employee: {
              include: {
                jobCategory: true,
                location: true,
              },
            },
          },
        },
      },
    });

    if (!payPeriod || payPeriod.distributions.length === 0) {
      return null;
    }

    const publicResults: EmployeeDistributionResult[] = payPeriod.distributions.map(d => ({
      employeeId: d.employeeId,
      employeeName: d.employee.name,
      locationId: d.employee.locationId,
      locationName: d.employee.location.name,
      jobCategory: {
        id: d.employee.jobCategoryId,
        name: d.employee.jobCategory.name,
        badgeColor: d.employee.jobCategory.badgeColor,
      },
      hoursWorked: Number(d.hoursWorked),
      hourlyRate: d.rateAtTimeCents / 100,
      percentage: Number(d.percentage) * 100, // Convert to 0-100 format
      shareCents: d.shareCents,
      receivedCents: d.receivedCents,
    }));

    const totalHours = publicResults.reduce((sum, r) => sum + r.hoursWorked, 0);
    const distributedCents = publicResults.reduce((sum, r) => sum + r.receivedCents, 0);

    return {
      payPeriod: {
        id: payPeriod.id,
        startDate: payPeriod.startDate.toISOString().split('T')[0],
        endDate: payPeriod.endDate.toISOString().split('T')[0],
        status: payPeriod.status,
      },
      distribution: publicResults,
      summary: {
        totalParticipants: publicResults.length,
        totalHours: Math.round(totalHours * 100) / 100,
        totalPoolCents: payPeriod.totalPoolCents || 0,
        distributedCents,
        varianceCents: (payPeriod.totalPoolCents || 0) - distributedCents,
      },
      calculatedAt: payPeriod.calculatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}

/**
 * Pure calculation function for testing and sandbox mode.
 * Does not interact with the database.
 *
 * @param employees - Array of employee calculation inputs
 * @param totalPoolCents - Total tip pool in cents
 * @returns Distribution results (without basis)
 */
export function calculatePoolDistribution(
  employees: EmployeeCalculationInput[],
  totalPoolCents: number
): EmployeeDistributionResult[] {
  if (employees.length === 0) {
    return [];
  }

  if (totalPoolCents <= 0) {
    return employees.map(emp => ({
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      locationId: emp.locationId,
      locationName: emp.locationName,
      jobCategory: {
        id: emp.jobCategoryId,
        name: emp.jobCategoryName,
        badgeColor: emp.badgeColor,
      },
      hoursWorked: emp.hoursWorked,
      hourlyRate: emp.hourlyRateCents / 100,
      percentage: 0,
      shareCents: 0,
      receivedCents: 0,
    }));
  }

  // Filter out employees with 0 or negative hours
  const validEmployees = employees.filter(emp => emp.hoursWorked > 0);

  if (validEmployees.length === 0) {
    return employees.map(emp => ({
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      locationId: emp.locationId,
      locationName: emp.locationName,
      jobCategory: {
        id: emp.jobCategoryId,
        name: emp.jobCategoryName,
        badgeColor: emp.badgeColor,
      },
      hoursWorked: emp.hoursWorked,
      hourlyRate: emp.hourlyRateCents / 100,
      percentage: 0,
      shareCents: 0,
      receivedCents: 0,
    }));
  }

  // Calculate basis for each employee (NEVER EXPOSE THIS)
  const withBasis = validEmployees.map(emp => {
    const basis = new Decimal(emp.hoursWorked)
      .times(emp.hourlyRateCents)
      .times(emp.weight)
      .toNumber();
    return { emp, basis };
  });

  // Calculate total basis
  const totalBasis = withBasis.reduce((sum, item) => sum + item.basis, 0);

  // Calculate share for each
  const results = withBasis.map(({ emp, basis }) => {
    const percentage = new Decimal(basis).dividedBy(totalBasis);
    const shareCents = percentage.times(totalPoolCents);
    const receivedCents = shareCents.round().toNumber();

    return {
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      locationId: emp.locationId,
      locationName: emp.locationName,
      jobCategory: {
        id: emp.jobCategoryId,
        name: emp.jobCategoryName,
        badgeColor: emp.badgeColor,
      },
      hoursWorked: emp.hoursWorked,
      hourlyRate: emp.hourlyRateCents / 100,
      percentage: percentage.times(100).toDecimalPlaces(2).toNumber(),
      shareCents: shareCents.toDecimalPlaces(2).toNumber(),
      receivedCents,
    };
  });

  // Reconcile rounding
  const currentTotal = results.reduce((sum, r) => sum + r.receivedCents, 0);
  const difference = totalPoolCents - currentTotal;

  if (difference !== 0 && results.length > 0) {
    // Find largest share to absorb difference
    let largestIndex = 0;
    let largestShare = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i].receivedCents > largestShare) {
        largestShare = results[i].receivedCents;
        largestIndex = i;
      }
    }
    results[largestIndex].receivedCents += difference;
  }

  // Add back employees with 0 hours
  const zeroHoursEmployees = employees
    .filter(emp => emp.hoursWorked <= 0)
    .map(emp => ({
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      locationId: emp.locationId,
      locationName: emp.locationName,
      jobCategory: {
        id: emp.jobCategoryId,
        name: emp.jobCategoryName,
        badgeColor: emp.badgeColor,
      },
      hoursWorked: emp.hoursWorked,
      hourlyRate: emp.hourlyRateCents / 100,
      percentage: 0,
      shareCents: 0,
      receivedCents: 0,
    }));

  return [...results, ...zeroHoursEmployees];
}
