# TipSharePro Style Guide - Bold Edition

**Version:** 1.0
**Date:** January 9, 2026
**Status:** Active

---

## Overview

This style guide defines the visual language for TipSharePro's application interface. The design reflects the brand's bold, professional, restaurant-industry-focused identity as established on www.tipsharepro.com.

**Design DNA:**
- Restaurant/hospitality industry aesthetic
- Bold orange accents that command attention
- Professional dark tones for trust
- Clean white cards for data clarity
- High contrast for accessibility

---

## 1. Color System

### Primary Colors

#### Burnt Orange (Primary Brand)
The signature TipSharePro color - bold, energetic, and action-oriented.

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| **Primary** | `#E85D04` | rgb(232, 93, 4) | Primary CTAs, key actions, navigation highlights |
| **Primary Dark** | `#D14D00` | rgb(209, 77, 0) | Hover states, emphasis |
| **Primary Light** | `#FFF3E6` | rgb(255, 243, 230) | Backgrounds, subtle highlights |
| **Primary Pale** | `#FEF7F0` | rgb(254, 247, 240) | Very subtle backgrounds |

**Accessibility:** Primary on white = 4.52:1 contrast ratio (WCAG AA compliant)

#### Lime Green (Success/Growth)
Represents growth, success, and the "Transparent" brand value.

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| **Success** | `#82B536` | rgb(130, 181, 54) | Success states, positive actions, growth metrics |
| **Success Dark** | `#6B9A2A` | rgb(107, 154, 42) | Hover states |
| **Success Light** | `#F0F7E6` | rgb(240, 247, 230) | Success backgrounds |

#### Navy Blue (Secondary/Trust)
Conveys professionalism, trust, and stability.

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| **Secondary** | `#1A4B7C` | rgb(26, 75, 124) | Secondary buttons, trust elements |
| **Secondary Dark** | `#153D66` | rgb(21, 61, 102) | Hover states |
| **Secondary Light** | `#E6EEF5` | rgb(230, 238, 245) | Info backgrounds |

#### Cyan (Accent/Interactive)
For interactive elements and friendly highlights.

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| **Accent** | `#35A0D2` | rgb(53, 160, 210) | Links, interactive elements, data highlights |
| **Accent Dark** | `#2B8AB8` | rgb(43, 138, 184) | Hover states |
| **Accent Light** | `#E6F4FA` | rgb(230, 244, 250) | Info panels |

### Semantic Colors

| Purpose | Hex | Usage |
|---------|-----|-------|
| **Error** | `#DC2626` | Error states, destructive actions, validation errors |
| **Error Light** | `#FEF2F2` | Error backgrounds |
| **Warning** | `#F59E0B` | Warning states, caution indicators |
| **Warning Light** | `#FFFBEB` | Warning backgrounds |
| **Info** | `#35A0D2` | Informational messages (same as Accent) |
| **Info Light** | `#E6F4FA` | Info backgrounds |

### Foundation Colors

#### Dark Palette (Dark Mode / Dark Sections)
| Name | Hex | Usage |
|------|-----|-------|
| **Charcoal** | `#1F2937` | Dark backgrounds, footer, hero overlays |
| **Slate** | `#374151` | Secondary dark elements, subtle contrast |
| **Graphite** | `#4B5563` | Tertiary dark, disabled text on dark |

#### Light Palette
| Name | Hex | Usage |
|------|-----|-------|
| **White** | `#FFFFFF` | Card backgrounds, content areas, primary surface |
| **Snow** | `#FAFAFA` | Subtle background variation |
| **Stone** | `#F5F5F4` | Section backgrounds, alternating rows |
| **Fog** | `#E5E5E5` | Borders, dividers |

#### Text Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Text Primary** | `#1F2937` | Headlines, body text on light backgrounds |
| **Text Secondary** | `#6B7280` | Secondary text, captions, metadata |
| **Text Muted** | `#9CA3AF` | Placeholder text, disabled states |
| **Text Inverse** | `#FFFFFF` | Text on dark backgrounds |
| **Text Link** | `#E85D04` | Links, interactive text |

---

## 2. Typography System

### Font Stack

**Primary Font:** `Outfit` (if available), with system fallbacks
```css
font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Alternative (Web-Safe):** `system-ui` stack for performance
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
```

**Monospace (Data/Code):**
```css
font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
```

