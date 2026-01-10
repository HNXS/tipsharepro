/**
 * Job Category Service
 *
 * Manages job categories with weights for tip distribution calculation.
 * Weight range: 1.00 - 5.00 in 0.25 increments (17 options)
 */

import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../utils/prisma';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors';

// ============================================================================
// Types
// ============================================================================

export interface JobCategoryResponse {
  id: string;
  name: string;
  weight: number;
  badgeColor: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobCategoryInput {
  name: string;
  weight: number;
  badgeColor?: string;
}

export interface UpdateJobCategoryInput {
  name?: string;
  weight?: number;
  badgeColor?: string;
}

// Default badge colors for job categories
const BADGE_COLORS: Record<string, string> = {
  // Kitchen (BOH)
  'Lead Cook': '#DC2626',      // Red
  'Line Cook': '#EA580C',      // Orange
  'Pastry Chef': '#D97706',    // Amber
  'Prep Cook': '#CA8A04',      // Yellow
  'Pantry Chef': '#65A30D',    // Lime
  // Front of House
  'Maitre D': '#0891B2',       // Cyan
  'Host/Hostess': '#0284C7',   // Light Blue
  'Cashier': '#2563EB',        // Blue
  'Runner': '#4F46E5',         // Indigo
  'Busser': '#7C3AED',         // Violet
  // Bar
  'Barista': '#9333EA',        // Purple
  'Bartender': '#C026D3',      // Fuchsia
  'Sommelier': '#DB2777',      // Pink
  'Bar Back': '#E11D48',       // Rose
  'Dishwasher': '#64748B',     // Slate
  // Default
  'default': '#6B7280',        // Gray
};

// ============================================================================
// Job Category Service Class
// ============================================================================

export class JobCategoryService {
  /**
   * Get all job categories for an organization
   */
  async getAll(organizationId: string): Promise<JobCategoryResponse[]> {
    const categories = await prisma.jobCategory.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: { employees: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      weight: Number(cat.weight),
      badgeColor: cat.badgeColor,
      employeeCount: cat._count.employees,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
    }));
  }

  /**
   * Get a single job category by ID
   */
  async getById(organizationId: string, categoryId: string): Promise<JobCategoryResponse> {
    const category = await prisma.jobCategory.findFirst({
      where: {
        id: categoryId,
        organizationId,
      },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Job Category', categoryId);
    }

    return {
      id: category.id,
      name: category.name,
      weight: Number(category.weight),
      badgeColor: category.badgeColor,
      employeeCount: category._count.employees,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  /**
   * Create a new job category
   */
  async create(
    organizationId: string,
    input: CreateJobCategoryInput
  ): Promise<JobCategoryResponse> {
    // Validate weight
    this.validateWeight(input.weight);

    // Check for duplicate name
    const existing = await prisma.jobCategory.findFirst({
      where: {
        organizationId,
        name: input.name,
      },
    });

    if (existing) {
      throw new ConflictError(`Job category "${input.name}" already exists`);
    }

    // Get badge color
    const badgeColor = input.badgeColor || BADGE_COLORS[input.name] || BADGE_COLORS['default'];

    const category = await prisma.jobCategory.create({
      data: {
        organizationId,
        name: input.name,
        weight: new Decimal(input.weight),
        badgeColor,
      },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });

    return {
      id: category.id,
      name: category.name,
      weight: Number(category.weight),
      badgeColor: category.badgeColor,
      employeeCount: category._count.employees,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  /**
   * Update an existing job category
   */
  async update(
    organizationId: string,
    categoryId: string,
    input: UpdateJobCategoryInput
  ): Promise<JobCategoryResponse> {
    // Check if category exists
    const existing = await prisma.jobCategory.findFirst({
      where: {
        id: categoryId,
        organizationId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Job Category', categoryId);
    }

    // Validate weight if provided
    if (input.weight !== undefined) {
      this.validateWeight(input.weight);
    }

    // Check for duplicate name if changing name
    if (input.name && input.name !== existing.name) {
      const duplicate = await prisma.jobCategory.findFirst({
        where: {
          organizationId,
          name: input.name,
          id: { not: categoryId },
        },
      });

      if (duplicate) {
        throw new ConflictError(`Job category "${input.name}" already exists`);
      }
    }

    const category = await prisma.jobCategory.update({
      where: { id: categoryId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.weight !== undefined && { weight: new Decimal(input.weight) }),
        ...(input.badgeColor && { badgeColor: input.badgeColor }),
      },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });

    return {
      id: category.id,
      name: category.name,
      weight: Number(category.weight),
      badgeColor: category.badgeColor,
      employeeCount: category._count.employees,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  /**
   * Delete a job category
   * Cannot delete if employees are assigned
   */
  async delete(organizationId: string, categoryId: string): Promise<void> {
    const category = await prisma.jobCategory.findFirst({
      where: {
        id: categoryId,
        organizationId,
      },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Job Category', categoryId);
    }

    if (category._count.employees > 0) {
      throw new ConflictError(
        `Cannot delete job category "${category.name}" - ${category._count.employees} employees are assigned to it`
      );
    }

    await prisma.jobCategory.delete({
      where: { id: categoryId },
    });
  }

  /**
   * Validate weight is between 1.00 and 5.00 in 0.25 increments
   */
  private validateWeight(weight: number): void {
    if (weight < 1 || weight > 5) {
      throw new ValidationError('Weight must be between 1.00 and 5.00', [
        { field: 'weight', message: 'Weight must be between 1.00 and 5.00' },
      ]);
    }

    // Check it's a valid 0.25 increment (multiply by 4, should be whole number)
    if ((weight * 4) % 1 !== 0) {
      throw new ValidationError('Weight must be in 0.25 increments', [
        { field: 'weight', message: 'Weight must be in 0.25 increments (e.g., 1.00, 1.25, 1.50, ...)' },
      ]);
    }
  }

  /**
   * Get valid weight options
   */
  getWeightOptions(): number[] {
    const options: number[] = [];
    for (let weight = 1; weight <= 5; weight += 0.25) {
      options.push(weight);
    }
    return options;
  }

  /**
   * Get predefined job category list
   */
  getPredefinedCategories(): { group: string; categories: string[] }[] {
    return [
      {
        group: 'Kitchen (BOH)',
        categories: ['Lead Cook', 'Line Cook', 'Pastry Chef', 'Prep Cook', 'Pantry Chef'],
      },
      {
        group: 'Front of House',
        categories: ['Maitre D', 'Host/Hostess', 'Cashier', 'Runner', 'Busser'],
      },
      {
        group: 'Bar',
        categories: ['Barista', 'Bartender', 'Sommelier', 'Bar Back', 'Dishwasher'],
      },
    ];
  }
}

// Export singleton instance
export const jobCategoryService = new JobCategoryService();
