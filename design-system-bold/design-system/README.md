# TipSharePro Design System - Bold Edition

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

The TipSharePro Design System is a comprehensive collection of design tokens, components, and patterns that ensure visual consistency across the application. Built on the principle of being **bold, not bashful**, it reflects the confident, professional nature of the restaurant industry.

> "Take a look at my Logo. Not bashful."
> — Tom LaChaussee

---

## Design Philosophy

### Core Principles

1. **Bold & Confident** - High-contrast colors that command attention
2. **Professional & Trustworthy** - Clean layouts suitable for financial data
3. **Accessible & Inclusive** - WCAG 2.1 AA compliant throughout
4. **Restaurant Industry Focused** - Aesthetics that resonate with hospitality professionals

### Brand Values

| Value | Expression |
|-------|------------|
| **POWERFUL** | Bold orange CTAs, strong visual hierarchy |
| **FAIR** | Transparent calculations, clear data presentation |
| **TRANSPARENT** | Lime green accents, honest communication |

---

## Quick Start

### Brand Colors

```css
--color-primary: #E85D04;      /* Burnt Orange - CTAs */
--color-success: #82B536;      /* Lime Green - Success */
--color-secondary: #1A4B7C;    /* Navy Blue - Trust */
--color-accent: #35A0D2;       /* Cyan - Interactive */
```

### Typography

```css
--font-primary: 'Outfit', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Key Components

- **Buttons** - Primary (orange), Secondary (navy), Ghost (outlined)
- **Forms** - Settings, data entry, login
- **Tables** - Distribution grids, YTD reports
- **Help System** - ?Note tooltips, !!Note critical modals

---

## Directory Structure

```
design-system/
├── README.md                 # This file
├── style-guide.md            # Complete style specifications
├── components/
│   ├── README.md             # Component library overview
│   ├── buttons.md            # Button variants and states
│   ├── forms.md              # Form elements and validation
│   ├── tables.md             # Data tables and grids
│   ├── navigation.md         # Navigation patterns
│   ├── cards.md              # Card components
│   ├── modals.md             # Dialogs and modals
│   ├── badges.md             # Job category badges
│   ├── alerts.md             # Notifications and toasts
│   └── help-system.md        # ?Note and !!Note patterns
├── tokens/
│   ├── README.md             # Design tokens overview
│   ├── colors.md             # Color palette
│   ├── typography.md         # Type system
│   ├── spacing.md            # Spacing scale
│   └── animations.md         # Motion specifications
└── platform-adaptations/
    ├── README.md             # Platform strategy
    └── web.md                # Web-specific guidelines
```

---

## Design Tokens

Design tokens are the atomic values that define the visual language:

| Category | Description | File |
|----------|-------------|------|
| **Colors** | Brand palette, semantic colors | `tokens/colors.md` |
| **Typography** | Font families, sizes, weights | `tokens/typography.md` |
| **Spacing** | 4px-based spacing scale | `tokens/spacing.md` |
| **Animations** | Timing, easing, transitions | `tokens/animations.md` |

---

## Components

Reusable UI components built on design tokens:

| Component | Description | Priority |
|-----------|-------------|----------|
| **Buttons** | Primary, secondary, ghost, danger | P0 |
| **Forms** | Inputs, selects, checkboxes, tabs | P0 |
| **Tables** | Distribution, daily grid, YTD | P0 |
| **Navigation** | Nav hub, tabs, breadcrumbs | P0 |
| **Modals** | Dialogs, confirmations, !!Notes | P0 |
| **Cards** | Stat cards, info cards | P1 |
| **Badges** | Job category indicators | P1 |
| **Alerts** | Toasts, notifications | P1 |
| **Help System** | ?Note tooltips, !!Note modals | P0 |

---

## Accessibility

All components meet WCAG 2.1 AA standards:

- **Color Contrast** - 4.5:1 minimum for text
- **Focus States** - Visible keyboard focus indicators
- **ARIA Labels** - Proper semantic markup
- **Keyboard Navigation** - Full keyboard support

See `../accessibility/` for detailed guidelines.

---

## Usage Guidelines

### DO
- Use Primary Orange for main CTAs (one per section)
- Maintain consistent spacing using the 4px grid
- Include loading states for async operations
- Provide clear error feedback with red indicators

### DON'T
- Don't use more than 3 brand colors in a single view
- Don't create new colors outside the defined palette
- Don't disable buttons without explanation
- Don't hide the Basis calculation (proprietary)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial design system structure |
