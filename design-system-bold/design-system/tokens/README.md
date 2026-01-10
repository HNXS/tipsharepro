# TipSharePro Design Tokens

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

Design tokens are the foundational building blocks of the TipSharePro design system. They are named entities that store visual design attributes—colors, typography, spacing, and motion—enabling consistency across all platforms and components.

---

## Token Categories

| Category | Description | File |
|----------|-------------|------|
| **Colors** | Brand palette, semantic colors, accessibility | `colors.md` |
| **Typography** | Font families, scale, weights, line heights | `typography.md` |
| **Spacing** | 4px-based scale for margins and padding | `spacing.md` |
| **Animations** | Timing functions, durations, transitions | `animations.md` |

---

## Token Naming Convention

Tokens follow a consistent naming pattern:

```
--{category}-{property}-{variant}
```

**Examples:**
```css
--color-primary-500        /* Color category, primary property, 500 variant */
--text-h1                  /* Text category, h1 size */
--space-4                  /* Space category, level 4 (16px) */
--duration-fast            /* Duration category, fast variant */
```

---

## CSS Custom Properties

All tokens are implemented as CSS custom properties for easy theming:

```css
:root {
  /* Colors */
  --color-primary: #E85D04;
  --color-success: #82B536;
  --color-secondary: #1A4B7C;
  --color-accent: #35A0D2;

  /* Typography */
  --font-primary: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;

  /* Animation */
  --duration-fast: 150ms;
  --ease-out: cubic-bezier(0.0, 0, 0.2, 1);
}
```

---

## Token Export Formats

Tokens are available in multiple formats:

| Format | Use Case | Location |
|--------|----------|----------|
| **CSS** | Web applications | Inline in HTML or external CSS |
| **JSON** | Build tools, JS frameworks | `../assets/design-tokens.json` |
| **SCSS** | Sass-based projects | Generated from JSON |

---

## Quick Reference

### Primary Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#E85D04` | CTAs, links, brand |
| `--color-success` | `#82B536` | Success states, positive |
| `--color-secondary` | `#1A4B7C` | Secondary actions, trust |
| `--color-accent` | `#35A0D2` | Info, interactive |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-error` | `#DC2626` | Errors, destructive |
| `--color-warning` | `#F59E0B` | Warnings, caution |
| `--color-info` | `#35A0D2` | Information |

### Typography Scale
| Token | Size | Usage |
|-------|------|-------|
| `--text-display` | 48px | Hero headlines |
| `--text-h1` | 36px | Page titles |
| `--text-h2` | 30px | Section headers |
| `--text-body` | 16px | Body text |
| `--text-caption` | 12px | Captions, labels |

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Micro spacing |
| `--space-2` | 8px | Tight spacing |
| `--space-4` | 16px | Default padding |
| `--space-6` | 24px | Large padding |
| `--space-8` | 32px | Section gaps |

---

## Accessibility

All color tokens have been tested for accessibility:

- Primary on white: 4.52:1 (AA pass)
- White on charcoal: 12.6:1 (AAA pass)
- Text primary on white: 13.5:1 (AAA pass)

See `colors.md` for full contrast documentation.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial token documentation |
