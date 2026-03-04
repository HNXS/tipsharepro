# TipSharePro — Replit Agent Guide

## Overview

TipSharePro is a commercial SaaS web application for restaurant tip pool management. It automates fair tip distribution using an **Hours × Rate × Weight** algorithm, replacing manual spreadsheet workflows. Built for restaurant owners and managers, it supports multi-location operations, pay period tracking, year-to-date reporting, and PDF exports.

The product originated from a Fiverr client engagement (Tom LaChaussee, a 35-year restaurant veteran) converting Excel worksheets into a sellable web application. The business model is SaaS with per-location monthly fees.

**App Page Flow (10 pages + Demo):**

**Demo** — Single-page amalgamation of Settings (P3) + Distribution (P7). Free, requestable by email. Default 14-day expiry (adjustable in Command Center). Shows what a pool nets recipients using experimental settings. Mostly complete.

**Page 1 — Sign In** — Admin receives app via email after verification. First login: set password + F2A. Shortcut icon prompt. Expert sign-in checkbox (TipSharePro access only). Admin/Expert → Page 3 (Settings). All others → Page 2 (Data Hub). Admin creates team members; Managers can create Manager/Data roles only. Team members set own passwords on first recognized login. Managers set F2A.

**Page 2 — Data Hub** — All permissions. Non-Admin/Expert landing page. Clickable cards organized by permission level. Some open other pages, some have inline data entry (e.g., team names/logins).

**Page 3 — Settings** — Admin only. Org parameters. Cards 1-4 built (Locations, Day/Date/Time, Pay Period, Team & Permissions). Card 4 is full team management: add/edit/delete users with firstName/lastName, email, temp password, role (Admin/Manager/Data). Admin privilege assignment requires acknowledgment dialog. Users must change password on first login (mustChangePassword flag). 2FA badge shown when enabled. Cards 5-6 placeholder.

**Page 4 — Scenario Sandbox (SSB)** — Admin + Manager access. Replication of Demo with more utility. Same Settings + Distribution amalgamation. Before Launch Day: experimental settings can be uploaded to live tables (repeatable, each upload erases prior). After Launch Day: becomes testing ground only — no uploads. SSB auto-fills with current data from P3 + P7 on Archive Day (day after pay day). Launch Day set by Admin in Settings; once launched, only Expert can reset (from Command Center or by login). Upload button disabled after launch, re-enabled if Expert resets.

**Page 5 — Daily Contributions Log** — All permissions. Daily tip pool contribution + sales data entry. Look/feel of Distribution Table (P7). Entry every few days, concentrated near pay period end. Archives day after pay day.

**Page 6 — Pay Period Contributions Log** — All permissions. Real-time accumulation of daily entries. Auto-fill from P5. Produces final Gross Pool number → exports to Distribution (P7). Archives day after pay day → feeds YTD (P8) and EOY (P9). Printable for bulletin board + emailed to payroll. Future: mobile access for contributors, show contribution math. Top 2 contributors noted on P7 stat card.

**Page 7 — Distribution Table** — All permissions (varying access levels). Employee distribution entries. Most elements built, needs more definition. Printable + emailed to payroll. Experience bump (+/-) on category weight requires Manager/Admin permission. Future: mobile access for recipients (show distribution math), thumbnail photos of top 2 contributors on stat card.

**Page 8 — YTD Pool Data** — All permissions. Two tables: Contribution side + Distribution side. Contribution table mirrors P6 layout with different headings, auto-accumulates per employee. Distribution table is scaled-down accumulation (just pool tips column). Archives first day of new year → feeds EOY (P9). Printable + emailable.

**Page 9 — EOY Allocations** — All permissions. Two tables: Contribution + Distribution. Contribution side needs some sales data entry but mostly auto-accumulates from P6 or P8. Look/feel of expanded Distribution Table (P7).

**Page 10 — Command Center** — Expert access only. Standalone admin panel at /admin. In progress — Autopilot toggles, leads pipeline, org/user management built. Expanding.

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Monorepo Structure

The project is a monorepo with three layers managed by the root `package.json` using `concurrently`:

```
/ (root)
├── tip-share-pro-app/       # Next.js 15 frontend
├── tip-share-pro-backend/   # Express.js API backend
├── package.json             # Root orchestration scripts
└── vercel.json              # Static mockup deployment (legacy)
```

