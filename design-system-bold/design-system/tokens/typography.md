# TipSharePro Typography System - Bold Edition

**Version:** 1.0
**Date:** January 9, 2026
**Status:** Active

---

## Typography Philosophy

TipSharePro's typography is **confident, readable, and professional** - reflecting the serious nature of financial calculations while remaining approachable for busy restaurant managers.

### Key Principles

1. **Bold Headlines** - Commanding attention for key messages
2. **Clear Hierarchy** - Easy scanning of complex data
3. **Readable Data** - Optimized for numbers and tables
4. **Professional Tone** - Trustworthy and authoritative

---

## Font Families

### Primary Font: Outfit

**Outfit** is a geometric sans-serif that balances modern aesthetics with high readability. It's bold enough for headlines and clean enough for body text.

```css
font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
```

**Fallback Stack:**
If Outfit is unavailable, the system font stack provides excellent cross-platform consistency.

### Monospace Font: JetBrains Mono

For numerical data, currency values, and any code/technical content.

```css
font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace;
```

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
| 400 | `font-weight: 400` | Regular | Body text, descriptions |
| 500 | `font-weight: 500` | Medium | Data values, emphasized body |
| 600 | `font-weight: 600` | Semibold | H2-H5, buttons, labels |
| 700 | `font-weight: 700` | Bold | Display, H1, strong emphasis |

---

## Type Scale

### Scale System

Base size: 16px (1rem)
Scale ratio: 1.25 (Major Third)

| Token | Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Usage |
|-------|-----------|------------|--------|-------------|----------------|-------|
| `--text-display` | 48px | 3rem | 700 | 1.1 | -0.02em | Hero headlines |
| `--text-h1` | 36px | 2.25rem | 700 | 1.2 | -0.015em | Page titles |
| `--text-h2` | 30px | 1.875rem | 600 | 1.25 | -0.01em | Section headers |
| `--text-h3` | 24px | 1.5rem | 600 | 1.3 | 0 | Card titles |
| `--text-h4` | 20px | 1.25rem | 600 | 1.4 | 0 | Minor headers |
| `--text-h5` | 18px | 1.125rem | 500 | 1.4 | 0 | Small headers |
| `--text-body-lg` | 18px | 1.125rem | 400 | 1.6 | 0 | Lead paragraphs |
| `--text-body` | 16px | 1rem | 400 | 1.5 | 0 | Default body |
| `--text-body-sm` | 14px | 0.875rem | 400 | 1.5 | 0 | Secondary text |
| `--text-caption` | 12px | 0.75rem | 400 | 1.4 | 0.02em | Captions, timestamps |
| `--text-label` | 12px | 0.75rem | 600 | 1 | 0.05em | Form labels (uppercase) |
| `--text-data` | 14px | 0.875rem | 500 | 1.3 | 0 | Table data |

---

## Responsive Typography

### Fluid Type Scale

For a responsive experience, font sizes adjust based on viewport width.

```css
/* Display - 36px to 48px */
.text-display {
  font-size: clamp(2.25rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* H1 - 28px to 36px */
.text-h1 {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
}

/* H2 - 24px to 30px */
.text-h2 {
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

/* H3 - 20px to 24px */
.text-h3 {
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  font-weight: 600;
  line-height: 1.3;
}

/* Body - consistent at 16px */
.text-body {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}
```

### Breakpoint Adjustments

| Breakpoint | Display | H1 | H2 | H3 | Body |
|------------|---------|----|----|----|----- |
| Mobile (< 640px) | 36px | 28px | 24px | 20px | 16px |
| Tablet (640-1024px) | 42px | 32px | 26px | 22px | 16px |
| Desktop (> 1024px) | 48px | 36px | 30px | 24px | 16px |

---

## Typography Classes

### CSS Implementation

```css
/* Display */
.text-display {
  font-family: 'Outfit', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

/* Heading 1 */
.text-h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--color-text-primary);
}

/* Heading 2 */
.text-h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
}

/* Heading 3 */
.text-h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text-primary);
}

/* Heading 4 */
.text-h4 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-primary);
}

/* Heading 5 */
.text-h5 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--color-text-primary);
}

/* Body Large */
.text-body-lg {
  font-family: 'Outfit', sans-serif;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-primary);
}

/* Body */
.text-body {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-primary);
}

/* Body Small */
.text-body-sm {
  font-family: 'Outfit', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

/* Caption */
.text-caption {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: var(--color-text-secondary);
}

/* Label (Uppercase) */
.text-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

/* Data/Numbers */
.text-data {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--color-text-primary);
}

/* Currency */
.text-currency {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
}
```

---

## Special Typography Patterns

### Hero Headlines (Dark Background)

```css
.hero-headline {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(2.25rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-white);
}

.hero-subheadline {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-inverse-secondary);
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
  color: var(--color-text-secondary);
  background-color: var(--color-stone);
  padding: 0.75rem 1rem;
}
```

### Form Input Text

```css
.input-text {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.input-placeholder {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-muted);
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

.button-text-sm {
  font-family: 'Outfit', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
}

.button-text-lg {
  font-family: 'Outfit', sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1;
}
```

---

## Link Styles

### Default Links

```css
a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 150ms ease-out;
}

a:hover {
  color: var(--color-primary-hover);
}

a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
```

### Navigation Links

```css
.nav-link {
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 150ms ease-out;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link.active {
  color: var(--color-primary);
  font-weight: 600;
}
```

---

## Lists

### Unordered Lists

```css
ul.list-styled {
  padding-left: 1.5rem;
  list-style-type: disc;
}

ul.list-styled li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

ul.list-styled li::marker {
  color: var(--color-primary);
}
```

### Ordered Lists

```css
ol.list-styled {
  padding-left: 1.5rem;
  list-style-type: decimal;
}

ol.list-styled li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
  padding-left: 0.5rem;
}

ol.list-styled li::marker {
  color: var(--color-primary);
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

For optimal readability:
- **Minimum:** 45 characters
- **Optimal:** 66-75 characters
- **Maximum:** 90 characters

```css
.prose {
  max-width: 65ch;
}
```

### Contrast Requirements

All text must meet WCAG 2.1 AA standards:
- Normal text (< 18px): 4.5:1 minimum contrast
- Large text (>= 18px bold or >= 24px): 3:1 minimum contrast

---

## CSS Custom Properties

```css
:root {
  /* Font Families */
  --font-primary: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace;

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

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-09 | Initial typography system with Outfit font |
