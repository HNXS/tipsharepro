---
title: Tip Share Pro Style Guide
description: Complete visual language and design specifications
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ./tokens/colors.md
  - ./tokens/typography.md
  - ./tokens/spacing.md
  - ./tokens/animations.md
status: approved
---

# Tip Share Pro Style Guide

## Table of Contents
1. [Design Concept](#design-concept)
2. [Color System](#color-system)
3. [Typography System](#typography-system)
4. [Spacing & Layout](#spacing--layout)
5. [Elevation & Depth](#elevation--depth)
6. [Iconography](#iconography)
7. [Motion & Animation](#motion--animation)
8. [Patterns & Textures](#patterns--textures)
9. [Implementation](#implementation)

---

## Design Concept

### The "Amber Hour" Theme

Tip Share Pro uses a dark, warm aesthetic inspired by the intimate moments of restaurant life—the late-night tip count, the amber glow of a banker's lamp, the worn leather of a decades-old booth.

**Visual Metaphors:**
- Brass cash registers and banker's lamps → Gold/amber accents
- Chalkboard menus → Matte dark surfaces with high-contrast text
- Receipt paper → Cream-colored data displays
- Kitchen timers → Circular progress indicators
- Leather-bound ledgers → Rich, warm dark tones

**Mood Board Keywords:**
- Intimate, not institutional
- Warm, not clinical
- Professional, not corporate
- Honest, not flashy
- Functional, not decorative

---

## Color System

### The "Amber Hour" Palette

This palette draws from the warm, intimate lighting of a restaurant after hours—brass fixtures, amber bulbs, mahogany surfaces, and the occasional pop of kitchen heat.

#### Core Colors

##### Backgrounds (Dark Foundation)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--midnight` | `#0C0A07` | rgb(12, 10, 7) | Primary background, body |
| `--espresso` | `#1A1510` | rgb(26, 21, 16) | Elevated surfaces, cards |
| `--mahogany` | `#2A2318` | rgb(42, 35, 24) | Hover states, secondary surfaces |
| `--walnut` | `#3D3225` | rgb(61, 50, 37) | Borders, dividers |

##### Text (Warm Neutrals)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--cream` | `#F7F3EA` | rgb(247, 243, 234) | Primary text, headings |
| `--linen` | `#C4B9A4` | rgb(196, 185, 164) | Secondary text, labels |
| `--stone` | `#8B7B65` | rgb(139, 123, 101) | Tertiary text, placeholders |
| `--ash` | `#5C5145` | rgb(92, 81, 69) | Disabled text |

##### Accent Colors (The "Pops")

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--brass` | `#D4A420` | rgb(212, 164, 32) | Primary CTA, success, money/tips |
| `--brass-light` | `#E8C150` | rgb(232, 193, 80) | Hover states on brass |
| `--brass-glow` | `rgba(212, 164, 32, 0.15)` | — | Glow effects, focus rings |
| `--ember` | `#E85D35` | rgb(232, 93, 53) | Notifications, important actions |
| `--ember-dark` | `#C44A28` | rgb(196, 74, 40) | Active states |
| `--sage` | `#2D9B6E` | rgb(45, 155, 110) | Success states, positive values |
| `--sage-dark` | `#248558` | rgb(36, 133, 88) | Hover on success |
| `--sienna` | `#C74B4B` | rgb(199, 75, 75) | Errors, destructive actions |
| `--sienna-dark` | `#A33B3B` | rgb(163, 59, 59) | Active error states |

##### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#2D9B6E` (sage) | Positive outcomes, confirmations |
| `--warning` | `#D4A420` (brass) | Caution states, pending |
| `--error` | `#C74B4B` (sienna) | Errors, validation failures |
| `--info` | `#6B8CAE` | Informational, neutral alerts |

#### Color Application Rules

**Background Hierarchy:**
```
Deepest: --midnight     (body background)
    ↓
Middle:  --espresso     (cards, panels)
    ↓
Raised:  --mahogany     (hover states, dropdowns)
    ↓
Border:  --walnut       (dividers, subtle borders)
```

**Text on Dark Backgrounds:**
- Primary content: `--cream` on `--midnight` (contrast ratio: 15.8:1)
- Secondary content: `--linen` on `--midnight` (contrast ratio: 9.2:1)
- Tertiary content: `--stone` on `--midnight` (contrast ratio: 4.7:1)

**Accent Usage:**
- `--brass`: Money, tips, success, primary CTAs (sparingly—it's the "gold")
- `--ember`: Urgency, notifications, secondary emphasis
- `--sage`: Positive values, confirmations
- `--sienna`: Errors, warnings, destructive actions

---

## Typography System

### Font Stack

#### Display & Headings: Fraunces

**Why Fraunces?**
Fraunces is a "wonky" display serif with optical adjustments that give it warmth and personality. Its soft curves and slightly irregular forms feel handcrafted, like hand-painted signage at a beloved neighborhood restaurant.

```css
--font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
```

**Variable Font Axes:**
- `wght`: 100–900 (we use 400, 600, 700)
- `SOFT`: 0–100 (we use 50 for friendly curves)
- `WONK`: 0–1 (we use 1 for optical adjustments)

#### Body Text: Newsreader

**Why Newsreader?**
A high-readability serif designed for extended text. It has the professional authority of classic newspaper typography but with softer, more approachable curves. Perfect for the "professional but warm" brand voice.

```css
--font-body: 'Newsreader', Georgia, 'Times New Roman', serif;
```

#### Monospace & Numbers: JetBrains Mono

**Why JetBrains Mono?**
Financial data demands clarity. JetBrains Mono offers:
- True tabular figures (numbers align in columns)
- Clear distinction between 0/O, 1/l/I
- Excellent legibility at small sizes
- Ligatures off for financial data

```css
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale

Using a **1.25 (Major Third)** scale for harmonious proportions:

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-display` | 48px / 3rem | 1.1 | 700 | Hero sections, major stats |
| `--text-h1` | 36px / 2.25rem | 1.2 | 700 | Page titles |
| `--text-h2` | 28px / 1.75rem | 1.25 | 600 | Section headers |
| `--text-h3` | 22px / 1.375rem | 1.3 | 600 | Card titles, subsections |
| `--text-h4` | 18px / 1.125rem | 1.35 | 600 | Minor headers |
| `--text-body-lg` | 18px / 1.125rem | 1.6 | 400 | Lead paragraphs |
| `--text-body` | 16px / 1rem | 1.6 | 400 | Body text |
| `--text-body-sm` | 14px / 0.875rem | 1.5 | 400 | Secondary text |
| `--text-caption` | 12px / 0.75rem | 1.4 | 400 | Captions, timestamps |
| `--text-label` | 11px / 0.6875rem | 1.3 | 600 | Form labels, uppercase |
| `--text-mono-lg` | 24px / 1.5rem | 1.3 | 500 | Large dollar amounts |
| `--text-mono` | 16px / 1rem | 1.4 | 400 | Table data, numbers |
| `--text-mono-sm` | 13px / 0.8125rem | 1.4 | 400 | Small data points |

### Typography Rules

**Headings (Fraunces):**
```css
h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-variation-settings: 'SOFT' 50, 'WONK' 1;
  color: var(--cream);
  letter-spacing: -0.02em;
}
```

**Body Text (Newsreader):**
```css
body, p {
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.6;
  color: var(--cream);
}
```

**Financial Data (JetBrains Mono):**
```css
.currency, .percentage, .hours, [data-numeric] {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0;
}
```

**Dollar Amounts:**
```css
.dollar-amount {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--brass);
}

.dollar-amount::before {
  content: '$';
  opacity: 0.7;
  margin-right: 0.1em;
}
```

---

## Spacing & Layout

### Base Unit: 6px

We use a **6px base unit** rather than the common 4px or 8px. Why?
- Divides evenly into common screen widths
- Creates tighter, more information-dense layouts
- Feels "professional" rather than "spacious"
- Natural rhythm: 6, 12, 18, 24, 30, 36, 48, 60, 72...

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 6px | Micro spacing, icon gaps |
| `--space-2` | 12px | Tight padding, small gaps |
| `--space-3` | 18px | Default element spacing |
| `--space-4` | 24px | Card padding, medium gaps |
| `--space-5` | 30px | Section padding |
| `--space-6` | 36px | Large gaps |
| `--space-8` | 48px | Major section breaks |
| `--space-10` | 60px | Page margins |
| `--space-12` | 72px | Hero spacing |

### Layout Grid

**Desktop (1200px+ viewport):**
- Container max-width: 1400px
- Columns: 12
- Gutter: 24px
- Margin: 48px

**Tablet (768px–1199px):**
- Container: fluid
- Columns: 8
- Gutter: 18px
- Margin: 36px

**Mobile (320px–767px):**
- Container: fluid
- Columns: 4
- Gutter: 12px
- Margin: 18px

### Component Spacing Patterns

**Card Internal Spacing:**
```css
.card {
  padding: var(--space-4);           /* 24px */
}

.card-header {
  padding-bottom: var(--space-3);    /* 18px */
  border-bottom: 1px solid var(--walnut);
}

.card-body {
  padding-top: var(--space-3);       /* 18px */
}
```

**Table Cell Spacing:**
```css
.table td, .table th {
  padding: var(--space-2) var(--space-3);  /* 12px 18px */
}
```

**Form Element Spacing:**
```css
.form-group + .form-group {
  margin-top: var(--space-4);        /* 24px */
}

.form-label {
  margin-bottom: var(--space-1);     /* 6px */
}
```

---

## Elevation & Depth

### Shadow System

No harsh drop shadows. Instead, we use subtle, warm-tinted shadows that feel like natural lighting:

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(12, 10, 7, 0.4)` | Buttons, minor elevation |
| `--shadow-md` | `0 4px 8px rgba(12, 10, 7, 0.5), 0 1px 2px rgba(12, 10, 7, 0.3)` | Cards, dropdowns |
| `--shadow-lg` | `0 12px 24px rgba(12, 10, 7, 0.6), 0 4px 8px rgba(12, 10, 7, 0.4)` | Modals, overlays |
| `--shadow-glow` | `0 0 20px rgba(212, 164, 32, 0.25)` | Focus states, highlights |

### Border System

| Token | Value | Usage |
|-------|-------|-------|
| `--border-subtle` | `1px solid var(--walnut)` | Card borders, dividers |
| `--border-medium` | `1px solid var(--stone)` | Input borders |
| `--border-focus` | `2px solid var(--brass)` | Focus rings |
| `--border-radius-sm` | `4px` | Buttons, inputs |
| `--border-radius-md` | `8px` | Cards, modals |
| `--border-radius-lg` | `12px` | Large containers |
| `--border-radius-full` | `9999px` | Pills, avatars |

---

## Iconography

### Icon Style

**Character:**
- Outlined, not filled (lighter visual weight)
- 1.5px stroke width at 24px size
- Rounded line caps and joins
- Friendly, not corporate

**Recommended Icon Set:** Lucide Icons
- Open source, consistent design
- Matches our warm, friendly aesthetic
- Available as React components

**Icon Sizes:**
| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 14px | Inline with text |
| `sm` | 18px | Buttons, compact UI |
| `md` | 24px | Standard icons |
| `lg` | 32px | Feature icons |
| `xl` | 48px | Empty states |

**Icon Colors:**
- Default: `var(--linen)`
- Interactive: `var(--cream)` on hover
- Accent: `var(--brass)` for emphasis
- Semantic: Match semantic colors (success, error, etc.)

---

## Motion & Animation

### Philosophy: "Cash Flow"

Our animations evoke the physical handling of money and paper—the satisfying fan of bills, the quick tap of calculator keys, the smooth slide of a receipt.

### Timing Functions

| Token | Value | Character |
|-------|-------|-----------|
| `--ease-out` | `cubic-bezier(0.0, 0, 0.2, 1)` | Quick start, smooth finish |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Balanced, professional |
| `--ease-snap` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Slight overshoot, satisfying |
| `--ease-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` | Quick then settles |

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | `100ms` | State changes, hover |
| `--duration-fast` | `200ms` | Micro-interactions |
| `--duration-normal` | `300ms` | Standard transitions |
| `--duration-slow` | `500ms` | Page elements |
| `--duration-reveal` | `700ms` | Staggered reveals |

### Signature Animations

**1. "Receipt Roll" — Page Load Reveal**
Elements slide up and fade in with stagger, like receipts coming out of a printer:

```css
@keyframes receiptRoll {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal-item {
  animation: receiptRoll var(--duration-slow) var(--ease-settle) forwards;
  opacity: 0;
}

.reveal-item:nth-child(1) { animation-delay: 0ms; }
.reveal-item:nth-child(2) { animation-delay: 75ms; }
.reveal-item:nth-child(3) { animation-delay: 150ms; }
/* ... stagger continues */
```

**2. "Till Count" — Number Increment**
Numbers tick up rapidly, like counting bills:

```css
@keyframes tillCount {
  0% { opacity: 0.5; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

**3. "Brass Glow" — Focus & Success**
A warm golden glow that expands, like a lamp turning on:

```css
@keyframes brassGlow {
  0% { box-shadow: 0 0 0 0 rgba(212, 164, 32, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(212, 164, 32, 0); }
  100% { box-shadow: 0 0 0 0 rgba(212, 164, 32, 0); }
}
```

**4. "Paper Slide" — Modals & Drawers**
Smooth lateral movement, like sliding a document across a table:

```css
@keyframes paperSlide {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Reduced Motion

Always respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Patterns & Textures

### Background Texture: "Paper Grain"

A subtle noise texture applied to backgrounds to add depth and prevent the flat "digital" look:

```css
.paper-texture {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: 0.03;
  pointer-events: none;
}
```

### Ambient Gradients

Subtle radial gradients to create warm "lighting":

```css
.ambient-glow {
  background:
    radial-gradient(
      ellipse 80% 50% at 20% 40%,
      rgba(212, 164, 32, 0.04) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 60% 40% at 80% 60%,
      rgba(232, 93, 53, 0.03) 0%,
      transparent 50%
    );
}
```

### Data Grid Pattern

For areas with dense numerical data, a subtle grid pattern reinforces alignment:

```css
.data-grid-pattern {
  background-image:
    linear-gradient(
      to right,
      var(--walnut) 1px,
      transparent 1px
    );
  background-size: var(--space-8) 100%;
}
```

---

## Implementation

### CSS Custom Properties Export

```css
:root {
  /* ===== COLORS ===== */
  /* Backgrounds */
  --midnight: #0C0A07;
  --espresso: #1A1510;
  --mahogany: #2A2318;
  --walnut: #3D3225;

  /* Text */
  --cream: #F7F3EA;
  --linen: #C4B9A4;
  --stone: #8B7B65;
  --ash: #5C5145;

  /* Accents */
  --brass: #D4A420;
  --brass-light: #E8C150;
  --brass-glow: rgba(212, 164, 32, 0.15);
  --ember: #E85D35;
  --ember-dark: #C44A28;
  --sage: #2D9B6E;
  --sage-dark: #248558;
  --sienna: #C74B4B;
  --sienna-dark: #A33B3B;
  --info: #6B8CAE;

  /* Semantic */
  --success: var(--sage);
  --warning: var(--brass);
  --error: var(--sienna);

  /* ===== TYPOGRAPHY ===== */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Newsreader', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;

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

  /* ===== SPACING ===== */
  --space-1: 6px;
  --space-2: 12px;
  --space-3: 18px;
  --space-4: 24px;
  --space-5: 30px;
  --space-6: 36px;
  --space-8: 48px;
  --space-10: 60px;
  --space-12: 72px;

  /* ===== BORDERS & RADIUS ===== */
  --border-subtle: 1px solid var(--walnut);
  --border-medium: 1px solid var(--stone);
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-full: 9999px;

  /* ===== SHADOWS ===== */
  --shadow-sm: 0 1px 2px rgba(12, 10, 7, 0.4);
  --shadow-md: 0 4px 8px rgba(12, 10, 7, 0.5), 0 1px 2px rgba(12, 10, 7, 0.3);
  --shadow-lg: 0 12px 24px rgba(12, 10, 7, 0.6), 0 4px 8px rgba(12, 10, 7, 0.4);
  --shadow-glow: 0 0 20px rgba(212, 164, 32, 0.25);

  /* ===== MOTION ===== */
  --ease-out: cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snap: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-settle: cubic-bezier(0.22, 1, 0.36, 1);

  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-reveal: 700ms;
}
```

### Font Loading

```html
<!-- Preload critical fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Variable fonts for optimal file size -->
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap" rel="stylesheet">
```

---

## Related Documentation

- [Color Tokens](./tokens/colors.md) — Detailed color specifications
- [Typography Tokens](./tokens/typography.md) — Full type system
- [Spacing Tokens](./tokens/spacing.md) — Layout specifications
- [Animation Tokens](./tokens/animations.md) — Motion library

---

## Last Updated

| Date | Changes |
|------|---------|
| 2026-01-08 | Initial style guide creation |
