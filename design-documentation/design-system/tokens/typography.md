---
title: Typography Tokens
description: Type system featuring Fraunces, Newsreader, and JetBrains Mono
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../style-guide.md
  - ./colors.md
status: approved
---

# Typography Tokens

## The Type Trio

Tip Share Pro uses three carefully selected typefaces that together create a distinctive, warm, and professional voice:

| Role | Typeface | Character |
|------|----------|-----------|
| **Display** | Fraunces | Warm, wonky, handcrafted |
| **Body** | Newsreader | Elegant, readable, authoritative |
| **Data** | JetBrains Mono | Precise, clear, tabular |

---

## Fraunces — Display & Headings

### Why Fraunces?

Fraunces is an "old-style" display serif with a twist—optical "wonkiness" that gives it a handcrafted, warm personality. It feels like hand-painted signage at a beloved neighborhood restaurant, not corporate typography.

**Key Characteristics:**
- Variable font with `SOFT` and `WONK` axes
- Distinctive "goofy" curves that feel human
- Excellent at display sizes (24px+)
- Warm, approachable, yet professional

### Variable Font Axes

| Axis | Range | Our Setting | Effect |
|------|-------|-------------|--------|
| `wght` | 100–900 | 400, 600, 700 | Weight from thin to black |
| `SOFT` | 0–100 | 50 | Softness of curves |
| `WONK` | 0–1 | 1 | Optical adjustments active |

### CSS Implementation

```css
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/Fraunces-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}

:root {
  --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
}

h1, h2, h3, h4, .heading {
  font-family: var(--font-display);
  font-variation-settings: 'SOFT' 50, 'WONK' 1;
  letter-spacing: -0.02em;
  font-feature-settings: 'kern' 1;
}
```

### Heading Styles

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | 48px / 3rem | 700 | 1.1 | -0.03em | Hero stats, major numbers |
| H1 | 36px / 2.25rem | 700 | 1.2 | -0.02em | Page titles |
| H2 | 28px / 1.75rem | 600 | 1.25 | -0.02em | Section headers |
| H3 | 22px / 1.375rem | 600 | 1.3 | -0.01em | Card titles |
| H4 | 18px / 1.125rem | 600 | 1.35 | 0 | Minor headers |

---

## Newsreader — Body Text

### Why Newsreader?

Newsreader is a variable font designed for long-form reading. It has the authority of classic newspaper typography but with warmer, more approachable curves—perfect for the "professional but human" brand voice.

**Key Characteristics:**
- Exceptional readability at body sizes
- Variable optical sizing (opsz)
- Supports italic for emphasis
- Clean, uncluttered letterforms

### Variable Font Axes

| Axis | Range | Effect |
|------|-------|--------|
| `wght` | 200–800 | Weight from light to extra-bold |
| `opsz` | 6–72 | Optical sizing (auto-adjusts) |

### CSS Implementation

```css
@font-face {
  font-family: 'Newsreader';
  src: url('/fonts/Newsreader-Variable.woff2') format('woff2-variations');
  font-weight: 200 800;
  font-display: swap;
}

:root {
  --font-body: 'Newsreader', Georgia, 'Times New Roman', serif;
}

body, p, .body-text {
  font-family: var(--font-body);
  font-weight: 400;
  font-feature-settings: 'kern' 1, 'liga' 1;
}
```

### Body Styles

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Body Large | 18px / 1.125rem | 400 | 1.6 | Lead paragraphs |
| Body | 16px / 1rem | 400 | 1.6 | Standard text |
| Body Small | 14px / 0.875rem | 400 | 1.5 | Secondary info |
| Caption | 12px / 0.75rem | 400 | 1.4 | Timestamps, metadata |
| Label | 11px / 0.6875rem | 600 | 1.3 | Form labels (uppercase) |

---

## JetBrains Mono — Numbers & Data

### Why JetBrains Mono?

Financial data demands clarity. JetBrains Mono is specifically designed for code, which gives it critical features for numerical data:

**Key Characteristics:**
- **Tabular figures**: Numbers align perfectly in columns
- **Distinct characters**: Clear 0/O, 1/l/I differentiation
- **Wide spacing**: Each character occupies equal space
- **Excellent at small sizes**: Readable down to 11px

### CSS Implementation

```css
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Variable.woff2') format('woff2-variations');
  font-weight: 100 800;
  font-display: swap;
}

:root {
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
}

/* Financial data styling */
.currency,
.percentage,
.hours,
.numeric,
[data-type="number"] {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1, 'liga' 0; /* Ligatures OFF for data */
  letter-spacing: 0;
}
```

### Data Styles

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Mono Display | 32px / 2rem | 500 | Hero dollar amounts |
| Mono Large | 24px / 1.5rem | 500 | Card stat values |
| Mono | 16px / 1rem | 400 | Table data |
| Mono Small | 13px / 0.8125rem | 400 | Inline numbers, timestamps |

