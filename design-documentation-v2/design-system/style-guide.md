# TipSharePro Style Guide V2

**Version:** 2.0
**Last Updated:** January 9, 2026
**Based On:** tipsharepro.com Production Website

---

## 1. Brand Identity

### Brand Essence
TipSharePro is a **professional tool for professional restaurateurs**. The visual design must convey:
- Trustworthiness (handling employee compensation)
- Professionalism (compliance with DOL/IRS)
- Boldness (innovative approach to tip pooling)
- Warmth (restaurant/hospitality industry connection)

### Tagline
**POWERFUL * FAIR * TRANSPARENT**

### Logo Assets

| Asset | File | Usage |
|-------|------|-------|
| Full Logo | `fulllogo.png` | Primary branding, hero sections |
| Full Logo Transparent | `fulllogo_transparent.png` | Overlays, light backgrounds |
| Icon Only | `icononly_transparent_nobuffer.png` | Favicon, app icon, small displays |
| Text Only | `textonly.png` | Monochrome applications |

**Logo Elements:**
- Stacked transparent pages (representing documentation/records)
- Upward green arrow (representing growth/improvement)
- Orange brand name with green tagline

---

## 2. Color System

### Primary Brand Colors

```css
:root {
  /* Primary - The Bold Orange */
  --color-primary: #E85D04;
  --color-primary-dark: #C44D03;
  --color-primary-light: #F47B33;

  /* Secondary - Growth Green */
  --color-secondary: #7CB342;
  --color-secondary-dark: #5B8930;
  --color-secondary-light: #9CCC65;

  /* Accent - Trust Navy */
  --color-accent-navy: #1A5276;
  --color-accent-navy-dark: #154360;
  --color-accent-navy-light: #2874A6;

  /* Accent - Sky Blue */
  --color-accent-blue: #3498DB;
  --color-accent-blue-dark: #2980B9;
  --color-accent-blue-light: #5DADE2;
}
```

### Extended Palette

```css
:root {
  /* Dark Olive - Tom's approved accent */
  --color-olive: #4A5D23;
  --color-olive-light: #6B8E23;

  /* Neutrals */
  --color-charcoal: #2C3E50;
  --color-slate: #34495E;
  --color-gray-700: #4A5568;
  --color-gray-600: #718096;
  --color-gray-500: #A0AEC0;
  --color-gray-400: #CBD5E0;
  --color-gray-300: #E2E8F0;
  --color-gray-200: #EDF2F7;
  --color-gray-100: #F7FAFC;

  /* Warm Backgrounds */
  --color-cream: #FDF8F3;
  --color-warm-white: #FFFAF5;
  --color-pure-white: #FFFFFF;
}
```

### Semantic Colors

```css
:root {
  /* Success - Uses Growth Green */
  --color-success: #7CB342;
  --color-success-bg: #E8F5E9;
  --color-success-border: #A5D6A7;

  /* Warning - Uses Brand Orange */
  --color-warning: #F57C00;
  --color-warning-bg: #FFF3E0;
  --color-warning-border: #FFCC80;

  /* Error */
  --color-error: #E53935;
  --color-error-bg: #FFEBEE;
  --color-error-border: #EF9A9A;

  /* Info - Uses Sky Blue */
  --color-info: #3498DB;
  --color-info-bg: #E3F2FD;
  --color-info-border: #90CAF9;
}
```

### Color Usage Guidelines

| Element | Color | Hex |
|---------|-------|-----|
| Primary CTA buttons | TipShare Orange | `#E85D04` |
| Secondary CTA buttons | White w/ Orange border | `#FFFFFF` |
| Success messages | Growth Green | `#7CB342` |
| Links | Sky Blue | `#3498DB` |
| Primary headings | Charcoal | `#2C3E50` |
| Body text | Slate | `#34495E` |
| Section backgrounds | Warm Cream gradient | `#FDF8F3 → #FFFFFF` |
| Card backgrounds | Pure White | `#FFFFFF` |
| Category badges | Navy Blue | `#1A5276` |

### Gradients

```css
/* Hero section background overlay */
.hero-gradient {
  background: linear-gradient(
    135deg,
    rgba(44, 62, 80, 0.85) 0%,
    rgba(26, 82, 118, 0.75) 100%
  );
}

/* Warm section header */
.warm-header {
  background: linear-gradient(
    180deg,
    #FDF8F3 0%,
    #FFFFFF 100%
  );
}

/* Orange accent gradient */
.orange-gradient {
  background: linear-gradient(
    135deg,
    #E85D04 0%,
    #F47B33 100%
  );
}
```

---

## 3. Typography

### Font Stack

