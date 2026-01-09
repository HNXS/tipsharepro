---
title: Accessibility Guidelines
description: WCAG 2.1 AA compliance standards for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../design-system/tokens/colors.md
  - ../design-system/style-guide.md
status: approved
---

# Accessibility Guidelines

## Overview

Tip Share Pro is built to be accessible to all users, including those using assistive technologies. We target **WCAG 2.1 Level AA** compliance as our baseline, with Level AAA where practical.

Restaurant managers and team members come from diverse backgrounds and abilities. Accessibility isn't an afterthought—it's a core requirement.

---

## Core Principles

### 1. Perceivable
Information must be presentable in ways all users can perceive.

### 2. Operable
UI components must be operable by all users.

### 3. Understandable
Information and operation must be understandable.

### 4. Robust
Content must be robust enough for diverse user agents.

---

## Color & Contrast

### Minimum Contrast Ratios

| Text Type | Minimum Ratio | Our Target |
|-----------|---------------|------------|
| Normal text (< 18px) | 4.5:1 | 7:1+ |
| Large text (≥ 18px or 14px bold) | 3:1 | 4.5:1+ |
| UI components & graphics | 3:1 | 4.5:1+ |

### Verified Combinations

| Background | Text | Ratio | Status |
|------------|------|-------|--------|
| `--midnight` | `--cream` | 15.8:1 | AAA |
| `--midnight` | `--linen` | 9.2:1 | AAA |
| `--midnight` | `--brass` | 7.1:1 | AAA |
| `--midnight` | `--stone` | 4.7:1 | AA (large only) |
| `--espresso` | `--cream` | 13.5:1 | AAA |
| `--brass` | `--midnight` | 9.2:1 | AAA |

### Color Independence

**Never rely on color alone** to convey information:

```html
<!-- Bad: Color only -->
<span class="text-sage">Saved</span>

<!-- Good: Color + icon + text -->
<span class="status-success">
  <svg aria-hidden="true"><!-- checkmark --></svg>
  Saved
</span>
```

### High Contrast Mode

Support Windows High Contrast Mode:

```css
@media (forced-colors: active) {
  .btn-primary {
    border: 2px solid currentColor;
  }

  .card {
    border: 1px solid CanvasText;
  }

  .focus-ring {
    outline: 2px solid Highlight;
  }
}
```

---

## Typography

### Minimum Sizes

| Context | Minimum Size |
|---------|--------------|
| Body text | 16px |
| Secondary text | 14px |
| Labels | 11px (with uppercase + weight) |
| Interactive elements | 16px |

### Line Height

- Body text: 1.5–1.6
- Headings: 1.2–1.3
- Dense tables: 1.4 minimum

### Font Scaling

Support 200% zoom without loss of content:

```css
/* Use relative units */
body {
  font-size: 100%; /* Respects user preference */
}

h1 {
  font-size: 2.25rem; /* Scales with root */
}

/* Avoid fixed heights that clip text */
.card {
  min-height: auto;
  padding: 1.5rem;
}
```

### Reading Width

Limit line length for readability:

```css
.prose {
  max-width: 65ch;
}
```

---

## Keyboard Navigation

### Focus Management

All interactive elements must be keyboard accessible:

```css
/* Visible focus indicator */
:focus-visible {
  outline: none;
  box-shadow: var(--shadow-glow);
}

/* Remove default outline only when custom focus is provided */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Focus Order

Tab order should match visual order:

1. Skip link (first focusable element)
2. Navigation
3. Main content
4. Footer

### Skip Links

Provide skip navigation for keyboard users:

```html
<body>
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>
  <nav>...</nav>
  <main id="main-content" tabindex="-1">
    ...
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -100px;
  left: var(--space-4);
  padding: var(--space-2) var(--space-4);
  background: var(--brass);
  color: var(--midnight);
  border-radius: var(--radius-md);
  z-index: var(--z-max);
  transition: top var(--duration-fast) var(--ease-standard);
}