---

## Type Scale

Using a **1.25 (Major Third)** ratio for harmonious proportions:

```
Base: 16px

Scale:
├── 48px (3rem)      ← Display
├── 36px (2.25rem)   ← H1
├── 28px (1.75rem)   ← H2
├── 22px (1.375rem)  ← H3
├── 18px (1.125rem)  ← H4, Body Large
├── 16px (1rem)      ← Body (base)
├── 14px (0.875rem)  ← Body Small
├── 12px (0.75rem)   ← Caption
└── 11px (0.6875rem) ← Label
```

---

## Special Typography Patterns

### Dollar Amounts

```css
.dollar-amount {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--brass);
  font-variant-numeric: tabular-nums;
}

/* Dollar sign styling */
.dollar-amount::before {
  content: '$';
  opacity: 0.7;
  font-weight: 400;
  margin-right: 0.05em;
}
```

### Percentage Values

```css
.percentage {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.percentage::after {
  content: '%';
  opacity: 0.7;
  font-size: 0.85em;
  margin-left: 0.05em;
}
```

### Positive/Negative Indicators

```css
.value-positive {
  color: var(--sage);
}

.value-positive::before {
  content: '+';
}

.value-negative {
  color: var(--sienna);
}

.value-negative::before {
  content: '−'; /* Proper minus sign, not hyphen */
}
```

### Truncation

```css
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## Responsive Typography

### Fluid Type Scale

```css
:root {
  /* Fluid base: 15px at 320px → 17px at 1200px */
  --text-base: clamp(0.9375rem, 0.85rem + 0.25vw, 1.0625rem);
}

/* Scale proportionally */
h1 { font-size: calc(var(--text-base) * 2.25); }
h2 { font-size: calc(var(--text-base) * 1.75); }
h3 { font-size: calc(var(--text-base) * 1.375); }
```

### Breakpoint Adjustments

| Breakpoint | Base Size | Line Height Adjustment |
|------------|-----------|------------------------|
| Mobile (<768px) | 15px | +0.1 (more generous) |
| Tablet (768–1023px) | 16px | Standard |
| Desktop (1024px+) | 16px | Standard |
| Wide (1440px+) | 17px | Standard |

---

## Font Loading Strategy

### Critical Font Preloading

```html
<head>
  <!-- Preload only the weights we use initially -->
  <link rel="preload" href="/fonts/Fraunces-Variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Newsreader can load async (body text appears after layout) -->
  <link rel="preload" href="/fonts/Newsreader-Variable.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

### Font-Display Strategy

```css
@font-face {
  font-family: 'Fraunces';
  font-display: swap; /* Show fallback immediately, swap when loaded */
}

@font-face {
  font-family: 'JetBrains Mono';
  font-display: swap;
}

@font-face {
  font-family: 'Newsreader';
  font-display: optional; /* Don't swap if cached, avoid layout shift */
}
```

### Fallback Stack

```css
:root {
  --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-body: 'Newsreader', Georgia, 'Times New Roman', serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
}
```

---

## CSS Custom Properties

```css
:root {
  /* Font families */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Newsreader', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Font sizes */
  --text-display: 3rem;
  --text-h1: 2.25rem;
  --text-h2: 1.75rem;
  --text-h3: 1.375rem;
  --text-h4: 1.125rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.75rem;
  --text-label: 0.6875rem;
  --text-mono-lg: 1.5rem;
  --text-mono: 1rem;
  --text-mono-sm: 0.8125rem;

  /* Line heights */
  --leading-tight: 1.2;
  --leading-snug: 1.35;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;

  /* Letter spacing */
  --tracking-tight: -0.03em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
}
```

---

## Accessibility Considerations

### Minimum Sizes
- Body text: Never below 14px
- Interactive elements: Never below 16px
- Labels: Never below 11px (and use uppercase + weight for clarity)

### Line Length
- Optimal: 65–75 characters
- Maximum: 90 characters
- Use `max-width: 65ch` for reading blocks

### Contrast
- All text must meet WCAG AA (4.5:1 for normal, 3:1 for large)
- See [Color Tokens](./colors.md) for verified ratios

### Dynamic Type (Future Mobile App)
- Use relative units (rem) throughout
- Test at 200% zoom
- Respect system font size preferences

---

## Do's and Don'ts

### Do:
- Use Fraunces for headings and display text only
- Use JetBrains Mono for all numerical data
- Enable tabular figures for aligned columns
- Preload critical fonts

### Don't:
- Use Fraunces for body text (it's too decorative at small sizes)
- Use decorative fonts for form inputs
- Disable ligatures for body text (only for tabular data)
- Use more than 3 font weights per family

---

## Related Documentation

- [Color Tokens](./colors.md)
- [Style Guide](../style-guide.md)

---

## Last Updated

| Date | Changes |
|------|---------|
| 2026-01-08 | Initial typography system |