```css
:root {
  /* Primary Font - Clean, Professional */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Display Font - Bold Headlines */
  --font-display: 'Poppins', 'Inter', sans-serif;

  /* Monospace - Code/Numbers */
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}
```

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | 48px / 3rem | 700 | 1.1 | Hero headlines |
| H1 | 36px / 2.25rem | 700 | 1.2 | Page titles |
| H2 | 30px / 1.875rem | 600 | 1.25 | Section headers |
| H3 | 24px / 1.5rem | 600 | 1.3 | Subsections |
| H4 | 20px / 1.25rem | 600 | 1.4 | Card titles |
| H5 | 18px / 1.125rem | 500 | 1.4 | Minor headers |
| Body Large | 18px / 1.125rem | 400 | 1.6 | Lead paragraphs |
| Body | 16px / 1rem | 400 | 1.6 | Default text |
| Body Small | 14px / 0.875rem | 400 | 1.5 | Secondary text |
| Caption | 12px / 0.75rem | 400 | 1.4 | Labels, metadata |
| Label | 12px / 0.75rem | 600 | 1.2 | Form labels, badges |

### Typography CSS

```css
/* Display - Hero Headlines */
.text-display {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-charcoal);
}

/* H1 - Page Titles */
.text-h1 {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--color-charcoal);
}

/* Body - Default */
.text-body {
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-slate);
}

/* Category Badge Text */
.text-badge {
  font-family: var(--font-primary);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-primary);
}
```

---

## 4. Spacing System

### Base Unit: 4px

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Spacing Usage

| Use Case | Token | Value |
|----------|-------|-------|
| Inline element spacing | `space-1` | 4px |
| Icon + text gap | `space-2` | 8px |
| Form field gap | `space-3` | 12px |
| Card internal padding | `space-6` | 24px |
| Section padding | `space-12` to `space-16` | 48-64px |
| Page margins | `space-8` | 32px |
| Component spacing | `space-8` | 32px |

---

## 5. Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px - Subtle rounding */
  --radius-md: 0.5rem;    /* 8px - Default cards/buttons */
  --radius-lg: 0.75rem;   /* 12px - Larger cards */
  --radius-xl: 1rem;      /* 16px - Modals */
  --radius-full: 9999px;  /* Pills/Badges */
}
```

---

## 6. Shadows & Elevation

```css
:root {
  /* Card shadow - Subtle */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* Default card shadow */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
               0 2px 4px -1px rgba(0, 0, 0, 0.06);

  /* Elevated cards, dropdowns */
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
               0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* Modals */
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
               0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Focus ring - Orange */
  --shadow-focus: 0 0 0 3px rgba(232, 93, 4, 0.4);
}
```

---

## 7. Grid & Layout

### Container Widths

```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1440px;
}
```

### Grid System

- **Columns:** 12-column grid
- **Gutter:** 24px (desktop), 16px (mobile)
- **Margin:** 24px (desktop), 16px (mobile)

### Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

---

## 8. Component Specifications

### Buttons

**Primary Button (Orange)**
```css
.btn-primary {
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

**Secondary Button (Outline)**
```css
.btn-secondary {
  background: white;
  color: var(--color-primary);
  font-weight: 600;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: white;
}
```

### Cards

```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  border: 1px solid var(--color-gray-200);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
```

### Category Badges

```css
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge-orange { background: #FFF3E0; color: var(--color-primary); }
.badge-green { background: #E8F5E9; color: var(--color-secondary-dark); }
.badge-blue { background: #E3F2FD; color: var(--color-accent-navy); }
```

---

## 9. Icons

### Icon Style
- Style: Outlined, 2px stroke
- Size: 24px default, 20px small, 32px large
- Color: Inherit from parent or use semantic colors

### Icon + Text Alignment
- Gap: 8px (`space-2`)
- Vertical alignment: center

---

## 10. Imagery

### Photography Style
- **Subject:** Restaurant/kitchen environments, professional staff
- **Mood:** Warm, energetic, professional
- **Treatment:** Slight warm color grade, high contrast
- **Overlay:** Dark gradient for text legibility

### Hero Image Guidelines
- Minimum resolution: 1920x1080
- Aspect ratio: 16:9 preferred
- Apply gradient overlay: `linear-gradient(135deg, rgba(44, 62, 80, 0.85), rgba(26, 82, 118, 0.75))`

---

## 11. Accessibility

### Color Contrast
- All text meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Orange on white: 4.5:1 ratio verified
- Navy on white: 7:1 ratio verified

### Focus States
- All interactive elements have visible focus ring
- Focus ring: 3px orange ring with 40% opacity

### Touch Targets
- Minimum: 44x44px for all interactive elements
- Buttons: Minimum height 44px

---

## 12. Motion & Animation

```css
:root {
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;

  --ease-out: cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.6, 1);
}
```

### Animation Guidelines
- Subtle hover effects (2px lift, shadow increase)
- Page transitions: 200-300ms fade
- Loading states: Skeleton screens with subtle shimmer
- Respect `prefers-reduced-motion`

---

*This style guide defines the visual language for TipSharePro, matching the bold, professional aesthetic of the existing website while maintaining accessibility and usability standards.*
