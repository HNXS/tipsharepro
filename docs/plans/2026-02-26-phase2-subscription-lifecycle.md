# Phase 2: Subscription Lifecycle Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the Demo→Trial→Active subscription lifecycle with time-limited access, read-only lockout on expiry, and Command Center account management.

**Architecture:** Backend middleware enforces subscription status on every authenticated request. Expired DEMO/TRIAL accounts auto-transition to SUSPENDED. Frontend shows countdown banners and disables editing for expired accounts. Tom manages all status transitions from the Command Center.

**Tech Stack:** Express middleware, Prisma ORM, React context, existing admin API infrastructure.

---

### Task 1: Backend — Subscription Enforcement Middleware

**Files:**
- Create: `tip-share-pro-backend/src/middleware/subscription.middleware.ts`

**Step 1: Create the middleware file**

```typescript
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
```

**Step 2: Verify it compiles**

Run: `cd tip-share-pro-backend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add tip-share-pro-backend/src/middleware/subscription.middleware.ts
git commit -m "feat: add subscription enforcement middleware"
```

---

### Task 2: Backend — Wire Middleware Into Routes

**Files:**
- Modify: `tip-share-pro-backend/src/routes/index.ts`

**Step 1: Add subscription middleware to authenticated routes**

Import the middleware at the top of `routes/index.ts`:

```typescript
import { authenticate } from '../middleware/auth.middleware';
import { enforceSubscription } from '../middleware/subscription.middleware';
```

Apply both `authenticate` and `enforceSubscription` as route-level middleware for the protected routes. The key change is in how routes are mounted — add `enforceSubscription` after `authenticate` for settings, job-categories, employees, pay-periods, and calculate routes.

Since each route file currently applies `authenticate` internally per-route, the cleanest approach is to add `enforceSubscription` as a router-level middleware that runs after auth on these paths:

```typescript
// After the auth routes (which are public), apply subscription enforcement
// to all other authenticated routes
const protectedRoutes = Router();
protectedRoutes.use(enforceSubscription);
protectedRoutes.use('/settings', settingsRoutes);
protectedRoutes.use('/job-categories', jobCategoryRoutes);
protectedRoutes.use('/employees', employeeRoutes);
protectedRoutes.use('/pay-periods', payPeriodRoutes);
protectedRoutes.use('/pay-periods', calculationRoutes);
protectedRoutes.use('/pay-periods', dailyEntryRoutes);
protectedRoutes.use('/calculate', calculationRoutes);
router.use(protectedRoutes);
```

Note: Auth routes (`/auth`) and admin routes (`/admin`) are NOT wrapped — they remain exempt.

**Step 2: Verify it compiles**

Run: `cd tip-share-pro-backend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add tip-share-pro-backend/src/routes/index.ts
git commit -m "feat: wire subscription middleware into protected routes"
```

---

### Task 3: Backend — Set trialEndsAt on Self-Signup

**Files:**
- Modify: `tip-share-pro-backend/src/services/auth.service.ts`

**Step 1: Update the register method**

In the `register()` method, when creating the organization, add `trialEndsAt`:

```typescript
const DEMO_DURATION_DAYS = 14;

// Inside register(), when creating the organization:
const trialEndsAt = new Date();
trialEndsAt.setDate(trialEndsAt.getDate() + DEMO_DURATION_DAYS);

const organization = await tx.organization.create({
  data: {
    name: orgName,
    subscriptionStatus: 'DEMO',
    trialEndsAt,
  },
});
```

**Step 2: Add trialEndsAt and subscriptionStatus to auth responses**

In the login result and session info, add the org's subscription data. Modify `getSession()` return:

```typescript
return {
  user: { /* existing fields */ },
  organization: {
    id: user.organization.id,
    name: user.organization.name,
    subscriptionStatus: user.organization.subscriptionStatus,
    trialEndsAt: user.organization.trialEndsAt?.toISOString() || null,
  },
};
```

Do the same for the `login()` and `register()` methods — add `organization` to the return object:

