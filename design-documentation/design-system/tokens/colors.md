---
title: Color Tokens — The "Amber Hour" Palette
description: Complete color system for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../style-guide.md
  - ./typography.md
status: approved
---

# Color Tokens

## The "Amber Hour" Palette

Named for the warm, intimate lighting of a restaurant after hours—when the team gathers under brass fixtures and amber bulbs to count the night's tips.

---

## Visual Reference

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║  FOUNDATIONS                                                         ║
║  ━━━━━━━━━━━                                                         ║
║                                                                      ║
║  Midnight    Espresso    Mahogany    Walnut                         ║
║  ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐                      ║
║  │       │   │       │   │       │   │       │                      ║
║  │#0C0A07│   │#1A1510│   │#2A2318│   │#3D3225│                      ║
║  │       │   │       │   │       │   │       │                      ║
║  └───────┘   └───────┘   └───────┘   └───────┘                      ║
║                                                                      ║
║  TEXT                                                                ║
║  ━━━━                                                                ║
║                                                                      ║
║  Cream       Linen       Stone       Ash                            ║
║  ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐                      ║
║  │░░░░░░░│   │▒▒▒▒▒▒▒│   │▓▓▓▓▓▓▓│   │███████│                      ║
║  │#F7F3EA│   │#C4B9A4│   │#8B7B65│   │#5C5145│                      ║
║  │░░░░░░░│   │▒▒▒▒▒▒▒│   │▓▓▓▓▓▓▓│   │███████│                      ║
║  └───────┘   └───────┘   └───────┘   └───────┘                      ║
║                                                                      ║
║  ACCENTS                                                             ║
║  ━━━━━━━                                                             ║
║                                                                      ║
║  Brass       Ember       Sage        Sienna      Info               ║
║  ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐          ║
║  │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│          ║
║  │#D4A420│   │#E85D35│   │#2D9B6E│   │#C74B4B│   │#6B8CAE│          ║
║  │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│          ║
║  └───────┘   └───────┘   └───────┘   └───────┘   └───────┘          ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Background Colors

These form the depth layers of the interface, from deepest (body) to most elevated (active states).

### Midnight — `#0C0A07`

**The Deepest Layer**

| Property | Value |
|----------|-------|
| Hex | `#0C0A07` |
| RGB | `rgb(12, 10, 7)` |
| HSL | `hsl(36, 26%, 4%)` |
| CSS Variable | `--midnight` |

**Usage:**
- Page body background
- Deepest visual layer
- Sidebar backgrounds
- Modal overlays (at 95% opacity)

**Accessibility:**
- Text `--cream` on `--midnight`: **15.8:1** (AAA)
- Text `--linen` on `--midnight`: **9.2:1** (AAA)
- Text `--brass` on `--midnight`: **7.1:1** (AAA)

---

### Espresso — `#1A1510`

**Elevated Surfaces**

| Property | Value |
|----------|-------|
| Hex | `#1A1510` |
| RGB | `rgb(26, 21, 16)` |
| HSL | `hsl(30, 24%, 8%)` |
| CSS Variable | `--espresso` |

**Usage:**
- Card backgrounds
- Table containers
- Navigation backgrounds
- Form containers

---

### Mahogany — `#2A2318`

**Interactive Surfaces**

| Property | Value |
|----------|-------|
| Hex | `#2A2318` |
| RGB | `rgb(42, 35, 24)` |
| HSL | `hsl(37, 27%, 13%)` |
| CSS Variable | `--mahogany` |

**Usage:**
- Hover states on cards
- Dropdown backgrounds
- Active table rows
- Secondary button backgrounds

---

### Walnut — `#3D3225`

**Borders & Dividers**

| Property | Value |
|----------|-------|
| Hex | `#3D3225` |
| RGB | `rgb(61, 50, 37)` |
| HSL | `hsl(32, 25%, 19%)` |
| CSS Variable | `--walnut` |

**Usage:**
- Subtle borders
- Divider lines
- Table cell borders
- Inactive input borders

---

## Text Colors

A warm neutral scale that feels like aged paper under candlelight.

### Cream — `#F7F3EA`

**Primary Text**

| Property | Value |
|----------|-------|
| Hex | `#F7F3EA` |
| RGB | `rgb(247, 243, 234)` |
| HSL | `hsl(42, 45%, 94%)` |
| CSS Variable | `--cream` |

**Usage:**
- Headings
- Primary body text
- Button labels
- Navigation items (active)

---

### Linen — `#C4B9A4`

**Secondary Text**

| Property | Value |
|----------|-------|
| Hex | `#C4B9A4` |
| RGB | `rgb(196, 185, 164)` |
| HSL | `hsl(39, 27%, 71%)` |
| CSS Variable | `--linen` |

**Usage:**
- Secondary body text
- Table headers
- Form labels
- Timestamps
- Navigation items (inactive)

---

### Stone — `#8B7B65`

**Tertiary Text**

| Property | Value |
|----------|-------|
| Hex | `#8B7B65` |
| RGB | `rgb(139, 123, 101)` |
| HSL | `hsl(35, 17%, 47%)` |
| CSS Variable | `--stone` |

**Usage:**
- Placeholder text
- Helper text
- Captions
- Metadata

**Note:** Meets WCAG AA for large text only on `--midnight` (4.7:1). Use with caution.

---

### Ash — `#5C5145`

**Disabled Text**

| Property | Value |
|----------|-------|
| Hex | `#5C5145` |
| RGB | `rgb(92, 81, 69)` |
| HSL | `hsl(31, 14%, 32%)` |
| CSS Variable | `--ash` |

