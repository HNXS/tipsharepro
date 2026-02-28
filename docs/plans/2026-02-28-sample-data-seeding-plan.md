# Sample Data Seeding Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Seed sample employees, job categories, and default settings into the database during user registration so new users see a populated distribution table on first login.

**Architecture:** Add `is_sample` boolean column to `employees` table. Extend the registration transaction in `auth.service.ts` to create 13 job categories + 10 sample employees + default org settings. Modify the delete endpoint to hard-delete sample employees. Add `DELETE /employees/samples` bulk endpoint. Frontend shows an info banner when sample employees exist, with a "Clear all" button.

**Tech Stack:** Prisma (migration + schema), Express (routes), React (frontend banner)

---

### Task 1: Database Migration — Add `is_sample` Column

**Files:**
- Modify: `tip-share-pro-backend/prisma/schema.prisma:178-201` (Employee model)
- Create: `tip-share-pro-backend/prisma/migrations/20260228000000_add_employee_is_sample/migration.sql`

**Step 1: Add `isSample` field to the Employee model in schema.prisma**

In the Employee model (between `status` and `hiredAt` fields), add:

```prisma
  isSample        Boolean        @default(false) @map("is_sample")
```

**Step 2: Create the migration SQL file**

Create `tip-share-pro-backend/prisma/migrations/20260228000000_add_employee_is_sample/migration.sql`:

```sql
-- Add is_sample flag to employees for sample data cleanup
ALTER TABLE "employees" ADD COLUMN "is_sample" BOOLEAN NOT NULL DEFAULT false;
```

**Step 3: Generate Prisma client**

Run: `cd tip-share-pro-backend && npx prisma generate`
Expected: "Generated Prisma Client"

**Step 4: Commit**

```bash
git add tip-share-pro-backend/prisma/schema.prisma tip-share-pro-backend/prisma/migrations/20260228000000_add_employee_is_sample/
git commit -m "feat: add is_sample column to employees table"
```

---

### Task 2: Create Sample Data Constants in Backend

**Files:**
- Create: `tip-share-pro-backend/src/constants/sample-data.ts`

**Step 1: Create the sample data constants file**

This file defines the 13 job categories and 10 sample employees that get seeded on registration. The data matches the frontend's `DEFAULT_JOB_CATEGORIES` and `DEFAULT_EMPLOYEES` from `tip-share-pro-app/src/lib/types.ts`.

```typescript
/**
 * Sample data seeded into the database for new organizations.
 * Matches the frontend demo data so new users see a populated distribution table.
 */

import { Decimal } from '@prisma/client/runtime/library';

// Badge colors from job-category.service.ts BADGE_COLORS map
export const SAMPLE_JOB_CATEGORIES = [
  // BOH (Kitchen) — weight 3.00
  { name: 'Lead Cook',    weight: new Decimal(3.00), badgeColor: '#DC2626' },
  { name: 'Line Cook',    weight: new Decimal(3.00), badgeColor: '#EA580C' },
  { name: 'Pastry Chef',  weight: new Decimal(3.00), badgeColor: '#D97706' },
  { name: 'Pantry Chef',  weight: new Decimal(3.00), badgeColor: '#65A30D' },
  // FOH (Non-Tipped) — weight 2.00
  { name: 'Host/Hostess', weight: new Decimal(2.00), badgeColor: '#0284C7' },
  { name: 'Busser',       weight: new Decimal(2.00), badgeColor: '#7C3AED' },
  { name: 'Cashier',      weight: new Decimal(2.00), badgeColor: '#2563EB' },
  { name: 'Runner',       weight: new Decimal(2.00), badgeColor: '#4F46E5' },
  // Bar — weight 4.00
  { name: 'Bartender',    weight: new Decimal(4.00), badgeColor: '#C026D3' },
  { name: 'Barista',      weight: new Decimal(4.00), badgeColor: '#9333EA' },
  { name: 'Bar Back',     weight: new Decimal(4.00), badgeColor: '#E11D48' },
  // Support — weight 1.00
  { name: 'Dishwasher',   weight: new Decimal(1.00), badgeColor: '#64748B' },
  { name: 'Prep Cook',    weight: new Decimal(1.00), badgeColor: '#CA8A04' },
];

// Sample employees — reference category by name, resolved to ID during seeding
// hourlyRateCents stored as cents (e.g., 2200 = $22.00)
export const SAMPLE_EMPLOYEES: Array<{
  name: string;
  jobCategoryName: string;  // Resolved to jobCategoryId during seeding
  hourlyRateCents: number;
}> = [
  { name: 'Maria Santos',     jobCategoryName: 'Line Cook',     hourlyRateCents: 2200 },
  { name: 'James Wilson',     jobCategoryName: 'Bartender',     hourlyRateCents: 2400 },
  { name: 'Sarah Johnson',    jobCategoryName: 'Host/Hostess',  hourlyRateCents: 1600 },
  { name: 'Mike Chen',        jobCategoryName: 'Busser',        hourlyRateCents: 1550 },
  { name: 'Lisa Park',        jobCategoryName: 'Dishwasher',    hourlyRateCents: 1600 },
  { name: 'Tom Rodriguez',    jobCategoryName: 'Line Cook',     hourlyRateCents: 2000 },
  { name: 'Amy Martinez',     jobCategoryName: 'Host/Hostess',  hourlyRateCents: 1500 },
  { name: 'Dan Torres',       jobCategoryName: 'Busser',        hourlyRateCents: 1500 },
  { name: 'Katie Middleton',  jobCategoryName: 'Bartender',     hourlyRateCents: 2200 },
  { name: 'Chris Lee',        jobCategoryName: 'Dishwasher',    hourlyRateCents: 1550 },
];

// Default organization settings (matches settings.service.ts DEFAULT_SETTINGS)
export const SAMPLE_ORG_SETTINGS = {
  contributionMethod: 'ALL_SALES' as const,
  contributionRate: 3.25,
  payPeriodType: 'BIWEEKLY' as const,
  estimatedMonthlySales: 100000,
  autoArchiveDays: 1,
  roundingMode: 'NEAREST' as const,
};
```