```typescript
return {
  token,
  expiresIn: config.jwt.accessExpiry,
  user: { /* existing fields */ },
  organization: {
    id: user.organization.id,
    name: user.organization.name,
    subscriptionStatus: user.organization.subscriptionStatus,
    trialEndsAt: user.organization.trialEndsAt?.toISOString() || null,
  },
};
```

Update the `LoginResult` and `SessionInfo` interfaces accordingly.

**Step 3: Verify it compiles**

Run: `cd tip-share-pro-backend && npx tsc --noEmit`

**Step 4: Commit**

```bash
git add tip-share-pro-backend/src/services/auth.service.ts
git commit -m "feat: set 14-day demo expiry on signup, add subscription info to auth responses"
```

---

### Task 4: Backend — Admin Account Management Endpoints

**Files:**
- Modify: `tip-share-pro-backend/src/routes/admin.routes.ts`

**Step 1: Add account creation endpoint (with user + org + location in one call)**

Add a `POST /admin/accounts` route that creates an organization, location, and user in a transaction — same as self-signup but with Tom's chosen status and end date:

```typescript
/**
 * POST /admin/accounts - Create a full account (org + location + user)
 */
router.post('/accounts', async (req: Request, res: Response) => {
  try {
    const { email, password, companyName, subscriptionStatus = 'DEMO', durationDays } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'VALIDATION_ERROR', message: 'email and password are required' },
      });
    }

    const normalizedEmail = email.toLowerCase();
    const orgName = companyName?.trim() || normalizedEmail.split('@')[1];
    const passwordHash = await bcrypt.hash(password, 10);

    const defaultDays = subscriptionStatus === 'TRIAL' ? 45 : 14;
    const days = durationDays || defaultDays;
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + days);

    const user = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: orgName,
          subscriptionStatus,
          trialEndsAt: subscriptionStatus === 'ACTIVE' ? null : trialEndsAt,
        },
      });

      const location = await tx.location.create({
        data: {
          organizationId: organization.id,
          name: 'Main Location',
          number: '001',
        },
      });

      return tx.user.create({
        data: {
          organizationId: organization.id,
          locationId: location.id,
          email: normalizedEmail,
          passwordHash,
          role: 'ADMIN',
        },
        include: { organization: true, location: true },
      });
    });

    const { passwordHash: _, ...sanitized } = user;

    res.status(201).json({ status: 'success', data: sanitized });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to create account' },
    });
  }
});
```

**Step 2: Add status change endpoint**

```typescript
/**
 * PUT /admin/accounts/:orgId/status - Change subscription status
 */
router.put('/accounts/:orgId/status', async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const { status, durationDays } = req.body;

    const validStatuses = ['DEMO', 'TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'VALIDATION_ERROR', message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
      });
    }

    const updateData: Record<string, unknown> = { subscriptionStatus: status };

    if (status === 'ACTIVE' || status === 'CANCELLED') {
      updateData.trialEndsAt = null; // No expiry
    } else if (status === 'TRIAL' || status === 'DEMO') {
      const defaultDays = status === 'TRIAL' ? 45 : 14;
      const days = durationDays || defaultDays;
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + days);
      updateData.trialEndsAt = trialEndsAt;
    }

    const org = await prisma.organization.update({
      where: { id: orgId },
      data: updateData,
    });

    // Invalidate cache so middleware picks up the change immediately
    const { invalidateOrgCache } = await import('../middleware/subscription.middleware');
    invalidateOrgCache(orgId);

    res.json({ status: 'success', data: org });
  } catch (error) {
    console.error('Error updating account status:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to update account status' },
    });
  }
});
```

**Step 3: Add extend endpoint**

