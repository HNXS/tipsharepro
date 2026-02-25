# TipSharePro Demo Launch Design

**Date:** 2026-02-25
**Goal:** Ship a persistence-backed, security-hardened, visually polished demo for 50 founding members
**Hosting:** Replit (imported from GitHub)
**Billing:** Not in scope (demo-first, free for founding members)

---

## Architecture Decision: Wire DemoContext to Backend

**Chosen approach:** Modify `DemoContext` to call backend APIs instead of localStorage. Keep DemoContext as the state manager (minimal UI disruption), replace the persistence layer underneath.

**Rejected alternatives:**
- Full API-first rewrite (too risky, too slow)
- localStorage-as-cache with background sync (over-engineered for 50 users)

---

## Phase 1: Data Persistence

### Strategy
On login, fetch user's data from the API. On every mutation, save to API. localStorage used only as temporary fallback if API unreachable. Cleared on logout.

### Data Flow

```
Login → GET /settings, GET /employees, GET /job-categories → populate state
Settings change → update local state → PUT /settings
Add employee → POST /employees → get server ID → update local state
Calculate → POST /calculate/preview → display results
Save period → POST /pay-periods → PUT entries → POST calculate
```

### Key Mappings
| Frontend | Backend |
|----------|---------|
| Employee.hourlyRate (dollars) | hourlyRateCents (cents) |
| Settings.contributionRate | Organization.settings JSON |
| JobCategory.variableWeight | JobCategory.weight (Decimal) |
| CategoryColor (string) | JobCategory.badgeColor (hex) |

### Files Modified
- `tip-share-pro-app/src/lib/DemoContext.tsx` — Replace localStorage calls with API calls
- `tip-share-pro-app/src/lib/api/` — Wire up existing but unused API functions
- Backend services — May need minor adjustments for frontend data shape compatibility

---

## Phase 2: Security Hardening

| Issue | Fix | File |
|-------|-----|------|
| Hardcoded admin key fallback | Remove `\|\| 'tipsharepro-admin-2026'`, require env var | `admin.routes.ts:20` |
| Hardcoded demo bypass | Remove `isDemoMode` check entirely | `LoginPage.tsx:91-100` |
| Weak auth rate limiting | Add 5 req/min per IP on `/auth/login` and `/auth/register` | `auth.routes.ts` |
| JWT secret | Ensure strong random value in Replit env vars | Replit config |
| Password UX | Add visual strength indicator on signup form | `LoginPage.tsx` |

### Not needed (already solid)
- XSS: No `dangerouslySetInnerHTML`, React auto-escapes
- CORS: Explicit origin whitelist configured
- Password hashing: bcrypt with 10 salt rounds
- Input validation: Zod on all endpoints
- CSRF: Not applicable (Bearer tokens, not cookies)

---

## Phase 3: Visual Polish

End-to-end audit of every screen at desktop (1280px+) and mobile (375px) widths.

### Screens to Audit
1. **Login/Signup** — spacing, typography, error states, password strength, mobile
2. **Settings** — form controls, dropdowns, category selectors, consistency
3. **Data Entry** — employee table readability, read-only name styling
4. **Distribution Table** — column alignment, number formatting, colors, weight adjusters
5. **Print** — letterhead, columns, professional branded output
6. **Admin Command Center** — autopilot badge, stats, tables, "control room" feel

### Method
Use Playwright to screenshot each screen, review visually, fix iteratively.

---

## Phase 4: Replit Migration

1. Import from `https://github.com/HNXS/tipsharepro.git`
2. Use Replit's built-in PostgreSQL
3. Run `npx prisma db push` to create tables
4. Seed database (admin user, demo org)
5. Set environment variables in Replit secrets:
   - `DATABASE_URL`, `DIRECT_URL` (Replit Postgres)
   - `JWT_SECRET` (strong random)
   - `ADMIN_SECRET_KEY` (strong random)
   - `ALLOWED_ORIGINS` (app.tipsharepro.com)
   - `NODE_ENV=production`
6. Add `concurrently` to run both backend + frontend from single `Run` button
7. Tom connects `app.tipsharepro.com` via Replit domain settings

---

## Out of Scope (Future Phases)

- Role-based permission enforcement (Admin/Manager/Designee)
- Multi-location support
- Stripe billing / subscription tiers
- Two-factor authentication
- Pay period management UI (daily entries by date)
- Scenario Sandbox
