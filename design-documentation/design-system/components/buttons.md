---
title: Button Components
description: Primary actions and button variants for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../tokens/colors.md
  - ../tokens/animations.md
status: approved
---

# Button Components

## Overview

Buttons are the primary way users take action in Tip Share Pro. They're designed with physical weight and satisfying feedback—like pressing a key on a vintage cash register.

---

## Button Anatomy

```
┌─────────────────────────────────────────┐
│                                         │
│   [Icon]  Button Label  [Trailing]     │
│                                         │
└─────────────────────────────────────────┘

Padding: 12px vertical, 24px horizontal
Border radius: 6px
Icon gap: 12px
```

---

## Button Variants

### Primary Button

The brass-gold action button. Use for the single most important action on screen.

**Visual Specs:**
| Property | Value |
|----------|-------|
| Background | `--brass` (#D4A420) |
| Text | `--midnight` (#0C0A07) |
| Border | none |
| Border Radius | `--radius-md` (6px) |
| Font | `--font-body`, 500 weight |

**States:**
| State | Changes |
|-------|---------|
| Hover | Background `--brass-light`, shadow glow, translateY(-1px) |
| Active | translateY(1px), instant duration |
| Focus | `--shadow-glow` ring |
| Disabled | opacity 0.5, no interactions |
| Loading | Text transparent, spinner centered |

```css
.btn-primary {
  background: var(--brass);
  color: var(--midnight);
  border: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    transform var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.btn-primary:hover {
  background: var(--brass-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--brass-glow);
}

.btn-primary:active {
  transform: translateY(1px);
  transition-duration: var(--duration-instant);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--shadow-glow);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

**Usage:**
- "Calculate Tips" (main action)
- "Save & Close Pay Period"
- "Confirm Distribution"
- Form submissions

---

### Secondary Button

For secondary actions that are still important.

**Visual Specs:**
| Property | Value |
|----------|-------|
| Background | `--mahogany` (#2A2318) |
| Text | `--cream` (#F7F3EA) |
| Border | 1px solid `--walnut` |
| Border Radius | `--radius-md` (6px) |

**States:**
| State | Changes |
|-------|---------|
| Hover | Background `--walnut`, border `--stone` |
| Active | translateY(1px) |
| Focus | `--shadow-glow` ring |

```css
.btn-secondary {
  background: var(--mahogany);
  color: var(--cream);
  border: 1px solid var(--walnut);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    transform var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);
}

.btn-secondary:hover {
  background: var(--walnut);
  border-color: var(--stone);
  transform: translateY(-1px);
}
```

**Usage:**
- "Save Draft"
- "Edit Team Member"
- "View History"

---

### Ghost Button

Minimal presence, for tertiary actions.

**Visual Specs:**
| Property | Value |
|----------|-------|
| Background | transparent |
| Text | `--linen` (#C4B9A4) |
| Border | 1px solid `--walnut` |

**States:**
| State | Changes |
|-------|---------|
| Hover | Background `--mahogany`, text `--cream` |
| Active | translateY(1px) |

```css
.btn-ghost {
  background: transparent;
  color: var(--linen);
  border: 1px solid var(--walnut);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.btn-ghost:hover {
  background: var(--mahogany);
  color: var(--cream);
}
```

**Usage:**
- "Cancel"
- "Back"
- Secondary modal actions

---

### Danger Button

For destructive actions that require caution.

**Visual Specs:**
| Property | Value |
|----------|-------|
| Background | `--sienna` (#C74B4B) |
| Text | `--cream` |
| Border | none |

**States:**
| State | Changes |
|-------|---------|
| Hover | Background `--sienna-dark` (#A33B3B) |

```css
.btn-danger {
  background: var(--sienna);
  color: var(--cream);
  border: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    transform var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.btn-danger:hover {
  background: var(--sienna-dark);
  transform: translateY(-1px);
}
```

**Usage:**
- "Delete Pay Period"
- "Remove Team Member"
- "Clear All Data"

---

## Button Sizes

### Small

```css
.btn-sm {
  padding: var(--space-1) var(--space-3); /* 6px 18px */
  font-size: 0.875rem;
}
```

### Default

```css
.btn {
  padding: var(--space-2) var(--space-4); /* 12px 24px */
  font-size: 1rem;
}
```

### Large

```css
.btn-lg {
  padding: var(--space-3) var(--space-5); /* 18px 36px */
  font-size: 1.125rem;
}
```

---

## Icon Buttons

### With Leading Icon

```html
<button class="btn btn-primary">
  <svg class="btn-icon"><!-- icon --></svg>
  Calculate Tips
</button>
```

```css
.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
```

### Icon-Only Button

```css
.btn-icon-only {
  padding: var(--space-2);
  aspect-ratio: 1;
}

.btn-icon-only .btn-icon {
  width: 20px;
  height: 20px;
}
```

---

## Button States

### Loading State

```html
<button class="btn btn-primary" data-loading="true">
  <span class="btn-text">Calculating...</span>
  <span class="btn-spinner"></span>
</button>
```

```css
.btn[data-loading="true"] {
  position: relative;
  color: transparent;
  pointer-events: none;
}

.btn[data-loading="true"] .btn-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-primary[data-loading="true"] .btn-spinner {
  border-color: var(--midnight);
  border-top-color: transparent;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

### Success State (Post-Action)

```css
.btn-success {
  background: var(--sage);
  animation: register-ding var(--duration-slow) var(--ease-standard);
}

@keyframes register-ding {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(45, 155, 110, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px transparent;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 transparent;
  }
}
```

---

## Button Groups

### Inline Group

```html
<div class="btn-group">
  <button class="btn btn-primary">Save</button>
  <button class="btn btn-ghost">Cancel</button>
</div>
```

```css
.btn-group {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}
```

### Segmented Control

```css
.btn-segment {
  display: inline-flex;
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-md);
  padding: var(--space-1);
}

.btn-segment .btn {
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--linen);
  padding: var(--space-1) var(--space-3);
}

.btn-segment .btn[aria-pressed="true"] {
  background: var(--mahogany);
  color: var(--cream);
}
```

---

## Accessibility

### Required Attributes

```html
<!-- Standard button -->
<button type="button" class="btn btn-primary">
  Action
</button>

<!-- Submit button -->
<button type="submit" class="btn btn-primary">
  Submit
</button>

<!-- Disabled button -->
<button type="button" class="btn btn-primary" disabled aria-disabled="true">
  Disabled
</button>

<!-- Loading button -->
<button type="button" class="btn btn-primary" data-loading="true" aria-busy="true">
  <span class="btn-text">Loading</span>
  <span class="btn-spinner" aria-hidden="true"></span>
</button>

<!-- Icon-only button -->
<button type="button" class="btn btn-icon-only" aria-label="Settings">
  <svg class="btn-icon" aria-hidden="true"><!-- icon --></svg>
</button>
```

### Focus Management

- All buttons must be keyboard accessible
- Focus ring visible via `:focus-visible`
- Tab order follows visual order
- Loading buttons are not focusable

---

## Do's and Don'ts

### Do:
- Use one primary button per screen section
- Keep button labels short (2-4 words)
- Use verb-first labels ("Calculate Tips", not "Tip Calculator")
- Provide loading states for async actions
- Use danger style only for destructive actions

### Don't:
- Stack more than 3 buttons together
- Use primary style for cancel/back actions
- Disable buttons without explanation
- Use icon-only buttons without labels for primary actions

---

## Related Documentation

- [Forms](./forms.md)
- [Modals](./modals.md)
- [Animation Tokens](../tokens/animations.md)
