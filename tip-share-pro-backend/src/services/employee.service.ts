/**
 * Employee Service
 *
 * Manages employee CRUD operations.
 * Employees are assigned to locations and job categories.
 */

import { prisma } from '../utils/prisma';
import { NotFoundError, ValidationError } from '../utils/errors';
import { EmployeeStatus } from '@prisma/client';

// ============================================================================
// Types
// ============================================================================

export interface EmployeeResponse {
  id: string;
  name: string;
  locationId: string;
  locationName: string;
  jobCategory: {
    id: string;
    name: string;
    weight: number;
    badgeColor: string;
  };
  hourlyRate: number;        // Dollars for display
  hourlyRateCents: number;   // Cents for storage
  status: EmployeeStatus;
  hiredAt: string;
  terminatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInput {
  name: string;
  locationId: string;
  jobCategoryId: string;
  hourlyRateCents: number;
  hiredAt?: string;
}

export interface UpdateEmployeeInput {
  name?: string;
  jobCategoryId?: string;
  hourlyRateCents?: number;
  status?: EmployeeStatus;
}

export interface EmployeeListOptions {
  locationId?: string;
  status?: EmployeeStatus;
  jobCategoryId?: string;
}

// ============================================================================
// Employee Service Class
// ============================================================================

export class EmployeeService {
  /**
   * Get all employees for an organization
   */
  async getAll(
    organizationId: string,
    options: EmployeeListOptions = {}
  ): Promise<EmployeeResponse[]> {
    const where: Record<string, unknown> = { organizationId };

    if (options.locationId) {
      where.locationId = options.locationId;
    }
    if (options.status) {
      where.status = options.status;
    }
    if (options.jobCategoryId) {
      where.jobCategoryId = options.jobCategoryId;
    }

    const employees = await prisma.employee.findMany({
      where,
      include: {
        location: true,
        jobCategory: true,
      },
      orderBy: { name: 'asc' },
    });

    return employees.map((emp) => this.formatEmployee(emp));
  }

  /**
   * Get a single employee by ID
   */
  async getById(organizationId: string, employeeId: string): Promise<EmployeeResponse> {
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        organizationId,
      },
      include: {
        location: true,
        jobCategory: true,
      },
    });

    if (!employee) {
      throw new NotFoundError('Employee', employeeId);
    }

    return this.formatEmployee(employee);
  }

  /**
   * Create a new employee
   */
  async create(
    organizationId: string,
    input: CreateEmployeeInput
  ): Promise<EmployeeResponse> {
    // Validate location exists and belongs to org
    const location = await prisma.location.findFirst({
      where: {
        id: input.locationId,
        organizationId,
      },
    });

    if (!location) {
      throw new ValidationError('Invalid location', [
        { field: 'locationId', message: 'Location not found or does not belong to this organization' },
      ]);
    }

    // Validate job category exists and belongs to org
    const jobCategory = await prisma.jobCategory.findFirst({
      where: {
        id: input.jobCategoryId,
        organizationId,
      },
    });

    if (!jobCategory) {
      throw new ValidationError('Invalid job category', [
        { field: 'jobCategoryId', message: 'Job category not found or does not belong to this organization' },
      ]);
    }

    // Validate hourly rate
    if (input.hourlyRateCents < 100 || input.hourlyRateCents > 20000) {
      throw new ValidationError('Invalid hourly rate', [
        { field: 'hourlyRateCents', message: 'Hourly rate must be between $1.00 and $200.00' },
      ]);
    }

    const employee = await prisma.employee.create({
      data: {
        organizationId,
        locationId: input.locationId,
        jobCategoryId: input.jobCategoryId,
        name: input.name,
        hourlyRateCents: input.hourlyRateCents,
        hiredAt: input.hiredAt ? new Date(input.hiredAt) : new Date(),
        status: 'ACTIVE',
      },
      include: {
        location: true,
        jobCategory: true,
      },
    });

    return this.formatEmployee(employee);
  }

  /**
   * Update an employee
   */
  async update(
    organizationId: string,
    employeeId: string,
    input: UpdateEmployeeInput
  ): Promise<EmployeeResponse> {
    // Check employee exists
    const existing = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        organizationId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Employee', employeeId);
    }

    // Validate job category if changing
    if (input.jobCategoryId) {
      const jobCategory = await prisma.jobCategory.findFirst({
        where: {
          id: input.jobCategoryId,
          organizationId,
        },
      });

      if (!jobCategory) {
        throw new ValidationError('Invalid job category', [
          { field: 'jobCategoryId', message: 'Job category not found or does not belong to this organization' },
        ]);
      }
    }

    // Validate hourly rate if changing
    if (input.hourlyRateCents !== undefined) {
      if (input.hourlyRateCents < 100 || input.hourlyRateCents > 20000) {
        throw new ValidationError('Invalid hourly rate', [
          { field: 'hourlyRateCents', message: 'Hourly rate must be between $1.00 and $200.00' },
        ]);
      }
    }

    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.jobCategoryId !== undefined) updateData.jobCategoryId = input.jobCategoryId;
    if (input.hourlyRateCents !== undefined) updateData.hourlyRateCents = input.hourlyRateCents;
    if (input.status !== undefined) {
      updateData.status = input.status;
      if (input.status === 'TERMINATED') {
        updateData.terminatedAt = new Date();
      }
    }

    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: updateData,
      include: {
        location: true,
        jobCategory: true,
      },
    });

    return this.formatEmployee(employee);
  }

  /**
   * Soft-delete an employee (set status to TERMINATED)
   */
  async delete(organizationId: string, employeeId: string): Promise<void> {
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        organizationId,
      },
    });

    if (!employee) {
      throw new NotFoundError('Employee', employeeId);
    }

    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        status: 'TERMINATED',
        terminatedAt: new Date(),
      },
    });
  }

  /**
   * Format employee for API response
   */
  private formatEmployee(employee: {
    id: string;
    name: string;
    locationId: string;
    hourlyRateCents: number;
    status: EmployeeStatus;
    hiredAt: Date;
    terminatedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    location: { id: string; name: string };
    jobCategory: { id: string; name: string; weight: unknown; badgeColor: string };
  }): EmployeeResponse {
    return {
      id: employee.id,
      name: employee.name,
      locationId: employee.locationId,
      locationName: employee.location.name,
      jobCategory: {
        id: employee.jobCategory.id,
        name: employee.jobCategory.name,
        weight: Number(employee.jobCategory.weight),
        badgeColor: employee.jobCategory.badgeColor,
      },
      hourlyRate: employee.hourlyRateCents / 100,
      hourlyRateCents: employee.hourlyRateCents,
      status: employee.status,
      hiredAt: employee.hiredAt.toISOString(),
      terminatedAt: employee.terminatedAt?.toISOString() || null,
      createdAt: employee.createdAt.toISOString(),
      updatedAt: employee.updatedAt.toISOString(),
    };
  }
}

// Export singleton instance
export const employeeService = new EmployeeService();
