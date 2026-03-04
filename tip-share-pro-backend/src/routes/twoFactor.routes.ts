/**
 * Two-Factor Authentication Routes
 *
 * Email + SMS based 2FA (no authenticator apps — Tom's preference).
 * Uses TwoFactorCode model for code storage.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { prisma } from '../utils/prisma';
import { config } from '../config/index';
import { emailService } from '../services/email.service';
import { smsService } from '../services/sms.service';
import { send2FACodeEmail } from '../services/notifications.service';
import { logAudit } from '../services/audit.service';
import { ApiResponse, AuthenticatedRequest, AuthenticatedUser, JwtPayload } from '../types/index';
import { logger } from '../utils/logger';

const router = Router();

const CODE_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 3;
const TEMP_TOKEN_EXPIRY = '5m';

// ============================================================================
// Helpers
// ============================================================================

function generateCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

async function hashCode(code: string): Promise<string> {
  return bcrypt.hash(code, 6); // Lower rounds for faster verify during login
}

async function sendCode(method: 'EMAIL' | 'SMS', recipient: string, code: string): Promise<void> {
  if (method === 'EMAIL') {
    await send2FACodeEmail(recipient, code);
  } else {
    await smsService.sendSms({
      to: recipient,
      body: `TipSharePro code: ${code}. Expires in ${CODE_EXPIRY_MINUTES} min.`,
    });
  }
}

function generateTempToken(userId: string): string {
  return jwt.sign({ sub: userId, purpose: '2fa' }, config.jwt.secret, {
    expiresIn: TEMP_TOKEN_EXPIRY,
  });
}

function verifyTempToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { sub: string; purpose: string };
    if (decoded.purpose !== '2fa') return null;
    return decoded.sub;
  } catch {
    return null;
  }
}

// ============================================================================
// Validation Schemas
// ============================================================================

const setupSchema = z.object({
  method: z.enum(['EMAIL', 'SMS']),
  phone: z.string().min(10).optional(),
});

const verifyCodeSchema = z.object({
  code: z.string().length(6),
});

const sendCodeSchema = z.object({
  tempToken: z.string(),
});

const verifyLoginSchema = z.object({
  tempToken: z.string(),
  code: z.string().length(6),
});

// ============================================================================
// Setup Routes (require auth)
// ============================================================================

/**
 * POST /auth/2fa/setup
 * Enable 2FA — sends a test code to verify the method works
 */
