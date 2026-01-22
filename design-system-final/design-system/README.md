# TipSharePro Design System

**Version:** 1.0
**Date:** January 15, 2026

---

## Overview

This folder contains the complete design system for TipSharePro, combining the dark "Amber Hour" aesthetic with bold logo colors.

---

## Structure

```
design-system/
├── style-guide.md              # Quick reference for all tokens
├── tokens/
│   ├── colors.md               # Dark backgrounds + bold accents
│   ├── typography.md           # Outfit + JetBrains Mono
│   ├── spacing.md              # 4px base unit scale
│   └── animations.md           # Motion & timing
├── components/
│   ├── buttons.md              # Primary, secondary, ghost, danger
│   ├── forms.md                # Inputs, dropdowns, checkboxes
│   ├── tables.md               # Distribution & data tables
│   ├── cards.md                # Content containers
│   ├── badges.md               # Job role badges
│   ├── navigation.md           # Headers, tabs, breadcrumbs
│   ├── modals.md               # Dialogs & confirmations
│   └── help-system.md          # ?Note and !!Note patterns
├── platform-adaptations/
│   └── web.md                  # Web-specific guidelines
└── accessibility/
    └── guidelines.md           # WCAG compliance
```

---

## Quick Start

1. Import the CSS tokens: `@import 'assets/design-tokens.css'`
2. Reference the style guide for quick lookups
3. Use component specifications for detailed implementation

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **Dark-First** | All backgrounds use warm dark colors |
| **Bold Accents** | Logo colors (Orange, Green, Navy, Cyan) for emphasis |
| **No Pastels** | Every color has impact |
| **Warm Text** | Cream and linen tones, not pure white |
| **Monospace Numbers** | JetBrains Mono for all financial data |

---

## Related Files

- [Main README](../README.md)
- [Exportable CSS Tokens](../assets/design-tokens.css)
