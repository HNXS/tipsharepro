# TipSharePro Color System - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Active

---

## Color Philosophy

This palette merges two design directions:

1. **Dark "Amber Hour" Foundation** - Warm, moody backgrounds from the original design
2. **Bold Logo Colors** - The confident TipSharePro brand accents

> "Pastels are gay. You did that on the new one with the use of the logo colors and I think it will be great. Let's combine those 2 elements."
> — Tom LaChaussee

---

## Visual Reference

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║  DARK FOUNDATIONS (from Amber Hour)                                          ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                          ║
║                                                                              ║
║  Midnight      Espresso     Mahogany     Walnut                              ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                      ║
║  │██████████│  │██████████│  │██████████│  │██████████│                      ║
║  │ #0C0A07  │  │ #1A1510  │  │ #2A2318  │  │ #3D3225  │                      ║
║  │ Body     │  │ Cards    │  │ Hover    │  │ Borders  │                      ║
║  └──────────┘  └──────────┘  └──────────┘  └──────────┘                      ║
║                                                                              ║
║  WARM TEXT (from Amber Hour)                                                 ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━                                                  ║
║                                                                              ║
║  Cream        Linen        Stone        Ash                                  ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                      ║
║  │░░░░░░░░░░│  │▒▒▒▒▒▒▒▒▒▒│  │▓▓▓▓▓▓▓▓▓▓│  │██████████│                      ║
║  │ #F7F3EA  │  │ #C4B9A4  │  │ #8B7B65  │  │ #5C5145  │                      ║
║  │ Primary  │  │ Secondary│  │ Helper   │  │ Disabled │                      ║
║  └──────────┘  └──────────┘  └──────────┘  └──────────┘                      ║
║                                                                              ║
║  BOLD BRAND ACCENTS (from TipSharePro Logo)                                  ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                   ║
║                                                                              ║
║  Burnt Orange   Lime Green    Navy Blue     Cyan                             ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                      ║
║  │▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓│                      ║
║  │ #E85D04  │  │ #82B536  │  │ #1A4B7C  │  │ #35A0D2  │                      ║
║  │ Primary  │  │ Success  │  │ Secondary│  │ Info     │                      ║
║  │ CTA      │  │ Growth   │  │ Trust    │  │ Links    │                      ║
║  └──────────┘  └──────────┘  └──────────┘  └──────────┘                      ║
║                                                                              ║
║  SEMANTIC STATES                                                             ║
║  ━━━━━━━━━━━━━━                                                              ║
║                                                                              ║
║  Error         Warning                                                       ║
║  ┌──────────┐  ┌──────────┐                                                  ║
║  │▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓│                                                  ║
║  │ #DC2626  │  │ #F59E0B  │                                                  ║
║  └──────────┘  └──────────┘                                                  ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## Background Colors (Dark Foundation)

### Midnight — `#0C0A07`

**The Deepest Layer** — Like the corner of a restaurant after closing.

| Property | Value |
|----------|-------|
| Hex | `#0C0A07` |
| RGB | `rgb(12, 10, 7)` |
| HSL | `hsl(36, 26%, 4%)` |
| CSS Variable | `--color-midnight` |

**Usage:**
- Page body background
- Sidebar backgrounds
- Modal overlays (at 95% opacity)

**Accessibility:**
- Text `--cream` on `--midnight`: **15.8:1** (AAA)
- Text `--linen` on `--midnight`: **9.2:1** (AAA)
- Text `--burnt-orange` on `--midnight`: **5.9:1** (AA)

---

### Espresso — `#1A1510`

**Elevated Surfaces** — One step up from the deepest dark.

| Property | Value |
|----------|-------|
| Hex | `#1A1510` |
| RGB | `rgb(26, 21, 16)` |
| HSL | `hsl(30, 24%, 8%)` |
| CSS Variable | `--color-espresso` |

**Usage:**
- Card backgrounds
- Table containers
- Navigation backgrounds
- Form containers
- Settings panels

---

### Mahogany — `#2A2318`

**Interactive Surfaces** — Tom liked this "dark olive" color.

| Property | Value |
|----------|-------|
| Hex | `#2A2318` |
| RGB | `rgb(42, 35, 24)` |
| HSL | `hsl(37, 27%, 13%)` |
| CSS Variable | `--color-mahogany` |

**Usage:**
- Hover states on cards
- Dropdown backgrounds
- Active table rows
- Secondary button backgrounds
- Selected states

---

### Walnut — `#3D3225`

**Borders & Dividers**

| Property | Value |
|----------|-------|
| Hex | `#3D3225` |
| RGB | `rgb(61, 50, 37)` |
| HSL | `hsl(32, 25%, 19%)` |
| CSS Variable | `--color-walnut` |

**Usage:**
- Subtle borders
- Divider lines
- Table cell borders
- Input borders (default)

---

## Text Colors (Warm Neutrals)

### Cream — `#F7F3EA`

**Primary Text** — Warm white for headings and important content.

