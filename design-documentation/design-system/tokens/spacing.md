---
title: Spacing & Layout Tokens
description: 6px base unit system for dense, professional financial interfaces
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../style-guide.md
  - ./colors.md
  - ./typography.md
status: approved
---

# Spacing & Layout Tokens

## The 6px Base Unit

Tip Share Pro uses a **6px base unit** rather than the typical 4px or 8px. This choice creates:

- **Denser layouts** appropriate for financial data
- **Better rhythm** for tabular number displays
- **Unique visual texture** that distinguishes us from generic SaaS

```
6px Base Unit Rationale:
━━━━━━━━━━━━━━━━━━━━━━━━

Restaurant people scan data quickly.
Dense but readable = respect for their time.
6 divides evenly into common screen widths.
Feels like a real accounting ledger.
```

---

## Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--space-0` | 0 | 0px | Reset/remove spacing |
| `--space-1` | 0.375rem | 6px | Tight gaps, icon padding |
| `--space-2` | 0.75rem | 12px | Inline elements, small gaps |
| `--space-3` | 1.125rem | 18px | Default element spacing |
| `--space-4` | 1.5rem | 24px | Section padding, card padding |
| `--space-5` | 2.25rem | 36px | Major section breaks |
| `--space-6` | 3rem | 48px | Page section margins |
| `--space-7` | 4.5rem | 72px | Major layout divisions |
| `--space-8` | 6rem | 96px | Hero spacing, major breaks |

### Visual Reference

```
--space-1  ██ (6px)
--space-2  ████ (12px)
--space-3  ██████ (18px)
--space-4  ████████ (24px)
--space-5  ████████████ (36px)
--space-6  ████████████████ (48px)
--space-7  ████████████████████████ (72px)
--space-8  ████████████████████████████████ (96px)
```

---

## CSS Implementation

```css
:root {
  /* Base unit */
  --space-unit: 6px;

  /* Scale */
  --space-0: 0;
  --space-1: calc(var(--space-unit) * 1);   /* 6px */
  --space-2: calc(var(--space-unit) * 2);   /* 12px */
  --space-3: calc(var(--space-unit) * 3);   /* 18px */
  --space-4: calc(var(--space-unit) * 4);   /* 24px */
  --space-5: calc(var(--space-unit) * 6);   /* 36px */
  --space-6: calc(var(--space-unit) * 8);   /* 48px */
  --space-7: calc(var(--space-unit) * 12);  /* 72px */
  --space-8: calc(var(--space-unit) * 16);  /* 96px */
}
```

---

## Layout Grid

### Container Widths

| Container | Max Width | Usage |
|-----------|-----------|-------|
| `--container-xs` | 480px | Modal dialogs |
| `--container-sm` | 640px | Narrow content, settings |
| `--container-md` | 768px | Forms, focused content |
| `--container-lg` | 1024px | Main content area |
| `--container-xl` | 1280px | Wide dashboards |
| `--container-full` | 100% | Full-width layouts |

### CSS Implementation

```css
:root {
  --container-xs: 480px;
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-full: 100%;

  /* Safe area padding */
  --container-padding: var(--space-4);
}

.container {
  width: 100%;
  max-width: var(--container-lg);
  margin-inline: auto;
  padding-inline: var(--container-padding);
}
```

---

## Grid System

### 12-Column Grid

For complex layouts, we use a 12-column grid with 12px gutters:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-2); /* 12px */
}

/* Common column spans */
.col-1  { grid-column: span 1; }
.col-2  { grid-column: span 2; }
.col-3  { grid-column: span 3; }  /* Quarter */
.col-4  { grid-column: span 4; }  /* Third */
.col-6  { grid-column: span 6; }  /* Half */
.col-8  { grid-column: span 8; }  /* Two-thirds */
.col-12 { grid-column: span 12; } /* Full */
```

### Dashboard Grid

The main dashboard uses a specialized grid:

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: 280px 1fr;  /* Sidebar + Main */
  grid-template-rows: auto 1fr;       /* Header + Content */
  min-height: 100vh;
  gap: 0;
}

@media (max-width: 1023px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Component Spacing

### Cards

```css
.card {
  padding: var(--space-4);           /* 24px internal padding */
  border-radius: var(--radius-lg);
  gap: var(--space-3);               /* 18px between elements */
}

.card-header {
  padding-bottom: var(--space-3);
  margin-bottom: var(--space-3);
  border-bottom: 1px solid var(--walnut);
}

.card-compact {
  padding: var(--space-3);           /* 18px for compact cards */
}
```

### Tables

```css
.table {
  border-spacing: 0;
}

.table th,
.table td {
  padding: var(--space-2) var(--space-3); /* 12px 18px */
}

.table-compact th,
.table-compact td {
  padding: var(--space-1) var(--space-2); /* 6px 12px */
}

.table-relaxed th,
.table-relaxed td {
  padding: var(--space-3) var(--space-4); /* 18px 24px */
}
```

### Forms

```css
.form-group {
  margin-bottom: var(--space-4);     /* 24px between groups */
}

.form-label {
  margin-bottom: var(--space-1);     /* 6px below labels */
}

.form-input {
  padding: var(--space-2) var(--space-3); /* 12px 18px */
}

.form-helper {
  margin-top: var(--space-1);        /* 6px above helper text */
}
```

### Buttons

```css
.btn {
  padding: var(--space-2) var(--space-4); /* 12px 24px */
  gap: var(--space-2);               /* 12px between icon and text */
}

.btn-sm {
  padding: var(--space-1) var(--space-3); /* 6px 18px */
}

