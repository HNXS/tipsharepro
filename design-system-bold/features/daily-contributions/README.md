# Daily Contributions Feature

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

The Daily Contributions page (Page 5) is the primary data entry interface for TipSharePro. It allows authorized users to enter daily tip contributions from servers and other contributing staff members.

---

## Feature Scope

### What This Feature Does

- Enter daily tip/sales contributions by employee
- Navigate between days within a pay period
- Copy data from previous days
- View running totals and calculations
- Auto-calculate contributions based on sales × rate

### User Access

| Role | Access Level |
|------|--------------|
| Admin | Full access |
| Manager | Full access |
| Designee | Full access |
| Viewer | No access |

---

## Page Structure

### Header Section
- Back button to Navigation Hub
- Page title with current date
- Date navigator (prev/next day)
- "Copy Previous Day" action button
- "Save & Continue" primary button

### Data Entry Grid
- Rows: Contributing employees (Servers, etc.)
- Columns: Sales, Calculated Contribution, Actual Contribution
- Green-highlighted "Actual Contribution" field (editable override)

### Summary Section
- Daily total contributions
- Number of contributors
- Period running total (if applicable)

---

## Key Business Rules

### Who Contributes
- Only job categories configured as "contributors" appear
- Typically servers, bartenders (roles that receive direct tips)

### Contribution Calculation
```
Calculated Contribution = Sales Amount × Contribution Rate
```

### Override Field
- "Actual Contribution" allows manual override
- Highlighted in green to indicate editability
- If different from calculated, shows variance indicator

### Date Navigation
- Can only enter data for dates within current pay period
- Future dates show as "locked" (no entry allowed)
- Past dates outside period show warning

---

## Related Documentation

- User Journey: `user-journey.md`
- Screen States: `screen-states.md`
- Interactions: `interactions.md`
- Accessibility: `accessibility.md`
- Implementation: `implementation.md`

---

## Design System Components Used

- Data Grid/Table: `/components/tables.md`
- Form Inputs (Currency): `/components/forms.md`
- Date Navigator: `/components/navigation.md`
- Buttons: `/components/buttons.md`
- Help System: `/components/help-system.md`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial daily contributions feature documentation |
