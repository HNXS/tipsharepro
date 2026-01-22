# Card Components - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Active

---

## Card Philosophy

Cards are elevated surfaces that group related content. On our dark theme:
- Cards use `--bg-surface` to lift off the `--bg-body`
- Borders provide subtle definition
- Hover states indicate interactivity

---

## Base Card

### Visual Specification

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  DEFAULT CARD                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Card Title                                              │  │
│  │  Card content goes here. This is body text that          │  │
│  │  explains something important.                           │  │
│  │                                                          │  │
│  │  [Action Button]                                         │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  #1A1510 bg / #3D3225 border / 12px radius                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Specifications

| Property | Value |
|----------|-------|
| Background | `--bg-surface` (#1A1510) |
| Border | 1px solid `--bg-border` (#3D3225) |
| Border Radius | 12px (`--radius-lg`) |
| Padding | 24px (`--space-6`) |
| Shadow | None (use border for definition) |

### CSS

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.card-title {
  font-family: var(--font-primary);
  font-size: var(--text-h4);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.card-body {
  font-size: var(--text-body);
  color: var(--text-primary);
  line-height: var(--leading-relaxed);
}

.card-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--bg-border);
}
```

---

## Interactive Card

For clickable cards that navigate or expand.

```css
.card-interactive {
  cursor: pointer;
  transition: background-color var(--transition-fast),
              border-color var(--transition-fast);
}

.card-interactive:hover {
  background: var(--bg-elevated);
  border-color: var(--color-primary);
}

.card-interactive:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.card-interactive:active {
  transform: translateY(1px);
}
```

---

## Stat Card

For dashboard statistics.

### Visual Specification

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  STAT CARD                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Total Pool                                              │  │
│  │  $812.00                          ↑ 12.4%                │  │
│  │  from 10 contributors                                    │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### CSS

```css
.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.stat-card-label {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.stat-card-value {
  font-family: var(--font-mono);
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  line-height: 1;
}

.stat-card-change {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: var(--space-3);
  font-size: var(--text-body-sm);
}

.stat-card-change.positive {
  color: var(--color-success);
}

.stat-card-change.negative {
  color: var(--color-error);
}

.stat-card-meta {
  margin-top: var(--space-2);
  font-size: var(--text-caption);
  color: var(--text-tertiary);
}
```

---

## Settings Card

For grouped settings sections (like Step 1-5 in Demo).

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  SETTINGS CARD                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  STEP 1                                              ⓘ   │  │
│  │  ─────────────────────────────────────────────────────── │  │
│  │  Method for Contribution %                               │  │
│  │                                                          │  │
│  │  ☐ CC Sales   ☐ CC Tips   ☐ All Tips   ● All Sales      │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### CSS

```css
.settings-card {
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
}

.settings-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--bg-border);
}

.settings-card-step {
  font-size: var(--text-label);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-primary);
}

.settings-card-title {
  font-size: var(--text-h5);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.settings-card-content {
  /* Form elements go here */
}
```

---

## Card with Header

For cards with distinct header sections.

```css
.card-with-header {
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-5);
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--bg-border);
}

.card-header-title {
  font-size: var(--text-h5);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.card-header-action {
  /* Button or icon goes here */
}

.card-content {
  padding: var(--space-5);
}
```

---

## Disabled/Faded Card

For Demo tease of Full Version features.

```css
.card-disabled {
  background: var(--bg-surface);
  border: 1px dashed var(--bg-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  opacity: 0.5;
  pointer-events: none;
}

.card-disabled-overlay {
  position: relative;
}

.card-disabled-overlay::after {
  content: 'Available in Full Version';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: var(--space-2) var(--space-4);
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
}
```

---

## Card Grid

For arranging multiple cards.

```css
.card-grid {
  display: grid;
  gap: var(--space-4);
}

/* 2 columns on tablet+ */
@media (min-width: 768px) {
  .card-grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 3 columns on desktop+ */
@media (min-width: 1024px) {
  .card-grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 4 columns on wide screens */
@media (min-width: 1280px) {
  .card-grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## Accessibility

- Interactive cards should be buttons or links
- Use appropriate heading levels in cards
- Ensure focus is visible on interactive cards
- Cards with actions should have clear labels

---

## Related Files

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Buttons](./buttons.md)
