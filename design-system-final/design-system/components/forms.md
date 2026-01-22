# Form Components - Final Edition

**Version:** 1.0
**Date:** January 15, 2026

---

## Form Philosophy

Forms in TipSharePro are functional and clear:
- Dark backgrounds with warm text
- Clear labels (uppercase, secondary color)
- Obvious focus states with orange glow
- Validation feedback that doesn't overwhelm

---

## Text Input

### Specifications

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  LABEL (uppercase)                                             │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Monthly Sales Estimate                                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  INPUT FIELD                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  $ 25,000                                              │    │
│  │  #1A1510 bg / #3D3225 border                           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  HELPER TEXT (optional)                                        │
│  Any close estimate will work                                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `--bg-surface` (#1A1510) |
| Border | 1px solid `--bg-border` (#3D3225) |
| Border Focus | 2px solid `--color-primary` (#E85D04) |
| Border Error | 2px solid `--color-error` (#DC2626) |
| Text | `--text-primary` (#F7F3EA) |
| Placeholder | `--text-tertiary` (#8B7B65) |
| Height | 44px |
| Padding | 12px 16px |
| Border Radius | 8px |
| Font | 16px Outfit |

### CSS

```css
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-family: var(--font-primary);
  font-size: var(--text-label);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text-secondary);
}

.form-input {
  display: block;
  width: 100%;
  height: 44px;
  padding: 12px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--text-body);
  color: var(--text-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.form-input:hover {
  border-color: var(--color-linen);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.form-input:disabled {
  background: var(--bg-elevated);
  color: var(--text-disabled);
  cursor: not-allowed;
}

/* Error state */
.form-input.error {
  border-color: var(--color-error);
}

.form-input.error:focus {
  box-shadow: var(--shadow-error);
}

.form-helper {
  margin-top: var(--space-1);
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

.form-error {
  margin-top: var(--space-1);
  font-size: var(--text-caption);
  color: var(--color-error);
}
```

---

## Select Dropdown

For contribution type, job categories, weights.

### Specifications

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  CLOSED STATE                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  All Sales                                          ▼  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  OPEN STATE                                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  All Sales                                          ▲  │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │  CC Sales                                              │    │
│  │  CC Tips                                               │    │
│  │  All Tips                                              │    │
│  │  ✓ All Sales  ← selected, orange accent                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Same as input | Background, border, height, radius |
| Dropdown bg | `--bg-elevated` (#2A2318) |
| Option hover | `--bg-elevated` |
| Selected | Left border `--color-primary` |

### CSS

```css
.form-select {
  appearance: none;
  display: block;
  width: 100%;
  height: 44px;
  padding: 12px 40px 12px 16px;
  background: var(--bg-surface) url("data:image/svg+xml,...") no-repeat right 12px center;
  background-size: 16px;
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--text-body);
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

/* Custom dropdown for better styling */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  padding: 4px 0;
  background: var(--bg-elevated);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: var(--z-dropdown);
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  font-size: var(--text-body);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.dropdown-item:hover {
  background: var(--bg-border);
}

.dropdown-item.selected {
  border-left: 3px solid var(--color-primary);
  background: var(--bg-border);
}
```

---

## Checkbox

For Step 1 (contribution method) and !!Note acknowledgment.

### Specifications

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  UNCHECKED           CHECKED                DISABLED           │
│  ┌────┐              ┌────┐                 ┌────┐             │
│  │    │ CC Sales     │ ✓  │ All Sales       │    │ Option      │
│  └────┘              └────┘                 └────┘             │
│  walnut border       orange bg              ash color          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Size | 20px x 20px |
| Border | 2px solid `--bg-border` |
| Checked bg | `--color-primary` |
| Checkmark | `--color-midnight` |
| Border radius | 4px |

### CSS

```css
.form-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.form-checkbox input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--bg-surface);
  border: 2px solid var(--bg-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.form-checkbox input[type="checkbox"]:hover {
  border-color: var(--color-primary);
}

.form-checkbox input[type="checkbox"]:checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  /* Add checkmark via background-image */
}

.form-checkbox input[type="checkbox"]:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.form-checkbox label {
  font-size: var(--text-body);
  color: var(--text-primary);
  cursor: pointer;
}
```

---

## Number Input (Currency)

For monthly estimate and hours.

### Specifications

| Property | Value |
|----------|-------|
| Font | JetBrains Mono |
| Text align | Right |
| Prefix | $ (styled separately) |

```css
.form-input-currency {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
  padding-left: 32px; /* Space for $ prefix */
}

.form-input-currency-wrapper {
  position: relative;
}

.form-input-currency-wrapper::before {
  content: '$';
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  color: var(--text-secondary);
}
```

---

## Weight Dropdown (1-5 in 0.25 increments)

Special dropdown for job category weights.

### Options

```
1.00, 1.25, 1.50, 1.75,
2.00, 2.25, 2.50, 2.75,
3.00, 3.25, 3.50, 3.75,
4.00, 4.25, 4.50, 4.75,
5.00
```

Total: 17 options

---

## Form Layout

### Settings Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│  STEP 1: Contribution Method                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ☐ CC Sales    ☐ CC Tips    ☐ All Tips    ● All Sales   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  STEP 2: Monthly Estimate                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  $ 25,000                                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  STEP 3: Contribution %                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  3.25%                                               ▼   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Accessibility

- All inputs have associated labels
- Error messages linked via aria-describedby
- Focus states clearly visible
- Tab order logical
- Required fields marked with aria-required

---

## Related Files

- [Buttons](./buttons.md)
- [Help System](./help-system.md)
- [Typography](../tokens/typography.md)