.skip-link:focus {
  top: var(--space-4);
}
```

### Keyboard Shortcuts

Document and respect keyboard conventions:

| Action | Key |
|--------|-----|
| Submit form | Enter |
| Cancel/Close | Escape |
| Next field | Tab |
| Previous field | Shift+Tab |
| Toggle checkbox | Space |
| Navigate menu | Arrow keys |

---

## Forms

### Labels

Every form input must have a label:

```html
<!-- Visible label -->
<label for="tip-amount" class="form-label">
  Total Tips
</label>
<input type="text" id="tip-amount" class="form-input">

<!-- Screen reader only label -->
<label for="search" class="sr-only">
  Search team members
</label>
<input type="search" id="search" placeholder="Search...">
```

### Error Messages

Errors must be programmatically associated:

```html
<div class="form-group">
  <label for="hours" class="form-label">Hours Worked</label>
  <input
    type="number"
    id="hours"
    class="form-input"
    aria-invalid="true"
    aria-describedby="hours-error"
  >
  <span id="hours-error" class="form-error" role="alert">
    Please enter a valid number of hours
  </span>
</div>
```

### Required Fields

Indicate required fields clearly:

```html
<label for="name" class="form-label">
  Name
  <span aria-hidden="true" class="form-required">*</span>
</label>
<input
  type="text"
  id="name"
  class="form-input"
  required
  aria-required="true"
>
```

### Input Purpose

Use autocomplete attributes for common fields:

```html
<input type="text" autocomplete="given-name" name="firstName">
<input type="text" autocomplete="family-name" name="lastName">
<input type="email" autocomplete="email" name="email">
<input type="tel" autocomplete="tel" name="phone">
```

---

## Tables

### Proper Structure

```html
<table class="table" role="table">
  <caption class="sr-only">
    Tip distribution for January 1-15, 2026
  </caption>
  <thead>
    <tr>
      <th scope="col">Team Member</th>
      <th scope="col">Position</th>
      <th scope="col" class="text-right">Hours</th>
      <th scope="col" class="text-right">Tip Share</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Maria Santos</th>
      <td>Server</td>
      <td class="text-right">32.5</td>
      <td class="text-right">$558.28</td>
    </tr>
  </tbody>
</table>
```

### Sortable Tables

```html
<th scope="col" aria-sort="ascending">
  <button class="sort-button" aria-label="Sort by Hours, currently ascending">
    Hours
    <svg aria-hidden="true"><!-- sort icon --></svg>
  </button>
</th>
```

### Responsive Tables

On mobile, provide accessible alternatives:

```html
<div class="table-responsive" role="region" aria-label="Tip distribution" tabindex="0">
  <table>...</table>
</div>
```

---

## Modals & Dialogs

### Focus Trapping

When a modal opens:
1. Store last focused element
2. Move focus to modal (first focusable or close button)
3. Trap focus within modal
4. Return focus when closed

### ARIA Attributes

```html
<div
  class="modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm Distribution</h2>
  <p id="modal-description">
    This will finalize tip calculations for the period.
  </p>
  <button>Cancel</button>
  <button>Confirm</button>
</div>
```

### Alert Dialogs

For confirmations requiring immediate attention:

```html
<div
  class="modal"
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="alert-title"
  aria-describedby="alert-desc"
>
  <h2 id="alert-title">Delete Team Member?</h2>
  <p id="alert-desc">This action cannot be undone.</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>
```

---

## Images & Icons

### Decorative Images

```html
<!-- Decorative: hide from screen readers -->
<img src="decoration.svg" alt="" role="presentation">
<svg aria-hidden="true"><!-- icon --></svg>
```

### Meaningful Images

```html
<!-- Informative: provide alt text -->
<img src="chart.png" alt="Tip distribution showing Maria Santos earned $558.28">

<!-- Icon buttons: label required -->
<button aria-label="Edit team member">
  <svg aria-hidden="true"><!-- edit icon --></svg>
</button>
```

### Complex Graphics

For charts and complex visuals, provide text alternatives:

```html
<figure>
  <div role="img" aria-labelledby="chart-title" aria-describedby="chart-desc">
    <!-- Chart component -->
  </div>
  <figcaption id="chart-title">Weekly tip totals</figcaption>
  <p id="chart-desc" class="sr-only">
    Bar chart showing tips from Monday ($823) through Sunday ($412)...
  </p>