```typescript
/**
 * PUT /admin/accounts/:orgId/extend - Extend trial by N days
 */
router.put('/accounts/:orgId/extend', async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const { days } = req.body;

    if (!days || days < 1) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'VALIDATION_ERROR', message: 'days must be a positive number' },
      });
    }

    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'NOT_FOUND', message: 'Organization not found' },
      });
    }

    // Extend from current end date (or from now if already expired)
    const baseDate = org.trialEndsAt && org.trialEndsAt > new Date() ? org.trialEndsAt : new Date();
    const newEndDate = new Date(baseDate);
    newEndDate.setDate(newEndDate.getDate() + days);

    // If suspended, reactivate to previous tier
    const newStatus = org.subscriptionStatus === 'SUSPENDED'
      ? (org.trialEndsAt ? 'TRIAL' : 'DEMO')
      : org.subscriptionStatus;

    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: { trialEndsAt: newEndDate, subscriptionStatus: newStatus },
    });

    const { invalidateOrgCache } = await import('../middleware/subscription.middleware');
    invalidateOrgCache(orgId);

    res.json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Error extending trial:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to extend trial' },
    });
  }
});
```

**Step 4: Verify it compiles**

Run: `cd tip-share-pro-backend && npx tsc --noEmit`

**Step 5: Commit**

```bash
git add tip-share-pro-backend/src/routes/admin.routes.ts
git commit -m "feat: add admin account management endpoints (create, status change, extend)"
```

---

### Task 5: Frontend — Add Subscription State to Auth Types & DemoContext

**Files:**
- Modify: `tip-share-pro-app/src/lib/api/auth.ts`
- Modify: `tip-share-pro-app/src/lib/DemoContext.tsx`

**Step 1: Update auth types**

Add `subscriptionStatus` and `trialEndsAt` to `LoginResponse` and `SessionResponse` organization objects in `auth.ts`.

In `SessionResponse.organization`, add:
```typescript
subscriptionStatus: 'DEMO' | 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
trialEndsAt: string | null;
```

Add a new `organization` field to `LoginResponse`:
```typescript
organization: {
  id: string;
  name: string;
  subscriptionStatus: 'DEMO' | 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  trialEndsAt: string | null;
};
```

**Step 2: Update DemoContext internal state**

Add to `InternalState`:
```typescript
subscriptionStatus: 'DEMO' | 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
trialEndsAt: string | null;
```

**Step 3: Update session restore and login handlers**

In `restoreSession()`, after calling `getSession()`, store the subscription fields:
```typescript
subscriptionStatus: session.organization.subscriptionStatus,
trialEndsAt: session.organization.trialEndsAt,
```

In `handleLoginSuccess()`, for real accounts, set defaults and let `loadUserData()` populate them. After the login response is available (passed through from LoginPage), store the values.

**Step 4: Add helper functions**

```typescript
function isSubscriptionExpired(
  status: string,
  trialEndsAt: string | null
): boolean {
  if (status === 'SUSPENDED' || status === 'CANCELLED') return true;
  if ((status === 'DEMO' || status === 'TRIAL') && trialEndsAt) {
    return new Date(trialEndsAt).getTime() < Date.now();
  }
  return false;
}

function getDaysRemaining(trialEndsAt: string | null): number | null {
  if (!trialEndsAt) return null;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
```

**Step 5: Expose to context consumers**

Add to `ExtendedDemoState`:
```typescript
subscriptionStatus: 'DEMO' | 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
trialEndsAt: string | null;
isExpired: boolean;
daysRemaining: number | null;
```

Compute `isExpired` and `daysRemaining` in the `exposedState` object using the helpers.

**Step 6: Verify it compiles**

Run: `cd tip-share-pro-app && npx tsc --noEmit`

**Step 7: Commit**

```bash
git add tip-share-pro-app/src/lib/api/auth.ts tip-share-pro-app/src/lib/DemoContext.tsx
git commit -m "feat: add subscription status to frontend state and auth types"
```

---

### Task 6: Frontend — Subscription Banner Component

**Files:**
- Create: `tip-share-pro-app/src/components/SubscriptionBanner.tsx`
- Modify: `tip-share-pro-app/src/app/page.tsx`

**Step 1: Create the banner component**

