---
title: Component Library Overview
description: Reusable UI components for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
status: approved
---

# Component Library

## Overview

This component library provides the building blocks for the Tip Share Pro interface. Each component is designed with the "After Hours" aesthetic in mind—warm, professional, and optimized for financial data display.

---

## Component Index

| Component | Description | Status |
|-----------|-------------|--------|
| [Buttons](./buttons.md) | Primary actions and variants | Ready |
| [Forms](./forms.md) | Input fields, selects, checkboxes | Ready |
| [Tables](./tables.md) | Financial data display | Ready |
| [Cards](./cards.md) | Container components | Ready |
| [Navigation](./navigation.md) | Sidebar, tabs, breadcrumbs | Ready |
| [Modals](./modals.md) | Dialogs and overlays | Ready |

---

## Design Principles for Components

### 1. Warm Professionalism
Every component should feel like it belongs in a well-appointed back office—not cold corporate software, not casual consumer apps.

### 2. Financial Data First
Components are optimized for displaying and inputting monetary values, percentages, and hours.

### 3. Dense but Readable
Restaurant managers are busy. Maximize information density without sacrificing readability.

### 4. Consistent Token Usage
All components use design tokens. No hardcoded values.

### 5. Accessible by Default
WCAG 2.1 AA compliance is non-negotiable.

---

## Component Architecture

### Naming Convention

```
[category]-[component]-[variant]-[state]

Examples:
btn-primary
btn-primary-hover
input-text
input-text-error
card-stat
card-stat-highlighted
```

### CSS Structure

```css
/* Base component */
.btn { }

/* Variants */
.btn-primary { }
.btn-secondary { }
.btn-ghost { }

/* Sizes */
.btn-sm { }
.btn-lg { }

/* States (typically applied via data attributes or classes) */
.btn:hover { }
.btn:active { }
.btn:disabled { }
.btn[data-loading="true"] { }
```

### Component Props (for React/Vue implementation)

Each component specification includes:
- Required props
- Optional props with defaults
- Event handlers
- Accessibility attributes

---

## Shared Patterns

### Focus States

All interactive components share the brass glow focus ring:

```css
:focus-visible {
  outline: none;
  box-shadow: var(--shadow-glow);
}
```

### Disabled States

Disabled components use reduced opacity and blocked cursors:

```css
:disabled,
[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Loading States

Components with async actions support loading states:

```css
[data-loading="true"] {
  position: relative;
  color: transparent;
  pointer-events: none;
}

[data-loading="true"]::after {
  content: '';
  position: absolute;
  /* Spinner styles */
}
```

---

## Implementation Notes

### Framework Agnostic

These specifications are framework-agnostic. They can be implemented in:
- Vanilla CSS + HTML
- React + CSS Modules
- Vue + Scoped Styles
- Svelte
- Any CSS-in-JS solution

### CSS Custom Properties

Components rely on CSS custom properties defined in the token files:
- Colors: `--midnight`, `--brass`, `--cream`, etc.
- Spacing: `--space-1` through `--space-8`
- Typography: `--font-display`, `--font-body`, `--font-mono`
- Animations: `--ease-standard`, `--duration-normal`

### Responsive Behavior

All components are mobile-first and responsive. Breakpoint-specific adjustments are documented per component.

---

## Related Documentation

- [Color Tokens](../tokens/colors.md)
- [Typography Tokens](../tokens/typography.md)
- [Spacing Tokens](../tokens/spacing.md)
- [Animation Tokens](../tokens/animations.md)
- [Style Guide](../style-guide.md)
