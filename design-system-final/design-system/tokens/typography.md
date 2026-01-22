# TipSharePro Typography System - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Active

---

## Typography Philosophy

TipSharePro's typography is **bold, readable, and professional**. It commands attention while remaining approachable for busy restaurant managers handling financial data.

---

## Font Families

### Primary Font: Outfit

**Outfit** is a geometric sans-serif that balances modern aesthetics with high readability. Bold enough for headlines, clean for body text, professional for a financial application.

```css
font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Why Outfit?**
- Modern geometric design
- Excellent weight range (400-700)
- Clear at all sizes
- Professional without being cold
- Works well on dark backgrounds

### Data Font: JetBrains Mono

For all numerical data, currency, percentages, and tabular content.

```css
font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

**Why JetBrains Mono?**
- **Tabular figures**: Numbers align in columns
- **Distinct characters**: Clear 0/O, 1/l differentiation
- **Equal width**: Perfect for financial data
- **Readable at small sizes**: Down to 12px

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Font Weights

| Weight | CSS Value | Name | Usage |
|--------|-----------|------|-------|
| 400 | `font-weight: 400` | Regular | Body text |
| 500 | `font-weight: 500` | Medium | Data values, emphasized |
| 600 | `font-weight: 600` | Semibold | H2-H5, buttons, labels |
| 700 | `font-weight: 700` | Bold | Display, H1, strong emphasis |

---

## Type Scale

Base: 16px (1rem)
Ratio: 1.25 (Major Third)

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `--text-display` | 48px / 3rem | 700 | 1.1 | -0.02em | Hero stats, big numbers |
| `--text-h1` | 36px / 2.25rem | 700 | 1.2 | -0.015em | Page titles |
| `--text-h2` | 30px / 1.875rem | 600 | 1.25 | -0.01em | Section headers |
| `--text-h3` | 24px / 1.5rem | 600 | 1.3 | 0 | Card titles |
| `--text-h4` | 20px / 1.25rem | 600 | 1.4 | 0 | Minor headers |
| `--text-h5` | 18px / 1.125rem | 500 | 1.4 | 0 | Small headers |
| `--text-body-lg` | 18px / 1.125rem | 400 | 1.6 | 0 | Lead paragraphs |
| `--text-body` | 16px / 1rem | 400 | 1.5 | 0 | Default body |
| `--text-body-sm` | 14px / 0.875rem | 400 | 1.5 | 0 | Secondary text |
| `--text-caption` | 12px / 0.75rem | 400 | 1.4 | 0.02em | Timestamps, metadata |
| `--text-label` | 12px / 0.75rem | 600 | 1 | 0.05em | Form labels (uppercase) |
| `--text-data` | 14px / 0.875rem | 500 | 1.3 | 0 | Table data (mono) |
| `--text-currency` | 16px / 1rem | 500 | 1.3 | 0 | Dollar amounts (mono) |

---

## Text Colors on Dark Backgrounds

All text appears on dark backgrounds in this design system.

| Element | Color Variable | Hex |
|---------|---------------|-----|
| Headings | `--text-primary` | `#F7F3EA` (Cream) |
| Body text | `--text-primary` | `#F7F3EA` (Cream) |
| Secondary text | `--text-secondary` | `#C4B9A4` (Linen) |
| Helper/caption | `--text-tertiary` | `#8B7B65` (Stone) |
| Disabled | `--text-disabled` | `#5C5145` (Ash) |
| Links | `--color-primary` | `#E85D04` (Orange) |
| Success values | `--color-success` | `#82B536` (Green) |
| Error values | `--color-error` | `#DC2626` |

---

## Responsive Typography

### Fluid Type Scale

```css
/* Display - 36px to 48px */
.text-display {
  font-size: clamp(2.25rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

/* H1 - 28px to 36px */
.text-h1 {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--text-primary);
}

/* H2 - 24px to 30px */
.text-h2 {
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

/* H3 - 20px to 24px */
.text-h3 {
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
}

/* Body - consistent at 16px */
.text-body {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-primary);
}
```

### Breakpoint Reference

| Breakpoint | Display | H1 | H2 | H3 | Body |
|------------|---------|----|----|----|----- |
| Mobile (< 640px) | 36px | 28px | 24px | 20px | 16px |
| Tablet (640-1024px) | 42px | 32px | 26px | 22px | 16px |
| Desktop (> 1024px) | 48px | 36px | 30px | 24px | 16px |

---

## Special Typography Patterns

### Dollar Amounts

```css
.currency {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.currency-positive {
  color: var(--color-success);
}

.currency-positive::before {
  content: '+$';
}

.currency-negative {
  color: var(--color-error);
}

.currency-negative::before {
  content: '-$';
}
```

### Percentages

```css
.percentage {
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
}

.percentage::after {
  content: '%';
  opacity: 0.7;
  font-size: 0.85em;
}
```

### Table Headers

```css
.table-header {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
```

### Form Labels

```css
.form-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
```

### Button Text

```css
.button-text {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.01em;
}
```

### ?Note Help Text

```css
.help-note {
  font-family: 'Outfit', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-secondary);
}

.help-note strong {
  color: var(--color-info);
  font-weight: 600;
}
```

---

## Accessibility

### Minimum Font Sizes

| Context | Minimum Size |
|---------|--------------|
| Body text | 16px |
| Secondary text | 14px |
| Captions/Labels | 12px |
| Interactive elements | 16px |

### Line Length

- **Optimal:** 65-75 characters
- **Maximum:** 90 characters
- Use `max-width: 65ch` for reading blocks

### Contrast (on Dark Backgrounds)

All text meets WCAG AA minimum:
- `--cream` on `--midnight`: **15.8:1** (AAA)
- `--linen` on `--espresso`: **7.5:1** (AAA)
- `--color-primary` on `--midnight`: **5.9:1** (AA)

---

## CSS Custom Properties

```css
:root {
  /* Font Families */
  --font-primary: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

  /* Font Sizes */
  --text-display: 3rem;
  --text-h1: 2.25rem;
  --text-h2: 1.875rem;
  --text-h3: 1.5rem;
  --text-h4: 1.25rem;
  --text-h5: 1.125rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.75rem;
  --text-label: 0.75rem;

  /* Font Weights */
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;

  /* Letter Spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.02em;
  --tracking-wider: 0.05em;
}
```

---

## Related Documentation

- [Color Tokens](./colors.md)
- [Button Components](../components/buttons.md)
- [Form Components](../components/forms.md)

---

## Version History

| Date | Changes |
|------|---------|
| 2026-01-15 | Final typography system using Outfit + JetBrains Mono |
