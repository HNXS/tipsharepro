/**
 * Billing Routes
 *
 * Handles Stripe checkout, portal, subscription info, and webhooks.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { AuthenticatedRequest, ApiResponse } from '../types/index';
import { config } from '../config/index';
import {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionInfo,
  constructWebhookEvent,
  handleWebhookEvent,
} from '../services/stripe.service';

const router = Router();

/**
 * POST /billing/create-checkout
 * Create a Stripe Checkout Session for subscription.
 * Requires ADMIN role.
 */
router.post(
  '/create-checkout',
  authenticate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      if (user.role !== 'ADMIN') {
        res.status(403).json({
          status: 'error',
          error: { code: 'FORBIDDEN', message: 'Only admins can manage billing' },
        });
        return;
      }

      const returnUrl = `${config.frontendUrl}`;
      const url = await createCheckoutSession(user.organizationId, returnUrl);

      res.status(200).json({
        status: 'success',
        data: { url },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /billing/create-portal
 * Create a Stripe Customer Portal session.
 * Requires ADMIN role.
 */
router.post(
  '/create-portal',
  authenticate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      if (user.role !== 'ADMIN') {
        res.status(403).json({
          status: 'error',
          error: { code: 'FORBIDDEN', message: 'Only admins can manage billing' },
        });
        return;
      }

      const returnUrl = `${config.frontendUrl}`;
      const url = await createPortalSession(user.organizationId, returnUrl);

      res.status(200).json({
        status: 'success',
        data: { url },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /billing/subscription
 * Get current subscription info.
 * Requires ADMIN role.
 */
router.get(
  '/subscription',
  authenticate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      if (user.role !== 'ADMIN') {
        res.status(403).json({
          status: 'error',
          error: { code: 'FORBIDDEN', message: 'Only admins can view billing' },
        });
        return;
      }

      const info = await getSubscriptionInfo(user.organizationId);

      res.status(200).json({
        status: 'success',
        data: info,
      });
    } catch (error) {
      // Gracefully handle billing errors (Stripe not configured, DB issues, etc.)
      // Return a fallback response so the UI doesn't break
      res.status(200).json({
        status: 'success',
        data: {
          status: 'TRIAL',
          plan: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          stripeConfigured: false,
        },
      });
    }
  }
);

/**
 * POST /billing/webhook
 * Stripe webhook handler.
 * IMPORTANT: This route must receive the raw body (not JSON-parsed).
 * The raw body middleware is configured in the main index.ts.
 */
router.post(
  '/webhook',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers['stripe-signature'] as string;
      if (!signature) {
        res.status(400).json({ error: 'Missing stripe-signature header' });
        return;
      }

      // req.body is raw Buffer when this route is configured with raw body parser
      const event = constructWebhookEvent(req.body, signature);
      await handleWebhookEvent(event);

      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
