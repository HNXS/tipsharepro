/**
 * Authentication Routes
 *
 * Handles demo login, logout, and session management.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth.middleware';
import { authService } from '../services/auth.service';
import { ApiResponse, AuthenticatedRequest } from '../types/index';
import { prisma } from '../utils/prisma';
import { config } from '../config/index';
import { emailService } from '../services/email.service';
import { smsService } from '../services/sms.service';
import crypto from 'crypto';
import { sendWelcomeEmail, send2FACodeEmail } from '../services/notifications.service';

const router = Router();

// Rate limiter for login/register: 5 attempts per minute per IP
const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    error: { code: 'RATE_LIMITED', message: 'Too many attempts. Please try again in a minute.' },
  },
});

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
  authLimiter,
  validate(loginSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Pre-check: does user have 2FA enabled?
      const user2fa = await prisma.user.findFirst({
        where: { email: email.toLowerCase() },
        select: { id: true, twoFactorEnabled: true, twoFactorMethod: true, phone: true, passwordHash: true },
      });

      if (user2fa && user2fa.twoFactorEnabled && user2fa.twoFactorMethod) {
        // Verify password first
        const isValidPassword = await bcrypt.compare(password, user2fa.passwordHash);
        if (!isValidPassword) {
          // Fall through to normal login for consistent error messages
          await authService.login(email, password); // Will throw UnauthorizedError
        }

        // Generate temp token for 2FA flow
        const tempToken = jwt.sign(
          { sub: user2fa.id, purpose: '2fa' },
          config.jwt.secret,
          { expiresIn: '5m' }
        );

        // Auto-send code
        const code = crypto.randomInt(100000, 999999).toString();
        const codeHash = await bcrypt.hash(code, 6);
        await prisma.twoFactorCode.deleteMany({ where: { userId: user2fa.id } });
        await prisma.twoFactorCode.create({
          data: {
            userId: user2fa.id,
            codeHash,
            method: user2fa.twoFactorMethod,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          },
        });

        if (user2fa.twoFactorMethod === 'EMAIL') {
          await send2FACodeEmail(email, code);
        } else {
          await smsService.sendSms({
            to: user2fa.phone!,
            body: `TipSharePro code: ${code}. Expires in 10 min.`,
          });
        }

        res.status(200).json({
          status: 'success',
          data: {
            requires2FA: true,
            tempToken,
            method: user2fa.twoFactorMethod,
          },
        });
        return;
      }

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
  authLimiter,
  validate(registerSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const { email, password, companyName } = req.body;

      const result = await authService.register(email, password, companyName);

      // Send welcome email (fire-and-forget)
      sendWelcomeEmail(email, companyName || result.user.companyName);

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

/**
 * POST /auth/change-password
 * Change password (used for first-login password reset)
 */
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { currentPassword, newPassword } = req.body;

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser) {
        res.status(404).json({ status: 'error', error: { code: 'NOT_FOUND', message: 'User not found' } });
        return;
      }

      const isValid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
      if (!isValid) {
        res.status(401).json({ status: 'error', error: { code: 'UNAUTHORIZED', message: 'Current password is incorrect' } });
        return;
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash, mustChangePassword: false },
      });

      res.status(200).json({ status: 'success', data: { message: 'Password changed successfully' } });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/refresh
 * Refresh the JWT token (extends session)
 */
router.post(
  '/refresh',
  authenticate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const authUser = (req as AuthenticatedRequest).user;
      const user = await prisma.user.findUnique({ where: { id: authUser.id } });
      if (!user) {
        res.status(401).json({ status: 'error', error: { code: 'UNAUTHORIZED', message: 'User not found' } });
        return;
      }
      const payload = {
        sub: user.id,
        org: user.organizationId,
        loc: user.locationId,
        role: user.role,
        email: user.email,
      };
      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.accessExpiry,
      } as jwt.SignOptions);
      res.status(200).json({
        status: 'success',
        data: { token, expiresIn: config.jwt.accessExpiry },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
