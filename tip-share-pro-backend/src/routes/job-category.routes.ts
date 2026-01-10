/**
 * Job Category Routes
 *
 * CRUD operations for job categories with weights.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate, validateParams } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { jobCategoryService } from '../services/job-category.service';
import { ApiResponse, AuthenticatedRequest } from '../types/index';
import { UserRole } from '@prisma/client';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const categoryIdParamsSchema = z.object({
  categoryId: z.string().uuid(),
});

const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  weight: z.number().min(1).max(5),
  badgeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  weight: z.number().min(1).max(5).optional(),
  badgeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /job-categories
 * Get all job categories for the organization
 */
router.get(
  '/',
  authenticate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      const categories = await jobCategoryService.getAll(user.organizationId);

      res.status(200).json({
        status: 'success',
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /job-categories/predefined
 * Get the list of predefined job categories (for UI)
 */
router.get(
  '/predefined',
  authenticate,
  (_req: Request, res: Response<ApiResponse>) => {
    const predefined = jobCategoryService.getPredefinedCategories();
    const weightOptions = jobCategoryService.getWeightOptions();

    res.status(200).json({
      status: 'success',
      data: {
        predefined,
        weightOptions,
      },
    });
  }
);

/**
 * GET /job-categories/:categoryId
 * Get a single job category
 */
router.get(
  '/:categoryId',
  authenticate,
  validateParams(categoryIdParamsSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { categoryId } = req.params;

      const category = await jobCategoryService.getById(user.organizationId, categoryId);

      res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /job-categories
 * Create a new job category (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createCategorySchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      const category = await jobCategoryService.create(user.organizationId, req.body);

      res.status(201).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /job-categories/:categoryId
 * Update a job category (Admin only)
 */
router.put(
  '/:categoryId',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(categoryIdParamsSchema),
  validate(updateCategorySchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { categoryId } = req.params;

      const category = await jobCategoryService.update(
        user.organizationId,
        categoryId,
        req.body
      );

      res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /job-categories/:categoryId
 * Delete a job category (Admin only)
 * Cannot delete if employees are assigned
 */
router.delete(
  '/:categoryId',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(categoryIdParamsSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { categoryId } = req.params;

      await jobCategoryService.delete(user.organizationId, categoryId);

      res.status(200).json({
        status: 'success',
        data: { message: 'Job category deleted successfully' },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
