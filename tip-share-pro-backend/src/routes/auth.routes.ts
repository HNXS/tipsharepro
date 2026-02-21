/**
 * Authentication Routes
 *
 * Handles demo login, logout, and session management.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth.middleware';
import { authService } from '../services/auth.service';
import { ApiResponse, AuthenticatedRequest } from '../types/index';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().optional(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /auth/login
 * Demo login endpoint - validates credentials and returns JWT
 */
router.post(
  '/login',
  validate(loginSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

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
 * POST /auth/register
 * Public registration endpoint - creates org, location, and user
 */
router.post(
  '/register',
  validate(registerSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const { email, password, companyName } = req.body;

      const result = await authService.register(email, password, companyName);

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/logout
 * Logout endpoint (stateless - just for frontend to clear token)
 */
router.post(
  '/logout',
  authenticate,
  (_req: Request, res: Response<ApiResponse>) => {
    // In a stateless JWT setup, the actual logout is handled client-side
    // by removing the token. This endpoint exists for API completeness
    // and could be used to invalidate refresh tokens in a more complex setup.
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Logged out successfully',
      },
    });
  }
);

/**
 * GET /auth/session
 * Get current session info (validates token and returns user info)
 */
router.get(
  '/session',
  authenticate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      const sessionInfo = await authService.getSession(user.id);

      res.status(200).json({
        status: 'success',
        data: sessionInfo,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
