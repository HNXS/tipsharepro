---
title: Form Components
description: Input fields, selects, checkboxes, and form patterns for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../tokens/colors.md
  - ./buttons.md
status: approved
---

# Form Components

## Overview

Forms in Tip Share Pro are optimized for financial data entry. Every input is designed for clarity, precision, and efficiency—respecting that restaurant managers are often entering data at the end of a long shift.

---

## Text Input

### Anatomy

```
┌─ Form Group ────────────────────────────────────┐
│                                                 │
│  LABEL                                          │
│  ┌─────────────────────────────────────────┐   │
│  │ Placeholder or value                     │   │
│  └─────────────────────────────────────────┘   │
│  Helper text or error message                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Visual Specs

| Property | Value |
|----------|-------|
| Background | `--midnight` (#0C0A07) |
| Border | 1px solid `--walnut` (#3D3225) |
| Border Radius | `--radius-md` (6px) |
| Text | `--cream` (#F7F3EA) |
| Placeholder | `--stone` (#8B7B65) |
| Padding | 12px 18px |
| Font | `--font-body`, 400 weight, 16px |

### States

| State | Border | Background | Additional |
|-------|--------|------------|------------|
| Default | `--walnut` | `--midnight` | — |
| Hover | `--stone` | `--midnight` | — |
| Focus | `--brass` | `--midnight` | `--shadow-glow` |
| Disabled | `--walnut` | `--espresso` | opacity 0.5 |
| Error | `--sienna` | `--midnight` | Error icon |
| Success | `--sage` | `--midnight` | Check icon |

### CSS Implementation

```css
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--linen);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-1);
}

.form-input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: var(--midnight);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--cream);
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.form-input::placeholder {
  color: var(--stone);
}

.form-input:hover {
  border-color: var(--stone);
}

.form-input:focus {
  outline: none;
  border-color: var(--brass);
  box-shadow: var(--shadow-glow);
}

.form-input:disabled {
  background: var(--espresso);
  opacity: 0.5;
  cursor: not-allowed;
}

.form-input[aria-invalid="true"] {
  border-color: var(--sienna);
}

.form-helper {
  font-size: 0.75rem;
  color: var(--stone);
  margin-top: var(--space-1);
}

.form-error {
  font-size: 0.75rem;
  color: var(--sienna);
  margin-top: var(--space-1);
}
```

---

## Currency Input

Specialized input for dollar amounts.

### Visual Specs

```
┌─────────────────────────────────────────┐
│  $  │  2,847.50                         │
│     │                                   │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Font | `--font-mono` (JetBrains Mono) |
| Prefix | `$` in `--stone` |
| Alignment | Right-aligned |

```css
.form-input-currency {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
  padding-left: var(--space-5);
}

.form-group-currency {
  position: relative;
}

.form-group-currency::before {
  content: '$';
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  color: var(--stone);
  pointer-events: none;
}
```

---

## Hours Input

For entering worked hours.

```css
.form-input-hours {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.form-group-hours::after {
  content: 'hrs';
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--stone);
  pointer-events: none;
}
```

---

## Percentage Input

For tip rates and percentages.

```css
.form-input-percentage {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
  padding-right: var(--space-5);
}

.form-group-percentage::after {
  content: '%';
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  color: var(--stone);
  pointer-events: none;
}
```

---

## Select Dropdown

### Visual Specs

```
┌─────────────────────────────────────────┐
│  Selected Option                    ▼   │
└─────────────────────────────────────────┘
```

```css
.form-select {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  padding-right: var(--space-6);
  background: var(--midnight);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--cream);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='%238B7B65'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.form-select:hover {
  border-color: var(--stone);
}

.form-select:focus {
  outline: none;
  border-color: var(--brass);
  box-shadow: var(--shadow-glow);
}

.form-select option {
  background: var(--espresso);
  color: var(--cream);
  padding: var(--space-2);
}
```

---

## Custom Dropdown (Enhanced)

For richer dropdown experiences:

```css
.dropdown {
  position: relative;
}

.dropdown-trigger {
  /* Same as .form-select */
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--space-1);
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  max-height: 240px;
  overflow-y: auto;
  animation: dropdown-open var(--duration-normal) var(--ease-decelerate);
}

.dropdown-item {
  padding: var(--space-2) var(--space-3);
  color: var(--linen);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.dropdown-item:hover,
.dropdown-item:focus {
  background: var(--mahogany);
  color: var(--cream);
}

.dropdown-item[aria-selected="true"] {
  background: var(--mahogany);
  color: var(--brass);
}

@keyframes dropdown-open {
  from {
    opacity: 0;
    transform: scaleY(0.9) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
}
```

---

## Checkbox

### Visual Specs

```
┌────┐
│ ✓  │  Label text
└────┘
```