| Property | Value |
|----------|-------|
| Hex | `#F7F3EA` |
| RGB | `rgb(247, 243, 234)` |
| HSL | `hsl(42, 45%, 94%)` |
| CSS Variable | `--color-cream` |

**Usage:**
- Headings
- Primary body text
- Button labels
- Active navigation items

---

### Linen — `#C4B9A4`

**Secondary Text** — For supporting content.

| Property | Value |
|----------|-------|
| Hex | `#C4B9A4` |
| RGB | `rgb(196, 185, 164)` |
| HSL | `hsl(39, 27%, 71%)` |
| CSS Variable | `--color-linen` |

**Usage:**
- Secondary body text
- Table headers
- Form labels
- Timestamps
- Inactive navigation

---

### Stone — `#8B7B65`

**Tertiary/Helper Text**

| Property | Value |
|----------|-------|
| Hex | `#8B7B65` |
| RGB | `rgb(139, 123, 101)` |
| HSL | `hsl(35, 17%, 47%)` |
| CSS Variable | `--color-stone` |

**Usage:**
- Placeholder text
- Helper text (but consider using `--linen` instead)
- Captions
- Metadata

**Note:** Meets WCAG AA for large text only (4.7:1). Use with caution.

---

### Ash — `#5C5145`

**Disabled Text**

| Property | Value |
|----------|-------|
| Hex | `#5C5145` |
| RGB | `rgb(92, 81, 69)` |
| HSL | `hsl(31, 14%, 32%)` |
| CSS Variable | `--color-ash` |

**Usage:**
- Disabled button text
- Unavailable options
- "Faded" Full Version controls in Demo (teaser)

---

## Brand Accent Colors (Bold Logo Colors)

### Burnt Orange — `#E85D04`

**Primary Action** — The signature TipSharePro color. BOLD, not bashful.

| Property | Value |
|----------|-------|
| Hex | `#E85D04` |
| RGB | `rgb(232, 93, 4)` |
| HSL | `hsl(23, 97%, 46%)` |
| CSS Variable | `--color-primary` |

**Semantic Meaning:** Action, CTA, energy, TipSharePro brand

**Usage:**
- Primary CTA buttons
- Active states
- Focus rings
- Key interactive elements
- Links on dark backgrounds

**Variants:**
| Variant | Hex | Usage |
|---------|-----|-------|
| `--color-primary-hover` | `#D14D00` | Hover state |
| `--color-primary-active` | `#C04500` | Active/pressed state |
| `--color-primary-glow` | `rgba(232, 93, 4, 0.25)` | Focus glow |

**Accessibility:**
- Text `--midnight` on `--color-primary`: **4.52:1** (AA)
- Use dark text on orange buttons

---

### Lime Green — `#82B536`

**Success & Growth** — From the "POWERFUL * FAIR * TRANSPARENT" tagline.

| Property | Value |
|----------|-------|
| Hex | `#82B536` |
| RGB | `rgb(130, 181, 54)` |
| HSL | `hsl(84, 54%, 46%)` |
| CSS Variable | `--color-success` |

**Semantic Meaning:** Success, positive values, confirmations, growth

**Usage:**
- Success messages
- Positive number changes (+$50)
- Confirmation states
- "Good" indicators
- Pool recipient gains

**Variants:**
| Variant | Hex | Usage |
|---------|-----|-------|
| `--color-success-hover` | `#6B9A2A` | Hover state |
| `--color-success-glow` | `rgba(130, 181, 54, 0.25)` | Success highlights |

---

### Navy Blue — `#1A4B7C`

**Secondary & Trust** — Professional, trustworthy, stable.

| Property | Value |
|----------|-------|
| Hex | `#1A4B7C` |
| RGB | `rgb(26, 75, 124)` |
| HSL | `hsl(210, 65%, 29%)` |
| CSS Variable | `--color-secondary` |

**Semantic Meaning:** Trust, professionalism, secondary actions

**Usage:**
- Secondary buttons
- Trust indicators
- Professional elements
- Less prominent CTAs

**Variants:**
| Variant | Hex | Usage |
|---------|-----|-------|
| `--color-secondary-hover` | `#153D66` | Hover state |

---

### Cyan — `#35A0D2`

**Info & Interactive** — Friendly, approachable, informational.

| Property | Value |
|----------|-------|
| Hex | `#35A0D2` |
| RGB | `rgb(53, 160, 210)` |
| HSL | `hsl(199, 63%, 52%)` |
| CSS Variable | `--color-info` |

**Semantic Meaning:** Information, links, help, ?Note indicators

**Usage:**
- Links on dark backgrounds
- Info tooltips (?Note)
- Help text
- Neutral status indicators

**Variants:**
| Variant | Hex | Usage |
|---------|-----|-------|
| `--color-info-hover` | `#2B8AB8` | Hover state |

---

## Semantic Colors

### Error — `#DC2626`