**Step 2: Commit**

```bash
git add tip-share-pro-backend/src/constants/sample-data.ts
git commit -m "feat: add sample data constants for registration seeding"
```

---

### Task 3: Extend Registration to Seed Sample Data

**Files:**
- Modify: `tip-share-pro-backend/src/services/auth.service.ts:138-169` (register method transaction)

**Step 1: Add import at top of auth.service.ts**

After the existing imports, add:

```typescript
import { SAMPLE_JOB_CATEGORIES, SAMPLE_EMPLOYEES, SAMPLE_ORG_SETTINGS } from '../constants/sample-data';
```

**Step 2: Extend the registration transaction**

Replace the existing `prisma.$transaction` block (lines 138-169) with a version that also creates job categories, employees, and settings. The transaction currently creates Org → Location → User. Extend it to:

1. Create Organization (with `SAMPLE_ORG_SETTINGS` in settings JSON)
2. Create Location
3. Create 13 job categories (using `tx.jobCategory.createMany`)
4. Look up created categories by name to get their IDs
5. Create 10 sample employees (using `tx.employee.createMany` with `isSample: true`)
6. Create User

The full replacement for the `prisma.$transaction` block:

```typescript
    const user = await prisma.$transaction(async (tx) => {
      // 1. Create Organization with default settings
      const organization = await tx.organization.create({
        data: {
          name: orgName,
          subscriptionStatus: 'DEMO',
          trialEndsAt,
          settings: SAMPLE_ORG_SETTINGS as Record<string, unknown>,
        },
      });

      // 2. Create Location
      const location = await tx.location.create({
        data: {
          organizationId: organization.id,
          name: 'Main Location',
          number: '001',
        },
      });

      // 3. Create job categories
      await tx.jobCategory.createMany({
        data: SAMPLE_JOB_CATEGORIES.map(cat => ({
          organizationId: organization.id,
          name: cat.name,
          weight: cat.weight,
          badgeColor: cat.badgeColor,
        })),
      });

      // 4. Look up created categories by name → id
      const createdCategories = await tx.jobCategory.findMany({
        where: { organizationId: organization.id },
      });
      const categoryMap = new Map(createdCategories.map(c => [c.name, c.id]));

      // 5. Create sample employees
      const now = new Date();
      await tx.employee.createMany({
        data: SAMPLE_EMPLOYEES.map(emp => ({
          organizationId: organization.id,
          locationId: location.id,
          jobCategoryId: categoryMap.get(emp.jobCategoryName)!,
          name: emp.name,
          hourlyRateCents: emp.hourlyRateCents,
          isSample: true,
          hiredAt: now,
          status: 'ACTIVE' as const,
        })),
      });

      // 6. Create User
      return tx.user.create({
        data: {
          organizationId: organization.id,
          locationId: location.id,
          email: normalizedEmail,
          passwordHash,
          role: 'ADMIN',
          lastLoginAt: new Date(),
        },
        include: {
          organization: true,
          location: true,
        },
      });
    });
```

