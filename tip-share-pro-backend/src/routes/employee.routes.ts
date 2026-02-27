/**
 * Employee Routes
 *
 * CRUD operations for employees.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate, validateParams, validateQuery } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { employeeService } from '../services/employee.service';
import { ApiResponse, AuthenticatedRequest } from '../types/index';
import { UserRole, EmployeeStatus } from '@prisma/client';
import { logAudit } from '../services/audit.service';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const employeeIdParamsSchema = z.object({
  employeeId: z.string().uuid(),
});

const listEmployeesQuerySchema = z.object({
  locationId: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'TERMINATED']).optional(),
  jobCategoryId: z.string().uuid().optional(),
});

const createEmployeeSchema = z.object({
  name: z.string().min(1).max(100),
  locationId: z.string().uuid(),
  jobCategoryId: z.string().uuid(),
  hourlyRateCents: z.number().int().min(100).max(20000), // $1.00 - $200.00
  hiredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const updateEmployeeSchema = z.object({
  jobCategoryId: z.string().uuid().optional(),
  hourlyRateCents: z.number().int().min(100).max(20000).optional(),
  status: z.enum(['ACTIVE', 'TERMINATED']).optional(),
});

const correctNameSchema = z.object({
  name: z.string().min(1).max(100),
  reason: z.string().min(1).max(500),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /employees
 * Get all employees for the organization
 */
router.get(
  '/',
  authenticate,
  validateQuery(listEmployeesQuerySchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      const employees = await employeeService.getAll(user.organizationId, {
        locationId: req.query.locationId as string | undefined,
        status: req.query.status as EmployeeStatus | undefined,
        jobCategoryId: req.query.jobCategoryId as string | undefined,
      });

      res.status(200).json({
        status: 'success',
        data: { employees },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /employees/:employeeId
 * Get a single employee
 */
router.get(
  '/:employeeId',
  authenticate,
  validateParams(employeeIdParamsSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { employeeId } = req.params;

      const employee = await employeeService.getById(user.organizationId, employeeId);

      res.status(200).json({
        status: 'success',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /employees
 * Create a new employee (Manager+ only)
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(createEmployeeSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      const employee = await employeeService.create(user.organizationId, req.body);

      res.status(201).json({
        status: 'success',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /employees/:employeeId
 * Update an employee (Manager+ only)
 */
router.put(
  '/:employeeId',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validateParams(employeeIdParamsSchema),
  validate(updateEmployeeSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { employeeId } = req.params;

      // Fetch before state for audit
      const before = await employeeService.getById(user.organizationId, employeeId);

      const employee = await employeeService.update(
        user.organizationId,
        employeeId,
        req.body
      );

      await logAudit({
        orgId: user.organizationId,
        userId: user.id,
        action: 'UPDATE',
        entityType: 'Employee',
        entityId: employeeId,
        before: JSON.parse(JSON.stringify(before)),
        after: JSON.parse(JSON.stringify(employee)),
        req,
      });

      res.status(200).json({
        status: 'success',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /employees/:employeeId/name
 * Legal name correction (e.g. marriage) — creates audit log entry
 */
router.put(
  '/:employeeId/name',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(employeeIdParamsSchema),
  validate(correctNameSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { employeeId } = req.params;

      const before = await employeeService.getById(user.organizationId, employeeId);

      const employee = await employeeService.correctName(
        user.organizationId,
        user.id,
        employeeId,
        req.body.name,
        req.body.reason
      );

      await logAudit({
        orgId: user.organizationId,
        userId: user.id,
        action: 'NAME_CORRECTION',
        entityType: 'Employee',
        entityId: employeeId,
        before: { name: before.name },
        after: { name: req.body.name, reason: req.body.reason },
        req,
      });

      res.status(200).json({
        status: 'success',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /employees/:employeeId
 * Soft-delete an employee (Admin only)
 */
router.delete(
  '/:employeeId',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(employeeIdParamsSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { employeeId } = req.params;

      const before = await employeeService.getById(user.organizationId, employeeId);

      await employeeService.delete(user.organizationId, employeeId);

      await logAudit({
        orgId: user.organizationId,
        userId: user.id,
        action: 'DELETE',
        entityType: 'Employee',
        entityId: employeeId,
        before: JSON.parse(JSON.stringify(before)),
        req,
      });

      res.status(200).json({
        status: 'success',
        data: { message: 'Employee terminated successfully' },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
