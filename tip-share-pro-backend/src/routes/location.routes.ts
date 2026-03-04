/**
 * Location Routes (Org-Scoped)
 *
 * Manages locations within the caller's organization.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateParams } from '../middleware/validate';
import { prisma } from '../utils/prisma';
import { logAudit } from '../services/audit.service';
import { ApiResponse, AuthenticatedRequest } from '../types/index';
import { UserRole } from '@prisma/client';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const createLocationSchema = z.object({
  name: z.string().min(1).max(100),
  number: z.string().max(20).optional(),
});

const updateLocationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  number: z.string().max(20).nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

const locationIdParamsSchema = z.object({
  id: z.string().uuid(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /locations
 * List all locations for the caller's organization
 */
router.get(
  '/',
  authenticate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      // Manager/Data with locationId only see their own location
      const where: Record<string, unknown> = { organizationId: user.organizationId };
      if (user.role !== 'ADMIN' && user.locationId) {
        where.id = user.locationId;
      }

      const locations = await prisma.location.findMany({
        where,
        select: {
          id: true,
          name: true,
          number: true,
          status: true,
          createdAt: true,
          _count: { select: { employees: true, users: true } },
        },
        orderBy: { createdAt: 'asc' },
      });

      res.status(200).json({
        status: 'success',
        data: {
          locations: locations.map((loc) => ({
            id: loc.id,
            name: loc.name,
            number: loc.number,
            status: loc.status,
            createdAt: loc.createdAt.toISOString(),
            employeeCount: loc._count.employees,
            userCount: loc._count.users,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /locations
 * Create a new location (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createLocationSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { name, number } = req.body;

      const location = await prisma.location.create({
        data: {
          organizationId: user.organizationId,
          name,
          number: number || null,
        },
      });

      await logAudit({
        orgId: user.organizationId,
        userId: user.id,
        action: 'CREATE',
        entityType: 'Location',
        entityId: location.id,
        after: { name, number },
        req,
      });

      res.status(201).json({
        status: 'success',
        data: {
          id: location.id,
          name: location.name,
          number: location.number,
          status: location.status,
          createdAt: location.createdAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /locations/:id
 * Update a location (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(locationIdParamsSchema),
  validate(updateLocationSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { id } = req.params;

      const existing = await prisma.location.findFirst({
        where: { id, organizationId: user.organizationId },
      });
      if (!existing) {
        res.status(404).json({
          status: 'error',
          error: { code: 'NOT_FOUND', message: 'Location not found' },
        });
        return;
      }

      const updates: Record<string, unknown> = {};
      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.number !== undefined) updates.number = req.body.number;
      if (req.body.status !== undefined) updates.status = req.body.status;

      const location = await prisma.location.update({
        where: { id },
        data: updates,
      });

      await logAudit({
        orgId: user.organizationId,
        userId: user.id,
        action: 'UPDATE',
        entityType: 'Location',
        entityId: id,
        before: JSON.parse(JSON.stringify(existing)),
        after: updates,
        req,
      });

      res.status(200).json({
        status: 'success',
        data: {
          id: location.id,
          name: location.name,
          number: location.number,
          status: location.status,
          createdAt: location.createdAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
