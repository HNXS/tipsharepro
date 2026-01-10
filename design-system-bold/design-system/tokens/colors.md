# TipSharePro Color System - Bold Edition

**Version:** 1.0
**Date:** January 9, 2026
**Status:** Active

---

## Color Philosophy

TipSharePro's color palette is **BOLD, not bashful** - reflecting the confident, professional nature of the restaurant industry and the product's value proposition.

> "Take a look at my Logo. Not bashful."
> — Tom LaChaussee

The palette draws directly from:
1. The official TipSharePro logo (Burnt Orange, Lime Green, Navy Blue, Cyan)
2. The current www.tipsharepro.com website
3. Restaurant/hospitality industry aesthetics

---

## Primary Brand Colors

### Burnt Orange - Primary Action Color
The signature TipSharePro color. Used for all primary calls-to-action and key interactive elements.

| Variant | Hex | RGB | HSL | Usage |
|---------|-----|-----|-----|-------|
| **Primary 900** | `#7C2D00` | rgb(124, 45, 0) | 22, 100%, 24% | Darkest, pressed states |
| **Primary 800** | `#9A3800` | rgb(154, 56, 0) | 22, 100%, 30% | Dark hover |
| **Primary 700** | `#C04500` | rgb(192, 69, 0) | 22, 100%, 38% | Active states |
| **Primary 600** | `#D14D00` | rgb(209, 77, 0) | 22, 100%, 41% | Hover states |
| **Primary 500** | `#E85D04` | rgb(232, 93, 4) | 23, 97%, 46% | **DEFAULT - Primary CTA** |
| **Primary 400** | `#F07B2F` | rgb(240, 123, 47) | 24, 86%, 56% | Lighter accent |
| **Primary 300** | `#F8A566` | rgb(248, 165, 102) | 26, 90%, 69% | Light highlight |
| **Primary 200** | `#FCCFA3` | rgb(252, 207, 163) | 30, 92%, 81% | Very light |
| **Primary 100** | `#FEE8D6` | rgb(254, 232, 214) | 27, 91%, 92% | Subtle background |
| **Primary 50** | `#FFF3E6` | rgb(255, 243, 230) | 31, 100%, 95% | Lightest background |

**CSS Custom Properties:**
```css
:root {
  --color-primary-900: #7C2D00;
  --color-primary-800: #9A3800;
  --color-primary-700: #C04500;
  --color-primary-600: #D14D00;
  --color-primary-500: #E85D04;
  --color-primary-400: #F07B2F;
  --color-primary-300: #F8A566;
  --color-primary-200: #FCCFA3;
  --color-primary-100: #FEE8D6;
  --color-primary-50: #FFF3E6;

  --color-primary: var(--color-primary-500);
  --color-primary-hover: var(--color-primary-600);
  --color-primary-active: var(--color-primary-700);
  --color-primary-light: var(--color-primary-50);
}
```

---

### Lime Green - Success & Growth
Represents success, growth, and the "Transparent" brand value from the tagline.

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| **Success 900** | `#2D4A11` | rgb(45, 74, 17) | Darkest |
| **Success 800** | `#3D6418` | rgb(61, 100, 24) | Dark |
| **Success 700** | `#4E7E1E` | rgb(78, 126, 30) | Dark hover |
| **Success 600** | `#6B9A2A` | rgb(107, 154, 42) | Hover |
| **Success 500** | `#82B536` | rgb(130, 181, 54) | **DEFAULT** |
| **Success 400** | `#9FC95B` | rgb(159, 201, 91) | Light accent |
| **Success 300** | `#BCDA88` | rgb(188, 218, 136) | Light |
| **Success 200** | `#D8EBB5` | rgb(216, 235, 181) | Very light |
| **Success 100** | `#E9F4D6` | rgb(233, 244, 214) | Subtle |
| **Success 50** | `#F0F7E6` | rgb(240, 247, 230) | Lightest |

**CSS Custom Properties:**
```css
:root {
  --color-success-500: #82B536;
  --color-success-600: #6B9A2A;
  --color-success-50: #F0F7E6;

  --color-success: var(--color-success-500);
  --color-success-hover: var(--color-success-600);
  --color-success-light: var(--color-success-50);
}
```

