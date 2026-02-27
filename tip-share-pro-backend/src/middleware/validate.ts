/**
 * Request validation middleware using Zod
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod';

/**
 * Validation middleware factory
 * Validates request body against a Zod schema
 */
export function validate<T extends ZodSchema>(schema: T) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Validate query parameters
 */
export function validateQuery<T extends ZodSchema>(schema: T) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Validate route parameters
 */
export function validateParams<T extends ZodSchema>(schema: T) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}

// ============================================================================
// Common Validation Schemas
// ============================================================================

export const uuidSchema = z.string().uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// Employee hours for calculation
export const employeeHoursSchema = z.object({
  employeeId: z.string().uuid(),
  hours: z.number().min(0).max(168), // Max hours in a week
});

// Calculate distribution request
export const calculateDistributionSchema = z.object({
  employeeHours: z.array(employeeHoursSchema).min(1, 'At least one employee with hours is required'),
});

// Daily entry
export const dailyEntrySchema = z.object({
  employeeId: z.string().uuid(),
  salesCents: z.number().int().min(0).max(99999999).nullable(),
  actualContribCents: z.number().int().min(0).max(9999999).nullable().optional(),
});

// Bulk daily entries
export const bulkDailyEntriesSchema = z.object({
  date: dateSchema,
  entries: z.array(dailyEntrySchema).min(1).max(100),
});

// Pay period params
export const payPeriodParamsSchema = z.object({
  periodId: z.string().uuid(),
});
