/**
 * Stripe Service
 *
 * Handles Stripe Checkout, Customer Portal, and subscription management.
 */

import Stripe from 'stripe';
import { config } from '../config/index';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { sendPaymentReceiptEmail, sendAccountSuspendedEmail } from './notifications.service';

// Initialize Stripe (only if key is configured)
const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, { apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion })
  : null;

function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY in environment.');
  }
  return stripe;
}

/**
 * Get or create a Stripe customer for an organization.
 */
export async function getOrCreateCustomer(orgId: string): Promise<string> {
  const s = requireStripe();

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { stripeCustomerId: true, name: true },
  });

  if (!org) throw new Error('Organization not found');

  // Return existing customer
  if (org.stripeCustomerId) return org.stripeCustomerId;

  // Find primary admin email for the org
  const admin = await prisma.user.findFirst({
    where: { organizationId: orgId, role: 'ADMIN' },
    select: { email: true },
  });

  // Create new Stripe customer
  const customer = await s.customers.create({
    name: org.name,
    email: admin?.email || undefined,
    metadata: { orgId },
  });

  // Store the customer ID
  await prisma.organization.update({
    where: { id: orgId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * Create a Stripe Checkout Session for subscription.
 */
export async function createCheckoutSession(orgId: string, returnUrl: string): Promise<string> {
  const s = requireStripe();
  const customerId = await getOrCreateCustomer(orgId);

  const session = await s.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [
      {
        price: config.stripe.priceId,
        quantity: 1,
      },
    ],
    success_url: `${returnUrl}?billing=success`,
    cancel_url: `${returnUrl}?billing=cancelled`,
    metadata: { orgId },
  });

  return session.url || '';
}

/**
 * Create a Stripe Customer Portal session.
 */
export async function createPortalSession(orgId: string, returnUrl: string): Promise<string> {
  const s = requireStripe();
  const customerId = await getOrCreateCustomer(orgId);

  const session = await s.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

/**
 * Get subscription info for an organization.
 */
export async function getSubscriptionInfo(orgId: string): Promise<{
  status: string;
  plan: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeConfigured: boolean;
}> {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { stripeCustomerId: true, subscriptionStatus: true },
  });

  if (!org) {
    return {
      status: 'DEMO',
      plan: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      stripeConfigured: !!stripe,
    };
  }

  // If Stripe is not configured, return DB-only subscription info
  if (!stripe) {
    return {
      status: org.subscriptionStatus,
      plan: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      stripeConfigured: false,
    };
  }

  if (!org.stripeCustomerId) {
    return {
      status: org.subscriptionStatus,
      plan: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      stripeConfigured: true,
    };
  }

  // Get active subscriptions from Stripe
  const subscriptions = await stripe.subscriptions.list({
    customer: org.stripeCustomerId,
    status: 'active',
    limit: 1,
  });

  if (subscriptions.data.length === 0) {
    return {
      status: org.subscriptionStatus,
      plan: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      stripeConfigured: true,
    };
  }

  const sub = subscriptions.data[0];
  const priceNickname = sub.items.data[0]?.price?.nickname || 'TipSharePro';

  // In Stripe SDK v20+, current_period_end is not on the Subscription object.
  // Use cancel_at for scheduled cancellations, or get the latest invoice period_end.
  let nextBillingDate: string | null = null;
  if (sub.cancel_at) {
    nextBillingDate = new Date(sub.cancel_at * 1000).toISOString();
  } else {
    try {
      const invoices = await stripe.invoices.list({
        subscription: sub.id,
        status: 'paid',
        limit: 1,
      });
      if (invoices.data.length > 0 && invoices.data[0].period_end) {
        nextBillingDate = new Date(invoices.data[0].period_end * 1000).toISOString();
      }
    } catch {
      // If no invoices, leave as null
    }
  }

  return {
    status: org.subscriptionStatus,
    plan: priceNickname,
    currentPeriodEnd: nextBillingDate,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    stripeConfigured: true,
  };
}

/**
 * Handle Stripe webhook events.
 */
export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.orgId;
      if (orgId) {
        await prisma.organization.update({
          where: { id: orgId },
          data: { subscriptionStatus: 'ACTIVE' },
        });
        logger.info({ orgId }, 'Subscription activated via checkout');
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        const org = await prisma.organization.findFirst({
          where: { stripeCustomerId: customerId },
          include: { users: { where: { role: 'ADMIN' }, select: { email: true }, take: 1 } },
        });
        if (org) {
          await prisma.organization.update({
            where: { id: org.id },
            data: { subscriptionStatus: 'ACTIVE' },
          });
          logger.info({ orgId: org.id }, 'Subscription renewed via invoice.paid');

          // Send payment receipt to admin
          const adminEmail = org.users[0]?.email;
          if (adminEmail && invoice.amount_paid) {
            const amount = `$${(invoice.amount_paid / 100).toFixed(2)}`;
            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            sendPaymentReceiptEmail(adminEmail, org.name, amount, date);
          }
        }
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        const org = await prisma.organization.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (org) {
          // Don't suspend immediately — Stripe retries. Just log it.
          logger.warn({ orgId: org.id }, 'Payment failed for subscription');
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
      if (customerId) {
        const org = await prisma.organization.findFirst({
          where: { stripeCustomerId: customerId },
          include: { users: { where: { role: 'ADMIN' }, select: { email: true }, take: 1 } },
        });
        if (org) {
          await prisma.organization.update({
            where: { id: org.id },
            data: { subscriptionStatus: 'CANCELLED' },
          });
          logger.info({ orgId: org.id }, 'Subscription cancelled');

          // Notify admin about cancellation
          const adminEmail = org.users[0]?.email;
          if (adminEmail) {
            sendAccountSuspendedEmail(adminEmail, org.name);
          }
        }
      }
      break;
    }

    default:
      // Unhandled event type
      logger.debug({ type: event.type }, 'Unhandled Stripe event');
  }
}

/**
 * Construct and verify a Stripe webhook event from raw body.
 */
export function constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
  const s = requireStripe();
  return s.webhooks.constructEvent(rawBody, signature, config.stripe.webhookSecret);
}
