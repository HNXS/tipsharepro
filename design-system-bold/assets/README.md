# TipSharePro Design Assets

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This folder contains exportable design assets and reference images for TipSharePro.

---

## Contents

### design-tokens.json

Machine-readable design tokens in JSON format. Use this file to:

- Generate CSS custom properties
- Sync tokens to design tools (Figma, Sketch)
- Validate implementation against spec
- Automate token updates across platforms

**Token Categories:**
- Colors (brand, semantic, neutral, text, badge)
- Typography (font family, size, weight, line height, letter spacing)
- Spacing (4px-based scale)
- Border Radius
- Shadows
- Animation (duration, easing)
- Breakpoints
- Z-Index layers

### reference-images/

Logo files for use in documentation, mockups, and implementation.

| File | Description | Use Case |
|------|-------------|----------|
| `fulllogo.png` | Full logo with background | Headers, documents |
| `fulllogo_transparent.png` | Full logo, transparent bg | Web headers, overlays |
| `icononly_transparent_nobuffer.png` | Icon only, transparent | Favicons, app icons |
| `textonly.png` | Text only | Compact headers |

---

## Usage

### CSS Custom Properties

Generate CSS from design-tokens.json:

```css
:root {
  /* Colors */
  --color-primary: #E85D04;
  --color-secondary: #1A4B7C;
  --color-success: #82B536;
  --color-warning: #F59E0B;
  --color-error: #DC2626;

  /* Typography */
  --font-family-primary: 'Outfit', sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  /* ... etc */
}
```

### JavaScript/TypeScript

```javascript
import tokens from './design-tokens.json';

const primaryColor = tokens.colors.brand.primary.value;
// "#E85D04"

const spacing4 = tokens.spacing['4'].value;
// "1rem"
```

### Design Tool Integration

These tokens can be imported into:
- **Figma** - via Tokens Studio plugin
- **Sketch** - via Sketch Palettes
- **Style Dictionary** - for multi-platform generation

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial assets collection |
