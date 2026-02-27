/**
 * Billing API Client
 *
 * Handles Stripe checkout, portal, and subscription info.
 */

import { get, post } from './client';

export interface SubscriptionInfo {
  status: string;
  plan: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export async function createCheckoutSession(): Promise<{ url: string }> {
  return post<{ url: string }>('/billing/create-checkout');
}

export async function createPortalSession(): Promise<{ url: string }> {
  return post<{ url: string }>('/billing/create-portal');
}

export async function getSubscription(): Promise<SubscriptionInfo> {
  return get<SubscriptionInfo>('/billing/subscription');
}
