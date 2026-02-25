# TipSharePro Demo Launch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a persistence-backed, security-hardened, visually polished demo for 50 founding members on Replit.

**Architecture:** Wire existing DemoContext to backend APIs incrementally (settings, job categories, employees, distributions). Remove hardcoded security shortcuts. Visual polish pass on all screens. Deploy to Replit with concurrently.

**Tech Stack:** Next.js 14, Express.js, Prisma, PostgreSQL, Zod, JWT, bcryptjs

**Design doc:** `docs/plans/2026-02-25-demo-launch-design.md`

---

## Phase 1: Security Hardening

### Task 1: Remove hardcoded admin key fallback

**Files:**
- Modify: `tip-share-pro-backend/src/routes/admin.routes.ts:20`

**Step 1: Remove the fallback**

Change line 20 from:
```typescript
const validKey = process.env.ADMIN_SECRET_KEY || 'tipsharepro-admin-2026';
```
to:
```typescript
const validKey = process.env.ADMIN_SECRET_KEY;

if (!validKey) {
  console.error('ADMIN_SECRET_KEY environment variable is not set');
}
```

And update the comparison at line 22 to also reject when no key is configured:
```typescript
if (!validKey || adminKey !== validKey) {
```

**Step 2: Commit**
```bash
git add tip-share-pro-backend/src/routes/admin.routes.ts
git commit -m "security: require ADMIN_SECRET_KEY env var, remove hardcoded fallback"
```

---

### Task 2: Remove hardcoded demo credential bypass

**Files:**
- Modify: `tip-share-pro-app/src/components/LoginPage.tsx:91-100`

**Step 1: Remove the isDemoMode bypass**

Remove these lines entirely (the demo mode block inside `handleSubmit`):
```typescript
// Demo mode: bypass API for demo credentials
const isDemoMode = email === 'demo@tipsharepro.com' && password === 'demo123';

if (isDemoMode) {
  await new Promise(resolve => setTimeout(resolve, 500));
  onLoginSuccess({
    name: 'Sarah Chen',
    companyName: 'The Golden Fork',
    role: 'manager',
  });
  setIsLoading(false);
  return;
}
```

The sign-in handler should now always go through the API `login()` call.

**Step 2: Commit**
```bash
git add tip-share-pro-app/src/components/LoginPage.tsx
git commit -m "security: remove hardcoded demo credential bypass from login"
```

---

### Task 3: Add stricter rate limiting on auth endpoints

**Files:**
- Modify: `tip-share-pro-backend/src/routes/auth.routes.ts`

**Step 1: Add auth-specific rate limiter**