router.post(
  '/setup',
  authenticate,
  validate(setupSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { method, phone } = req.body;

      // For SMS, phone is required
      if (method === 'SMS' && !phone) {
        res.status(400).json({
          status: 'error',
          error: { code: 'VALIDATION_ERROR', message: 'Phone number is required for SMS 2FA' },
        });
        return;
      }

      // Update user phone if SMS
      if (method === 'SMS' && phone) {
        await prisma.user.update({
          where: { id: user.id },
          data: { phone },
        });
      }

      // Generate and store code
      const code = generateCode();
      const codeHash = await hashCode(code);

      // Clean up old codes
      await prisma.twoFactorCode.deleteMany({ where: { userId: user.id } });

      await prisma.twoFactorCode.create({
        data: {
          userId: user.id,
          codeHash,
          method,
          expiresAt: new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000),
        },
      });

      // Send the code
      const recipient = method === 'EMAIL' ? user.email : phone!;
      await sendCode(method, recipient, code);

      logger.info({ userId: user.id, method }, '2FA setup code sent');

      res.status(200).json({
        status: 'success',
        data: { message: 'Verification code sent', method },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/2fa/verify-setup
 * Confirm 2FA setup with the test code
 */
router.post(
  '/verify-setup',
  authenticate,
  validate(verifyCodeSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { code } = req.body;

      const twoFactorCode = await prisma.twoFactorCode.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
          attempts: { lt: MAX_ATTEMPTS },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!twoFactorCode) {
        res.status(400).json({
          status: 'error',
          error: { code: 'INVALID_CODE', message: 'No valid code found. Please request a new one.' },
        });
        return;
      }

      const isValid = await bcrypt.compare(code, twoFactorCode.codeHash);

      if (!isValid) {
        await prisma.twoFactorCode.update({
          where: { id: twoFactorCode.id },
          data: { attempts: twoFactorCode.attempts + 1 },
        });

        res.status(400).json({
          status: 'error',
          error: { code: 'INVALID_CODE', message: 'Invalid code. Please try again.' },
        });
        return;
      }

      // Enable 2FA
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorEnabled: true,
          twoFactorMethod: twoFactorCode.method,
        },
      });

      // Clean up
      await prisma.twoFactorCode.deleteMany({ where: { userId: user.id } });

      await logAudit({
        orgId: user.organizationId,
        userId: user.id,
        action: 'ENABLE_2FA',
        entityType: 'User',
        entityId: user.id,
        after: { method: twoFactorCode.method },
        req,
      });

      res.status(200).json({
        status: 'success',
        data: { message: '2FA enabled successfully', method: twoFactorCode.method },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/2fa/disable
 * Disable 2FA (requires a current code for security)
 */
router.post(
  '/disable',
  authenticate,
  validate(verifyCodeSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { code } = req.body;

      const twoFactorCode = await prisma.twoFactorCode.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
          attempts: { lt: MAX_ATTEMPTS },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!twoFactorCode) {
        res.status(400).json({
          status: 'error',
          error: { code: 'INVALID_CODE', message: 'No valid code found. Please request a new one.' },
        });
        return;
      }

      const isValid = await bcrypt.compare(code, twoFactorCode.codeHash);
      if (!isValid) {
        await prisma.twoFactorCode.update({
          where: { id: twoFactorCode.id },
          data: { attempts: twoFactorCode.attempts + 1 },
        });
        res.status(400).json({
          status: 'error',
          error: { code: 'INVALID_CODE', message: 'Invalid code.' },
        });
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: false, twoFactorMethod: null },
      });

      await prisma.twoFactorCode.deleteMany({ where: { userId: user.id } });

      await logAudit({
        orgId: user.organizationId,
        userId: user.id,
        action: 'DISABLE_2FA',
        entityType: 'User',
        entityId: user.id,
        req,
      });

      res.status(200).json({
        status: 'success',
        data: { message: '2FA disabled' },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================================
// Login Routes (no auth — these are called during the login flow)
// ============================================================================

/**
 * POST /auth/2fa/send-code
 * Send 2FA code during login (uses temp token from login response)
 */
router.post(
  '/send-code',
  validate(sendCodeSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const { tempToken } = req.body;
      const userId = verifyTempToken(tempToken);

      if (!userId) {
        res.status(401).json({
          status: 'error',
          error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
        });
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.twoFactorEnabled || !user.twoFactorMethod) {
        res.status(400).json({
          status: 'error',
          error: { code: 'TWO_FACTOR_NOT_ENABLED', message: '2FA is not enabled for this account' },
        });
        return;
      }

      const code = generateCode();
      const codeHash = await hashCode(code);

      await prisma.twoFactorCode.deleteMany({ where: { userId } });
      await prisma.twoFactorCode.create({
        data: {
          userId,
          codeHash,
          method: user.twoFactorMethod,
          expiresAt: new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000),
        },
      });

      const recipient = user.twoFactorMethod === 'EMAIL' ? user.email : user.phone!;
      await sendCode(user.twoFactorMethod, recipient, code);

      res.status(200).json({
        status: 'success',
        data: { message: 'Code sent', method: user.twoFactorMethod },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/2fa/verify
 * Verify 2FA code during login → returns real JWT
 */
router.post(
  '/verify',
  validate(verifyLoginSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const { tempToken, code } = req.body;
      const userId = verifyTempToken(tempToken);

      if (!userId) {
        res.status(401).json({
          status: 'error',
          error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { organization: true },
      });

      if (!user) {
        res.status(404).json({
          status: 'error',
          error: { code: 'NOT_FOUND', message: 'User not found' },
        });
        return;
      }

      const twoFactorCode = await prisma.twoFactorCode.findFirst({
        where: {
          userId,
          expiresAt: { gt: new Date() },
          attempts: { lt: MAX_ATTEMPTS },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!twoFactorCode) {
        res.status(400).json({
          status: 'error',
          error: { code: 'INVALID_CODE', message: 'No valid code found. Please request a new one.' },
        });
        return;
      }

      const isValid = await bcrypt.compare(code, twoFactorCode.codeHash);
      if (!isValid) {
        await prisma.twoFactorCode.update({
          where: { id: twoFactorCode.id },
          data: { attempts: twoFactorCode.attempts + 1 },
        });
        res.status(400).json({
          status: 'error',
          error: { code: 'INVALID_CODE', message: 'Invalid code.' },
        });
        return;
      }

      // Clean up codes
      await prisma.twoFactorCode.deleteMany({ where: { userId } });

      // Generate real JWT
      const payload: JwtPayload = {
        sub: user.id,
        org: user.organizationId,
        loc: user.locationId,
        role: user.role,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 min
      };
      const token = jwt.sign(payload, config.jwt.secret);

      // Update last login
      await prisma.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() },
      });

      const nameParts = user.email.split('@')[0].split(/[._-]/);
      const name = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name,
            companyName: user.organization.name,
            role: user.role,
            locationId: user.locationId,
          },
          organization: {
            id: user.organization.id,
            name: user.organization.name,
            subscriptionStatus: user.organization.subscriptionStatus,
            trialEndsAt: user.organization.trialEndsAt?.toISOString() || null,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