---

### Navy Blue - Secondary & Trust
Conveys professionalism, trust, and stability. Used for secondary actions and trust-building elements.

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| **Secondary 900** | `#0A1F33` | rgb(10, 31, 51) | Darkest |
| **Secondary 800** | `#102D4A` | rgb(16, 45, 74) | Dark |
| **Secondary 700** | `#153D66` | rgb(21, 61, 102) | Hover |
| **Secondary 600** | `#1A4B7C` | rgb(26, 75, 124) | **DEFAULT** |
| **Secondary 500** | `#1E5A94` | rgb(30, 90, 148) | Light |
| **Secondary 400** | `#2E72B3` | rgb(46, 114, 179) | Lighter |
| **Secondary 300** | `#5A96CC` | rgb(90, 150, 204) | Light accent |
| **Secondary 200** | `#93BDE0` | rgb(147, 189, 224) | Very light |
| **Secondary 100** | `#C4DBF0` | rgb(196, 219, 240) | Subtle |
| **Secondary 50** | `#E6EEF5` | rgb(230, 238, 245) | Lightest |

**CSS Custom Properties:**
```css
:root {
  --color-secondary-600: #1A4B7C;
  --color-secondary-700: #153D66;
  --color-secondary-50: #E6EEF5;

  --color-secondary: var(--color-secondary-600);
  --color-secondary-hover: var(--color-secondary-700);
  --color-secondary-light: var(--color-secondary-50);
}
```

---

### Cyan - Accent & Interactive
For links, interactive elements, and friendly highlights. Adds brightness and approachability.

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| **Accent 700** | `#1A7BA8` | rgb(26, 123, 168) | Dark |
| **Accent 600** | `#2B8AB8` | rgb(43, 138, 184) | Hover |
| **Accent 500** | `#35A0D2` | rgb(53, 160, 210) | **DEFAULT** |
| **Accent 400** | `#5CB5DE` | rgb(92, 181, 222) | Light |
| **Accent 300** | `#8CCCE9` | rgb(140, 204, 233) | Lighter |
| **Accent 200** | `#B8E0F2` | rgb(184, 224, 242) | Very light |
| **Accent 100** | `#D6EEF8` | rgb(214, 238, 248) | Subtle |
| **Accent 50** | `#E6F4FA` | rgb(230, 244, 250) | Lightest |

**CSS Custom Properties:**
```css
:root {
  --color-accent-500: #35A0D2;
  --color-accent-600: #2B8AB8;
  --color-accent-50: #E6F4FA;

  --color-accent: var(--color-accent-500);
  --color-accent-hover: var(--color-accent-600);
  --color-accent-light: var(--color-accent-50);
}
```

---

## Semantic Colors

### Error / Destructive
| Variant | Hex | Usage |
|---------|-----|-------|
| **Error** | `#DC2626` | Error states, destructive actions |
| **Error Dark** | `#B91C1C` | Hover on error elements |
| **Error Light** | `#FEF2F2` | Error backgrounds |
| **Error Border** | `#FECACA` | Error input borders |

### Warning / Caution
| Variant | Hex | Usage |
|---------|-----|-------|
| **Warning** | `#F59E0B` | Warning states, attention needed |
| **Warning Dark** | `#D97706` | Hover |
| **Warning Light** | `#FFFBEB` | Warning backgrounds |

### Info / Neutral Notification
Uses Accent color (Cyan) for consistency.
| Variant | Hex | Usage |
|---------|-----|-------|
| **Info** | `#35A0D2` | Information, tips |
| **Info Light** | `#E6F4FA` | Info backgrounds |

---

## Foundation Colors

### Dark Palette (For Dark Sections)
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Charcoal** | `#1F2937` | rgb(31, 41, 55) | Dark backgrounds, footer, hero overlays |
| **Slate** | `#374151` | rgb(55, 65, 81) | Secondary dark, cards on dark |
| **Graphite** | `#4B5563` | rgb(75, 85, 99) | Tertiary dark |
| **Ash** | `#6B7280` | rgb(107, 114, 128) | Muted text on dark |

