# Badge Components - Final Edition

**Version:** 1.1
**Date:** January 15, 2026
**Status:** Active - **UPDATED with Color-Coded Category System**

---

## Badge Philosophy

Badges provide quick visual identification. In TipSharePro, they're primarily used for:
- **Job categories** (5 color-coded categories)
- Status indicators
- Counts and notifications

> "The inclusion of colors is actually a great idea. It makes category identification easy to see on the posted transparency report and it simplifies choosing weights."
> — Tom LaChaussee (January 11, 2026)

---

## Job Category Badges (5 Colors) - FINALIZED

Each **category** (not individual job) has a distinct, bold background color. A **color key** appears at the bottom of the Distribution Table.

### Visual Specification

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  JOB CATEGORY BADGES (5 Colors)                                │
│                                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│  │   BOH    │ │   FOH    │ │   BAR    │                       │
│  │  Orange  │ │  Violet  │ │   Cyan   │                       │
│  └──────────┘ └──────────┘ └──────────┘                       │
│                                                                │
│  ┌──────────┐ ┌──────────┐                                    │
│  │ SUPPORT  │ │  CUSTOM  │                                    │
│  │Lime Green│ │  Yellow  │                                    │
│  └──────────┘ └──────────┘                                    │
│                                                                │
│  ─────────────────────────────────────                        │
│  COLOR KEY (appears at bottom of Distribution Table)          │
│  🟠 BOH (Kitchen)  🟣 FOH (Non Tipped)  🔵 Bar                │
│  🟢 Support        🟡 Custom (Big Leagues)                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5 Category Colors (FINALIZED by Tom)

| Color | Category | Default Title | Example Job Titles |
|-------|----------|---------------|-------------------|
| **Orange** `#E85D04` | BOH (Kitchen) | Kitchen | Lead Cook, Line Cook, Pastry Chef, Pantry Chef |
| **Violet** `#8E44AD` | FOH (Non Tipped) | Front of House | Host/Hostess, Busser, Cashier, Runner |
| **Cyan** `#35A0D2` | Bar | Bar | Bartender, Barista, or custom (Clam Shuckers) |
| **Lime Green** `#82B536` | Support (FOH or BOH) | Support | Dishwasher, Prep Cook, Bar Back |
| **Yellow** `#F1C40F` | Custom (Big Leagues) | Custom | Banquet Chef, Maitre D, Sommelier |

### Category Badge Text Colors

| Background | Text Color | Contrast |
|------------|------------|----------|
| Orange `#E85D04` | `#0C0A07` (Midnight) | 5.9:1 ✓ |
| Violet `#8E44AD` | `#F7F3EA` (Cream) | 5.2:1 ✓ |
| Cyan `#35A0D2` | `#0C0A07` (Midnight) | 6.4:1 ✓ |
| Lime Green `#82B536` | `#0C0A07` (Midnight) | 5.8:1 ✓ |
| Yellow `#F1C40F` | `#0C0A07` (Midnight) | 10.2:1 ✓ |

### Category Assignment Rules

- **5 write-in categories** available for custom titles
- Assign custom titles to any color, or use suggested defaults
- Don't use all colors if you don't need them (save for expansion)
- More categories than colors? Combine something (5 colors max)
- **Color key** provided at bottom of Distribution Table

### Specifications

| Property | Value |
|----------|-------|
| Height | 24px |
| Padding | 4px 12px |
| Border Radius | 4px (`--radius-sm`) |
| Font Size | 12px |
| Font Weight | 600 |
| Text Transform | Uppercase |
| Letter Spacing | 0.05em |

### CSS

