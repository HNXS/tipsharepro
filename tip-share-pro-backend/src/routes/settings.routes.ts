/**
 * Settings Routes
 *
 * Manages organization settings including contribution method,
 * contribution rate, pay period type, and estimated monthly sales.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { settingsService, ContributionMethod } from '../services/settings.service';
import { ApiResponse, AuthenticatedRequest } from '../types/index';
import { UserRole } from '@prisma/client';
import { logAudit } from '../services/audit.service';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const contributionMethodSchema = z.enum(['CC_SALES', 'CC_TIPS', 'ALL_TIPS', 'ALL_SALES']);
const payPeriodTypeSchema = z.enum(['WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY']);

const updateSettingsSchema = z.object({
  contributionMethod: contributionMethodSchema.optional(),
  contributionRate: z.number().min(1).max(25).optional(),
  payPeriodType: payPeriodTypeSchema.optional(),
  estimatedMonthlySales: z.number().int().min(0).max(99999999).optional(),
  autoArchiveDays: z.number().int().min(0).max(30).optional(),
  roundingMode: z.enum(['NEAREST', 'DOWN']).optional(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /settings
 * Get organization settings
 */
router.get(
  '/',
  authenticate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      const settings = await settingsService.getSettings(user.organizationId);

      res.status(200).json({
        status: 'success',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /settings
 * Update organization settings (Admin only)
 */
router.put(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateSettingsSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      // Fetch current settings for audit trail
      const before = await settingsService.getSettings(user.organizationId);

      const settings = await settingsService.updateSettings(
        user.organizationId,
        req.body
      );

      await logAudit({
        orgId: user.organizationId,
        userId: user.id,
        action: 'UPDATE',
        entityType: 'Settings',
        entityId: user.organizationId,
        before: JSON.parse(JSON.stringify(before.settings)),
        after: JSON.parse(JSON.stringify(settings.settings)),
        req,
      });

      res.status(200).json({
        status: 'success',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /settings/contribution-rates
 * Get valid contribution rate options based on method
 */
router.get(
  '/contribution-rates',
  authenticate,
  (req: Request, res: Response<ApiResponse>) => {
    const method = (req.query.method as ContributionMethod) || 'ALL_SALES';

    const validMethods: ContributionMethod[] = ['CC_SALES', 'CC_TIPS', 'ALL_TIPS', 'ALL_SALES'];
    if (!validMethods.includes(method)) {
      res.status(400).json({
        status: 'error',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid contribution method',
        },
      });
      return;
    }

    const options = settingsService.getContributionRateOptions(method);

    res.status(200).json({
      status: 'success',
      data: {
        method,
        options,
      },
    });
  }
);

export default router;