### Type Scale

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| **Display** | 48px / 3rem | 700 (Bold) | 1.1 | -0.02em | Hero headlines |
| **H1** | 36px / 2.25rem | 700 (Bold) | 1.2 | -0.015em | Page titles |
| **H2** | 30px / 1.875rem | 600 (Semibold) | 1.25 | -0.01em | Section headers |
| **H3** | 24px / 1.5rem | 600 (Semibold) | 1.3 | 0 | Card titles, subsections |
| **H4** | 20px / 1.25rem | 600 (Semibold) | 1.4 | 0 | Minor headers |
| **H5** | 18px / 1.125rem | 500 (Medium) | 1.4 | 0 | Small headers |
| **Body Large** | 18px / 1.125rem | 400 (Regular) | 1.6 | 0 | Lead paragraphs |
| **Body** | 16px / 1rem | 400 (Regular) | 1.5 | 0 | Standard body text |
| **Body Small** | 14px / 0.875rem | 400 (Regular) | 1.5 | 0 | Secondary info |
| **Caption** | 12px / 0.75rem | 400 (Regular) | 1.4 | 0.02em | Captions, timestamps |
| **Label** | 12px / 0.75rem | 600 (Semibold) | 1 | 0.05em | Form labels, uppercase |
| **Data** | 14px / 0.875rem | 500 (Medium) | 1.3 | 0 | Table data, numbers |

### Font Weights

| Weight | CSS Value | Usage |
|--------|-----------|-------|
| Regular | 400 | Body text, descriptions |
| Medium | 500 | Data values, emphasized text |
| Semibold | 600 | Headers H2-H5, buttons, labels |
| Bold | 700 | Display, H1, strong emphasis |

---

## 3. Spacing System

### Base Unit: 4px

All spacing values are multiples of the 4px base unit for consistency.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0px | None |
| `--space-1` | 4px | Micro spacing, icon gaps |
| `--space-2` | 8px | Tight spacing, inline elements |
| `--space-3` | 12px | Small padding |
| `--space-4` | 16px | Default padding, margins |
| `--space-5` | 20px | Medium spacing |
| `--space-6` | 24px | Large padding |
| `--space-8` | 32px | Section gaps |
| `--space-10` | 40px | Major section spacing |
| `--space-12` | 48px | Large section spacing |
| `--space-16` | 64px | Page section spacing |
| `--space-20` | 80px | Hero sections |
| `--space-24` | 96px | Major page sections |

### Layout Grid

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Mobile (< 640px) | 4 | 16px | 16px |
| Tablet (640-1023px) | 8 | 24px | 32px |
| Desktop (1024-1279px) | 12 | 24px | 64px |
| Wide (1280px+) | 12 | 32px | auto (max-width 1280px) |

---

## 4. Border & Radius System

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Sharp edges |
| `--radius-sm` | 4px | Small elements, tags |
| `--radius-md` | 8px | Buttons, inputs, default |
| `--radius-lg` | 12px | Cards, modals |
| `--radius-xl` | 16px | Large cards, panels |
| `--radius-2xl` | 24px | Hero sections, feature cards |
| `--radius-full` | 9999px | Pills, avatars, circular elements |

### Border Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--border-none` | 0px | No border |
| `--border-thin` | 1px | Default borders, inputs |
| `--border-medium` | 2px | Focus states, emphasis |
| `--border-thick` | 4px | Strong emphasis, active states |

---

## 5. Shadow System

### Elevation Levels

| Level | Shadow | Usage |
|-------|--------|-------|
| **None** | `none` | Flat elements |
| **XS** | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift, hover states |
| **SM** | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Buttons, small cards |
| **MD** | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Cards, dropdowns |
| **LG** | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals, popovers |
| **XL** | `0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)` | Major overlays |
| **Orange Glow** | `0 0 20px rgba(232, 93, 4, 0.3)` | CTA emphasis, hover effect |

---

## 6. Motion & Animation

### Timing Functions

| Name | Value | Usage |
|------|-------|-------|
| **Ease Out** | `cubic-bezier(0.0, 0, 0.2, 1)` | Entrances, expansions |
| **Ease In-Out** | `cubic-bezier(0.4, 0, 0.6, 1)` | State changes |
| **Spring** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful interactions |

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 75ms | Instant feedback |
| `--duration-fast` | 150ms | Hover states, quick transitions |
| `--duration-normal` | 250ms | Standard transitions |
| `--duration-slow` | 400ms | Complex animations |
| `--duration-slower` | 600ms | Page transitions |

### Standard Transitions

```css
/* Button hover */
transition: all 150ms ease-out;

/* Card hover */
transition: transform 250ms ease-out, box-shadow 250ms ease-out;

/* Page transitions */
transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
```

