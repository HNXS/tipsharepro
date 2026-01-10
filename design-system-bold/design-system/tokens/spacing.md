# TipSharePro Spacing System

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

TipSharePro uses a **4px base unit** spacing system. All spacing values are multiples of 4px, ensuring visual rhythm and alignment across the application.

---

## Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--space-0` | 0 | 0px | None |
| `--space-1` | 0.25rem | 4px | Micro spacing, icon gaps |
| `--space-2` | 0.5rem | 8px | Tight spacing, inline elements |
| `--space-3` | 0.75rem | 12px | Small padding |
| `--space-4` | 1rem | 16px | Default padding, margins |
| `--space-5` | 1.25rem | 20px | Medium spacing |
| `--space-6` | 1.5rem | 24px | Large padding |
| `--space-8` | 2rem | 32px | Section gaps |
| `--space-10` | 2.5rem | 40px | Major section spacing |
| `--space-12` | 3rem | 48px | Large section spacing |
| `--space-16` | 4rem | 64px | Page section spacing |
| `--space-20` | 5rem | 80px | Hero sections |
| `--space-24` | 6rem | 96px | Major page sections |

---

## CSS Custom Properties

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

---

## Layout Grid

### Breakpoints

| Breakpoint | Width | Columns | Gutter | Margin |
|------------|-------|---------|--------|--------|
| **Mobile** | < 640px | 4 | 16px | 16px |
| **Tablet** | 640-1023px | 8 | 24px | 32px |
| **Desktop** | 1024-1279px | 12 | 24px | 64px |
| **Wide** | 1280px+ | 12 | 32px | auto |

### Container

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 640px) {
  .container {
    padding: 0 var(--space-8);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--space-16);
  }
}
```

---

## Component Spacing

### Buttons

| Size | Padding (Y) | Padding (X) |
|------|-------------|-------------|
| Small | 8px | 16px |
| Medium | 12px | 24px |
| Large | 16px | 32px |

```css
.btn-sm { padding: var(--space-2) var(--space-4); }
.btn-md { padding: var(--space-3) var(--space-6); }
.btn-lg { padding: var(--space-4) var(--space-8); }
```

### Cards

```css
.card {
  padding: var(--space-6);           /* 24px internal padding */
  margin-bottom: var(--space-6);     /* 24px between cards */
  border-radius: 12px;
}

.card-compact {
  padding: var(--space-4);           /* 16px for compact cards */
}
```

### Forms

```css
.form-group {
  margin-bottom: var(--space-5);     /* 20px between fields */
}

.form-input {
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
}

.form-label {
  margin-bottom: var(--space-2);     /* 8px below label */
}
```

### Tables

```css
.table th,
.table td {
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
}

.table-compact th,
.table-compact td {
  padding: var(--space-2) var(--space-3);  /* 8px 12px */
}
```

---

## Section Spacing

### Page Sections

```css
section {
  padding: var(--space-16) 0;        /* 64px vertical */
}

section + section {
  margin-top: var(--space-8);        /* 32px between sections */
}
```

### Hero Sections

```css
.hero {
  padding: var(--space-12) 0;        /* 48px vertical */
}

@media (min-width: 1024px) {
  .hero {
    padding: var(--space-16) 0;      /* 64px on desktop */
  }
}
```

---

## Gap Utilities

### Flexbox & Grid Gaps

```css
.gap-1 { gap: var(--space-1); }      /* 4px */
.gap-2 { gap: var(--space-2); }      /* 8px */
.gap-3 { gap: var(--space-3); }      /* 12px */
.gap-4 { gap: var(--space-4); }      /* 16px */
.gap-6 { gap: var(--space-6); }      /* 24px */
.gap-8 { gap: var(--space-8); }      /* 32px */
```

### Button Groups

```css
.btn-group {
  display: flex;
  gap: var(--space-3);               /* 12px between buttons */
}
```

---

## Margin & Padding Utilities

### Margin

```css
.m-0 { margin: 0; }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-4 { margin: var(--space-4); }
.m-6 { margin: var(--space-6); }

.mt-4 { margin-top: var(--space-4); }
.mb-4 { margin-bottom: var(--space-4); }
.ml-4 { margin-left: var(--space-4); }
.mr-4 { margin-right: var(--space-4); }
```

### Padding

```css
.p-0 { padding: 0; }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }

.pt-4 { padding-top: var(--space-4); }
.pb-4 { padding-bottom: var(--space-4); }
.pl-4 { padding-left: var(--space-4); }
.pr-4 { padding-right: var(--space-4); }
```

---

## Usage Guidelines

### DO
- Use spacing tokens instead of arbitrary values
- Maintain consistent vertical rhythm with the 4px grid
- Use larger spacing for visual separation between sections
- Apply consistent padding within component types

### DON'T
- Don't use odd pixel values (5px, 7px, 13px, etc.)
- Don't mix spacing systems (4px and 8px base)
- Don't overcrowd UI elements—give content room to breathe
- Don't use different spacing for similar components

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial spacing system |
