/**
 * Pay Period Routes
 *
 * CRUD operations for pay periods.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate, validateParams, validateQuery, dateSchema } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { payPeriodService } from '../services/pay-period.service';
import { ApiResponse, AuthenticatedRequest } from '../types/index';
import { UserRole } from '@prisma/client';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const periodIdParamsSchema = z.object({
  periodId: z.string().uuid(),
});

const listPeriodsQuerySchema = z.object({
  locationId: z.string().uuid().optional(),
});

const createPeriodSchema = z.object({
  locationId: z.string().uuid(),
  startDate: dateSchema,
  endDate: dateSchema,
});

const updatePeriodSchema = z.object({
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  totalPoolCents: z.number().int().min(0).optional(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /pay-periods
 * Get all pay periods for the organization
 */
router.get(
  '/',
  authenticate,
  validateQuery(listPeriodsQuerySchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      const periods = await payPeriodService.getAll(
        user.organizationId,
        req.query.locationId as string | undefined
      );

      res.status(200).json({
        status: 'success',
        data: { payPeriods: periods },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /pay-periods/current
 * Get the current active pay period
 */
router.get(
  '/current',
  authenticate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      // For users with a location, use their location
      // For admins, require locationId query param
      let locationId = user.locationId;

      if (!locationId) {
        locationId = req.query.locationId as string;
        if (!locationId) {
          // Try to get the first location for the org
          const { prisma } = await import('../utils/prisma');
          const location = await prisma.location.findFirst({
            where: { organizationId: user.organizationId },
          });
          locationId = location?.id || null;
        }
      }

      if (!locationId) {
        res.status(200).json({
          status: 'success',
          data: { payPeriod: null },
        });
        return;
      }

      const period = await payPeriodService.getCurrent(user.organizationId, locationId);

      res.status(200).json({
        status: 'success',
        data: { payPeriod: period },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /pay-periods/:periodId
 * Get a single pay period
 */
router.get(
  '/:periodId',
  authenticate,
  validateParams(periodIdParamsSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { periodId } = req.params;

      const period = await payPeriodService.getById(user.organizationId, periodId);

      res.status(200).json({
        status: 'success',
        data: period,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /pay-periods
 * Create a new pay period (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createPeriodSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      const period = await payPeriodService.create(user.organizationId, req.body);

      res.status(201).json({
        status: 'success',
        data: period,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /pay-periods/:periodId
 * Update a pay period (Admin only)
 */
router.put(
  '/:periodId',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(periodIdParamsSchema),
  validate(updatePeriodSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { periodId } = req.params;

      const period = await payPeriodService.update(
        user.organizationId,
        periodId,
        req.body
      );

      res.status(200).json({
        status: 'success',
        data: period,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