```typescript
'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { AlertTriangle, Clock, X } from 'lucide-react';

export default function SubscriptionBanner() {
  const { state } = useDemo();
  const [dismissed, setDismissed] = useState(false);

  const { subscriptionStatus, isExpired, daysRemaining } = state;

  // ACTIVE accounts or demo mode (demo@tipsharepro.com) — no banner
  if (subscriptionStatus === 'ACTIVE' || !subscriptionStatus) return null;

  // Expired — full lockout banner (never dismissible)
  if (isExpired) {
    const label = subscriptionStatus === 'SUSPENDED' ? 'expired' : 'cancelled';
    return (
      <div className="subscription-banner subscription-banner-expired">
        <AlertTriangle size={18} />
        <span>
          Your access has {label}. Your data is safe — contact TipSharePro to continue.
        </span>
      </div>
    );
  }

  // Dismissed (only allowed if > 3 days remaining)
  if (dismissed && daysRemaining !== null && daysRemaining > 3) return null;

  // Active DEMO or TRIAL with countdown
  if (daysRemaining === null) return null;

  const isUrgent = daysRemaining <= 3;
  const label = subscriptionStatus === 'DEMO' ? 'Demo account' : 'Trial';

  return (
    <div className={`subscription-banner ${isUrgent ? 'subscription-banner-warning' : 'subscription-banner-info'}`}>
      <Clock size={16} />
      <span>
        {label} · {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining · Contact TipSharePro to upgrade
      </span>
      {!isUrgent && (
        <button
          onClick={() => setDismissed(true)}
          className="subscription-banner-dismiss"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
```

**Step 2: Add to page.tsx**

Import and render `<SubscriptionBanner />` inside the main app container, before `<Header />`.

**Step 3: Add CSS**

Add banner styles to the global CSS (subscription-banner, subscription-banner-info, subscription-banner-warning, subscription-banner-expired). Info = subtle blue/gray bar, warning = amber, expired = red.

**Step 4: Verify it compiles**

Run: `cd tip-share-pro-app && npx tsc --noEmit`

**Step 5: Commit**

```bash
git add tip-share-pro-app/src/components/SubscriptionBanner.tsx tip-share-pro-app/src/app/page.tsx
git commit -m "feat: add subscription countdown banner component"
```

---

### Task 7: Frontend — Disable Editing When Expired

**Files:**
- Modify: `tip-share-pro-app/src/lib/DemoContext.tsx`

**Step 1: Guard all write callbacks**

At the top of every mutation callback (`updateSettings`, `setContributionMethod`, `addEmployee`, `removeEmployee`, `updateEmployee`, `addJobToCategory`, `removeJob`, `updateCategoryWeight`, `setPrePaidAmount`), add an early return if expired:

```typescript
if (isSubscriptionExpired(stateRef.current.subscriptionStatus, stateRef.current.trialEndsAt)) {
  return;
}
```

This ensures the UI can't even trigger writes for expired accounts, regardless of whether the API would also block them.

**Step 2: Expose `isReadOnly` boolean**

Add to `ExtendedDemoState`:
```typescript
isReadOnly: boolean; // true when SUSPENDED or CANCELLED
```

Compute in `exposedState`:
```typescript
isReadOnly: isSubscriptionExpired(state.subscriptionStatus, state.trialEndsAt),
```

Components can use `state.isReadOnly` to disable inputs, hide add buttons, gray out controls.

**Step 3: Verify it compiles**

Run: `cd tip-share-pro-app && npx tsc --noEmit`

**Step 4: Commit**

```bash
git add tip-share-pro-app/src/lib/DemoContext.tsx
git commit -m "feat: guard mutations and expose isReadOnly for expired accounts"
```

---

### Task 8: Frontend — Admin Account Management UI

**Files:**
- Modify: `tip-share-pro-app/src/lib/api/admin.ts`
- Modify: `tip-share-pro-app/src/app/admin/page.tsx`

**Step 1: Add new admin API functions**

In `admin.ts`, add:

```typescript
export async function createAccount(data: {
  email: string;
  password: string;
  companyName?: string;
  subscriptionStatus?: string;
  durationDays?: number;
}): Promise<Organization> {
  return adminRequest<Organization>('/admin/accounts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function changeAccountStatus(
  orgId: string,
  data: { status: string; durationDays?: number }
): Promise<Organization> {
  return adminRequest<Organization>(`/admin/accounts/${orgId}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function extendAccount(
  orgId: string,
  days: number
): Promise<Organization> {
  return adminRequest<Organization>(`/admin/accounts/${orgId}/extend`, {
    method: 'PUT',
    body: JSON.stringify({ days }),
  });
}
```

**Step 2: Update the admin page**

Add to the organizations table:
- **Expires** column showing `trialEndsAt` with red highlight if < 7 days
- **Actions dropdown** with: Upgrade to Trial, Upgrade to Active, Extend (prompts for days), Suspend, Reactivate
- **Create Account** button that opens a form: email, password, company name, status (DEMO/TRIAL), auto-calculated end date
- **Expiring Soon** alert section at top showing accounts within 7 days of expiry

**Step 3: Verify it compiles**

Run: `cd tip-share-pro-app && npx tsc --noEmit`

**Step 4: Commit**

```bash
git add tip-share-pro-app/src/lib/api/admin.ts tip-share-pro-app/src/app/admin/page.tsx
git commit -m "feat: add account management UI to Command Center"
```

---

### Task 9: Frontend — Update LoginPage to Pass Organization Data

**Files:**
- Modify: `tip-share-pro-app/src/components/LoginPage.tsx`
- Modify: `tip-share-pro-app/src/lib/DemoContext.tsx`

**Step 1: Pass organization data from login response**

Update `LoginPageProps.onLoginSuccess` to accept organization data:

```typescript
onLoginSuccess: (user: {
  name: string;
  companyName: string;
  role: string;
  email?: string;
  locationId?: string | null;
  organization?: {
    subscriptionStatus: string;
    trialEndsAt: string | null;
  };
}) => void;
```

In the login and register handlers, pass `response.organization` through.

For the demo bypass, pass:
```typescript
organization: { subscriptionStatus: 'DEMO', trialEndsAt: null },
```

**Step 2: Update DemoContext handleLoginSuccess**

Accept the organization data and store `subscriptionStatus` and `trialEndsAt` in state.

**Step 3: Verify it compiles**

Run: `cd tip-share-pro-app && npx tsc --noEmit`

**Step 4: Commit**

```bash
git add tip-share-pro-app/src/components/LoginPage.tsx tip-share-pro-app/src/lib/DemoContext.tsx
git commit -m "feat: pass subscription data through login flow"
```

---

### Task 10: End-to-End Verification

**Step 1: Build both projects**

```bash
cd tip-share-pro-backend && npx tsc --noEmit
cd tip-share-pro-app && npx tsc --noEmit
```

**Step 2: Manual test checklist**

- [ ] Demo login (`demo@tipsharepro.com` / `demo123`) — no banner, full access, no API calls
- [ ] Self-signup — creates DEMO account with 14-day `trialEndsAt`
- [ ] Real account login — shows "Demo account · X days remaining" banner
- [ ] Expired account (set `trialEndsAt` to past via pgAdmin) — read-only lockout, red banner, edits blocked
- [ ] Command Center: Create Account, Upgrade to Trial, Extend, Suspend, Reactivate all work
- [ ] Command Center: Expiring Soon list shows accounts within 7 days

**Step 3: Commit any fixes**

```bash
git commit -m "fix: address issues found during e2e verification"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Subscription middleware | `subscription.middleware.ts` (new) |
| 2 | Wire middleware into routes | `routes/index.ts` |
| 3 | Set trialEndsAt on signup + add org to auth responses | `auth.service.ts` |
| 4 | Admin account management endpoints | `admin.routes.ts` |
| 5 | Frontend subscription state in auth types + DemoContext | `auth.ts`, `DemoContext.tsx` |
| 6 | Subscription banner component | `SubscriptionBanner.tsx` (new), `page.tsx` |
| 7 | Disable editing when expired | `DemoContext.tsx` |
| 8 | Admin account management UI | `admin.ts`, `admin/page.tsx` |
| 9 | Pass org data through login flow | `LoginPage.tsx`, `DemoContext.tsx` |
| 10 | End-to-end verification | All |