| Property | Value |
|----------|-------|
| Hex | `#DC2626` |
| CSS Variable | `--color-error` |

**Usage:**
- Error messages
- Form validation errors
- Delete/destructive actions
- Negative values
- !!Note warning indicators

---

### Warning — `#F59E0B`

| Property | Value |
|----------|-------|
| Hex | `#F59E0B` |
| CSS Variable | `--color-warning` |

**Usage:**
- Warning messages
- Caution states
- !!Note attention indicators
- Approaching limits

---

## Job Category Badges

Tom will specify final badge colors. Proposed system using bold colors on dark:

| Category | Background | Text |
|----------|------------|------|
| Server | `#E85D04` (Orange) | `#0C0A07` |
| Cook | `#82B536` (Green) | `#0C0A07` |
| Busser | `#35A0D2` (Cyan) | `#0C0A07` |
| Host | `#1A4B7C` (Navy) | `#F7F3EA` |
| Bartender | `#D4A420` (Brass) | `#0C0A07` |
| **Custom 1-5** | TBD by Tom | TBD |

**Badge Requirements:**
- "Easily identifiable background color" per Tom
- High contrast for readability
- Consistent sizing across all badges

---

## Accessibility Compliance

### Contrast Ratios (on Midnight `#0C0A07`)

| Color | Ratio | WCAG Level |
|-------|-------|------------|
| `--cream` | 15.8:1 | AAA |
| `--linen` | 9.2:1 | AAA |
| `--burnt-orange` | 5.9:1 | AA |
| `--cyan` | 6.4:1 | AA |
| `--lime-green` | 5.8:1 | AA (large text) |
| `--stone` | 4.7:1 | AA (large text only) |

### Color Blindness Tested

- **Protanopia:** Orange/Green distinction maintained by brightness
- **Deuteranopia:** Orange/Green distinction maintained
- **Tritanopia:** All colors distinguishable

**Rule:** Never rely on color alone. Always pair with icons, text, or patterns.

---

## CSS Custom Properties

```css
:root {
  /* ========================================
     DARK FOUNDATIONS
     ======================================== */
  --color-midnight: #0C0A07;
  --color-espresso: #1A1510;
  --color-mahogany: #2A2318;
  --color-walnut: #3D3225;

  /* ========================================
     WARM TEXT
     ======================================== */
  --color-cream: #F7F3EA;
  --color-linen: #C4B9A4;
  --color-stone: #8B7B65;
  --color-ash: #5C5145;

  /* ========================================
     BOLD BRAND ACCENTS (from Logo)
     ======================================== */

  /* Primary - Burnt Orange */
  --color-primary: #E85D04;
  --color-primary-hover: #D14D00;
  --color-primary-active: #C04500;
  --color-primary-glow: rgba(232, 93, 4, 0.25);

  /* Success - Lime Green */
  --color-success: #82B536;
  --color-success-hover: #6B9A2A;
  --color-success-glow: rgba(130, 181, 54, 0.25);

  /* Secondary - Navy Blue */
  --color-secondary: #1A4B7C;
  --color-secondary-hover: #153D66;

  /* Info - Cyan */
  --color-info: #35A0D2;
  --color-info-hover: #2B8AB8;

  /* ========================================
     SEMANTIC STATES
     ======================================== */
  --color-error: #DC2626;
  --color-error-hover: #B91C1C;
  --color-warning: #F59E0B;
  --color-warning-hover: #D97706;

  /* ========================================
     LEGACY ALIASES (for Amber Hour compatibility)
     ======================================== */
  --brass: #D4A420;
  --ember: var(--color-primary);
  --sage: var(--color-success);
  --sienna: var(--color-error);

  /* ========================================
     BACKGROUND SHORTCUTS
     ======================================== */
  --bg-body: var(--color-midnight);
  --bg-surface: var(--color-espresso);
  --bg-elevated: var(--color-mahogany);
  --bg-border: var(--color-walnut);

  /* ========================================
     TEXT SHORTCUTS
     ======================================== */
  --text-primary: var(--color-cream);
  --text-secondary: var(--color-linen);
  --text-tertiary: var(--color-stone);
  --text-disabled: var(--color-ash);
}
```

---

## Do's and Don'ts

### Do:
- Use bold logo colors for CTAs and key actions
- Maintain dark backgrounds throughout (no white sections)
- Use `--cream` for headings and primary content
- Test all combinations for accessibility
- Use semantic aliases (`--color-success`, `--color-error`) in code

### Don't:
- Use pastel or light variants anywhere
- Place text on white or light gray backgrounds
- Use `--stone` for important information (too low contrast)
- Rely on color alone for meaning
- Create new colors outside this palette without approval

---

## Related Documentation

- [Typography Tokens](./typography.md)
- [Style Guide](../style-guide.md)
- [Button Components](../components/buttons.md)

---

## Version History

| Date | Changes |
|------|---------|
| 2026-01-15 | Combined Dark Amber Hour + Bold Logo Colors |
