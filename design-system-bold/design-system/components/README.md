# TipSharePro Component Library

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

The TipSharePro component library provides a comprehensive set of reusable UI components built on the Bold design system. Each component is designed for the restaurant industry context, with a focus on data entry efficiency and clear information display.

---

## Component Catalog

### Core Components (P0 - Required for MVP)

| Component | Description | File |
|-----------|-------------|------|
| **Buttons** | Primary, secondary, ghost, danger variants | `buttons.md` |
| **Forms** | Inputs, selects, checkboxes, radio, tabs | `forms.md` |
| **Tables** | Distribution tables, data grids | `tables.md` |
| **Navigation** | Nav hub, tabs, breadcrumbs | `navigation.md` |
| **Modals** | Dialogs, confirmations, !!Note modals | `modals.md` |
| **Help System** | ?Note tooltips, !!Note critical warnings | `help-system.md` |

### Supporting Components (P1 - Important)

| Component | Description | File |
|-----------|-------------|------|
| **Cards** | Stat cards, info cards, feature cards | `cards.md` |
| **Badges** | Job category badges, status indicators | `badges.md` |
| **Alerts** | Toasts, notifications, inline messages | `alerts.md` |

---

## Component Anatomy

Each component documentation includes:

1. **Overview** - Purpose and use cases
2. **Variants** - Different styles/types available
3. **States** - Default, hover, active, focus, disabled
4. **Specifications** - Sizes, spacing, colors
5. **Code Examples** - HTML/CSS implementation
6. **Accessibility** - ARIA, keyboard, screen reader support
7. **Usage Guidelines** - Do's and don'ts

---

## Design Principles

### 1. Consistency

All components share common patterns:
- 8px border radius for interactive elements
- 12px border radius for containers
- 150ms transitions for hover states
- Primary orange (#E85D04) for main actions

### 2. Clarity

Components prioritize readability:
- High contrast text (13.5:1 for primary)
- Clear visual hierarchy
- Explicit state changes

### 3. Efficiency

Optimized for data entry workflows:
- Large touch targets (44px minimum)
- Keyboard navigation support
- Auto-focus on primary actions

---

## Component States

All interactive components support these states:

| State | Description | Visual Treatment |
|-------|-------------|------------------|
| **Default** | Normal resting state | Base styling |
| **Hover** | Mouse over | Subtle highlight, shadow |
| **Focus** | Keyboard focus | Orange outline ring |
| **Active** | Being pressed | Darker shade, no transform |
| **Disabled** | Not interactive | Gray, reduced opacity |
| **Loading** | Async operation | Spinner, disabled interaction |
| **Error** | Validation failed | Red border, error message |
| **Success** | Action completed | Green indicator |

---

## Responsive Behavior

Components adapt to viewport sizes:

| Breakpoint | Component Adjustments |
|------------|----------------------|
| **Mobile** (< 640px) | Stack buttons, full-width inputs |
| **Tablet** (640-1023px) | Side-by-side with wrapping |
| **Desktop** (1024px+) | Full horizontal layouts |

---

## Accessibility Standards

All components meet WCAG 2.1 AA:

- **Color Contrast** - 4.5:1 minimum for text
- **Focus Visible** - Clear focus indicators
- **Touch Target** - 44x44px minimum
- **ARIA Labels** - Proper roles and labels
- **Keyboard** - Full keyboard navigation

---

## TipSharePro-Specific Components

### Help System

Unique to TipSharePro, the help system provides contextual guidance:

| Type | Symbol | Behavior | Use Case |
|------|--------|----------|----------|
| **?Note** | Yellow `?` | Hover tooltip | General help, recommendations |
| **!!Note** | Red/Orange `!!` | Modal with checkbox | Critical warnings, compliance |

See `help-system.md` for full documentation.

### Job Category Badges

Color-coded badges identify employee roles:

| Role | Color | Hex |
|------|-------|-----|
| Server | Blue | `#35A0D2` |
| Bartender | Navy | `#1A4B7C` |
| Cook | Yellow | `#F59E0B` |
| Busser | Green | `#82B536` |
| Host | Purple | `#7C3AED` |

See `badges.md` for full documentation.

---

## Usage Guidelines

### Component Selection

Choose components based on:

1. **User Task** - What action is the user taking?
2. **Data Type** - What kind of data is involved?
3. **Context** - Where does this appear in the flow?
4. **Frequency** - How often is this used?

### Composition

Components can be composed together:

```html
<!-- Card with form -->
<div class="card">
  <h3>Settings</h3>
  <form>
    <div class="form-group">
      <label>Contribution Rate</label>
      <select class="form-select">...</select>
      <span class="help-note">?</span>
    </div>
    <button class="btn btn-primary">Save</button>
  </form>
</div>
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial component library |