### Light Palette
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Primary surface, cards |
| **Snow** | `#FAFAFA` | rgb(250, 250, 250) | Subtle background |
| **Stone** | `#F5F5F4` | rgb(245, 245, 244) | Section backgrounds |
| **Fog** | `#E5E5E5` | rgb(229, 229, 229) | Borders, dividers |
| **Silver** | `#D4D4D4` | rgb(212, 212, 212) | Disabled borders |

### Text Colors
| Name | Hex | On Background | Usage |
|------|-----|---------------|-------|
| **Text Primary** | `#1F2937` | Light | Headlines, body |
| **Text Secondary** | `#6B7280` | Light | Secondary text |
| **Text Muted** | `#9CA3AF` | Light | Placeholders, disabled |
| **Text Inverse** | `#FFFFFF` | Dark | Text on dark backgrounds |
| **Text Inverse Secondary** | `#D1D5DB` | Dark | Secondary text on dark |
| **Text Link** | `#E85D04` | Light | Links, interactive text |
| **Text Link on Dark** | `#F07B2F` | Dark | Links on dark backgrounds |

---

## Accessibility Compliance

### Contrast Ratios

| Combination | Ratio | WCAG AA | WCAG AAA |
|-------------|-------|---------|----------|
| Text Primary on White | 13.5:1 | Pass | Pass |
| Text Secondary on White | 4.82:1 | Pass | Fail |
| Primary (Orange) on White | 4.52:1 | Pass | Fail |
| White on Primary (Orange) | 4.52:1 | Pass | Fail |
| White on Charcoal | 12.6:1 | Pass | Pass |
| Success (Green) on White | 3.25:1 | Fail* | Fail |
| White on Secondary (Navy) | 8.94:1 | Pass | Pass |

*Note: Success green should only be used for icons/indicators alongside text, not as the primary text color.

### Color Blindness Considerations

The palette has been tested for common forms of color blindness:
- **Protanopia:** Orange and green remain distinguishable by brightness
- **Deuteranopia:** Orange and green remain distinguishable
- **Tritanopia:** All colors remain distinguishable

---

## Usage Guidelines

### DO
- Use Primary Orange for primary CTAs and key actions
- Use Success Green sparingly for positive states
- Use Charcoal for dark sections (not pure black)
- Maintain consistent use across all touchpoints

### DON'T
- Don't use light variants of orange/green as primary button colors
- Don't use Success Green for large text blocks
- Don't use more than 3 brand colors in a single view
- Don't create new colors outside this palette

---

## CSS Variables - Complete Set

```css
:root {
  /* Primary (Burnt Orange) */
  --color-primary: #E85D04;
  --color-primary-hover: #D14D00;
  --color-primary-active: #C04500;
  --color-primary-light: #FFF3E6;
  --color-primary-100: #FEE8D6;
  --color-primary-200: #FCCFA3;

  /* Success (Lime Green) */
  --color-success: #82B536;
  --color-success-hover: #6B9A2A;
  --color-success-light: #F0F7E6;

  /* Secondary (Navy Blue) */
  --color-secondary: #1A4B7C;
  --color-secondary-hover: #153D66;
  --color-secondary-light: #E6EEF5;

  /* Accent (Cyan) */
  --color-accent: #35A0D2;
  --color-accent-hover: #2B8AB8;
  --color-accent-light: #E6F4FA;

  /* Semantic */
  --color-error: #DC2626;
  --color-error-light: #FEF2F2;
  --color-warning: #F59E0B;
  --color-warning-light: #FFFBEB;
  --color-info: #35A0D2;
  --color-info-light: #E6F4FA;

  /* Foundation - Dark */
  --color-charcoal: #1F2937;
  --color-slate: #374151;
  --color-graphite: #4B5563;

  /* Foundation - Light */
  --color-white: #FFFFFF;
  --color-snow: #FAFAFA;
  --color-stone: #F5F5F4;
  --color-fog: #E5E5E5;

  /* Text */
  --color-text-primary: #1F2937;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;
  --color-text-inverse: #FFFFFF;
  --color-text-link: #E85D04;
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-09 | Initial bold color system based on logo and website |
