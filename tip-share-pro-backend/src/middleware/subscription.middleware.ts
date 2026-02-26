/**
 * Subscription Enforcement Middleware
 *
 * Checks organization subscription status on every authenticated request.
 * Auto-transitions expired DEMO/TRIAL to SUSPENDED.
 * Blocks write operations for SUSPENDED/CANCELLED accounts.
 */

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../types/index';

// In-memory cache: orgId -> { status, trialEndsAt, cachedAt }
const orgCache = new Map<string, {
  status: string;
  trialEndsAt: Date | null;
  cachedAt: number;
}>();

const CACHE_TTL_MS = 60_000; // 60 seconds

/**
 * Clear cached entry for an org (call after status changes)
 */
export function invalidateOrgCache(orgId: string): void {
  orgCache.delete(orgId);
}

/**
 * Enforce subscription status.
 * Must be used AFTER authenticate middleware.
 */
export async function enforceSubscription(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      next();
      return;
    }

    const orgId = user.organizationId;
    const now = Date.now();

    // Check cache
    let cached = orgCache.get(orgId);
    if (!cached || (now - cached.cachedAt) > CACHE_TTL_MS) {
      const org = await prisma.organization.findUnique({
        where: { id: orgId },
        select: { subscriptionStatus: true, trialEndsAt: true },
      });

      if (!org) {
        res.status(403).json({
          status: 'error',
          error: { code: 'ORG_NOT_FOUND', message: 'Organization not found' },
        });
        return;
      }

      cached = {
        status: org.subscriptionStatus,
        trialEndsAt: org.trialEndsAt,
        cachedAt: now,
      };
      orgCache.set(orgId, cached);
    }

    let { status } = cached;
    const { trialEndsAt } = cached;

    // Auto-suspend expired DEMO/TRIAL
    if ((status === 'DEMO' || status === 'TRIAL') && trialEndsAt && trialEndsAt.getTime() < now) {
      await prisma.organization.update({
        where: { id: orgId },
        data: { subscriptionStatus: 'SUSPENDED' },
      });
      status = 'SUSPENDED';
      orgCache.set(orgId, { ...cached, status: 'SUSPENDED', cachedAt: now });
    }

    // Block writes for suspended/cancelled
    if (status === 'SUSPENDED' || status === 'CANCELLED') {
      const method = req.method.toUpperCase();
      if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
        res.status(403).json({
          status: 'error',
          error: {
            code: 'SUBSCRIPTION_EXPIRED',
            message: 'Your access has expired. Contact TipSharePro to continue.',
          },
        });
        return;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
