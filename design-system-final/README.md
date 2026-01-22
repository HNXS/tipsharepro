# TipSharePro Design System - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Active

---

## Design Philosophy

This design system combines two elements per Tom LaChaussee's directive:

1. **Dark "Amber Hour" Foundation** - The warm, moody, restaurant-after-hours aesthetic
2. **Bold Logo Colors** - The confident, not bashful brand colors

> "I liked that dark look on the first rendition. Unusual and not boring. I just wanted the contrasting colors to be bold. Let's combine those 2 elements."
> — Tom LaChaussee, January 15, 2026

---

## Key Principles

| Principle | Implementation |
|-----------|----------------|
| **Dark-First** | Rich, warm dark backgrounds (not pure black) |
| **Bold Accents** | Logo colors (Orange, Lime, Navy, Cyan) pop against dark |
| **No Pastels** | Every color has purpose and impact |
| **Unusual, Not Boring** | Distinctive, memorable aesthetic |
| **Restaurant Vibe** | Feels like brass fixtures and amber bulbs after-hours |

---

## Quick Reference

### Foundation Colors (Dark)
- **Midnight** `#0C0A07` - Body background
- **Espresso** `#1A1510` - Card backgrounds
- **Mahogany** `#2A2318` - Hover states
- **Walnut** `#3D3225` - Borders

### Text Colors (Warm)
- **Cream** `#F7F3EA` - Primary text
- **Linen** `#C4B9A4` - Secondary text
- **Stone** `#8B7B65` - Tertiary/helper

### Brand Accents (Bold)
- **Burnt Orange** `#E85D04` - Primary CTA
- **Lime Green** `#82B536` - Success
- **Navy Blue** `#1A4B7C` - Secondary actions
- **Cyan** `#35A0D2` - Links, info

---

## Design System Structure

```
design-system-final/
├── README.md                    # This file
├── design-system/
│   ├── style-guide.md          # Complete style guide
│   ├── tokens/
│   │   ├── colors.md           # Color palette (combined)
│   │   ├── typography.md       # Typography system
│   │   ├── spacing.md          # Spacing scale
│   │   └── animations.md       # Motion & transitions
│   ├── components/
│   │   ├── buttons.md          # Button specifications
│   │   ├── forms.md            # Form elements
│   │   ├── tables.md           # Data tables
│   │   ├── cards.md            # Card components
│   │   ├── badges.md           # Job role badges
│   │   ├── navigation.md       # Navigation patterns
│   │   ├── modals.md           # Dialogs & modals
│   │   └── help-system.md      # ?Note and !!Note patterns
│   ├── platform-adaptations/
│   │   └── web.md              # Web-specific guidelines
│   └── accessibility/
│       └── guidelines.md       # WCAG compliance
├── features/
│   └── demo-settings/
│       └── README.md           # Demo Settings Page spec
└── assets/
    └── design-tokens.css       # Exportable CSS variables
```

---

## Implementation Priority

Per Tom's directive: **"I want to see some buttons!"**

1. Build Demo Settings Page with real UI
2. Inline Distribution Preview
3. Printable Distribution Table
4. Faded Full Version controls as tease

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-15 | Combined Dark Amber Hour + Bold Logo Colors per Tom's direction |
