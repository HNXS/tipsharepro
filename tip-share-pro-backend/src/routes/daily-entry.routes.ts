/**
 * Daily Entry API Routes
 *
 * Handles daily contribution entry endpoints for:
 * - Viewing entries for a pay period
 * - Viewing entries for a specific date (with navigation)
 * - Bulk upserting entries for a date
 * - Deleting individual entries
 *
 * Authorization:
 * - GET endpoints: All authenticated users
 * - PUT (upsert): Designee+ role
 * - DELETE: Manager+ role
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { DailyEntryService, createDailyEntryService } from '../services/daily-entry.service';
import { prisma } from '../utils/prisma';
import {
  validate,
  validateParams,
  validateQuery,
  uuidSchema,
  dateSchema,
  bulkDailyEntriesSchema,
  paginationSchema,
} from '../middleware/validate';
import { ApiResponse } from '../types/index';
import { logger } from '../utils/logger';

const router = Router();

// Initialize service
const dailyEntryService = createDailyEntryService(prisma);

// ============================================================================
// Validation Schemas
// ============================================================================

const periodIdParams = z.object({
  periodId: uuidSchema,
});

const periodIdWithDateParams = z.object({
  periodId: uuidSchema,
  date: dateSchema,
});

const entryIdParams = z.object({
  periodId: uuidSchema,
  entryId: uuidSchema,
});

const entriesQuerySchema = z.object({
  date: dateSchema.optional(),
  employeeId: uuidSchema.optional(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/v1/pay-periods/:periodId/entries
 *
 * Get all entries for a pay period.
 * Optionally filter by date or employee.
 *
 * Query Parameters:
 * - date (optional): Filter by specific date (YYYY-MM-DD)
 * - employeeId (optional): Filter by employee
 *
 * Response:
 * - payPeriod: Period info
 * - entries: Array of daily entries
 * - summary: Total sales, contributions, days entered
 */
router.get(
  '/:periodId/entries',
  validateParams(periodIdParams),
  validateQuery(entriesQuerySchema),
  async (
    req: Request<
      { periodId: string },
      ApiResponse,
      unknown,
      { date?: string; employeeId?: string }
    >,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      const { periodId } = req.params;
      const { date, employeeId } = req.query;

      logger.debug({ periodId, date, employeeId }, 'Fetching entries for period');

      const result = await dailyEntryService.getEntriesForPeriod(periodId, {
        date,
        employeeId,
      });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/pay-periods/:periodId/entries/:date
 *
 * Get entries for a specific date with navigation info.
 * Includes previous/next date links and running totals.
 *
 * Response:
 * - payPeriod: Period info
 * - date: Current date
 * - entries: Entries for this date
 * - navigation: Previous/next date links, day number
 * - runningTotals: Cumulative totals for the period
 */
router.get(
  '/:periodId/entries/:date',
  validateParams(periodIdWithDateParams),
  async (
    req: Request<{ periodId: string; date: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      const { periodId, date } = req.params;

      logger.debug({ periodId, date }, 'Fetching entries for date');

      const result = await dailyEntryService.getEntriesForDate(periodId, date);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/pay-periods/:periodId/entries/:date/employees
 *
 * Get all employees for a date with their existing entries (if any).
 * Useful for populating the data entry form.
 */
router.get(
  '/:periodId/entries/:date/employees',
  validateParams(periodIdWithDateParams),
  async (
    req: Request<{ periodId: string; date: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      const { periodId, date } = req.params;

      logger.debug({ periodId, date }, 'Fetching employees for date entry');

      const result = await dailyEntryService.getContributingEmployeesForDate(periodId, date);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/v1/pay-periods/:periodId/entries
 *
 * Bulk upsert daily entries for a specific date.
 * Creates or updates entries as needed.
 *
 * Request Body:
 * {
 *   date: "YYYY-MM-DD",
 *   entries: [
 *     { employeeId: "uuid", salesCents: number|null, actualContribCents: number|null },
 *     ...
 *   ]
 * }
 *
 * Response:
 * - created: Number of new entries created
 * - updated: Number of existing entries updated
 * - entries: Processed entries
 * - runningTotals: Updated cumulative totals
 */
router.put(
  '/:periodId/entries',
  validateParams(periodIdParams),
  validate(bulkDailyEntriesSchema),
  async (
    req: Request<
      { periodId: string },
      ApiResponse,
      {
        date: string;
        entries: Array<{
          employeeId: string;
          salesCents: number | null;
          actualContribCents: number | null;
        }>;
      }
    >,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      const { periodId } = req.params;
      const { date, entries } = req.body;

      // TODO: Get enteredById from authenticated user when auth is implemented
      // For now, we'll leave it as undefined
      const enteredById = undefined;

      logger.info({ periodId, date, entryCount: entries.length }, 'Bulk upserting entries');

      const result = await dailyEntryService.bulkUpsertEntries(
        periodId,
        date,
        entries,
        enteredById
      );

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/v1/pay-periods/:periodId/entries/:entryId
 *
 * Delete a single daily entry.
 * Requires Manager+ role.
 *
 * Response:
 * - success: boolean
 * - deletedEntry: The deleted entry data
 */
router.delete(
  '/:periodId/entries/:entryId',
  validateParams(entryIdParams),
  async (
    req: Request<{ periodId: string; entryId: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      const { entryId } = req.params;

      logger.info({ entryId }, 'Deleting daily entry');

      const result = await dailyEntryService.deleteEntry(entryId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