</figure>
```

---

## Motion & Animation

### Reduced Motion

Respect user preference for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Essential vs. Decorative Motion

- **Essential**: Loading spinners, progress bars (keep, but simplify)
- **Decorative**: Entrance animations, parallax (disable entirely)

### Auto-Playing Content

Never auto-play video or audio without user control.

---

## Live Regions

### Status Messages

```html
<!-- Polite: announced when convenient -->
<div role="status" aria-live="polite" aria-atomic="true">
  Saved successfully
</div>

<!-- Assertive: announced immediately -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  Error: Please enter a valid amount
</div>
```

### Dynamic Content

When content updates dynamically:

```html
<div aria-live="polite" aria-relevant="additions text">
  <!-- New items announced as added -->
</div>
```

---

## Touch Targets

### Minimum Size

Touch targets must be at least 44×44 CSS pixels:

```css
.btn,
.nav-item,
.form-checkbox-input {
  min-width: 44px;
  min-height: 44px;
}

/* Small buttons need padding or larger touch area */
.btn-sm {
  min-height: 44px;
  padding: var(--space-2) var(--space-3);
}
```

### Spacing

Ensure adequate spacing between touch targets:

```css
.btn-group {
  gap: var(--space-2); /* 12px minimum */
}
```

---

## Screen Reader Text

### Visually Hidden Class

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Allow element to be focusable */
.sr-only-focusable:focus,
.sr-only-focusable:active {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Currency Formatting

```html
<!-- Announce currency properly -->
<span class="currency" aria-label="558 dollars and 28 cents">
  $558.28
</span>
```

---

## Testing Checklist

### Automated Testing

- [ ] Run axe-core or similar tool
- [ ] Check color contrast with browser devtools
- [ ] Validate HTML structure
- [ ] Test with Lighthouse accessibility audit

### Manual Testing

- [ ] Navigate entire app with keyboard only
- [ ] Test with screen reader (NVDA, VoiceOver, JAWS)
- [ ] Test at 200% zoom
- [ ] Test with high contrast mode
- [ ] Test with reduced motion preference
- [ ] Verify all images have appropriate alt text
- [ ] Check focus order matches visual order
- [ ] Verify all forms have proper labels
- [ ] Test error handling and messaging

### Screen Reader Testing

| Platform | Screen Reader |
|----------|---------------|
| Windows | NVDA (free), JAWS |
| macOS | VoiceOver (built-in) |
| iOS | VoiceOver (built-in) |
| Android | TalkBack (built-in) |

---

## Common Patterns

### Disclosure Widget (Expandable Content)

```html
<div class="disclosure">
  <button
    aria-expanded="false"
    aria-controls="panel-content"
    class="disclosure-trigger"
  >
    Team Hours
    <svg aria-hidden="true"><!-- chevron --></svg>
  </button>
  <div
    id="panel-content"
    class="disclosure-content"
    hidden
  >
    <!-- Content -->
  </div>
</div>
```

### Tab Panel

```html
<div class="tabs">
  <div role="tablist" aria-label="Distribution views">
    <button
      role="tab"
      aria-selected="true"
      aria-controls="panel-overview"
      id="tab-overview"
    >
      Overview
    </button>
    <button
      role="tab"
      aria-selected="false"
      aria-controls="panel-details"
      id="tab-details"
      tabindex="-1"
    >
      Details
    </button>
  </div>

  <div
    role="tabpanel"
    id="panel-overview"
    aria-labelledby="tab-overview"
  >
    <!-- Overview content -->
  </div>

  <div
    role="tabpanel"
    id="panel-details"
    aria-labelledby="tab-details"
    hidden
  >
    <!-- Details content -->
  </div>
</div>
```

### Loading State

```html
<button aria-busy="true" aria-disabled="true">
  <span class="spinner" aria-hidden="true"></span>
  <span class="sr-only">Loading, please wait</span>
  <span aria-hidden="true">Calculating...</span>
</button>
```

---

## Resources

### Tools

- [axe DevTools](https://www.deque.com/axe/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

### References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

## Related Documentation

- [Color Tokens](../design-system/tokens/colors.md)
- [Typography Tokens](../design-system/tokens/typography.md)
- [Style Guide](../design-system/style-guide.md)