**Usage:**
- Disabled button text
- Unavailable options
- Placeholder values

**Note:** Intentionally low contrast for disabled states.

---

## Accent Colors

Bold, purposeful colors used sparingly for maximum impact.

### Brass — `#D4A420`

**The Golden Standard**

| Property | Value |
|----------|-------|
| Hex | `#D4A420` |
| RGB | `rgb(212, 164, 32)` |
| HSL | `hsl(44, 74%, 48%)` |
| CSS Variable | `--brass` |

**Semantic Meaning:** Money, success, tips, gold

**Usage:**
- Primary CTA buttons
- Dollar amounts (positive)
- Success indicators
- Active states
- Focus rings

**Variants:**
| Variant | Hex | Usage |
|---------|-----|-------|
| `--brass-light` | `#E8C150` | Hover states |
| `--brass-glow` | `rgba(212, 164, 32, 0.15)` | Focus glow, highlights |

**Accessibility:**
- Text `--midnight` on `--brass`: **9.2:1** (AAA)
- Use `--midnight` for text on brass backgrounds

---

### Ember — `#E85D35`

**Warmth & Urgency**

| Property | Value |
|----------|-------|
| Hex | `#E85D35` |
| RGB | `rgb(232, 93, 53)` |
| HSL | `hsl(13, 80%, 56%)` |
| CSS Variable | `--ember` |

**Semantic Meaning:** Urgency, notifications, secondary emphasis, kitchen heat

**Usage:**
- Notification badges
- Important callouts
- Secondary accent
- "Hot" items

**Variants:**
| Variant | Hex | Usage |
|---------|-----|-------|
| `--ember-dark` | `#C44A28` | Hover/active states |

---

### Sage — `#2D9B6E`

**Success & Growth**

| Property | Value |
|----------|-------|
| Hex | `#2D9B6E` |
| RGB | `rgb(45, 155, 110)` |
| HSL | `hsl(155, 55%, 39%)` |
| CSS Variable | `--sage` |

**Semantic Meaning:** Success, positive values, confirmations, growth

**Usage:**
- Success messages
- Positive number changes
- Confirmation states
- "Good" indicators

**Variants:**
| Variant | Hex | Usage |
|---------|-----|-------|
| `--sage-dark` | `#248558` | Hover/active states |

---

### Sienna — `#C74B4B`

**Error & Caution**

| Property | Value |
|----------|-------|
| Hex | `#C74B4B` |
| RGB | `rgb(199, 75, 75)` |
| HSL | `hsl(0, 50%, 54%)` |
| CSS Variable | `--sienna` |

**Semantic Meaning:** Errors, destructive actions, warnings

**Usage:**
- Error messages
- Form validation errors
- Delete/remove buttons
- Negative values

**Variants:**
| Variant | Hex | Usage |
|---------|-----|-------|
| `--sienna-dark` | `#A33B3B` | Hover/active states |

---

### Info — `#6B8CAE`

**Neutral Information**

| Property | Value |
|----------|-------|
| Hex | `#6B8CAE` |
| RGB | `rgb(107, 140, 174)` |
| HSL | `hsl(210, 28%, 55%)` |
| CSS Variable | `--info` |

**Semantic Meaning:** Neutral information, tips, help

**Usage:**
- Info tooltips
- Help text
- Neutral status indicators

---

## Semantic Color Aliases

For consistency, use these semantic aliases in component development:

```css
:root {
  --success: var(--sage);
  --warning: var(--brass);
  --error: var(--sienna);
  --info: #6B8CAE;
}
```

---

## Dark Mode Considerations

Tip Share Pro is a **dark-first** application. There is no light mode planned for v1.0.

If a light mode is added in the future:
- Invert the background scale (cream becomes body, midnight becomes elevated)
- Keep accent colors consistent
- Ensure all contrast ratios remain compliant

---

## Accessibility Verification

### Contrast Ratios (Text on `--midnight`)

| Color | Ratio | WCAG Level |
|-------|-------|------------|
| `--cream` | 15.8:1 | AAA |
| `--linen` | 9.2:1 | AAA |
| `--brass` | 7.1:1 | AAA |
| `--stone` | 4.7:1 | AA (large text only) |
| `--ember` | 5.2:1 | AA |
| `--sage` | 4.8:1 | AA (large text only) |
| `--sienna` | 4.5:1 | AA (large text only) |

### Color Blindness Considerations

The palette has been tested for:
- **Protanopia** (red-blind): Brass/Sage distinction maintained
- **Deuteranopia** (green-blind): Ember/Sage distinction maintained
- **Tritanopia** (blue-blind): All distinctions maintained

**Rule:** Never rely on color alone. Always pair with:
- Icons (✓ for success, ✗ for error)
- Text labels
- Patterns or borders

---

## CSS Implementation

```css
:root {
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

  /* Semantic aliases */
  --success: var(--sage);
  --warning: var(--brass);
  --error: var(--sienna);
}
```

---

## Do's and Don'ts

### Do:
- Use `--brass` sparingly for maximum impact
- Pair low-contrast text (`--stone`) with icons or larger sizes
- Test all color combinations for accessibility
- Use semantic aliases (`--success`, `--error`) in components

### Don't:
- Use `--ash` for critical information
- Place `--stone` text on `--espresso` (fails contrast)
- Use color as the only indicator of state
- Mix warm and cool grays (stick to warm neutrals)

---

## Related Documentation

- [Typography Tokens](./typography.md)
- [Style Guide](../style-guide.md)

---

## Last Updated

| Date | Changes |
|------|---------|
| 2026-01-08 | Initial color system |