At the top of the file, after existing imports, add:
```typescript
import rateLimit from 'express-rate-limit';

const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 attempts per IP per minute
  message: {
    status: 'error',
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many attempts. Please try again in a minute.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

**Step 2: Apply to login and register routes**

Add `authRateLimiter` as the first middleware on both POST /login and POST /register:
```typescript
router.post('/login', authRateLimiter, validate(loginSchema), async (req, res, next) => {
```
```typescript
router.post('/register', authRateLimiter, validate(registerSchema), async (req, res, next) => {
```

**Step 3: Commit**
```bash
git add tip-share-pro-backend/src/routes/auth.routes.ts
git commit -m "security: add 5-req/min rate limit on login and register endpoints"
```

---

### Task 4: Add password strength indicator to signup form

**Files:**
- Modify: `tip-share-pro-app/src/components/LoginPage.tsx`
- Modify: `tip-share-pro-app/src/app/globals.css`

**Step 1: Add strength calculation function**

Inside LoginPage.tsx, before the component function, add:
```typescript
function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Weak', color: 'var(--color-error, #e74c3c)' };
  if (score <= 2) return { level: 2, label: 'Fair', color: 'var(--color-warning, #f39c12)' };
  if (score <= 3) return { level: 3, label: 'Good', color: 'var(--color-info, #3498db)' };
  return { level: 4, label: 'Strong', color: 'var(--color-success, #27ae60)' };
}
```

**Step 2: Add strength bar below password field in signup mode**

After the password input div (inside the `mode === 'signup'` block), before Confirm Password:
```tsx
{mode === 'signup' && password && (
  <div className="password-strength">
    <div className="password-strength-bar">
      {[1, 2, 3, 4].map((segment) => (
        <div
          key={segment}
          className="password-strength-segment"
          style={{
            backgroundColor: segment <= getPasswordStrength(password).level
              ? getPasswordStrength(password).color
              : 'var(--bg-border)',
          }}
        />
      ))}
    </div>
    <span className="password-strength-label" style={{ color: getPasswordStrength(password).color }}>
      {getPasswordStrength(password).label}
    </span>
  </div>
)}
```

**Step 3: Add CSS**

Add to globals.css after the `.form-label-optional` rule:
```css
.password-strength {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: calc(var(--space-1) * -1);
  margin-bottom: var(--space-1);
}

.password-strength-bar {
  display: flex;
  gap: 3px;
  flex: 1;
}

.password-strength-segment {
  height: 4px;
  flex: 1;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.password-strength-label {
  font-size: var(--text-caption);
  font-weight: 600;
  min-width: 3rem;
}
```

**Step 4: Commit**
```bash
git add tip-share-pro-app/src/components/LoginPage.tsx tip-share-pro-app/src/app/globals.css
git commit -m "security: add password strength indicator on signup form"
```

---

## Phase 2: Data Persistence

### Task 5: Wire settings to backend API

**Files:**
- Modify: `tip-share-pro-app/src/lib/DemoContext.tsx`

**Context:** DemoContext currently stores settings in localStorage. The backend already has `GET /settings` and `PUT /settings` endpoints. The frontend API client (`src/lib/api/settings.ts`) already has `getSettings()` and `updateSettings()` functions defined but never called.

**Step 1: Import API functions in DemoContext**

Add to imports:
```typescript
import { getSettings, updateSettings as apiUpdateSettings } from './api/settings';
```

**Step 2: Modify handleLoginSuccess to fetch settings from API**

In `handleLoginSuccess`, after setting auth state, add an API call to load settings:
```typescript
try {
  const serverSettings = await getSettings();
  // Map backend settings shape to frontend Settings shape
  // Apply to state
} catch {
  // Fall back to defaults if API fails (new account with no settings yet)
}
```

The mapping from backend `OrganizationSettings` to frontend `Settings` requires translating:
- Backend `contributionMethod` (uppercase like 'ALL_SALES') matches frontend type
- Backend `payPeriodType` (uppercase) needs `toFrontendPayPeriodType()` conversion
- Backend `estimatedMonthlySales` maps directly
- Backend doesn't store jobCategories/selectedCategories/categoryWeights in settings — those come from the job categories API (Task 6)

**Step 3: Modify updateSettings to save to API**

In the `updateSettings` callback, after updating local state, add:
```typescript
// Debounced API save
apiUpdateSettings({
  contributionMethod: newSettings.contributionMethod,
  contributionRate: newSettings.contributionRate,
  payPeriodType: toBackendPayPeriodType(newSettings.payPeriodType),
  estimatedMonthlySales: newSettings.estimatedMonthlySales,
}).catch(console.error);
```

**Step 4: Remove localStorage save/load for settings**

Remove settings from `saveDemoState()` and `loadDemoState()`. Keep employee data in localStorage for now (wired in Task 7).

**Step 5: Commit**
```bash
git add tip-share-pro-app/src/lib/DemoContext.tsx
git commit -m "feat: wire settings to backend API, remove localStorage for settings"
```

---

### Task 6: Wire job categories to backend API

**Files:**
- Modify: `tip-share-pro-app/src/lib/DemoContext.tsx`

**Context:** The frontend has `getJobCategories()`, `createJobCategory()`, `updateJobCategory()`, `deleteJobCategory()` in `src/lib/api/jobCategories.ts` — all defined but never called. Job categories on the backend have `name`, `weight` (Decimal), and `badgeColor` (hex string). The frontend uses `JobCategory` with `variableWeight`, `categoryColor`, and `description`.

**Step 1: Import API functions**
```typescript
import {
  getJobCategories as apiGetJobCategories,
  createJobCategory as apiCreateJobCategory,
  updateJobCategory as apiUpdateJobCategory,
  deleteJobCategory as apiDeleteJobCategory,
} from './api/jobCategories';
```

**Step 2: Load job categories on login**

In `handleLoginSuccess`, after settings load:
```typescript
try {
  const serverCategories = await apiGetJobCategories();
  // Map backend shape to frontend JobCategory shape
  // If empty (new account), seed with predefined defaults via POST
} catch {
  // Fall back to predefined defaults
}
```

**Step 3: Wire category mutations to API**

Each category action (toggleCategorySelection, updateCategoryWeight, addJobToCategory, removeJob, moveJobToCategory) needs to call the corresponding API after updating local state.

**Step 4: Commit**
```bash
git add tip-share-pro-app/src/lib/DemoContext.tsx
git commit -m "feat: wire job categories to backend API"
```

---

### Task 7: Wire employees to backend API

**Files:**
- Modify: `tip-share-pro-app/src/lib/DemoContext.tsx`

**Context:** Frontend has `getEmployees()`, `createEmployee()`, `updateEmployee()`, `deleteEmployee()` in `src/lib/api/employees.ts`. Backend stores hourlyRateCents (int), frontend uses hourlyRate (float dollars). Conversion helpers `dollarsToCents()` and `centsToDollars()` already exist.

**Step 1: Import API functions**
```typescript
import {
  getEmployees as apiGetEmployees,
  createEmployee as apiCreateEmployee,
  updateEmployee as apiUpdateEmployee,
  deleteEmployee as apiDeleteEmployee,
  dollarsToCents,
} from './api/employees';
```

**Step 2: Load employees on login**

In `handleLoginSuccess`, after job categories load:
```typescript
try {
  const serverEmployees = await apiGetEmployees();
  // Map backend Employee to frontend Employee shape
  // Convert hourlyRateCents -> hourlyRate
  // Map jobCategory.id, set hoursWorked to 0 (hours are per-period, not persistent)
} catch {
  // Fall back to defaults for new accounts
}
```

**Step 3: Wire employee mutations**

- `addEmployee` → `apiCreateEmployee()` with cents conversion
- `updateEmployee` → `apiUpdateEmployee()` (exclude `name` — already protected)
- `removeEmployee` → `apiDeleteEmployee()` (soft delete)

**Step 4: Remove localStorage persistence entirely**

Remove `saveDemoState()`, `loadDemoState()`, `clearDemoState()`, the `DEMO_STORAGE_KEY` constant, and the auto-save useEffect. All persistence now goes through the API.

**Step 5: Commit**
```bash
git add tip-share-pro-app/src/lib/DemoContext.tsx
git commit -m "feat: wire employees to backend API, remove all localStorage persistence"
```

---

### Task 8: Wire distribution calculation to backend

**Files:**
- Modify: `tip-share-pro-app/src/lib/DemoContext.tsx`

**Context:** The frontend currently calculates distributions entirely client-side (lines 636-700 in DemoContext). The backend has `POST /calculate/preview` that accepts employee data and returns distribution results without saving. For the demo, we can keep client-side calculation (it's the same algorithm) and only persist when the user explicitly saves a pay period.

**Decision:** Keep client-side calculation for real-time preview (instant feedback). The backend calculation endpoint is for when pay period management is added later.

**Step 1: No changes needed for calculation itself**

The existing client-side calculation stays. It provides instant feedback as users adjust hours/weights.

**Step 2: Add "Save Period" functionality (optional for demo launch)**

This is a stretch goal. If time permits, add a "Save" button on the results page that:
- Creates a pay period via `POST /pay-periods`
- Saves daily entries via `PUT /pay-periods/:id/entries`
- Runs calculation via `POST /pay-periods/:id/calculate`

For demo launch, this can be deferred — the core value is that settings/employees/categories persist.

**Step 3: Commit (if changes made)**
```bash
git add tip-share-pro-app/src/lib/DemoContext.tsx
git commit -m "feat: preserve client-side distribution calculation for instant preview"
```

---

## Phase 3: Visual Polish

### Task 9: Visual audit — Login/Signup page

**Files:**
- Modify: `tip-share-pro-app/src/components/LoginPage.tsx`
- Modify: `tip-share-pro-app/src/app/globals.css`

**Step 1: Launch the app locally and screenshot**

Start the frontend dev server and use Playwright to capture the login page at:
- Desktop (1280x800)
- Mobile (375x812)
- Both sign-in and sign-up modes
- Error states
- Loading states

**Step 2: Audit and fix**

Check for:
- Consistent spacing and padding
- Typography hierarchy (heading > subtitle > body > label)
- Input focus states (visible ring/border color)
- Button hover/active states
- Error message styling (red alert with icon)
- Loading spinner alignment
- Mode toggle link visibility and contrast
- Mobile: full-width inputs, adequate tap targets (44px min)
- Logo sizing and positioning

**Step 3: Test and commit**
```bash
git add tip-share-pro-app/src/components/LoginPage.tsx tip-share-pro-app/src/app/globals.css
git commit -m "ui: polish login/signup page — spacing, states, mobile"
```

---

### Task 10: Visual audit — Settings page

**Files:**
- Modify: `tip-share-pro-app/src/components/SettingsPage.tsx`
- Modify: `tip-share-pro-app/src/app/globals.css`

**Step 1: Screenshot settings page at desktop + mobile**

**Step 2: Audit and fix**

Check for:
- Dropdown/select styling consistency
- Radio/checkbox alignment
- Section dividers and grouping
- Category color badges — proper contrast, readable text
- Weight slider or input styling
- Help tooltips not obscuring content on mobile
- Form labels aligned consistently (above or left)
- Number inputs — proper width, aligned decimal points

**Step 3: Test and commit**
```bash
git add tip-share-pro-app/src/components/SettingsPage.tsx tip-share-pro-app/src/app/globals.css
git commit -m "ui: polish settings page — controls, spacing, mobile layout"
```

---

### Task 11: Visual audit — Data Entry page

**Files:**
- Modify: `tip-share-pro-app/src/components/DataEntryPage.tsx`
- Modify: `tip-share-pro-app/src/app/globals.css`

**Step 1: Screenshot data entry page at desktop + mobile**

**Step 2: Audit and fix**

Check for:
- Read-only employee names look intentional (not like a broken input)
- Table row heights consistent
- Number input alignment in table cells
- Add/remove employee buttons clearly visible
- Table horizontal scroll on mobile
- Column headers properly aligned with data

**Step 3: Test and commit**
```bash
git add tip-share-pro-app/src/components/DataEntryPage.tsx tip-share-pro-app/src/app/globals.css
git commit -m "ui: polish data entry page — table readability, mobile"
```

---

### Task 12: Visual audit — Distribution Table (core product)

**Files:**
- Modify: `tip-share-pro-app/src/components/DistributionTable.tsx`
- Modify: `tip-share-pro-app/src/components/ResultsPage.tsx`
- Modify: `tip-share-pro-app/src/app/globals.css`

**Step 1: Screenshot distribution table at desktop + mobile + print preview**

**Step 2: Audit and fix**

Check for:
- Column alignment (names left, numbers right)
- Dollar amounts formatted consistently ($X,XXX.XX)
- Percentage formatting (XX.XX%)
- Category color dots properly sized and aligned
- Weight adjuster buttons (+/-) clearly visible but not dominant
- Summary stat cards at top — consistent sizing, readable numbers
- Drag handles visible but subtle
- Print: columns fit on page, no orphan rows, letterhead aligned

**Step 3: Test and commit**
```bash
git add tip-share-pro-app/src/components/DistributionTable.tsx tip-share-pro-app/src/components/ResultsPage.tsx tip-share-pro-app/src/app/globals.css
git commit -m "ui: polish distribution table — alignment, formatting, print layout"
```

---

### Task 13: Visual audit — Print output

**Files:**
- Modify: `tip-share-pro-app/src/components/PrintDialog.tsx`
- Modify: `tip-share-pro-app/src/app/globals.css`

**Step 1: Trigger print and screenshot the print preview**

**Step 2: Audit and fix**

Check for:
- Letterhead properly positioned (logo, contact info, decorative border)
- Table fits within print margins
- Font sizes readable when printed
- No screen-only elements visible in print (buttons, toggles, drag handles)
- Page breaks in logical places (not mid-row)
- Color badges print correctly (or use black/white fallback)
- Company name and date in header

**Step 3: Test and commit**
```bash
git add tip-share-pro-app/src/components/PrintDialog.tsx tip-share-pro-app/src/app/globals.css
git commit -m "ui: polish print output — letterhead, layout, page breaks"
```

---

### Task 14: Visual audit — Admin Command Center

**Files:**
- Modify: `tip-share-pro-app/src/app/admin/page.tsx`
- Modify: `tip-share-pro-app/src/app/globals.css`

**Step 1: Screenshot admin panel — login screen, overview, orgs tab, users tab**

**Step 2: Audit and fix**

Check for:
- Autopilot badge prominent but not garish
- Stats cards evenly sized with clear numbers
- Organization list cards — expand/collapse smooth, info dense but scannable
- User table — sortable appearance, clear status badges
- Modals (create org, create user) — properly centered, backdrop, form alignment
- Admin login page — distinct from user login, "Command Center" branding

**Step 3: Test and commit**
```bash
git add tip-share-pro-app/src/app/admin/page.tsx tip-share-pro-app/src/app/globals.css
git commit -m "ui: polish admin command center — stats, tables, modals"
```

---

## Phase 4: Replit Migration

### Task 15: Add concurrently and run script

**Files:**
- Create: `package.json` (root-level)
- Create: `start.sh` (root-level run script)

**Step 1: Create root package.json**

```json
{
  "name": "tipsharepro",
  "private": true,
  "scripts": {
    "dev": "concurrently --names backend,frontend --prefix-colors blue,green \"npm run dev --prefix tip-share-pro-backend\" \"npm run dev --prefix tip-share-pro-app\"",
    "start": "concurrently --names backend,frontend \"npm start --prefix tip-share-pro-backend\" \"npm start --prefix tip-share-pro-app\"",
    "db:push": "cd tip-share-pro-backend && npx prisma db push",
    "db:seed": "cd tip-share-pro-backend && npx tsx prisma/seed.ts"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

**Step 2: Create .replit config (if needed)**

```
run = "npm start"
```

**Step 3: Commit**
```bash
git add package.json .replit
git commit -m "deploy: add root package.json with concurrently for Replit"
```

---

### Task 16: Create database seed script

**Files:**
- Create: `tip-share-pro-backend/prisma/seed.ts`

**Step 1: Write seed script**

Creates:
- A default admin organization
- A default location
- An admin user (with hashed password)
- Predefined job categories

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if already seeded
  const existingOrgs = await prisma.organization.count();
  if (existingOrgs > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  const passwordHash = await bcrypt.hash('admin123', 10);

  const org = await prisma.organization.create({
    data: {
      name: 'TipSharePro Admin',
      subscriptionStatus: 'ACTIVE',
    },
  });

  const location = await prisma.location.create({
    data: {
      organizationId: org.id,
      name: 'Main Location',
      number: '001',
    },
  });

  await prisma.user.create({
    data: {
      organizationId: org.id,
      locationId: location.id,
      email: 'admin@tipsharepro.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Step 2: Commit**
```bash
git add tip-share-pro-backend/prisma/seed.ts
git commit -m "deploy: add database seed script for initial admin user"
```

---

### Task 17: Update environment variable documentation

**Files:**
- Modify: `.env.example`

**Step 1: Add ADMIN_SECRET_KEY to .env.example**

```
# Admin Command Center
# Generate with: openssl rand -base64 32
ADMIN_SECRET_KEY=your-admin-secret-key
```

**Step 2: Commit**
```bash
git add .env.example
git commit -m "docs: add ADMIN_SECRET_KEY to env example"
```

---

### Task 18: Security review pass

**Files:** All frontend and backend files

**Step 1: Grep for remaining security issues**

Search for:
- `demo123` or `demo@tipsharepro` (should only be in seed script if at all)
- `tipsharepro-admin-2026` (should be completely gone)
- `change-me-in-production` (OK in dev, validated in prod)
- `dangerouslySetInnerHTML` (should not exist)
- `eval(` (should not exist)
- Any hardcoded tokens, passwords, or API keys

**Step 2: Fix any findings**

**Step 3: Commit**
```bash
git commit -m "security: final review pass — no hardcoded secrets"
```

---

### Task 19: Final integration test

**Step 1: Start the app**

```bash
npm run dev
```

**Step 2: Test the full flow**

1. Open login page — no demo credentials visible
2. Click "Create Account" — fill email + password + company name
3. Submit — account created, logged into app
4. Change settings (contribution method, rate) — verify they persist
5. Add an employee — verify persists after page refresh
6. Remove an employee — verify persists
7. Change job category weights — verify persists
8. Log out, log back in — all data still there
9. Visit `/?signup=true` — defaults to sign-up mode
10. Open `/admin` with ADMIN_SECRET_KEY env var set — see autopilot badge, new sign-up in users list
11. Print the distribution table — verify letterhead, alignment, formatting
12. Test on mobile viewport (375px) — all pages usable

**Step 3: Fix any issues found during testing**

**Step 4: Final commit**
```bash
git commit -m "test: verify full integration — all features working end-to-end"
```

---

## Task Execution Order

```
Phase 1 (Security): Tasks 1-4 (independent, can run in parallel)
Phase 2 (Persistence): Tasks 5 → 6 → 7 → 8 (sequential, each builds on previous)
Phase 3 (Visual): Tasks 9-14 (independent, can run in parallel)
Phase 4 (Deploy): Tasks 15-19 (sequential)
```

## Estimated Scope

- **17 substantive tasks** + 2 review tasks
- **Files touched:** ~15 files across frontend and backend
- **New files:** 3 (root package.json, seed script, .replit)
- **Deleted code:** localStorage persistence layer in DemoContext (~80 lines)