**Step 3: Verify TypeScript compiles**

Run: `cd tip-share-pro-backend && npx tsc --noEmit`
Expected: no errors

**Step 4: Commit**

```bash
git add tip-share-pro-backend/src/services/auth.service.ts
git commit -m "feat: seed sample employees and categories on registration"
```

---

### Task 4: Add `isSample` to Employee API Response

**Files:**
- Modify: `tip-share-pro-backend/src/services/employee.service.ts:16-34` (EmployeeResponse interface)
- Modify: `tip-share-pro-backend/src/services/employee.service.ts:314-346` (formatEmployee method)

**Step 1: Add `isSample` to EmployeeResponse interface**

After the `status` field (line 29), add:

```typescript
  isSample: boolean;
```

**Step 2: Update `formatEmployee` to include `isSample`**

In the `formatEmployee` method, add `isSample` to the input type and output object:

Add to the input type parameter: `isSample: boolean;`

Add to the returned object (after `status`): `isSample: employee.isSample,`

**Step 3: Add `isSample` to the frontend Employee type**

In `tip-share-pro-app/src/lib/api/employees.ts`, add to the `Employee` interface (after `status` line 26):

```typescript
  isSample: boolean;
```

**Step 4: Verify both TypeScript projects compile**

Run: `cd tip-share-pro-backend && npx tsc --noEmit`
Run: `cd tip-share-pro-app && npx tsc --noEmit`
Expected: no errors for both

**Step 5: Commit**

```bash
git add tip-share-pro-backend/src/services/employee.service.ts tip-share-pro-app/src/lib/api/employees.ts
git commit -m "feat: expose isSample flag in employee API response"
```

---

### Task 5: Hard-Delete Sample Employees + Bulk Clear Endpoint

**Files:**
- Modify: `tip-share-pro-backend/src/services/employee.service.ts:290-309` (delete method)
- Add method: `tip-share-pro-backend/src/services/employee.service.ts` (new `clearSamples` method)
- Modify: `tip-share-pro-backend/src/routes/employee.routes.ts` (add DELETE /employees/samples route)

**Step 1: Modify the `delete` method to hard-delete sample employees**

Replace the existing `delete` method in `employee.service.ts` (lines 290-309):

```typescript
  async delete(organizationId: string, employeeId: string): Promise<void> {
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        organizationId,
      },
    });

    if (!employee) {
      throw new NotFoundError('Employee', employeeId);
    }

    if (employee.isSample) {
      // Hard-delete sample employees — no audit trail needed
      await prisma.employee.delete({
        where: { id: employeeId },
      });
    } else {
      // Soft-delete real employees
      await prisma.employee.update({
        where: { id: employeeId },
        data: {
          status: 'TERMINATED',
          terminatedAt: new Date(),
        },
      });
    }
  }
```

**Step 2: Add `clearSamples` method to EmployeeService**

Add after the `delete` method:

```typescript
  /**
   * Hard-delete all sample employees for an organization
   */
  async clearSamples(organizationId: string): Promise<number> {
    const result = await prisma.employee.deleteMany({
      where: {
        organizationId,
        isSample: true,
      },
    });
    return result.count;
  }
```

**Step 3: Add `DELETE /employees/samples` route**

