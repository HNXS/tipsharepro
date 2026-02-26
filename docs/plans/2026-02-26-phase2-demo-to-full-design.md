# Phase 2: Demo to Full Version — Design Document

**Date:** 2026-02-26
**Goal:** Build the subscription lifecycle that takes clients from Demo → Trial → Paid, with time-limited access, read-only lockout on expiry, and full Command Center control for Tom.
**Stripe:** Deferred (schema ready, will bolt on when Tom provides credentials)

---

## Overview

Every organization progresses through a subscription lifecycle:

```
  Self-signup          Tom upgrades          Tom upgrades / Stripe (future)
     │                     │                       │
     ▼                     ▼                       ▼
   DEMO ──────────────► TRIAL ──────────────► ACTIVE
     │                     │                       │
     │ expired             │ expired               │ payment failed
     ▼                     ▼                       ▼
  SUSPENDED            SUSPENDED              SUSPENDED
     │                     │                       │
     │ Tom reactivates     │ Tom reactivates       │ payment retried
     ▼                     ▼                       ▼
   TRIAL               ACTIVE                 ACTIVE
                                                   │
                                                   │ user cancels
                                                   ▼
                                              CANCELLED
```

### Status Definitions

| Status | Duration | Who Sets It | User Experience |
|--------|----------|-------------|-----------------|
| DEMO | 14 days default | Self-signup or Tom | Full access, info bar with countdown |
| TRIAL | 45 days default | Tom only (from Command Center) | Full access, info bar with countdown |
| ACTIVE | No expiry | Tom manually (Stripe later) | Full access, no bar |
| SUSPENDED | Indefinite | Autopilot (on expiry) or Tom | Read-only: can view data, cannot edit/calculate/print |
| CANCELLED | Permanent | User cancels (future) | Read-only, terminal state |

### Anti-Exploitation Strategy

The demo allows real data (employees, settings, job categories) — this is intentional so data carries over seamlessly on upgrade. The gate is **time**, not features:

- Demo expires after 14 days → read-only lockout
- Tom personally controls all upgrades (Demo → Trial → Active)
- No way to reset the clock without Tom's involvement
- Autopilot auto-suspends expired accounts on next API request

---

## 1. Subscription State Machine

### Rules

- **DEMO → TRIAL:** Tom upgrades from Command Center. Sets new trialEndsAt (default +45 days from upgrade date).
- **TRIAL → ACTIVE:** Tom upgrades from Command Center (manual for now, Stripe-automated later). Clears trialEndsAt.
- **DEMO/TRIAL → SUSPENDED:** Automatic when trialEndsAt passes. Checked lazily on every authenticated request.
- **SUSPENDED → TRIAL/ACTIVE:** Tom reactivates from Command Center. Sets new trialEndsAt or clears it.
- **ACTIVE → SUSPENDED:** Future: Stripe payment failure.
- **ACTIVE → CANCELLED:** Future: User cancels subscription.

### Database

Already exists on Organization model — no migration needed:
- `subscriptionStatus` (enum: DEMO, TRIAL, ACTIVE, SUSPENDED, CANCELLED)
- `trialEndsAt` (nullable DateTime — used for both demo and trial end dates)
- `stripeCustomerId` (nullable — for future Stripe integration)

Only change: self-signup now sets `trialEndsAt = now + 14 days` instead of leaving it null.

---

## 2. Backend Middleware — Subscription Enforcement

New middleware: `subscriptionMiddleware.ts`

```
Request → authMiddleware (JWT) → subscriptionMiddleware → route handler
```

### Logic

1. Extract `org` ID from JWT payload (already available as `req.user.org`)
2. Fetch org's `subscriptionStatus` + `trialEndsAt` (with 60-second in-memory cache)
3. If status is DEMO or TRIAL and `trialEndsAt < now()`:
   - Auto-update status to SUSPENDED in database
4. If status is SUSPENDED or CANCELLED:
   - GET requests → allow (read-only access)
   - POST/PUT/DELETE requests → return `403 { error: "SUBSCRIPTION_EXPIRED", message: "Your access has expired. Contact TipSharePro to continue." }`
5. Otherwise → allow

### Exemptions (always allowed)

- `GET /auth/session` — frontend needs to check status
- `POST /auth/logout` — always let users log out
- All `/admin/*` routes — Command Center is exempt

### Performance

60-second TTL in-memory cache per org ID. ~1ms overhead per request. Cache invalidated when Tom changes status from Command Center.

---

## 3. Command Center Upgrades

### Accounts Table

