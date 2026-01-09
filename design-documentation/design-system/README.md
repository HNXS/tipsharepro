---
title: Design System Overview
description: Core design system documentation for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
status: approved
---

# Tip Share Pro Design System

## Overview

This design system defines the visual language, components, and patterns for the Tip Share Pro application—a restaurant tip pooling platform built with the "Amber Hour" aesthetic.

---

## Philosophy

Our design system is built on five core principles:

1. **Warm Professionalism** — Financial precision wrapped in hospitality warmth
2. **Honest Utility** — Every element earns its place; nothing decorative without function
3. **Respectful Density** — Restaurant people are busy; information should be scannable
4. **Tactile Digital** — Interfaces that feel physical: paper textures, stamped numbers, tangible feedback
5. **Night-Shift Friendly** — Dark theme by default, easy on tired eyes at 1 AM

---

## Structure

### Design Tokens
The atomic values that form the foundation of our visual language.

| Token Category | File | Description |
|----------------|------|-------------|
| [Colors](./tokens/colors.md) | `colors.md` | The "Amber Hour" palette |
| [Typography](./tokens/typography.md) | `typography.md` | Fraunces, Newsreader & JetBrains Mono |
| [Spacing](./tokens/spacing.md) | `spacing.md` | 6px base unit system |
| [Animations](./tokens/animations.md) | `animations.md` | "Cash Flow" motion library |

→ [Tokens Overview](./tokens/README.md)

### Components
Reusable UI building blocks built from our tokens.

| Component | File | Description |
|-----------|------|-------------|
| [Buttons](./components/buttons.md) | `buttons.md` | Primary, secondary, and utility actions |
| [Forms](./components/forms.md) | `forms.md` | Inputs, selects, and form layouts |
| [Tables](./components/tables.md) | `tables.md` | Financial data display |
| [Cards](./components/cards.md) | `cards.md` | Container and content components |
| [Navigation](./components/navigation.md) | `navigation.md` | Wayfinding elements |
| [Modals](./components/modals.md) | `modals.md` | Dialogs and overlays |

→ [Components Overview](./components/README.md)

### Platform Adaptations
Platform-specific guidelines and modifications.

| Platform | File | Description |
|----------|------|-------------|
| [Web](./platform-adaptations/web.md) | `web.md` | Browser-based implementation |

→ [Platform Adaptations Overview](./platform-adaptations/README.md)

---

## Quick Start

### For Designers

1. Review the [Style Guide](./style-guide.md) for the complete visual language
2. Familiarize yourself with the [Color Tokens](./tokens/colors.md)
3. Use the [Typography](./tokens/typography.md) specifications for all text
4. Reference [Components](./components/README.md) for UI patterns

### For Developers

1. Import design tokens from `assets/design-tokens.json`
2. Set up CSS custom properties from the [Style Guide](./style-guide.md)
3. Load fonts per the [Typography](./tokens/typography.md) guide
4. Implement components following the specifications

### CSS Custom Properties

```css
:root {
  /* Colors */
  --midnight: #0C0A07;
  --brass: #D4A420;
  --cream: #F7F3EA;

  /* Typography */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Newsreader', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing (6px base) */
  --space-1: 6px;
  --space-2: 12px;
  --space-3: 18px;
  --space-4: 24px;
}
```

---

## Key Visual Elements

### The "Amber Hour" Palette

```
BACKGROUNDS                    ACCENTS
━━━━━━━━━━━                    ━━━━━━━
████ #0C0A07 Midnight          ████ #D4A420 Brass
████ #1A1510 Espresso          ████ #E85D35 Ember
████ #2A2318 Mahogany          ████ #2D9B6E Sage
████ #3D3225 Walnut            ████ #C74B4B Sienna
```

### Typography Stack

- **Display/Headings:** Fraunces (variable, wonky serif)
- **Body:** Newsreader (readable, warm serif)
- **Data/Numbers:** JetBrains Mono (tabular figures)

### Spacing System

6px base unit creating the scale: 6, 12, 18, 24, 30, 36, 48, 60, 72px

---

## Related Documentation

- [Main README](../README.md) — Project overview
- [Style Guide](./style-guide.md) — Complete visual specifications
- [Accessibility Guidelines](../accessibility/guidelines.md) — A11y requirements

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial design system |

---

*"Fair share, every time."*