In `employee.routes.ts`, add this route BEFORE the `DELETE /:employeeId` route (important — Express matches routes in order, so `/samples` must come before `/:employeeId` or it'll be treated as an employeeId):

```typescript
/**
 * DELETE /employees/samples
 * Hard-delete all sample employees (Admin only)
 */
router.delete(
  '/samples',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      const count = await employeeService.clearSamples(user.organizationId);

      res.status(200).json({
        status: 'success',
        data: { message: `Cleared ${count} sample employees`, count },
      });
    } catch (error) {
      next(error);
    }
  }
);
```

**Step 4: Verify TypeScript compiles**

Run: `cd tip-share-pro-backend && npx tsc --noEmit`
Expected: no errors

**Step 5: Commit**

```bash
git add tip-share-pro-backend/src/services/employee.service.ts tip-share-pro-backend/src/routes/employee.routes.ts
git commit -m "feat: hard-delete sample employees, add bulk clear endpoint"
```

---

### Task 6: Frontend API + Context Integration

**Files:**
- Modify: `tip-share-pro-app/src/lib/api/employees.ts` (add `clearSampleEmployees` function)
- Modify: `tip-share-pro-app/src/lib/DemoContext.tsx` (add `clearSamples` to context, pass `isSample` through)

**Step 1: Add `clearSampleEmployees` API function**

In `tip-share-pro-app/src/lib/api/employees.ts`, add after the `deleteEmployee` function:

```typescript
/**
 * Clear all sample employees (hard-delete)
 */
export async function clearSampleEmployees(): Promise<{ message: string; count: number }> {
  return del<{ message: string; count: number }>('/employees/samples');
}
```

**Step 2: Add `hasSampleEmployees` to DemoContext state and `clearSamples` function**

In `tip-share-pro-app/src/lib/DemoContext.tsx`:

1. Import `clearSampleEmployees` from the API module (add to existing import)
2. Add to the state interface: `hasSampleEmployees: boolean`
3. Initialize in `initialState`: `hasSampleEmployees: false`
4. In `loadUserData`, after mapping `frontendEmployees`, compute:
   ```typescript
   const hasSamples = employeesResp.employees.some((e: { isSample?: boolean }) => e.isSample === true);
   ```
   And add to the setState call: `hasSampleEmployees: hasSamples,`
5. Add a `clearSamples` callback:
   ```typescript
   const clearSamples = useCallback(async () => {
     if (stateRef.current.isDemo) return;
     try {
       await clearSampleEmployees();
       setState(prev => ({ ...prev, hasSampleEmployees: false }));
       await loadUserData();
     } catch (err) {
       console.error('Failed to clear sample employees:', err);
     }
   }, [loadUserData]);
   ```
6. Expose `hasSampleEmployees` in the exposed state and `clearSamples` in the context value

**Step 3: Verify TypeScript compiles**

Run: `cd tip-share-pro-app && npx tsc --noEmit`
Expected: no errors

**Step 4: Commit**

```bash
git add tip-share-pro-app/src/lib/api/employees.ts tip-share-pro-app/src/lib/DemoContext.tsx
git commit -m "feat: add clearSamples to frontend context and API"
```

---

### Task 7: Frontend Banner Component

**Files:**
- Modify: `tip-share-pro-app/src/components/DistributionTable.tsx` (add sample data banner)
- Modify: `tip-share-pro-app/src/app/globals.css` (add banner styles)

**Step 1: Add the sample data banner to DistributionTable**

In `DistributionTable.tsx`, add to the `useDemo()` destructuring: `clearSamples`

After the `{/* Section Header */}` div (around line 648), add:

```tsx
{/* Sample Data Banner */}
{state.hasSampleEmployees && !isDemo && (
  <div className="sample-data-banner">
    <span className="sample-data-banner-icon">i</span>
    <span className="sample-data-banner-text">
      You're viewing sample employees. Edit them to explore, or clear them to start fresh.
    </span>
    <button
      onClick={clearSamples}
      className="btn btn-outline btn-sm sample-data-banner-btn"
    >
      Clear All Samples
    </button>
  </div>
)}
```

**Step 2: Add banner CSS styles**

In `globals.css`, add in the Distribution Table section:

```css
/* Sample Data Banner */
.sample-data-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  margin-bottom: 0.75rem;
  background: var(--bg-elevated);
  border: 1px solid var(--color-info, #3b82f6);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.sample-data-banner-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-info, #3b82f6);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.sample-data-banner-text {
  flex: 1;
}

.sample-data-banner-btn {
  flex-shrink: 0;
  white-space: nowrap;
}
```

**Step 3: Verify TypeScript compiles**

Run: `cd tip-share-pro-app && npx tsc --noEmit`
Expected: no errors

**Step 4: Commit**

```bash
git add tip-share-pro-app/src/components/DistributionTable.tsx tip-share-pro-app/src/app/globals.css
git commit -m "feat: add sample data info banner to distribution table"
```

---

### Task 8: Apply Migration to Production + Push

**Step 1: Push all commits to GitHub**

```bash
git push
```

**Step 2: Apply migration on production database**

SSH into the production server (or use Coolify console) and run:

```bash
cd tip-share-pro-backend && npx prisma migrate deploy
```

This applies the `20260228000000_add_employee_is_sample` migration.

**Step 3: Restart the backend service**

Restart via Coolify to pick up the new code.

**Step 4: Test the full flow**

1. Register a new test account
2. Verify: 13 job categories appear in settings
3. Verify: 10 sample employees appear in the distribution table
4. Verify: Info banner shows "You're viewing sample employees..."
5. Click "Clear All Samples" — verify employees are removed and banner disappears
6. Verify: Job categories remain (they're useful)