| Column | Description |
|--------|-------------|
| Company Name | Organization name |
| Email | Admin user's email |
| Status | Color-coded badge: DEMO / TRIAL / ACTIVE / SUSPENDED / CANCELLED |
| Expires | Date, or "Never" for ACTIVE. Red highlight if < 7 days remaining |
| Employees | Count of active employees |
| Created | Sign-up date |
| Actions | Dropdown menu |

### Actions Per Account

| Action | Effect |
|--------|--------|
| Upgrade to Trial | status → TRIAL, trialEndsAt = now + 45 days |
| Upgrade to Active | status → ACTIVE, trialEndsAt = null |
| Extend | trialEndsAt += N days (Tom picks N) |
| Suspend | status → SUSPENDED immediately |
| Reactivate | status → previous tier, new trialEndsAt set |

### Create Account

Tom can create accounts directly: email, company name, password, status (DEMO/TRIAL), end date auto-filled from defaults (14 or 45 days). Self-signup still works — creates DEMO with 14-day limit.

### Dashboard Summary

- Account counts by status (DEMO: 5, TRIAL: 3, ACTIVE: 12, SUSPENDED: 2)
- "Expiring soon" alert list (accounts within 7 days of expiry)

---

## 4. Frontend Subscription Awareness

### Data Flow

`/auth/session` response adds `organization.trialEndsAt`. DemoContext stores `subscriptionStatus` and `trialEndsAt` in internal state.

### Three UI States

**Active (not expired) — DEMO, TRIAL, or ACTIVE:**
- Full functionality, everything works as today
- DEMO/TRIAL: subtle info bar at top: `"Demo account · 8 days remaining · Contact TipSharePro to upgrade"`
- ACTIVE: no bar

**Countdown escalation (DEMO and TRIAL):**
- 10-4 days remaining: subtle info bar, dismissible per session
- 3-1 days remaining: amber/warning bar, non-dismissible
- 0 days (expired): full lockout (see below)

**Suspended / Expired (read-only lockout):**
- All data visible (employees, settings, past distributions)
- All edit controls disabled (inputs disabled, buttons grayed)
- Add Employee row hidden
- Print button disabled
- Prominent banner: `"Your [demo/trial] has expired. Your data is safe — contact TipSharePro to continue."`
- API 403 errors caught silently (UI already prevents writes)

### Helpers

- `isExpired(status, trialEndsAt)` → boolean
- `daysRemaining(trialEndsAt)` → number | null
- `isReadOnly(status)` → boolean (SUSPENDED or CANCELLED)

---

## 5. Backend API Changes

### New: Subscription middleware
- `tip-share-pro-backend/src/middleware/subscription.middleware.ts`

### Modified: Auth service
- `getSession()` adds `organization.trialEndsAt` to response
- Login/register adds `organization.subscriptionStatus` and `organization.trialEndsAt`
- Self-signup sets `subscriptionStatus = DEMO`, `trialEndsAt = now + 14 days`

### New: Admin account management endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/admin/accounts` | GET | List all orgs with status, expiry, counts |
| `/admin/accounts` | POST | Create account (email, password, companyName, status, trialEndsAt) |
| `/admin/accounts/:orgId/status` | PUT | Change status (upgrade, suspend, reactivate) |
| `/admin/accounts/:orgId/extend` | PUT | Extend trialEndsAt by N days |

### Frontend auth types
- Add `subscriptionStatus` and `trialEndsAt` to `SessionResponse.organization`
- Add same to `LoginResponse` (new field)

---

## Out of Scope (Deferred)

- **Stripe integration** — deferred until Tom provides credentials. Schema is ready.
- **Email/SMS countdown alerts** — frontend countdown is sufficient for now.
- **2FA** — can be added independently later.
- **Pay period archiving** — the key feature distinguishing full version from demo. Separate workstream.
- **Scenario Sandbox** — Phase 3+ feature.
- **Multi-location** — Phase 3.

---

## Decisions Log

| Decision | Rationale |
|----------|-----------|
| Tom-gated account creation | Matches PRD. Tom controls the sales funnel. Self-signup creates time-limited DEMO. |
| Real data in demo | Stronger investment hook. Data carries over on upgrade — no re-entry friction. |
| Read-only lockout on expiry | Psychological pull: users see their data but can't use it. Stronger than full lockout. |
| Lazy expiry check (no cron) | Simpler. Status auto-transitions to SUSPENDED on next API request after expiry. |
| Stripe deferred | Don't have Tom's credentials yet. State machine is Stripe-ready. |
| Single trialEndsAt field | Reused for both demo and trial periods. Simpler than separate fields. |
| 14-day demo, 45-day trial | Demo = ~1 pay period taste. Trial = 2 full pay periods + buffer. Tom can override per client. |
