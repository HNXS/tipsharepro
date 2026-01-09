---
title: Tip Share Pro Design System
description: Complete design documentation for the Tip Share Pro restaurant tip pooling platform
last-updated: 2026-01-08
version: 1.0.0
status: approved
---

# Tip Share Pro Design System

## The "After Hours" Aesthetic

> *"It's 11:47 PM. The last table just left. The kitchen is winding down, but in the back office, under warm amber light, the real work of the restaurant begins—counting the night's take, calculating who gets what, making sure everyone gets their fair share."*

This design system captures that intimate, honest moment when restaurant people do the real work of the business. It's warm but serious, approachable but professional, distinctly human in an industry built on human connection.

---

## Design Philosophy

### The Inspiration

**The Back of House**
Every restaurant has two faces: the polished front-of-house where guests dine, and the honest, no-nonsense back-of-house where the real work happens. Our design embraces the BOH aesthetic—functional, warm, unpretentious, and built for people who work with their hands.

**The Late Night Tip Count**
There's a specific moment in every restaurant—after close, when the team gathers to divide tips. It happens under warm lighting, often on worn surfaces, with the intimacy of people who've worked hard together. This is the emotional core of our design.

**The Green Eyeshade**
Classic accountancy meets hospitality. The precision of financial calculation delivered with the warmth of restaurant culture. Think brass banker's lamps, leather-bound ledgers, and the satisfying click of an old cash register.

### Design Principles

1. **Warm Professionalism** — Financial precision wrapped in hospitality warmth
2. **Honest Utility** — Every element earns its place; nothing decorative without function
3. **Respectful Density** — Restaurant people are busy; information should be scannable
4. **Tactile Digital** — Interfaces that feel physical: paper textures, stamped numbers, tangible feedback
5. **Night-Shift Friendly** — Dark theme by default, easy on tired eyes at 1 AM

---

## Quick Navigation

### Design System Foundation
- [Style Guide](./design-system/style-guide.md) — Complete visual language
- [Color Tokens](./design-system/tokens/colors.md) — The "Amber Hour" palette
- [Typography](./design-system/tokens/typography.md) — Fraunces + JetBrains Mono system
- [Spacing & Layout](./design-system/tokens/spacing.md) — 6px base unit system
- [Motion & Animation](./design-system/tokens/animations.md) — "Cash Flow" animation library

### Components
- [Buttons](./design-system/components/buttons.md) — Primary actions and variants
- [Forms](./design-system/components/forms.md) — Data entry components
- [Tables](./design-system/components/tables.md) — Financial data display
- [Cards](./design-system/components/cards.md) — Container components
- [Navigation](./design-system/components/navigation.md) — Wayfinding elements

### Feature Specifications
- [Tip Calculation Engine](./features/tip-calculation/README.md)
- [Daily Entry](./features/daily-entry/README.md)
- [Pool Distribution](./features/pool-distribution/README.md)
- [Settings & Configuration](./features/settings/README.md)

### Accessibility
- [Accessibility Guidelines](./accessibility/guidelines.md)

---

## The Palette at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   BACKGROUNDS                        ACCENTS                   │
│   ━━━━━━━━━━━                        ━━━━━━━                   │
│   ████ #0C0A07 Midnight              ████ #D4A420 Brass        │
│   ████ #1A1510 Espresso              ████ #E85D35 Ember        │
│   ████ #2A2318 Mahogany              ████ #2D9B6E Sage         │
│                                      ████ #C74B4B Sienna       │
│   TEXT                                                         │
│   ━━━━                                                         │
│   ████ #F7F3EA Cream                                           │
│   ████ #C4B9A4 Linen                                           │
│   ████ #8B7B65 Stone                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Typography Preview

**Headings: Fraunces**
A "wonky" serif with optical adjustments that give it a handcrafted, warm character. Like signage from a beloved neighborhood restaurant.

**Body: Newsreader**
An elegant, readable serif designed for long-form text. Professional without being cold—like a well-written menu.

**Numbers & Data: JetBrains Mono**
Tabular figures, clear distinction between similar characters (0/O, 1/l), optimized for financial data at a glance.

---

## File Structure

```
/design-documentation/
├── README.md                          ← You are here
├── design-system/
│   ├── README.md
│   ├── style-guide.md
│   ├── components/
│   │   ├── README.md
│   │   ├── buttons.md
│   │   ├── forms.md
│   │   ├── tables.md
│   │   ├── cards.md
│   │   ├── navigation.md
│   │   └── modals.md
│   ├── tokens/
│   │   ├── README.md
│   │   ├── colors.md
│   │   ├── typography.md
│   │   ├── spacing.md
│   │   └── animations.md
│   └── platform-adaptations/
│       ├── README.md
│       └── web.md
├── features/
│   ├── tip-calculation/
│   ├── daily-entry/
│   ├── pool-distribution/
│   └── settings/
├── accessibility/
│   ├── README.md
│   └── guidelines.md
└── assets/
    └── design-tokens.json
```

---

## Implementation Notes for Developers

### CSS Custom Properties
All design tokens are implemented as CSS custom properties for runtime theming and consistency:

```css
:root {
  /* Colors */
  --color-midnight: #0C0A07;
  --color-brass: #D4A420;

  /* Typography */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Newsreader', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing (6px base) */
  --space-1: 6px;
  --space-2: 12px;
  --space-3: 18px;
  /* ... */
}
```

### Font Loading Strategy
Use `font-display: swap` with preloaded critical fonts:
```html
<link rel="preload" href="/fonts/fraunces-var.woff2" as="font" crossorigin>
<link rel="preload" href="/fonts/jetbrains-mono.woff2" as="font" crossorigin>
```

### Animation Performance
All animations use `transform` and `opacity` only. Hardware acceleration enabled via `will-change` on animated elements.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial design system release |

---

*"Fair share, every time."*