```css
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-family: var(--font-primary);
  font-size: 0.75rem;
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  white-space: nowrap;
}

/* ====================================
   5 JOB CATEGORY COLORS (FINALIZED)
   ==================================== */

/* BOH (Kitchen) - Orange */
.badge-boh,
.badge-kitchen {
  background: #E85D04;
  color: var(--color-midnight);
}

/* FOH (Non Tipped) - Violet */
.badge-foh,
.badge-front-of-house {
  background: #8E44AD;
  color: var(--color-cream);
}

/* Bar - Cyan */
.badge-bar {
  background: #35A0D2;
  color: var(--color-midnight);
}

/* Support (FOH or BOH) - Lime Green */
.badge-support {
  background: #82B536;
  color: var(--color-midnight);
}

/* Custom (Big Leagues) - Yellow */
.badge-custom,
.badge-big-leagues {
  background: #F1C40F;
  color: var(--color-midnight);
}

/* CSS Custom Properties for Category Colors */
:root {
  --badge-boh: #E85D04;
  --badge-foh: #8E44AD;
  --badge-bar: #35A0D2;
  --badge-support: #82B536;
  --badge-custom: #F1C40F;
}
```

### Color Key Component

The color key appears at the bottom of the Distribution Table:

```css
.category-color-key {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  margin-top: var(--space-4);
}

.color-key-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.color-key-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
}

.color-key-dot.boh { background: var(--badge-boh); }
.color-key-dot.foh { background: var(--badge-foh); }
.color-key-dot.bar { background: var(--badge-bar); }
.color-key-dot.support { background: var(--badge-support); }
.color-key-dot.custom { background: var(--badge-custom); }
```

```html
<!-- Example Color Key -->
<div class="category-color-key">
  <div class="color-key-item">
    <span class="color-key-dot boh"></span>
    <span>BOH (Kitchen)</span>
  </div>
  <div class="color-key-item">
    <span class="color-key-dot foh"></span>
    <span>FOH (Non Tipped)</span>
  </div>
  <div class="color-key-item">
    <span class="color-key-dot bar"></span>
    <span>Bar</span>
  </div>
  <div class="color-key-item">
    <span class="color-key-dot support"></span>
    <span>Support</span>
  </div>
  <div class="color-key-item">
    <span class="color-key-dot custom"></span>
    <span>Custom (Big Leagues)</span>
  </div>
</div>
```

---

## Status Badges

For indicating states (active, pending, completed).

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  STATUS BADGES                                                 │
│                                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  ACTIVE  │ │  PENDING │ │ COMPLETED│ │  ERROR   │          │
│  │  Green   │ │  Orange  │ │   Cyan   │ │   Red    │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

```css
.badge-active {
  background: var(--color-success);
  color: var(--color-midnight);
}

.badge-pending {
  background: var(--color-warning);
  color: var(--color-midnight);
}

.badge-completed {
  background: var(--color-info);
  color: var(--color-midnight);
}

.badge-error {
  background: var(--color-error);
  color: var(--color-cream);
}
```

---

## Count Badges

For notification counts and quantities.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  COUNT BADGES                                                  │
│                                                                │
│  ┌─────┐  ┌─────┐  ┌─────┐                                    │
│  │  3  │  │ 12  │  │ 99+ │                                    │
│  └─────┘  └─────┘  └─────┘                                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

```css
.badge-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-midnight);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: var(--font-semibold);
}

.badge-count-secondary {
  background: var(--bg-elevated);
  color: var(--text-primary);
}
```

---

## Badge Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| Small | 20px | 2px 8px | 10px |
| Medium | 24px | 4px 12px | 12px |
| Large | 28px | 6px 14px | 14px |

```css
.badge-sm {
  height: 20px;
  padding: 2px 8px;
  font-size: 0.625rem;
}

.badge-md {
  height: 24px;
  padding: 4px 12px;
  font-size: 0.75rem;
}

.badge-lg {
  height: 28px;
  padding: 6px 14px;
  font-size: 0.875rem;
}
```

---

## Badge with Icon

```css
.badge-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-with-icon svg {
  width: 12px;
  height: 12px;
}
```

---

## Outline Badges

For subtle, secondary badges.

```css
.badge-outline {
  background: transparent;
  border: 1px solid currentColor;
}

.badge-outline-primary {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.badge-outline-success {
  color: var(--color-success);
  border-color: var(--color-success);
}
```

---

## Accessibility

- Badges should not be the only way to convey information
- Pair with text labels where possible
- Ensure sufficient contrast (4.5:1 minimum)
- Use aria-label for count badges: `aria-label="3 notifications"`

---

## Related Files

- [Colors](../tokens/colors.md)
- [Tables](./tables.md) — Badges in table rows
- [Typography](../tokens/typography.md)
