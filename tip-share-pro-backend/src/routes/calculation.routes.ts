/**
 * Pool Calculation API Routes
 *
 * Handles tip pool calculation and distribution endpoints.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TipCalculationService, calculatePoolDistribution } from '../services/tip-calculation.service';
import { prisma } from '../utils/prisma';
import { validate, validateParams, uuidSchema, calculateDistributionSchema } from '../middleware/validate';
import { NotFoundError } from '../utils/errors';
import { ApiResponse, PoolDistributionResult, EmployeeCalculationInput } from '../types/index';
import { logger } from '../utils/logger';

const router = Router();

// Initialize service
const calculationService = new TipCalculationService(prisma);

// Param validation schema
const periodIdParams = z.object({
  periodId: uuidSchema,
});

/**
 * POST /api/v1/pay-periods/:periodId/calculate
 *
 * Calculate tip distribution for a pay period.
 * This is the main calculation endpoint that runs the Hours × Rate × Weight algorithm.
 */
router.post(
  '/:periodId/calculate',
  validateParams(periodIdParams),
  validate(calculateDistributionSchema),
  async (
    req: Request<{ periodId: string }, ApiResponse<PoolDistributionResult>, { employeeHours: Array<{ employeeId: string; hours: number }> }>,
    res: Response<ApiResponse<PoolDistributionResult>>,
    next: NextFunction
  ) => {
    try {
      const { periodId } = req.params;
      const { employeeHours } = req.body;

      logger.info({ periodId, employeeCount: employeeHours.length }, 'Calculating distribution');

      // Convert array to map for service
      const hoursMap = new Map<string, number>();
      for (const eh of employeeHours) {
        hoursMap.set(eh.employeeId, eh.hours);
      }

      const result = await calculationService.calculateDistribution(periodId, hoursMap);

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
 * GET /api/v1/pay-periods/:periodId/distribution
 *
 * Get the calculated distribution for a pay period.
 * Returns the stored distribution results (without basis).
 */
router.get(
  '/:periodId/distribution',
  validateParams(periodIdParams),
  async (
    req: Request<{ periodId: string }>,
    res: Response<ApiResponse<PoolDistributionResult>>,
    next: NextFunction
  ) => {
    try {
      const { periodId } = req.params;

      const result = await calculationService.getDistribution(periodId);

      if (!result) {
        throw new NotFoundError('Distribution', periodId);
      }

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
 * POST /api/v1/calculate/preview
 *
 * Preview calculation without saving to database.
 * Useful for sandbox/what-if scenarios.
 */
router.post(
  '/preview',
  validate(
    z.object({
      totalPoolCents: z.number().int().positive(),
      roundingMode: z.enum(['NEAREST', 'DOWN']).optional(),
      employees: z.array(
        z.object({
          employeeId: z.string(),
          employeeName: z.string(),
          locationId: z.string(),
          locationName: z.string(),
          jobCategoryId: z.string(),
          jobCategoryName: z.string(),
          badgeColor: z.string(),
          hoursWorked: z.number().min(0),
          hourlyRateCents: z.number().int().positive(),
          weight: z.number().min(1).max(5),
        })
      ).min(1),
    })
  ),
  async (
    req: Request<
      object,
      ApiResponse,
      {
        totalPoolCents: number;
        employees: EmployeeCalculationInput[];
        roundingMode?: 'NEAREST' | 'DOWN';
      }
    >,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      const { totalPoolCents, employees, roundingMode } = req.body;

      logger.debug({ totalPoolCents, employeeCount: employees.length, roundingMode }, 'Preview calculation');

      // Use the pure calculation function (no database)
      const distribution = calculatePoolDistribution(employees, totalPoolCents, roundingMode || 'NEAREST');

      const totalHours = distribution.reduce((sum, d) => sum + d.hoursWorked, 0);
      const distributedCents = distribution.reduce((sum, d) => sum + d.receivedCents, 0);

      res.status(200).json({
        status: 'success',
        data: {
          distribution,
          summary: {
            totalParticipants: distribution.filter(d => d.receivedCents > 0).length,
            totalHours: Math.round(totalHours * 100) / 100,
            totalPoolCents,
            distributedCents,
            varianceCents: totalPoolCents - distributedCents,
          },
          isPreview: true,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
