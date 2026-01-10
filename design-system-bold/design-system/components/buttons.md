# TipSharePro Button System - Bold Edition

**Version:** 1.0
**Date:** January 9, 2026
**Status:** Active

---

## Button Philosophy

TipSharePro buttons are **bold and action-oriented**. The primary burnt orange CTA commands attention and drives users toward key actions. Secondary buttons provide clear alternatives without competing for attention.

---

## Button Variants

### Primary Button (Burnt Orange)

The main call-to-action. Use for primary actions like "Request Demo", "Save", "Calculate Distribution".

| Property | Value |
|----------|-------|
| Background | `#E85D04` |
| Text | `#FFFFFF` |
| Border | none |
| Border Radius | `8px` |
| Font Size | `16px` |
| Font Weight | `600` |
| Padding | `12px 24px` |
| Box Shadow | `0 1px 3px rgba(0,0,0,0.1)` |

**States:**

| State | Background | Shadow | Transform |
|-------|------------|--------|-----------|
| Default | `#E85D04` | `0 1px 3px rgba(0,0,0,0.1)` | none |
| Hover | `#D14D00` | `0 4px 12px rgba(232,93,4,0.35)` | `translateY(-1px)` |
| Active | `#C04500` | `0 1px 3px rgba(0,0,0,0.1)` | `translateY(0)` |
| Focus | `#E85D04` | Ring: `0 0 0 3px rgba(232,93,4,0.3)` | none |
| Disabled | `#9CA3AF` | none | none |

```css
.btn-primary {
  background-color: #E85D04;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 150ms ease-out;
}

.btn-primary:hover {
  background-color: #D14D00;
  box-shadow: 0 4px 12px rgba(232,93,4,0.35);
  transform: translateY(-1px);
}

.btn-primary:active {
  background-color: #C04500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transform: translateY(0);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(232,93,4,0.3);
}

.btn-primary:disabled {
  background-color: #9CA3AF;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}
```

---

### Secondary Button (Navy Blue)

For secondary actions that are important but not the primary focus.

| Property | Value |
|----------|-------|
| Background | `#1A4B7C` |
| Text | `#FFFFFF` |
| Border | none |
| Border Radius | `8px` |

**States:**

| State | Background |
|-------|------------|
| Default | `#1A4B7C` |
| Hover | `#153D66` |
| Active | `#102D4A` |
| Disabled | `#9CA3AF` |

```css
.btn-secondary {
  background-color: #1A4B7C;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 150ms ease-out;
}

.btn-secondary:hover {
  background-color: #153D66;
}

.btn-secondary:active {
  background-color: #102D4A;
}

.btn-secondary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(26,75,124,0.3);
}

.btn-secondary:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}
```

---

### Ghost Button (Outlined Orange)

For tertiary actions or when you need a button that doesn't dominate.

| Property | Value |
|----------|-------|
| Background | `transparent` |
| Text | `#E85D04` |
| Border | `2px solid #E85D04` |
| Border Radius | `8px` |

**States:**

| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | `transparent` | `#E85D04` | `#E85D04` |
| Hover | `#FFF3E6` | `#D14D00` | `#D14D00` |
| Active | `#FEE8D6` | `#C04500` | `#C04500` |
| Disabled | `transparent` | `#D4D4D4` | `#9CA3AF` |

```css
.btn-ghost {
  background-color: transparent;
  color: #E85D04;
  border: 2px solid #E85D04;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: calc(0.75rem - 2px) calc(1.5rem - 2px);
  cursor: pointer;
  transition: all 150ms ease-out;
}

.btn-ghost:hover {
  background-color: #FFF3E6;
  border-color: #D14D00;
  color: #D14D00;
}

.btn-ghost:active {
  background-color: #FEE8D6;
  border-color: #C04500;
  color: #C04500;
}

.btn-ghost:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(232,93,4,0.3);
}

.btn-ghost:disabled {
  background-color: transparent;
  border-color: #D4D4D4;
  color: #9CA3AF;
  cursor: not-allowed;
}
```

---

### Success Button (Lime Green)

For positive confirmations like "Confirm", "Approve", "Complete".

| Property | Value |
|----------|-------|
| Background | `#82B536` |
| Text | `#FFFFFF` |
| Border Radius | `8px` |

```css
.btn-success {
  background-color: #82B536;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 150ms ease-out;
}

.btn-success:hover {
  background-color: #6B9A2A;
}

.btn-success:active {
  background-color: #5A8524;
}
```