.btn-lg {
  padding: var(--space-3) var(--space-5); /* 18px 36px */
}
```

---

## Border Radius

A warm, approachable radius system—not too sharp, not too bubbly:

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0 | Sharp edges when needed |
| `--radius-sm` | 4px | Small elements, chips |
| `--radius-md` | 6px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, modals |
| `--radius-xl` | 18px | Large containers |
| `--radius-full` | 9999px | Pills, avatars |

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 12px;
  --radius-xl: 18px;
  --radius-full: 9999px;
}
```

---

## Shadows & Elevation

Shadows use warm tones to match the palette:

### Shadow Scale

```css
:root {
  /* Subtle lift */
  --shadow-sm:
    0 1px 2px rgba(12, 10, 7, 0.3),
    0 1px 3px rgba(12, 10, 7, 0.15);

  /* Card elevation */
  --shadow-md:
    0 4px 6px rgba(12, 10, 7, 0.3),
    0 2px 4px rgba(12, 10, 7, 0.2);

  /* Modal/dropdown */
  --shadow-lg:
    0 10px 15px rgba(12, 10, 7, 0.4),
    0 4px 6px rgba(12, 10, 7, 0.2);

  /* Floating elements */
  --shadow-xl:
    0 20px 25px rgba(12, 10, 7, 0.4),
    0 8px 10px rgba(12, 10, 7, 0.2);

  /* Brass glow for focus */
  --shadow-glow:
    0 0 0 3px var(--brass-glow),
    0 0 20px rgba(212, 164, 32, 0.15);

  /* Inner shadow for inset elements */
  --shadow-inset:
    inset 0 2px 4px rgba(12, 10, 7, 0.3);
}
```

### Elevation Layers

```
Layer 0: Page background (--midnight)
    ↓
Layer 1: --shadow-sm → Subtle separation
    ↓
Layer 2: --shadow-md → Cards, panels
    ↓
Layer 3: --shadow-lg → Dropdowns, tooltips
    ↓
Layer 4: --shadow-xl → Modals, dialogs
```

---

## Z-Index Scale

Organized layers prevent stacking conflicts:

```css
:root {
  --z-negative: -1;    /* Behind everything */
  --z-base: 0;         /* Default layer */
  --z-raised: 10;      /* Slightly elevated elements */
  --z-dropdown: 100;   /* Dropdowns, tooltips */
  --z-sticky: 200;     /* Sticky headers */
  --z-overlay: 300;    /* Modal backdrops */
  --z-modal: 400;      /* Modal content */
  --z-toast: 500;      /* Toast notifications */
  --z-max: 9999;       /* Maximum (rarely used) */
}
```

---

## Responsive Breakpoints

Mobile-first breakpoints:

| Token | Value | Target |
|-------|-------|--------|
| `--bp-xs` | 480px | Large phones |
| `--bp-sm` | 640px | Small tablets |
| `--bp-md` | 768px | Tablets |
| `--bp-lg` | 1024px | Laptops |
| `--bp-xl` | 1280px | Desktops |
| `--bp-2xl` | 1536px | Large screens |

### Media Query Usage

```css
/* Mobile first approach */
.element {
  /* Base mobile styles */
  padding: var(--space-3);
}

@media (min-width: 768px) {
  .element {
    /* Tablet and up */
    padding: var(--space-4);
  }
}

@media (min-width: 1024px) {
  .element {
    /* Desktop and up */
    padding: var(--space-5);
  }
}
```

### Container Queries (Future)

```css
@container (min-width: 400px) {
  .card-content {
    flex-direction: row;
  }
}
```

---

## Layout Patterns

### Sidebar + Main Content

```css
.app-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--espresso);
  padding: var(--space-4);
  border-right: 1px solid var(--walnut);
}

.main {
  background: var(--midnight);
  padding: var(--space-5);
  overflow-y: auto;
}
```

### Dashboard Cards Grid

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}
```

### Form Layout

```css
.form-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4) var(--space-5);
}

@media (max-width: 640px) {
  .form-layout {
    grid-template-columns: 1fr;
  }
}
```

### Table Container

```css
.table-container {
  background: var(--espresso);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  overflow-x: auto;
}
```

---

## Spacing Utility Classes

```css
/* Margin utilities */
.m-0  { margin: var(--space-0); }
.m-1  { margin: var(--space-1); }
.m-2  { margin: var(--space-2); }
/* ... through m-8 */

.mt-4 { margin-top: var(--space-4); }
.mr-4 { margin-right: var(--space-4); }
.mb-4 { margin-bottom: var(--space-4); }
.ml-4 { margin-left: var(--space-4); }
.mx-4 { margin-inline: var(--space-4); }
.my-4 { margin-block: var(--space-4); }

/* Padding utilities */
.p-0  { padding: var(--space-0); }
.p-1  { padding: var(--space-1); }
/* ... same pattern */

/* Gap utilities */
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
/* ... through gap-8 */
```

---

## Do's and Don'ts

### Do:
- Use the 6px base unit consistently
- Combine spacing tokens (don't use arbitrary values)
- Use larger spacing for major sections, tighter for related elements
- Let content breathe in cards and modals

### Don't:
- Mix pixel values with tokens
- Use spacing smaller than 6px (except borders)
- Cram too much into small spaces
- Ignore the visual rhythm of the spacing scale

---

## Related Documentation

- [Color Tokens](./colors.md)
- [Typography Tokens](./typography.md)
- [Animation Tokens](./animations.md)
- [Style Guide](../style-guide.md)

---

## Last Updated

| Date | Changes |
|------|---------|
| 2026-01-08 | Initial spacing system |
