# TipSharePro Badge Components

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

Badges in TipSharePro provide quick visual identification of job categories, statuses, and role types. The badge system uses consistent color coding throughout the application to help users quickly scan and understand data.

---

## Job Category Badges

Color-coded badges identify employee roles in distribution tables and employee lists.

### Badge Colors

| Role | Background | Text | Hex Code |
|------|------------|------|----------|
| **Server** | Light Blue | Blue | `#35A0D2` |
| **Bartender** | Light Navy | Navy | `#1A4B7C` |
| **Lead Cook** | Light Yellow | Yellow | `#F59E0B` |
| **Line Cook** | Light Yellow | Yellow | `#F59E0B` |
| **Prep Cook** | Light Yellow | Yellow | `#F59E0B` |
| **Busser** | Light Green | Green | `#82B536` |
| **Food Runner** | Light Green | Green | `#82B536` |
| **Host** | Light Purple | Purple | `#7C3AED` |
| **Expo** | Light Cyan | Cyan | `#35A0D2` |
| **Dishwasher** | Light Gray | Gray | `#78716C` |

### Base Badge Styles

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-radius: var(--radius-full);
  white-space: nowrap;
}
```

### Job Category Badge Classes

```css
/* Front of House (FOH) */
.badge-server {
  background: rgba(53, 160, 210, 0.15);
  color: #35A0D2;
}

.badge-bartender {
  background: rgba(26, 75, 124, 0.15);
  color: #1A4B7C;
}

.badge-host {
  background: rgba(124, 58, 237, 0.15);
  color: #7C3AED;
}

/* Back of House (BOH) */
.badge-cook,
.badge-lead-cook,
.badge-line-cook,
.badge-prep-cook {
  background: rgba(245, 158, 11, 0.15);
  color: #F59E0B;
}

.badge-dishwasher {
  background: rgba(120, 113, 108, 0.15);
  color: #78716C;
}

/* Support Roles */
.badge-busser,
.badge-food-runner {
  background: rgba(130, 181, 54, 0.15);
  color: #82B536;
}

.badge-expo {
  background: rgba(53, 160, 210, 0.15);
  color: #35A0D2;
}

/* Custom/Write-in Categories */
.badge-custom {
  background: rgba(232, 93, 4, 0.15);
  color: var(--color-primary);
}
```

### HTML Examples

```html
<!-- In distribution table -->
<td><span class="badge badge-server">Server</span></td>
<td><span class="badge badge-bartender">Bartender</span></td>
<td><span class="badge badge-lead-cook">Lead Cook</span></td>
<td><span class="badge badge-busser">Busser</span></td>
<td><span class="badge badge-host">Host</span></td>

<!-- Custom category -->
<td><span class="badge badge-custom">Barback</span></td>
```

---

## Role Type Badges

Grouping badges for FOH/BOH/Support classification.

```css
.badge-foh {
  background: var(--color-accent-light);
  color: var(--color-accent);
}