---

### Danger Button (Red)

For destructive actions like "Delete", "Remove", "Cancel Subscription".

| Property | Value |
|----------|-------|
| Background | `#DC2626` |
| Text | `#FFFFFF` |
| Border Radius | `8px` |

```css
.btn-danger {
  background-color: #DC2626;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 150ms ease-out;
}

.btn-danger:hover {
  background-color: #B91C1C;
}

.btn-danger:active {
  background-color: #991B1B;
}
```

---

## Button Sizes

### Small
```css
.btn-sm {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}
```

### Medium (Default)
```css
.btn-md {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
}
```

### Large
```css
.btn-lg {
  font-size: 1.125rem;
  padding: 1rem 2rem;
}
```

### Full Width
```css
.btn-full {
  width: 100%;
}
```

---

## Button with Icon

### Icon Left
```html
<button class="btn-primary">
  <svg class="btn-icon btn-icon-left">...</svg>
  Request Demo
</button>
```

```css
.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-icon-left {
  margin-right: 0.5rem;
}

.btn-icon-right {
  margin-left: 0.5rem;
}
```

### Icon Only
```css
.btn-icon-only {
  padding: 0.75rem;
  aspect-ratio: 1;
}

.btn-icon-only .btn-icon {
  margin: 0;
}
```

---

## Loading State

```html
<button class="btn-primary btn-loading" disabled>
  <span class="btn-spinner"></span>
  Saving...
</button>
```

```css
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
```

---

## Button Groups

```html
<div class="btn-group">
  <button class="btn-primary">Save</button>
  <button class="btn-ghost">Cancel</button>
</div>
```

```css
.btn-group {
  display: flex;
  gap: 0.75rem;
}

.btn-group-vertical {
  flex-direction: column;
}
```

---

## Accessibility

### Focus Indicators
All buttons must have visible focus indicators:
```css
button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(232,93,4,0.3);
}
```

### Touch Targets
Minimum button size for touch: 44px x 44px

### ARIA Labels
For icon-only buttons:
```html
<button class="btn-icon-only" aria-label="Close">
  <svg>...</svg>
</button>
```

---

## Usage Guidelines

### DO
- Use Primary (orange) for the single most important action on a page
- Use Secondary or Ghost for supporting actions
- Include loading states for async operations
- Maintain consistent sizing within button groups

### DON'T
- Don't use more than one Primary button per section
- Don't disable buttons without explanation (use tooltip)
- Don't use vague labels like "Click Here" or "Submit"
- Don't change button colors for custom meanings

---

## Complete CSS

```css
/* Base Button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease-out;
  text-decoration: none;
}

/* Primary */
.btn-primary {
  background-color: #E85D04;
  color: #FFFFFF;
  border: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.btn-primary:hover {
  background-color: #D14D00;
  box-shadow: 0 4px 12px rgba(232,93,4,0.35);
  transform: translateY(-1px);
}

.btn-primary:active {
  background-color: #C04500;
  transform: translateY(0);
}

/* Secondary */
.btn-secondary {
  background-color: #1A4B7C;
  color: #FFFFFF;
  border: none;
}

.btn-secondary:hover {
  background-color: #153D66;
}

/* Ghost */
.btn-ghost {
  background-color: transparent;
  color: #E85D04;
  border: 2px solid #E85D04;
}

.btn-ghost:hover {
  background-color: #FFF3E6;
  border-color: #D14D00;
  color: #D14D00;
}

/* Success */
.btn-success {
  background-color: #82B536;
  color: #FFFFFF;
  border: none;
}

.btn-success:hover {
  background-color: #6B9A2A;
}

/* Danger */
.btn-danger {
  background-color: #DC2626;
  color: #FFFFFF;
  border: none;
}

.btn-danger:hover {
  background-color: #B91C1C;
}

/* Sizes */
.btn-sm { font-size: 0.875rem; padding: 0.5rem 1rem; }
.btn-md { font-size: 1rem; padding: 0.75rem 1.5rem; }
.btn-lg { font-size: 1.125rem; padding: 1rem 2rem; }
.btn-full { width: 100%; }

/* Disabled */
.btn:disabled {
  background-color: #9CA3AF;
  border-color: #9CA3AF;
  color: #FFFFFF;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Focus */
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(232,93,4,0.3);
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-09 | Initial button system with bold orange primary |