Run everything with `npm run dev` from root. Database setup: `npm run db:setup`.

### Frontend (`tip-share-pro-app`)

- **Framework:** Next.js 15 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **PDF Export:** jsPDF + jsPDF-AutoTable
- **State Management:** `DemoContext` (React Context) — currently localStorage-backed, being migrated to API calls
- **API Proxy:** Next.js rewrites proxy `/api/*` → Express backend at `BACKEND_INTERNAL_URL` (default `localhost:3002`) via `next.config.ts`
- **Port:** 3000 (default Next.js)

**Key architectural note:** The frontend uses a `DemoContext` pattern that manages all app state. The active work (per `docs/plans/2026-02-25-demo-launch-design.md`) is wiring this context to backend API calls instead of localStorage. Do not bypass DemoContext — mutate state through it.

### Backend (`tip-share-pro-backend`)

- **Framework:** Express.js, TypeScript, Node.js 20+
- **ORM:** Prisma 5 with PostgreSQL
- **Auth:** JWT (jsonwebtoken) + bcryptjs for password hashing
- **Validation:** Zod schemas
- **Logging:** Pino + pino-http
- **Security:** Helmet, express-rate-limit, CORS
- **Testing:** Vitest
- **Port:** 3002

**API versioning:** All routes are prefixed `/api/v1/`. Vercel serverless entry at `api/index.ts` exports the Express app.

**Tip Calculation Engine** (`src/services/tip-calculation.service.ts`): Core business logic. Formula: `Share = (Hours × HourlyRateCents × Weight) / TotalBasis × TotalPoolCents`. All monetary values stored in **cents** (integers) to avoid floating-point errors.

### Database Schema (PostgreSQL via Prisma)

Key models:
- `Organization` — tenant root, has `subscriptionStatus` (DEMO/ACTIVE), `settings` (JSON blob)
- `Location` — belongs to org, has `number` + `organizationId` unique constraint
- `User` — scoped to org, has role-based access
- `Employee` — scoped to location, stores `hourlyRateCents` (not dollars)
- `JobCategory` — weight factors, `badgeColor` hex
- `PayPeriod` — date ranges per location
- `DailyEntry` / `PayPeriodEntry` — contribution records
- `Distribution` — calculated results

**Important field mappings** (frontend ↔ backend):
| Frontend | Backend |
|----------|---------|
| `employee.hourlyRate` (dollars) | `hourlyRateCents` (cents) |
| `settings.contributionRate` | `Organization.settings` JSON |
| `jobCategory.variableWeight` | `JobCategory.weight` (Decimal) |
| `categoryColor` (string) | `JobCategory.badgeColor` (hex) |

Seed data creates a demo org (`id: 00000000-0000-0000-0000-000000000001`), location, and user (`demo@tipsharepro.com` / `demo123`).

### Authentication

- JWT tokens issued on login
- Routes protected by auth middleware
- Admin routes require `ADMIN_SECRET_KEY` environment variable — **no hardcoded fallback** (security requirement per `docs/plans/2026-02-25-demo-launch-plan.md`)
- Demo credential bypass has been/must be removed

### Design System

Three design system iterations exist in the repo (use **Final Edition** as canonical):

- `design-system-final/` — **Active. Use this.** Dark "Amber Hour" foundation + bold logo colors
- `design-system-bold/` — Intermediate iteration (bold colors only)
- `design-documentation/` — Original "Amber Hour" dark aesthetic
- `design-documentation-v2/` — Bold rebrand attempt

**Final Design Tokens (from `design-system-final/`):**
- Backgrounds: Midnight `#0C0A07`, Espresso `#1A1510`, Mahogany `#2A2318`, Walnut `#3D3225`
- Text: Cream `#F7F3EA`, Linen `#C4B9A4`, Stone `#8B7B65`
- Brand Accents: Burnt Orange `#E85D04` (primary CTA), Lime Green `#82B536` (success), Navy `#1A4B7C` (secondary), Cyan `#35A0D2` (links/info)
- Typography: Outfit (UI), JetBrains Mono (numbers/data)
- This is a **dark-only** application — no light mode

### Print System

