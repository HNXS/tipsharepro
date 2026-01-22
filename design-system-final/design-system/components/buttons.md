# Button Components - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Active

> "I want to see some buttons!" — Tom LaChaussee

---

## Button Variants

### Primary Button

The main call-to-action. Bold Burnt Orange from the logo.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  DEFAULT                  HOVER                   ACTIVE       │
│  ┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│  │  Go To Table   │  →   │  Go To Table   │  →   │  Go To Table   │
│  │  #E85D04       │      │  #D14D00       │      │  #C04500       │
│  └────────────────┘      └────────────────┘      └────────────────┘
│                                                                │
│  FOCUS                   DISABLED                              │
│  ┌────────────────┐      ┌────────────────┐                    │
│  │  Go To Table   │      │  Go To Table   │                    │
│  │  + glow ring   │      │  #5C5145 text  │                    │
│  └────────────────┘      └────────────────┘                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Background | `--color-primary` (#E85D04) |
| Text | `--color-midnight` (#0C0A07) |
| Font | 16px / Outfit / 600 |
| Padding | 12px 24px |
| Border Radius | 8px |
| Min Width | 120px |
| Height | 44px |
| Cursor | pointer |

**States:**

| State | Change |
|-------|--------|
| Hover | Background: `--color-primary-hover` (#D14D00) |
| Active | Background: `--color-primary-active` (#C04500), translateY(1px) |
| Focus | Add `--shadow-focus` glow ring |
| Disabled | Background: `--bg-elevated`, Text: `--text-disabled`, cursor: not-allowed |

**CSS:**

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  min-width: 120px;
  padding: 12px 24px;
  background: var(--color-primary);
  color: var(--color-midnight);
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-primary:active {
  background: var(--color-primary-active);
  transform: translateY(1px);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.btn-primary:disabled {
  background: var(--bg-elevated);
  color: var(--text-disabled);
  cursor: not-allowed;
}
```

---

### Secondary Button

For secondary actions. Navy Blue for trust and professionalism.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  DEFAULT                  HOVER                                │
│  ┌────────────────┐      ┌────────────────┐                    │
│  │    Log Out     │  →   │    Log Out     │                    │
│  │  #1A4B7C       │      │  #153D66       │                    │
│  │  cream text    │      │  cream text    │                    │
│  └────────────────┘      └────────────────┘                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Background | `--color-secondary` (#1A4B7C) |
| Text | `--color-cream` (#F7F3EA) |
| Font | 16px / Outfit / 600 |
| Padding | 12px 24px |
| Border Radius | 8px |
| Height | 44px |

**CSS:**

```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 12px 24px;
  background: var(--color-secondary);
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.btn-secondary:hover {
  background: var(--color-secondary-hover);
}

.btn-secondary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(26, 75, 124, 0.4);
}
```

---

### Ghost Button

For tertiary actions or navigation. Transparent with border.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  DEFAULT                  HOVER                                │
│  ┌────────────────┐      ┌────────────────┐                    │
│  │    Cancel      │  →   │    Cancel      │                    │
│  │  transparent   │      │  #2A2318 bg    │                    │
│  │  walnut border │      │  mahogany bg   │                    │
│  └────────────────┘      └────────────────┘                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Background | transparent |
| Border | 1px solid `--bg-border` (#3D3225) |
| Text | `--text-primary` (#F7F3EA) |
| Padding | 11px 23px (accounting for border) |
| Border Radius | 8px |

**CSS:**

```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 11px 23px;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid var(--bg-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.btn-ghost:hover {
  background: var(--bg-elevated);
}

.btn-ghost:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

---

### Danger Button

For destructive actions like delete. Use sparingly.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  DEFAULT                  HOVER                                │
│  ┌────────────────┐      ┌────────────────┐                    │
│  │    Delete      │  →   │    Delete      │                    │
│  │  #DC2626       │      │  #B91C1C       │                    │
│  └────────────────┘      └────────────────┘                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**CSS:**

```css
.btn-danger {
  background: var(--color-error);
  color: white;
  /* ... same sizing as primary */
}

.btn-danger:hover {
  background: var(--color-error-hover);
}
```

---

### Disabled/Faded Button (Demo Tease)

For Demo mode: show Full Version buttons as faded tease.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  FADED (Demo Tease)                                            │
│  ┌────────────────┐                                            │
│  │  Scenario SSB  │  ← "Pilot's Cockpit" teaser               │
│  │  #5C5145 text  │     Shows what Full Version has            │
│  │  cursor: help  │     Not clickable in Demo                  │
│  └────────────────┘                                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**CSS:**

```css
.btn-faded {
  background: var(--bg-surface);
  color: var(--text-disabled);
  border: 1px solid var(--bg-border);
  cursor: help;
  opacity: 0.6;
  pointer-events: none; /* or show tooltip on hover */
}

/* Optional: tooltip on hover explaining Full Version */
.btn-faded[title] {
  pointer-events: auto;
  cursor: help;
}
```

---

## Button Sizes

| Size | Height | Padding | Font Size | Usage |
|------|--------|---------|-----------|-------|
| Small | 32px | 8px 16px | 14px | Inline actions, table rows |
| Medium | 44px | 12px 24px | 16px | Default, most uses |
| Large | 52px | 16px 32px | 18px | Hero CTAs, prominent actions |

```css
.btn-sm {
  height: 32px;
  padding: 8px 16px;
  font-size: 0.875rem;
}

.btn-md {
  height: 44px;
  padding: 12px 24px;
  font-size: 1rem;
}

.btn-lg {
  height: 52px;
  padding: 16px 32px;
  font-size: 1.125rem;
}
```

---

## Button with Icon

Icons should be 16px (sm), 20px (md), or 24px (lg).

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  Icon Left              Icon Right           Icon Only         │
│  ┌────────────────┐    ┌────────────────┐   ┌────────┐         │
│  │  ⬇ Download    │    │  Next Step →   │   │   🖨️   │         │
│  └────────────────┘    └────────────────┘   └────────┘         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**CSS:**

```css
.btn-icon-left svg {
  margin-right: 8px;
}

.btn-icon-right svg {
  margin-left: 8px;
}

.btn-icon-only {
  width: 44px;
  height: 44px;
  padding: 0;
  justify-content: center;
}
```

---

## Demo Settings Page Buttons

Specific buttons for the Demo Settings Page:

### "Go To Distribution Table" (Primary)
```css
.btn-go-to-table {
  /* Primary button styling */
  background: var(--color-primary);
  color: var(--color-midnight);
}
```

### "Log Out" (Secondary)
```css
.btn-logout {
  /* Secondary button styling */
  background: var(--color-secondary);
  color: var(--color-cream);
}
```

### "Print Distribution" (Ghost with icon)
```css
.btn-print {
  /* Ghost button with print icon */
  background: transparent;
  border: 1px solid var(--bg-border);
  color: var(--text-primary);
}
```

### PDF Links
```css
.btn-pdf-link {
  /* Text-style button for PDF links */
  background: transparent;
  color: var(--color-info);
  text-decoration: underline;
  padding: 8px;
}

.btn-pdf-link:hover {
  color: var(--color-primary);
}
```

### Faded Full Version Controls (Demo Tease)
```css
.btn-full-version-tease {
  background: var(--bg-surface);
  color: var(--text-disabled);
  border: 1px dashed var(--bg-border);
  opacity: 0.5;
  cursor: not-allowed;
}

/* Tooltip: "Available in Full Version" */
```

---

## Loading State

```css
.btn-loading {
  pointer-events: none;
  position: relative;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Accessibility

### Focus Indicators
All buttons have visible focus rings using `--shadow-focus`.

### Keyboard Navigation
- Buttons are focusable via Tab
- Space/Enter activates the button
- Disabled buttons are not focusable

### Touch Targets
Minimum 44x44px for all button sizes (per WCAG).

### ARIA
```html
<!-- Loading button -->
<button class="btn-primary btn-loading" aria-busy="true">
  Saving...
</button>

<!-- Disabled with reason -->
<button class="btn-primary" disabled aria-describedby="reason">
  Submit
</button>
<span id="reason" class="sr-only">Button disabled until form is complete</span>
```

---

## Usage Guidelines

### Do:
- Use Primary for the main action per screen
- Use Secondary for supporting actions
- Use Ghost for tertiary/cancel actions
- Show loading state during async operations
- Use faded buttons in Demo to tease Full Version

### Don't:
- Use more than one Primary button per section
- Use Danger button without confirmation
- Disable buttons without explanation
- Make buttons smaller than 32px height

---

## Related Files

- [Colors](../tokens/colors.md)
- [Typography](../tokens/typography.md)
- [Forms](./forms.md)
