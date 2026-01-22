# Design Tokens

Design tokens are the atomic values that make up the design system. They ensure consistency across all components and screens.

---

## Token Categories

| File | Description |
|------|-------------|
| [colors.md](./colors.md) | Dark backgrounds, warm text, bold brand accents |
| [typography.md](./typography.md) | Outfit font family, type scale, weights |
| [spacing.md](./spacing.md) | 4px base unit, spacing scale, border radius |
| [animations.md](./animations.md) | Timing functions, durations, transitions |

---

## Usage

All tokens are available as CSS custom properties. Import them via:

```css
@import url('../assets/design-tokens.css');
```

Then use in your styles:

```css
.my-component {
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
```

---

## Token Naming Convention

- **Colors:** `--color-{name}` or `--{semantic}-{variant}`
- **Text:** `--text-{role}` (primary, secondary, tertiary, disabled)
- **Background:** `--bg-{level}` (body, surface, elevated, border)
- **Spacing:** `--space-{multiplier}` (1, 2, 3, 4, 5, 6, 8, 10, 12, 16)
- **Radius:** `--radius-{size}` (sm, md, lg, xl, full)
- **Duration:** `--duration-{speed}` (fast, base, normal, slow)