A `PrintDialog` component controls print targets (`distribution` | `settings`) with orientation toggles. CSS classes on `<body>` (`print-portrait`/`print-landscape`, `print-target-*`) control what prints. Non-target sections get `display: none !important` in print CSS. See `docs/plans/2026-02-12-print-overhaul-design.md`.

---

## External Dependencies

### Required Services

| Service | Purpose | Config |
|---------|---------|--------|
| **PostgreSQL** | Primary database | `DATABASE_URL` env var |
| **Stripe** | Billing / subscription management | `stripe` package in root `package.json`; keys via env vars |

### Environment Variables Needed

```
# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=...
ADMIN_SECRET_KEY=...        # Required, no fallback allowed
ALLOWED_ORIGINS=...

# Frontend
BACKEND_INTERNAL_URL=http://localhost:3002   # or internal Replit URL
```

### Build & Dev Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Prisma | 5.x | ORM + migrations |
| tsx | 4.x | TypeScript execution for seeds/dev |
| concurrently | 9.x | Run frontend + backend together |
| Vitest | 1.x | Backend unit testing |
| ESLint | 9.x (frontend) / 8.x (backend) | Linting |

### Google Fonts

Loaded via CDN in HTML/CSS: Outfit, JetBrains Mono (final design system). Legacy design docs also load Fraunces, Newsreader — these are not used in the active app.

### Command Center (`/admin`)

The platform owner's CRM and management hub. Admin key authentication (via `ADMIN_SECRET_KEY` env var stored in session).

**Tabs:**
- **Overview** — 4 clickable cards: Active Subscriptions (monthly/annual breakdown, expandable detail table), Open Leads (links to Leads tab), Active Organizations (links to Orgs tab), Locations. Status breakdown by org status below.
- **Leads** — Full CRM pipeline for inbound contacts from marketing site forms
- **Organizations** — Org CRUD, account creation (org + location + user), status management (Trial/Active/Suspend/Extend), expiring alerts
- **Users** — Searchable user database with role filter (Admin/Manager/Data), CRUD across all organizations

**Organization Subscription Fields:**
- `subscriptionPlan` (MONTHLY/ANNUAL enum, nullable) — tracks billing plan
- `subscriptionStartedAt`, `subscriptionRenewsAt` — date tracking for renewals
- Stats endpoint groups active subscriptions by plan for overview card

**Leads Pipeline (Phase 1):**
- Database model: `Lead` in Prisma schema with `LeadType` (DEMO_REQUEST, TRIAL_REQUEST, QUESTION, CALLBACK) and `LeadStatus` (NEW → CONTACTED → DEMO_SENT → TRIAL → SUBSCRIBED / EXPIRED / DISQUALIFIED)
- Backend: CRUD at `/admin/leads`, stats at `/admin/leads/stats`, supports search/filter/sort query params
- Frontend: Header row with search inline, quick-filter type tabs (All/Demo Request/Trial Request/Question/Callback with counts), status/sort selects
- Viability clock: configurable per-lead (default 14 days for Demo Request), color-coded green/yellow/red based on deadline proximity

**Autopilot System:**
- Two independent toggles in Command Center header: Demo Autopilot and Trial Autopilot
- Persisted to `platform_settings` table (key-value store) via GET/PATCH `/admin/settings`
- When Demo is ON: incoming demo requests will auto-provision demo accounts and email credentials
- When Trial is ON: incoming trial requests will auto-provision 45-day trial accounts
- Trial timing: marketed as "30-day free trial" but actually 45 days; countdown banner at day 25; email reminders at days 30, 35, 40; auto-suspend at day 45; reminders stop if status changes to ACTIVE (subscribed)

**Planned phases:**
- Phase 2: Auto-provisioning pipeline (wiring autopilot toggles to actual account creation + email), trial countdown system
- Phase 3: Audit trail viewer (surfacing existing AuditLog records in Command Center)
- Future: Email/SMS from Command Center with templates, demo fraud protection, marketing site traffic

### Deployment

- **Replit:** Primary hosting target for demo launch (50 founding members)
- **Vercel:** Secondary target — backend has `vercel.json` + `api/index.ts` serverless adapter; root `vercel.json` serves static mockup (legacy, not the active app)
- The active app is NOT the static `tip-share-pro-mockup.html` — that's an old proof-of-concept