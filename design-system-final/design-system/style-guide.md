# TipSharePro Style Guide - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Active

---

## Design Principles

### 1. Dark-First, Always

This is a dark-themed application. There is no light mode. The dark aesthetic:
- Feels like a restaurant after hours
- Reduces eye strain during long sessions
- Makes bold brand colors pop
- Creates an "unusual, not boring" impression

### 2. Bold, Not Bashful

The TipSharePro logo is bold. The UI should match:
- Burnt Orange CTAs command attention
- Colors are saturated, never pastel
- Typography is confident with clear hierarchy
- No wishy-washy half-measures

### 3. Restaurant Professional

This is a serious financial tool for restaurant operations:
- Data tables are clear and scannable
- Numbers use tabular figures for alignment
- Currency displays prominently
- Badge colors identify job categories at a glance

### 4. Pilot's Cockpit

Full Version users should feel in control:
- All destinations visible (grayed if no permission)
- Settings create sense of power and capability
- Demo shows faded controls as teaser for Full Version

---

## Color Summary

### Backgrounds
| Token | Color | Usage |
|-------|-------|-------|
| `--bg-body` | `#0C0A07` Midnight | Page background |
| `--bg-surface` | `#1A1510` Espresso | Cards, panels |
| `--bg-elevated` | `#2A2318` Mahogany | Hover, active |
| `--bg-border` | `#3D3225` Walnut | Borders |

### Text
| Token | Color | Usage |
|-------|-------|-------|
| `--text-primary` | `#F7F3EA` Cream | Headings, body |
| `--text-secondary` | `#C4B9A4` Linen | Labels, secondary |
| `--text-tertiary` | `#8B7B65` Stone | Captions (large only) |
| `--text-disabled` | `#5C5145` Ash | Disabled, faded |

### Brand Accents
| Token | Color | Usage |
|-------|-------|-------|
| `--color-primary` | `#E85D04` Orange | Primary CTA |
| `--color-success` | `#82B536` Green | Success, positive |
| `--color-secondary` | `#1A4B7C` Navy | Secondary action |
| `--color-info` | `#35A0D2` Cyan | Links, info |
| `--color-error` | `#DC2626` Red | Errors, destructive |
| `--color-warning` | `#F59E0B` Amber | Warnings |

---

## Typography Summary

### Font Stack
```css
--font-primary: 'Outfit', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Scale
| Style | Size | Weight | Use |
|-------|------|--------|-----|
| Display | 48px | 700 | Hero numbers |
| H1 | 36px | 700 | Page titles |
| H2 | 30px | 600 | Section headers |
| H3 | 24px | 600 | Card titles |
| Body | 16px | 400 | Default text |
| Label | 12px | 600 | Form labels (UPPERCASE) |
| Data | 14px mono | 500 | Table data |

---

## Spacing Scale

Base unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing |
| `--space-2` | 8px | Icon gaps |
| `--space-3` | 12px | Small padding |
| `--space-4` | 16px | Default padding |
| `--space-5` | 20px | Medium padding |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section gaps |
| `--space-10` | 40px | Large gaps |
| `--space-12` | 48px | Section margins |
| `--space-16` | 64px | Major sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Badges, tags |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Modals |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows (on Dark)

Dark backgrounds need subtle glows, not traditional shadows.

```css
/* Subtle elevation */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);

/* Card elevation */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);

/* Modal elevation */
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);

/* Focus glow (orange) */
--shadow-focus: 0 0 0 3px rgba(232, 93, 4, 0.3);

/* Success glow (green) */
--shadow-success: 0 0 0 3px rgba(130, 181, 54, 0.3);

/* Error glow (red) */
--shadow-error: 0 0 0 3px rgba(220, 38, 38, 0.3);
```

---

## Animation Timing

```css
/* Quick state changes */
--transition-fast: 150ms ease-out;

/* Standard transitions */
--transition-base: 200ms ease-out;

/* Larger movements */
--transition-slow: 300ms ease-out;

/* Modals, overlays */
--transition-modal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Component Quick Reference

### Primary Button
- Background: `--color-primary` (#E85D04)
- Text: `--color-midnight` (#0C0A07)
- Padding: 12px 24px
- Radius: 8px
- Font: 16px/600

### Secondary Button
- Background: `--color-secondary` (#1A4B7C)
- Text: `--color-cream` (#F7F3EA)
- Padding: 12px 24px
- Radius: 8px

### Ghost Button
- Background: transparent
- Border: 1px solid `--color-walnut`
- Text: `--text-primary`

### Input Field
- Background: `--bg-surface` (#1A1510)
- Border: 1px solid `--bg-border` (#3D3225)
- Text: `--text-primary`
- Radius: 8px
- Height: 44px

### Card
- Background: `--bg-surface` (#1A1510)
- Border: 1px solid `--bg-border` (#3D3225)
- Padding: 24px
- Radius: 12px

### Badge (Job Role)
- Height: 24px
- Padding: 4px 12px
- Radius: 4px
- Font: 12px/600 UPPERCASE
- Colors: Per job category

---

## ?Note and !!Note Indicators

### ?Note (Yellow Help)
- Icon: Question mark in circle
- Color: `--color-warning` (#F59E0B) for icon
- Tooltip: Dark background with cream text
- Trigger: Hover

### !!Note (Red Critical)
- Icon: Exclamation in triangle
- Color: `--color-error` (#DC2626) for icon
- Modal: Requires "I Have Read and Agree" checkbox
- Trigger: Click (blocks action until acknowledged)

---

## Responsive Breakpoints

```css
/* Mobile first */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

---

## Accessibility Checklist

- [ ] All text meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation works throughout
- [ ] Screen reader labels on all form inputs
- [ ] Error messages announced to screen readers
- [ ] Touch targets minimum 44x44px on mobile

---

## Do's and Don'ts

### Do:
- Use bold logo colors for important actions
- Keep backgrounds dark throughout
- Use monospace font for all numbers
- Show faded controls in Demo as tease
- Include ?Note help where needed

### Don't:
- Use white or light backgrounds anywhere
- Use pastel colors
- Use stone color for important text
- Hide Full Version controls entirely in Demo
- Create new colors outside the palette

---

## Related Files

- [Colors](./tokens/colors.md)
- [Typography](./tokens/typography.md)
- [Buttons](./components/buttons.md)
- [Forms](./components/forms.md)
- [Tables](./components/tables.md)
