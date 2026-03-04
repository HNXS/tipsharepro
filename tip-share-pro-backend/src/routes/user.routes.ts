/**
 * User Management Routes (Org-Scoped)
 *
 * CRUD for users within the caller's organization.
 * All routes require ADMIN role.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateParams } from '../middleware/validate';
import { prisma } from '../utils/prisma';
import { logAudit } from '../services/audit.service';
import { ApiResponse, AuthenticatedRequest } from '../types/index';
import { UserRole } from '@prisma/client';
import { sendUserInviteEmail } from '../services/notifications.service';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const createUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'MANAGER', 'DATA']),
  locationId: z.string().uuid().optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'DATA']).optional(),
  adminAcknowledgment: z.boolean().optional(),
  locationId: z.string().uuid().nullable().optional(),
  twoFactorEnabled: z.boolean().optional(),
});

const userIdParamsSchema = z.object({
  id: z.string().uuid(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /users
 * List all users in the caller's organization (Admin only)
 */
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      const users = await prisma.user.findMany({
        where: { organizationId: user.organizationId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          mustChangePassword: true,
          twoFactorEnabled: true,
          locationId: true,
          location: { select: { id: true, name: true } },
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      res.status(200).json({
        status: 'success',
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /users
 * Create a new user in the caller's organization (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createUserSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const caller = (req as AuthenticatedRequest).user;
      const { firstName, lastName, email, password, role, locationId } = req.body;

      // Verify location belongs to this org if provided
      if (locationId) {
        const location = await prisma.location.findFirst({
          where: { id: locationId, organizationId: caller.organizationId },
        });
        if (!location) {
          res.status(400).json({
            status: 'error',
            error: { code: 'VALIDATION_ERROR', message: 'Location not found in this organization' },
          });
          return;
        }
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          organizationId: caller.organizationId,
          firstName: firstName || null,
          lastName: lastName || null,
          email,
          passwordHash,
          role,
          mustChangePassword: true,
          locationId: locationId || null,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          mustChangePassword: true,
          twoFactorEnabled: true,
          locationId: true,
          location: { select: { id: true, name: true } },
          createdAt: true,
        },
      });

      await logAudit({
        orgId: caller.organizationId,
        userId: caller.id,
        action: 'CREATE',
        entityType: 'User',
        entityId: newUser.id,
        after: { email, role, locationId },
        req,
      });

      // Send invite email (fire-and-forget)
      const org = await prisma.organization.findUnique({
        where: { id: caller.organizationId },
        select: { name: true },
      });
      sendUserInviteEmail(email, org?.name || 'Your Organization', role, caller.email);

      res.status(201).json({
        status: 'success',
        data: newUser,
      });
    } catch (error: unknown) {
      if ((error as { code?: string }).code === 'P2002') {
        res.status(409).json({
          status: 'error',
          error: { code: 'CONFLICT', message: 'A user with this email already exists in this organization' },
        });
        return;
      }
      next(error);
    }
  }
);

/**
 * PUT /users/:id
 * Update a user's role or location (Admin only, same org check)
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(userIdParamsSchema),
  validate(updateUserSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const caller = (req as AuthenticatedRequest).user;
      const { id } = req.params;

      // Ensure target user belongs to same org
      const existing = await prisma.user.findFirst({
        where: { id, organizationId: caller.organizationId },
      });
      if (!existing) {
        res.status(404).json({
          status: 'error',
          error: { code: 'NOT_FOUND', message: 'User not found' },
        });
        return;
      }

      if (req.body.role === 'ADMIN' && existing.role !== 'ADMIN') {
        if (!req.body.adminAcknowledgment) {
          res.status(400).json({
            status: 'error',
            error: { code: 'ACKNOWLEDGMENT_REQUIRED', message: 'Admin privilege acknowledgment is required' },
          });
          return;
        }
        await logAudit({
          orgId: caller.organizationId,
          userId: caller.id,
          action: 'ADMIN_PRIVILEGE_ACKNOWLEDGED',
          entityType: 'User',
          entityId: id,
          after: {
            assignee: existing.email,
            assigneeName: [existing.firstName, existing.lastName].filter(Boolean).join(' ') || existing.email,
            acknowledgment: 'I understand assigning Admin privileges requires trust and knowledge of Tip Pooling laws and ethics',
            acknowledgedBy: caller.email,
            acknowledgedAt: new Date().toISOString(),
          },
          req,
        });
      }

      const updates: Record<string, unknown> = {};
      if (req.body.firstName !== undefined) updates.firstName = req.body.firstName;
      if (req.body.lastName !== undefined) updates.lastName = req.body.lastName;
      if (req.body.role !== undefined) updates.role = req.body.role;
      if (req.body.locationId !== undefined) updates.locationId = req.body.locationId;
      if (req.body.twoFactorEnabled !== undefined) {
        updates.twoFactorEnabled = req.body.twoFactorEnabled;
        if (req.body.twoFactorEnabled) {
          updates.twoFactorMethod = 'EMAIL';
        } else {
          updates.twoFactorMethod = null;
        }
      }

      const updated = await prisma.user.update({
        where: { id },
        data: updates,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          mustChangePassword: true,
          twoFactorEnabled: true,
          locationId: true,
          location: { select: { id: true, name: true } },
          lastLoginAt: true,
          createdAt: true,
        },
      });

      await logAudit({
        orgId: caller.organizationId,
        userId: caller.id,
        action: 'UPDATE',
        entityType: 'User',
        entityId: id,
        before: { role: existing.role, locationId: existing.locationId },
        after: updates,
        req,
      });

      res.status(200).json({
        status: 'success',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /users/:id
 * Delete a user (Admin only, same org check, cannot delete self)
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(userIdParamsSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const caller = (req as AuthenticatedRequest).user;
      const { id } = req.params;

      if (id === caller.id) {
        res.status(400).json({
          status: 'error',
          error: { code: 'VALIDATION_ERROR', message: 'Cannot delete your own account' },
        });
        return;
      }

      const existing = await prisma.user.findFirst({
        where: { id, organizationId: caller.organizationId },
      });
      if (!existing) {
        res.status(404).json({
          status: 'error',
          error: { code: 'NOT_FOUND', message: 'User not found' },
        });
        return;
      }

      await prisma.user.delete({ where: { id } });

      await logAudit({
        orgId: caller.organizationId,
        userId: caller.id,
        action: 'DELETE',
        entityType: 'User',
        entityId: id,
        before: { email: existing.email, role: existing.role },
        req,
      });

      res.status(200).json({
        status: 'success',
        data: { message: 'User deleted successfully' },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