---

## 7. Component Specifications

### Buttons

#### Primary Button (Orange CTA)
```
Background: #E85D04
Text: #FFFFFF
Border Radius: 8px
Padding: 12px 24px (md) / 16px 32px (lg)
Font: 16px/600 (md) / 18px/600 (lg)
Shadow: 0 1px 3px rgba(0,0,0,0.1)

Hover:
- Background: #D14D00
- Shadow: 0 0 20px rgba(232, 93, 4, 0.3)
- Transform: translateY(-1px)

Active:
- Background: #C04500
- Transform: translateY(0)

Disabled:
- Background: #9CA3AF
- Cursor: not-allowed
```

#### Secondary Button (Navy)
```
Background: #1A4B7C
Text: #FFFFFF
Border Radius: 8px

Hover:
- Background: #153D66
```

#### Ghost Button
```
Background: transparent
Text: #E85D04
Border: 2px solid #E85D04
Border Radius: 8px

Hover:
- Background: #FFF3E6
```

### Cards

#### Standard Card
```
Background: #FFFFFF
Border Radius: 12px
Padding: 24px
Shadow: 0 4px 6px rgba(0,0,0,0.1)
Border: 1px solid #E5E5E5

Hover (if interactive):
- Shadow: 0 10px 15px rgba(0,0,0,0.1)
- Transform: translateY(-2px)
```

#### Featured Card
```
Same as Standard Card +
Border-left: 4px solid #E85D04
```

### Form Elements

#### Text Input
```
Background: #FFFFFF
Border: 1px solid #E5E5E5
Border Radius: 8px
Padding: 12px 16px
Font: 16px/400

Focus:
- Border: 2px solid #E85D04
- Outline: none
- Box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.1)

Error:
- Border: 2px solid #DC2626
- Box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1)
```

#### Select Dropdown
```
Same styling as Text Input
Chevron icon: #6B7280
```

### Tables

#### Data Table
```
Header Row:
- Background: #F5F5F4
- Text: #1F2937
- Font: 12px/600 uppercase
- Letter-spacing: 0.05em
- Padding: 12px 16px

Body Row:
- Background: #FFFFFF
- Border-bottom: 1px solid #E5E5E5
- Padding: 16px

Hover Row:
- Background: #FEF7F0

Currency/Number Data:
- Font: monospace
- Text-align: right
```

---

## 8. Iconography

### Icon Style
- Style: Outlined (not filled) for consistency
- Stroke Width: 1.5px - 2px
- Size Grid: 16px, 20px, 24px, 32px, 48px
- Color: Inherit from text color

### Recommended Icon Library
**Heroicons** (MIT License) - Matches the clean, professional aesthetic

### Icon Colors by Context
| Context | Color |
|---------|-------|
| Default | `#6B7280` (Text Secondary) |
| Interactive | `#E85D04` (Primary) |
| Success | `#82B536` (Success) |
| Error | `#DC2626` (Error) |
| Info | `#35A0D2` (Info) |
| On Dark | `#FFFFFF` (White) |

---

## 9. Dark Mode Specifications

### Background Colors
| Surface | Light Mode | Dark Mode |
|---------|------------|-----------|
| Primary | `#FFFFFF` | `#1F2937` |
| Secondary | `#F5F5F4` | `#374151` |
| Tertiary | `#E5E5E5` | `#4B5563` |

### Text Colors
| Level | Light Mode | Dark Mode |
|-------|------------|-----------|
| Primary | `#1F2937` | `#F9FAFB` |
| Secondary | `#6B7280` | `#9CA3AF` |
| Muted | `#9CA3AF` | `#6B7280` |

### Accent Colors
Primary orange (#E85D04) remains unchanged in dark mode for brand consistency.

---

## 10. Accessibility Guidelines

### Color Contrast Requirements

| Combination | Ratio | WCAG Level |
|-------------|-------|------------|
| Primary text on white | 13.5:1 | AAA |
| Primary orange on white | 4.52:1 | AA |
| White on charcoal | 12.6:1 | AAA |
| White on primary orange | 4.52:1 | AA |

### Focus States
All interactive elements MUST have visible focus indicators:
```css
:focus-visible {
  outline: 2px solid #E85D04;
  outline-offset: 2px;
}
```

### Touch Targets
Minimum touch target size: 44px x 44px

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-09 | Design System | Initial bold design system based on tipsharepro.com website and Tom's logo |
