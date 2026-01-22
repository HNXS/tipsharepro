# Spacing System - Final Edition

**Version:** 1.0
**Date:** January 15, 2026

---

## Base Unit

**4px** — All spacing is a multiple of 4px for consistency.

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0 | Reset |
| `--space-1` | 4px | Tight spacing, icon gaps |
| `--space-2` | 8px | Small gaps, inline elements |
| `--space-3` | 12px | Small padding |
| `--space-4` | 16px | Default padding, form gaps |
| `--space-5` | 20px | Medium padding |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section gaps |
| `--space-10` | 40px | Large gaps |
| `--space-12` | 48px | Section margins |
| `--space-16` | 64px | Major sections |
| `--space-20` | 80px | Page sections |
| `--space-24` | 96px | Hero sections |

---

## Usage Examples

```css
/* Card padding */
.card {
  padding: var(--space-6); /* 24px */
}

/* Form field gap */
.form-group {
  margin-bottom: var(--space-4); /* 16px */
}

/* Section gap */
.section + .section {
  margin-top: var(--space-12); /* 48px */
}

/* Button icon gap */
.btn svg {
  margin-right: var(--space-2); /* 8px */
}
```

---

## Grid System

### Container Widths

| Size | Max Width | Usage |
|------|-----------|-------|
| Small | 640px | Narrow content |
| Medium | 768px | Default content |
| Large | 1024px | Wide content |
| XL | 1280px | Dashboard |
| Full | 100% | Full bleed |

### Grid Columns

12-column grid with 16px (mobile) to 24px (desktop) gutters.

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
}
```

---

## CSS Custom Properties

```css
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```
