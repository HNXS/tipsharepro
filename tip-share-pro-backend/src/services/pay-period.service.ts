/**
 * Pay Period Service
 *
 * Manages pay period lifecycle: create, list, update status.
 */

import { prisma } from '../utils/prisma';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors';
import { PayPeriodStatus } from '@prisma/client';

// ============================================================================
// Types
// ============================================================================

export interface PayPeriodResponse {
  id: string;
  locationId: string;
  locationName: string;
  startDate: string;
  endDate: string;
  status: PayPeriodStatus;
  totalPool: number | null;        // Dollars for display
  totalPoolCents: number | null;   // Cents for storage
  daysEntered: number;
  totalDays: number;
  calculatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayPeriodInput {
  locationId: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
}

export interface UpdatePayPeriodInput {
  status?: PayPeriodStatus;
  totalPoolCents?: number;
}

// ============================================================================
// Pay Period Service Class
// ============================================================================

export class PayPeriodService {
  /**
   * Get all pay periods for an organization
   */
  async getAll(organizationId: string, locationId?: string): Promise<PayPeriodResponse[]> {
    const where: Record<string, unknown> = { organizationId };
    if (locationId) {
      where.locationId = locationId;
    }

    const periods = await prisma.payPeriod.findMany({
      where,
      include: {
        location: true,
        dailyEntries: {
          select: { date: true },
          distinct: ['date'],
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return periods.map((period) => this.formatPayPeriod(period));
  }

  /**
   * Get current/active pay period for a location
   */
  async getCurrent(organizationId: string, locationId: string): Promise<PayPeriodResponse | null> {
    const period = await prisma.payPeriod.findFirst({
      where: {
        organizationId,
        locationId,
        status: { in: ['DRAFT', 'ACTIVE'] },
      },
      include: {
        location: true,
        dailyEntries: {
          select: { date: true },
          distinct: ['date'],
        },
      },
      orderBy: { startDate: 'desc' },
    });

    if (!period) {
      return null;
    }

    return this.formatPayPeriod(period);
  }

  /**
   * Get a single pay period by ID
   */
  async getById(organizationId: string, periodId: string): Promise<PayPeriodResponse> {
    const period = await prisma.payPeriod.findFirst({
      where: {
        id: periodId,
        organizationId,
      },
      include: {
        location: true,
        dailyEntries: {
          select: { date: true },
          distinct: ['date'],
        },
      },
    });

    if (!period) {
      throw new NotFoundError('Pay Period', periodId);
    }

    return this.formatPayPeriod(period);
  }

  /**
   * Create a new pay period
   */
  async create(
    organizationId: string,
    input: CreatePayPeriodInput
  ): Promise<PayPeriodResponse> {
    // Validate location
    const location = await prisma.location.findFirst({
      where: {
        id: input.locationId,
        organizationId,
      },
    });

    if (!location) {
      throw new ValidationError('Invalid location', [
        { field: 'locationId', message: 'Location not found' },
      ]);
    }

    // Parse dates
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    // Validate date range
    if (endDate <= startDate) {
      throw new ValidationError('Invalid date range', [
        { field: 'endDate', message: 'End date must be after start date' },
      ]);
    }

    // Check for overlapping periods
    const overlapping = await prisma.payPeriod.findFirst({
      where: {
        organizationId,
        locationId: input.locationId,
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictError('Pay period overlaps with an existing period');
    }

    const period = await prisma.payPeriod.create({
      data: {
        organizationId,
        locationId: input.locationId,
        startDate,
        endDate,
        status: 'DRAFT',
      },
      include: {
        location: true,
        dailyEntries: {
          select: { date: true },
          distinct: ['date'],
        },
      },
    });

    return this.formatPayPeriod(period);
  }

  /**
   * Update a pay period
   */
  async update(
    organizationId: string,
    periodId: string,
    input: UpdatePayPeriodInput
  ): Promise<PayPeriodResponse> {
    const existing = await prisma.payPeriod.findFirst({
      where: {
        id: periodId,
        organizationId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Pay Period', periodId);
    }

    // Validate status transitions
    if (input.status) {
      this.validateStatusTransition(existing.status, input.status);
    }

    const period = await prisma.payPeriod.update({
      where: { id: periodId },
      data: {
        ...(input.status && { status: input.status }),
        ...(input.totalPoolCents !== undefined && { totalPoolCents: input.totalPoolCents }),
        ...(input.status === 'ARCHIVED' && { calculatedAt: new Date() }),
      },
      include: {
        location: true,
        dailyEntries: {
          select: { date: true },
          distinct: ['date'],
        },
      },
    });

    return this.formatPayPeriod(period);
  }

  /**
   * Calculate total days in pay period
   */
  private calculateTotalDays(startDate: Date, endDate: Date): number {
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  /**
   * Validate status transitions
   */
  private validateStatusTransition(current: PayPeriodStatus, next: PayPeriodStatus): void {
    const validTransitions: Record<PayPeriodStatus, PayPeriodStatus[]> = {
      DRAFT: ['ACTIVE'],
      ACTIVE: ['ARCHIVED'],
      ARCHIVED: [],
    };

    if (!validTransitions[current].includes(next)) {
      throw new ValidationError('Invalid status transition', [
        { field: 'status', message: `Cannot transition from ${current} to ${next}` },
      ]);
    }
  }

  /**
   * Format pay period for API response
   */
  private formatPayPeriod(period: {
    id: string;
    startDate: Date;
    endDate: Date;
    status: PayPeriodStatus;
    totalPoolCents: number | null;
    calculatedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    location: { id: string; name: string };
    dailyEntries: { date: Date }[];
  }): PayPeriodResponse {
    const totalDays = this.calculateTotalDays(period.startDate, period.endDate);

    return {
      id: period.id,
      locationId: period.location.id,
      locationName: period.location.name,
      startDate: period.startDate.toISOString().split('T')[0],
      endDate: period.endDate.toISOString().split('T')[0],
      status: period.status,
      totalPool: period.totalPoolCents ? period.totalPoolCents / 100 : null,
      totalPoolCents: period.totalPoolCents,
      daysEntered: period.dailyEntries.length,
      totalDays,
      calculatedAt: period.calculatedAt?.toISOString() || null,
      createdAt: period.createdAt.toISOString(),
      updatedAt: period.updatedAt.toISOString(),
    };
  }
}

// Export singleton instance
export const payPeriodService = new PayPeriodService();