.badge-boh {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.badge-bar {
  background: rgba(26, 75, 124, 0.15);
  color: var(--color-secondary);
}

.badge-support {
  background: var(--color-success-light);
  color: var(--color-success);
}
```

```html
<span class="badge badge-foh">FOH</span>
<span class="badge badge-boh">BOH</span>
<span class="badge badge-bar">Bar</span>
<span class="badge badge-support">Support</span>
```

---

## Status Badges

For indicating states and statuses throughout the application.

### Status Types

```css
.badge-status {
  padding: 0.375rem 0.75rem;
  font-size: 0.6875rem;
}

.badge-active {
  background: var(--color-success-light);
  color: var(--color-success);
}

.badge-inactive {
  background: var(--color-stone);
  color: var(--color-text-muted);
}

.badge-pending {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.badge-completed {
  background: var(--color-success-light);
  color: var(--color-success);
}

.badge-error {
  background: var(--color-error-light);
  color: var(--color-error);
}

.badge-draft {
  background: var(--color-stone);
  color: var(--color-text-secondary);
}

.badge-posted {
  background: var(--color-primary-light);
  color: var(--color-primary);
}
```

```html
<!-- Pay period status -->
<span class="badge badge-status badge-draft">Draft</span>
<span class="badge badge-status badge-pending">Pending Review</span>
<span class="badge badge-status badge-posted">Posted</span>

<!-- Employee status -->
<span class="badge badge-status badge-active">Active</span>
<span class="badge badge-status badge-inactive">Inactive</span>
```

---

## Permission Badges

For indicating user roles and permissions.

```css
.badge-admin {
  background: linear-gradient(135deg, var(--color-error), var(--color-primary));
  color: var(--color-white);
}

.badge-manager {
  background: var(--color-secondary);
  color: var(--color-white);
}

.badge-designee {
  background: var(--color-accent);
  color: var(--color-white);
}

.badge-viewer {
  background: var(--color-stone);
  color: var(--color-text-secondary);
}
```

```html
<!-- User roles in settings -->
<span class="badge badge-admin">Admin</span>
<span class="badge badge-manager">Manager</span>
<span class="badge badge-designee">Designee</span>
<span class="badge badge-viewer">View Only</span>
```

---

## Trial Badge

Special badge for trial period indication.

```css
.badge-trial {
  background: linear-gradient(135deg, var(--color-primary), var(--color-warning));
  color: var(--color-white);
  font-weight: 700;
  animation: pulse-subtle 2s infinite;
}

.badge-trial-urgent {
  background: var(--color-error);
  color: var(--color-white);
  animation: pulse 1.5s infinite;
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

```html
<!-- Trial countdown (last 10 days) -->
<span class="badge badge-trial">Trial: 10 days left</span>
<span class="badge badge-trial">Trial: 5 days left</span>
<span class="badge badge-trial-urgent">Trial: 2 days left</span>
```

---

## Badge Sizes

### Small

```css
.badge-sm {
  padding: 0.125rem 0.5rem;
  font-size: 0.625rem;
}
```

### Large

```css
.badge-lg {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}
```

---

## Badge with Icon

```html
<span class="badge badge-active badge-icon">
  <svg class="badge-icon-svg"><!-- Check icon --></svg>
  Active
</span>
```

```css
.badge-icon {
  gap: 0.25rem;
}

.badge-icon-svg {
  width: 12px;
  height: 12px;
}
```

---

## Badge with Count

For showing quantities or notifications.

```html
<span class="badge badge-count">12</span>
<span class="badge badge-count badge-count-primary">5</span>
```

```css
.badge-count {
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background: var(--color-stone);
  color: var(--color-text-secondary);
}

.badge-count-primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.badge-count-danger {
  background: var(--color-error);
  color: var(--color-white);
}
```

---

## Badge in Tables

Specific styling for badges within distribution tables.

```css
.table .badge {
  font-size: 0.6875rem;
  padding: 0.1875rem 0.625rem;
}

/* Ensure badge doesn't affect row height */
.table td .badge {
  vertical-align: middle;
}
```

---

## Badge Groups

For displaying multiple badges together.

```html
<div class="badge-group">
  <span class="badge badge-server">Server</span>
  <span class="badge badge-bartender">Bartender</span>
</div>
```

```css
.badge-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
```

---

## Accessibility

- Use sufficient color contrast (minimum 4.5:1)
- Don't rely solely on color to convey meaning
- Include descriptive text within badges
- Use `aria-label` for icon-only badges

```html
<!-- Icon-only badge with accessible label -->
<span class="badge badge-active" aria-label="Active status">
  <svg aria-hidden="true"><!-- Icon --></svg>
</span>

<!-- Badge with additional context -->
<span class="badge badge-server" title="Front of House - Server">Server</span>
```

---

## Usage Guidelines

### DO
- Use consistent colors for the same job categories
- Keep badge text short and clear
- Use badges to aid quick scanning
- Maintain color meaning throughout the app

### DON'T
- Don't create new colors without design approval
- Don't use badges for long text content
- Don't mix badge sizes in the same context
- Don't use badges for interactive elements

---

## Job Category Reference

Default categories shipped with TipSharePro:

| Category | Role Type | Color | Weight Default |
|----------|-----------|-------|----------------|
| Server | FOH | Blue | 1.00 |
| Bartender | Bar | Navy | 1.25 |
| Lead Cook | BOH | Yellow | 1.50 |
| Line Cook | BOH | Yellow | 1.25 |
| Prep Cook | BOH | Yellow | 1.00 |
| Busser | Support | Green | 0.75 |
| Food Runner | Support | Green | 0.75 |
| Host | FOH | Purple | 0.75 |
| Expo | Support | Cyan | 1.00 |
| Dishwasher | BOH | Gray | 0.75 |

Plus 5 write-in fields for custom categories.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial badge specifications |
