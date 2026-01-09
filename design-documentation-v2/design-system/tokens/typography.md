# TipSharePro Typography Tokens V2

**Version:** 2.0
**Last Updated:** January 9, 2026
**Status:** Active

---

## Font Families

### Primary Font: Inter

Inter is a highly legible sans-serif typeface optimized for computer screens. It provides excellent readability for data-heavy interfaces like TipSharePro.

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                'Helvetica Neue', Arial, sans-serif;
```

**Weights Used:**
- 400 Regular - Body text
- 500 Medium - Emphasized text, buttons
- 600 Semibold - Headings, labels
- 700 Bold - Display headlines

### Display Font: Poppins

Poppins is used for hero headlines and marketing-focused text. Its geometric shapes convey modernity and boldness.

```css
--font-display: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Weights Used:**
- 600 Semibold - Section headers
- 700 Bold - Display headlines

### Monospace Font: JetBrains Mono

Used for numerical data, calculations, and code-like elements.

```css
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas,
             'Liberation Mono', Menlo, monospace;
```

**Weights Used:**
- 400 Regular - Data display
- 600 Semibold - Emphasized numbers

---

## Type Scale

### Scale Definition

Based on a 1.25 (Major Third) ratio for harmonious sizing.

| Token | Size (px) | Size (rem) | Line Height | Letter Spacing |
|-------|-----------|------------|-------------|----------------|
| `--text-xs` | 12px | 0.75rem | 1.5 | 0.02em |
| `--text-sm` | 14px | 0.875rem | 1.5 | 0.01em |
| `--text-base` | 16px | 1rem | 1.6 | 0 |
| `--text-lg` | 18px | 1.125rem | 1.6 | 0 |
| `--text-xl` | 20px | 1.25rem | 1.5 | -0.01em |
| `--text-2xl` | 24px | 1.5rem | 1.4 | -0.01em |
| `--text-3xl` | 30px | 1.875rem | 1.3 | -0.02em |
| `--text-4xl` | 36px | 2.25rem | 1.2 | -0.02em |
| `--text-5xl` | 48px | 3rem | 1.1 | -0.03em |
| `--text-6xl` | 60px | 3.75rem | 1.1 | -0.03em |

---

## Typography Styles

### Display Headlines

For hero sections and major marketing headlines.

```css
.text-display {
  font-family: var(--font-display);
  font-size: 3rem;        /* 48px */
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
}

/* Mobile */
@media (max-width: 768px) {
  .text-display {
    font-size: 2.25rem;   /* 36px */
  }
}
```

**Usage:** Hero headlines like "TipSharePro. Get Your BOH a Share They Deserve."

### Page Titles (H1)

```css
.text-h1 {
  font-family: var(--font-display);
  font-size: 2.25rem;     /* 36px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

/* Mobile */
@media (max-width: 768px) {
  .text-h1 {
    font-size: 1.875rem;  /* 30px */
  }
}
```

**Usage:** Page titles like "How It Works", "Settings"

### Section Headers (H2)

```css
.text-h2 {
  font-family: var(--font-display);
  font-size: 1.875rem;    /* 30px */
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

/* Mobile */
@media (max-width: 768px) {
  .text-h2 {
    font-size: 1.5rem;    /* 24px */
  }
}
```

**Usage:** Section headers like "Why Restaurants Choose TipSharePro"

### Subsection Headers (H3)

```css
.text-h3 {
  font-family: var(--font-primary);
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
}
```

**Usage:** Card titles, feature headers

### Card Titles (H4)

```css
.text-h4 {
  font-family: var(--font-primary);
  font-size: 1.25rem;     /* 20px */
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
}
```

**Usage:** FAQ questions, card titles

### Minor Headers (H5)

```css
.text-h5 {
  font-family: var(--font-primary);
  font-size: 1.125rem;    /* 18px */
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-primary);
}
```

**Usage:** List section headers, small feature titles

### Lead Paragraph

```css
.text-lead {
  font-family: var(--font-primary);
  font-size: 1.125rem;    /* 18px */
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
```

**Usage:** Hero subtitles, section introductions

### Body Text

```css
.text-body {
  font-family: var(--font-primary);
  font-size: 1rem;        /* 16px */
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
```

**Usage:** Default paragraph text

### Small Text

```css
.text-small {
  font-family: var(--font-primary);
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-muted);
}
```

**Usage:** Helper text, timestamps, metadata

### Caption Text

```css
.text-caption {
  font-family: var(--font-primary);
  font-size: 0.75rem;     /* 12px */
  font-weight: 400;
  line-height: 1.4;
  color: var(--color-text-muted);
}
```

**Usage:** Form hints, image captions

### Label Text

```css
.text-label {
  font-family: var(--font-primary);
  font-size: 0.75rem;     /* 12px */
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-primary);
}
```

**Usage:** Category badges, form labels

### Data/Number Text

```css
.text-data {
  font-family: var(--font-mono);
  font-size: 1rem;        /* 16px */
  font-weight: 400;
  line-height: 1.4;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-primary);
}

.text-data-lg {
  font-family: var(--font-mono);
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-primary);
}
```

**Usage:** Currency amounts, percentages, calculations

---

## Responsive Typography

### Fluid Type Scale

```css
/* Clamp for responsive sizing without media queries */
.text-display-fluid {
  font-size: clamp(2.25rem, 5vw + 1rem, 3.75rem);
}

.text-h1-fluid {
  font-size: clamp(1.875rem, 3vw + 1rem, 2.25rem);
}

.text-h2-fluid {
  font-size: clamp(1.5rem, 2.5vw + 0.75rem, 1.875rem);
}
```

---

## Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#0F172A` | Primary headlines, important text |
| `--text-secondary` | `#475569` | Body text, descriptions |
| `--text-muted` | `#64748B` | Helper text, timestamps |
| `--text-disabled` | `#94A3B8` | Disabled states |
| `--text-inverse` | `#FFFFFF` | Text on dark backgrounds |
| `--text-link` | `#3498DB` | Links (default) |
| `--text-link-hover` | `#2980B9` | Links (hover) |
| `--text-brand` | `#E85D04` | Brand accent text |

---

## Font Loading Strategy

### Critical Fonts (Preload)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Critical path fonts -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

<!-- Load display fonts async -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" media="print" onload="this.media='all'">
```

### Font Display Strategy

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap; /* Show fallback immediately, swap when loaded */
}
```

---

## CSS Custom Properties Export

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Poppins', var(--font-sans);
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.2;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Letter Spacing */
  --tracking-tighter: -0.03em;
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
}
```

---

*Typography tokens designed for optimal readability in data-heavy restaurant management interfaces while maintaining the bold, professional aesthetic of the TipSharePro brand.*
