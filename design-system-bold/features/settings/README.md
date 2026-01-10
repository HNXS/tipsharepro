# Settings Feature

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

The Settings page (Page 3) is the configuration hub for TipSharePro. It allows administrators and managers to configure all system parameters that affect tip pool calculations and distributions.

---

## Feature Scope

### What This Feature Does

- Configure location/establishment details
- Set pay period parameters
- Define contribution method and rate
- Manage job categories and weights
- Control user access (Admin only)

### User Access

| Role | Access Level |
|------|--------------|
| Admin | Full access, all tabs |
| Manager | All tabs except Users |
| Designee | No access |
| Viewer | No access |

---

## Tab Structure

The Settings page uses tabbed navigation with 6 tabs:

| Tab | Content | Access |
|-----|---------|--------|
| **Location** | Establishment name, address, multi-location toggle | Admin/Manager |
| **Pay Period** | Period type, start date, timing | Admin/Manager |
| **Contribution** | Method, rate, basis source | Admin/Manager |
| **Job Categories** | Role names, groupings, enable/disable | Admin/Manager |
| **Weights** | Category weights (1.00-5.00) | Admin/Manager |
| **Users** | User management, roles, permissions | Admin only |

---

## Key Business Rules

### Location Tab
- Multi-location toggle affects PP Allocations visibility
- Location name appears on all reports

### Pay Period Tab
- Period types: Weekly, Bi-weekly, Semi-monthly
- Start date determines all period calculations
- Changes affect future periods only

### Contribution Tab
- Methods: CC Sales, CC Tips, All Tips, All Sales
- Rate range: 1% - 25% depending on method
- "All Sales" is recommended default

### Job Categories Tab
- 8 default categories (Server, Bartender, Lead Cook, etc.)
- 5 write-in custom categories
- Categories can be enabled/disabled
- Categories grouped by type (FOH, BOH, Bar, Support)

### Weights Tab
- Range: 1.00 to 5.00 in 0.25 increments
- Default weights vary by category
- Higher weight = larger share of pool
- Weights affect all active employees in category

### Users Tab (Admin Only)
- Create/edit/deactivate users
- Assign roles (Admin, Manager, Designee, Viewer)
- 2FA enforcement option
- Activity logging

---

## Related Documentation

- User Journey: `user-journey.md`
- Screen States: `screen-states.md`
- Interactions: `interactions.md`
- Accessibility: `accessibility.md`
- Implementation: `implementation.md`

---

## Design System Components Used

- Tab Navigation: `/components/navigation.md`
- Form Elements: `/components/forms.md`
- Help System: `/components/help-system.md`
- Buttons: `/components/buttons.md`
- Modals: `/components/modals.md`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial settings feature documentation |
