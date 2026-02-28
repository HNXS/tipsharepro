# Sample Data Seeding on Registration

**Date:** 2026-02-28
**Status:** Approved

## Problem

New users who register see a completely empty distribution table — no employees, no categories, no context. This makes it hard to understand how the tool works. The existing demo mode (frontend-only, hardcoded data) doesn't help real accounts.

## Decision

Seed sample employees + job categories + default settings into the database during registration. Mark sample employees with `isSample` flag for clean hard-delete when the user is ready to use their own data.

## Design

### Database Schema Change

Add `is_sample` boolean column to `employees` table:

```sql
ALTER TABLE employees ADD COLUMN is_sample BOOLEAN NOT NULL DEFAULT false;
```

No change to `job_categories` — the 13 standard restaurant roles are useful regardless and don't need a sample flag.

### Registration Flow (auth.service.ts)

Extend the existing `register()` transaction (Org → Location → User) to also create:

1. **13 job categories** — Lead Cook, Line Cook, Pastry Chef, Pantry Chef, Host/Hostess, Busser, Cashier, Runner, Bartender, Barista, Bar Back, Dishwasher, Prep Cook
2. **10 sample employees** — Maria Santos, James Wilson, Sarah Johnson, Mike Chen, Lisa Park, Tom Rodriguez, Amy Martinez, Dan Torres, Katie Middleton, Chris Lee (with `isSample: true`)
3. **Default org settings** — contribution method: ALL_SALES, rate: 3.25%, estimated monthly sales: $100K, category weights: BOH=3, FOH=2, Bar=4, Support=1, Custom=1

All in the same transaction.

### Sample Data Cleanup

- **Individual delete**: Deleting a sample employee → hard `DELETE` (not soft-delete). The delete endpoint checks `isSample` flag.
- **Clear all samples**: New endpoint `DELETE /employees/samples` hard-deletes all `isSample=true` rows for the org.

### Frontend Banner

When any employee has `isSample: true`, show a dismissible info banner above the distribution table:

```
ⓘ You're viewing sample employees. Edit them, or [Clear all & start fresh].
```

The `GET /employees` response includes `isSample` on each employee object.

### Data Lifecycle

| Item | Created on signup | Hard-deletable | Persists after clear |
|------|-------------------|----------------|---------------------|
| 13 job categories | Yes | No (useful) | Yes |
| 10 sample employees | Yes, `isSample=true` | Yes | No |
| Default settings | Yes | N/A (overwritten) | Settings persist |

### DB Impact

~24 rows per signup (13 categories + 10 employees + 1 settings update). At 1,000 signups: 24K rows before any cleanup — trivial for Postgres. Sample employees are hard-deleted (not soft-deleted) so they don't accumulate.
