---
title: Design Tokens Overview
description: Foundational design tokens for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
status: approved
---

# Design Tokens

## Overview

Design tokens are the atomic values that form the foundation of our visual language. They ensure consistency across all platforms and make the design system maintainable and scalable.

---

## What Are Design Tokens?

Design tokens are named entities that store visual design attributes. Instead of hard-coding values like `#D4A420` throughout your code, you use semantic names like `--brass` that can be updated globally.

**Benefits:**
- Single source of truth for design values
- Easy theme updates and variations
- Consistent implementation across platforms
- Better communication between design and development

---

## Token Categories

### [Colors](./colors.md)

The "Amber Hour" palette—warm, intimate colors inspired by the late-night tip count.

| Category | Examples |
|----------|----------|
| Backgrounds | `--midnight`, `--espresso`, `--mahogany`, `--walnut` |
| Text | `--cream`, `--linen`, `--stone`, `--ash` |
| Accents | `--brass`, `--ember`, `--sage`, `--sienna` |
| Semantic | `--success`, `--warning`, `--error`, `--info` |

→ [Full Color Documentation](./colors.md)

---

### [Typography](./typography.md)

A carefully curated font stack balancing warmth with financial precision.

| Category | Font | Usage |
|----------|------|-------|
| Display | Fraunces | Headings, hero text |
| Body | Newsreader | Paragraphs, descriptions |
| Mono | JetBrains Mono | Numbers, financial data |

**Type Scale (Major Third - 1.25):**
```
Display:    48px
H1:         36px
H2:         28px
H3:         22px
H4:         18px
Body:       16px
Caption:    12px
```

→ [Full Typography Documentation](./typography.md)

---

### [Spacing](./spacing.md)

A 6px base unit system for tight, professional layouts.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 6px | Micro spacing |
| `--space-2` | 12px | Tight padding |
| `--space-3` | 18px | Default spacing |
| `--space-4` | 24px | Card padding |
| `--space-5` | 30px | Section padding |
| `--space-6` | 36px | Large gaps |
| `--space-8` | 48px | Major sections |
| `--space-10` | 60px | Page margins |
| `--space-12` | 72px | Hero spacing |

→ [Full Spacing Documentation](./spacing.md)

---

### [Animations](./animations.md)

The "Cash Flow" motion library—animations inspired by the physical handling of money.

**Timing Functions:**
| Token | Character |
|-------|-----------|
| `--ease-out` | Quick start, smooth finish |
| `--ease-in-out` | Balanced, professional |
| `--ease-snap` | Slight overshoot, satisfying |
| `--ease-settle` | Quick then settles |

**Signature Animations:**
- Receipt Roll — Page load reveals
- Till Count — Number increments
- Brass Glow — Focus states
- Paper Slide — Modal transitions

→ [Full Animation Documentation](./animations.md)

---

## Token Formats

### CSS Custom Properties

```css
:root {
  --midnight: #0C0A07;
  --brass: #D4A420;
  --font-display: 'Fraunces', Georgia, serif;
  --space-4: 24px;
  --duration-fast: 200ms;
}
```

### JSON Export

Tokens are also available in JSON format for tooling integration:

```json
{
  "color": {
    "midnight": { "value": "#0C0A07" },
    "brass": { "value": "#D4A420" }
  },
  "spacing": {
    "4": { "value": "24px" }
  }
}
```

→ [Design Tokens JSON](../../assets/design-tokens.json)

---

## Usage Guidelines

### Naming Convention

Tokens follow a consistent naming pattern:

```
--{category}-{variant}

Examples:
--color-midnight
--space-4
--duration-fast
--font-display
```

### Choosing Tokens

1. **Always use tokens** — Never hard-code values
2. **Use semantic when available** — `--success` over `--sage` for success states
3. **Reference the source** — Check documentation for intended usage
4. **Maintain consistency** — Same use case = same token

### Do's and Don'ts

**Do:**
- Use `--brass` for monetary values and primary CTAs
- Use `--space-4` for standard card padding
- Use `--font-mono` for all financial data

**Don't:**
- Hard-code `#D4A420` instead of using `--brass`
- Mix spacing values (e.g., 23px) not in the scale
- Use display font for body text

---

## Related Documentation

- [Style Guide](../style-guide.md) — Complete visual language
- [Components](../components/README.md) — Token usage in components
- [Design Tokens JSON](../../assets/design-tokens.json) — Machine-readable format

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial token system |
