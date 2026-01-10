# PPE Distribution Feature

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

The PPE (Pay Period Ending) Distribution page (Page 7) displays the calculated tip pool distribution for a completed pay period. This is the primary output of TipSharePro, showing each employee's share of the collective tip pool.

---

## Feature Scope

### What This Feature Does

- Display calculated tip distribution for a pay period
- Show employee shares with breakdown
- Export distribution reports (PDF/Print)
- View historical distributions
- Toggle between Admin and Employee views

### User Access

| Role | Access Level |
|------|--------------|
| Admin | Full access, all columns, wage data |
| Manager | Full access, all columns, wage data |
| Designee | Limited view, no wage data |
| Viewer | Employee view only, no wage data |

---

## Page Structure

### Header Section
- Back button to Navigation Hub
- Page title with pay period dates
- Period selector (for viewing history)
- Export/Print buttons
- View toggle (Admin/Employee)

### Summary Cards
- Total Pool Amount
- Number of Recipients
- Average Share
- Period Dates

### Distribution Table
- Employee Name
- Job Category (badge)
- Hours Worked
- Hourly Rate (Admin only, hidden on print)
- Share Percentage
- Share Amount
- Received (whole dollars)

### Footer
- Total row
- Privacy notice
- Last calculated timestamp

---

## Key Business Rules

### Distribution Calculation

```
1. Collect all contributions from PPE Contributions page
2. For each eligible employee:
   - Basis = Hours × Hourly Rate × Weight
3. Total Basis = Sum of all employee bases
4. For each employee:
   - Share % = (Employee Basis / Total Basis) × 100
   - Share Amount = Pool × Share %
   - Received = Round to whole dollars (proprietary method)
```

### What's Shown vs. Hidden

| Column | Admin View | Employee View | Print |
|--------|------------|---------------|-------|
| Employee | ✓ | ✓ | ✓ |
| Job Category | ✓ | ✓ | ✓ |
| Hours | ✓ | ✓ | ✓ |
| Rate | ✓ | ✗ | ✗ |
| Share % | ✓ | ✓ | ✓ |
| Share Amount | ✓ | ✓ | ✓ |
| Received | ✓ | ✓ | ✓ |
| **Basis** | **✗** | **✗** | **✗** |

**IMPORTANT:** The "Basis" column is NEVER shown. This is a proprietary calculation that remains hidden from all users.

### !!Note Critical Warning

When accessing the full Admin view with wage data, users must acknowledge the wage confidentiality !!Note modal.

---

## Related Documentation

- User Journey: `user-journey.md`
- Screen States: `screen-states.md`
- Interactions: `interactions.md`
- Accessibility: `accessibility.md`
- Implementation: `implementation.md`

---

## Design System Components Used

- Distribution Table: `/components/tables.md`
- Stat Cards: `/components/cards.md`
- Badges: `/components/badges.md`
- !!Note Modal: `/components/help-system.md`
- Buttons: `/components/buttons.md`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial distribution feature documentation |
