/**
 * Audit Log Routes
 *
 * Read-only endpoints for viewing the audit trail.
 * All routes require ADMIN role.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateQuery, validateParams } from '../middleware/validate';
import { getAuditLogs, getAuditLog } from '../services/audit.service';
import { ApiResponse, AuthenticatedRequest } from '../types/index';
import { UserRole } from '@prisma/client';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const listAuditLogsQuerySchema = z.object({
  entityType: z.string().optional(),
  action: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const auditLogIdParamsSchema = z.object({
  id: z.string().uuid(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /audit-logs
 * List audit logs for the organization (Admin only)
 */
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validateQuery(listAuditLogsQuerySchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      const result = await getAuditLogs({
        orgId: user.organizationId,
        entityType: req.query.entityType as string | undefined,
        action: req.query.action as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
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
 * GET /audit-logs/:id
 * Get a single audit log entry (Admin only)
 */
router.get(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(auditLogIdParamsSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { id } = req.params;

      const log = await getAuditLog(user.organizationId, id);

      if (!log) {
        res.status(404).json({
          status: 'error',
          error: { code: 'NOT_FOUND', message: 'Audit log entry not found' },
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: log,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