| Property | Value |
|----------|-------|
| Size | 20px × 20px |
| Border | 2px solid `--walnut` |
| Checked Background | `--brass` |
| Checkmark | `--midnight` |

```css
.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  cursor: pointer;
}

.form-checkbox-input {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--walnut);
  border-radius: var(--radius-sm);
  background: var(--midnight);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);
}

.form-checkbox-input:hover {
  border-color: var(--stone);
}

.form-checkbox-input:focus-visible {
  outline: none;
  box-shadow: var(--shadow-glow);
}

.form-checkbox-input:checked {
  background: var(--brass);
  border-color: var(--brass);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%230C0A07'%3E%3Cpath d='M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 111.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z'/%3E%3C/svg%3E");
  background-size: 14px;
  background-position: center;
  background-repeat: no-repeat;
}

.form-checkbox-label {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--linen);
  line-height: 1.4;
}
```

---

## Radio Button

```css
.form-radio {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  cursor: pointer;
}

.form-radio-input {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--walnut);
  border-radius: 50%;
  background: var(--midnight);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    border-color var(--duration-fast) var(--ease-standard);
}

.form-radio-input:hover {
  border-color: var(--stone);
}

.form-radio-input:focus-visible {
  outline: none;
  box-shadow: var(--shadow-glow);
}

.form-radio-input:checked {
  border-color: var(--brass);
  background: radial-gradient(var(--brass) 40%, transparent 45%);
}
```

---

## Toggle Switch

For binary on/off settings.

```css
.form-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
}

.form-toggle-track {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--walnut);
  border-radius: var(--radius-full);
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.form-toggle-input:checked + .form-toggle-track {
  background: var(--brass);
}

.form-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--cream);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-fast) var(--ease-standard);
}

.form-toggle-input:checked + .form-toggle-track .form-toggle-thumb {
  transform: translateX(20px);
}

.form-toggle-input:focus-visible + .form-toggle-track {
  box-shadow: var(--shadow-glow);
}
```

---

## Date Picker

```css
.form-date {
  position: relative;
}

.form-input-date {
  padding-right: var(--space-6);
}

.form-date-icon {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--stone);
  pointer-events: none;
}

/* Native date picker styling */
.form-input-date::-webkit-calendar-picker-indicator {
  opacity: 0;
  cursor: pointer;
}
```

---

## Form Layouts

### Single Column

```css
.form-single {
  max-width: 480px;
}

.form-single .form-group {
  margin-bottom: var(--space-4);
}
```

### Two Column

```css
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4) var(--space-5);
}

.form-grid .form-group-full {
  grid-column: span 2;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-grid .form-group-full {
    grid-column: span 1;
  }
}
```

### Inline Form

```css
.form-inline {
  display: flex;
  align-items: flex-end;
  gap: var(--space-3);
}

.form-inline .form-group {
  margin-bottom: 0;
  flex: 1;
}

.form-inline .btn {
  flex-shrink: 0;
}
```

---

## Validation

### Error State

```html
<div class="form-group form-group-error">
  <label class="form-label">Total Tips</label>
  <input type="text" class="form-input" aria-invalid="true" aria-describedby="tips-error">
  <span class="form-error" id="tips-error">
    <svg class="form-error-icon"><!-- icon --></svg>
    Please enter a valid dollar amount
  </span>
</div>
```

### Success State

```html
<div class="form-group form-group-success">
  <label class="form-label">Email</label>
  <input type="email" class="form-input" aria-invalid="false">
  <span class="form-success">
    <svg class="form-success-icon"><!-- icon --></svg>
    Email verified
  </span>
</div>
```

---

## Accessibility

### Required Fields

```html
<label class="form-label">
  Total Tips
  <span class="form-required" aria-hidden="true">*</span>
</label>
<input type="text" class="form-input" required aria-required="true">
```

### Labels & Descriptions

```html
<div class="form-group">
  <label class="form-label" for="hours-input">Hours Worked</label>
  <input
    type="text"
    id="hours-input"
    class="form-input"
    aria-describedby="hours-helper"
  >
  <span class="form-helper" id="hours-helper">
    Enter total hours for this pay period
  </span>
</div>
```

### Keyboard Navigation

- Tab navigates between form fields
- Enter submits forms
- Space toggles checkboxes/radios
- Arrow keys navigate radio groups
- Escape closes dropdowns

---

## Do's and Don'ts

### Do:
- Always use labels (visually hidden if needed)
- Provide clear error messages
- Use appropriate input types (number, email, tel)
- Use currency/percentage inputs for financial data
- Group related fields together

### Don't:
- Use placeholder as label replacement
- Rely on color alone for validation states
- Auto-focus inputs on page load
- Use generic "Invalid input" errors

---

## Related Documentation

- [Buttons](./buttons.md)
- [Tables](./tables.md)
- [Typography Tokens](../tokens/typography.md)
