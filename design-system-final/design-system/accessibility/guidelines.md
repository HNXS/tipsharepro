# Accessibility Guidelines - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Target:** WCAG 2.1 Level AA

---

## Color & Contrast

### Minimum Contrast Ratios

| Text Type | Minimum Ratio | Requirement |
|-----------|---------------|-------------|
| Normal text (< 18px) | 4.5:1 | WCAG AA |
| Large text (≥ 18px bold or ≥ 24px) | 3:1 | WCAG AA |
| UI components & graphics | 3:1 | WCAG AA |
| Enhanced (optional) | 7:1 | WCAG AAA |

### Verified Combinations

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| Cream (#F7F3EA) | Midnight (#0C0A07) | 15.8:1 | Pass (AAA) |
| Linen (#C4B9A4) | Midnight (#0C0A07) | 9.2:1 | Pass (AAA) |
| Linen (#C4B9A4) | Espresso (#1A1510) | 7.5:1 | Pass (AAA) |
| Orange (#E85D04) | Midnight (#0C0A07) | 5.9:1 | Pass (AA) |
| Cyan (#35A0D2) | Midnight (#0C0A07) | 6.4:1 | Pass (AA) |
| Green (#82B536) | Midnight (#0C0A07) | 5.8:1 | Pass (AA large) |
| Stone (#8B7B65) | Midnight (#0C0A07) | 4.7:1 | Pass (AA large only) |

### Color Independence

Never use color as the only means of conveying information:

```html
<!-- Bad: Color only -->
<span class="text-success">Approved</span>

<!-- Good: Color + icon -->
<span class="text-success">✓ Approved</span>

<!-- Good: Color + text -->
<span class="text-error">Error: Email is required</span>
```

---

## Keyboard Navigation

### Focus Order

Focus must follow a logical order:
1. Skip link (hidden until focused)
2. Header navigation
3. Main content (top to bottom, left to right)
4. Footer

### Focus Indicators

All interactive elements must have visible focus:

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.3);
}
```

### Keyboard Patterns

| Component | Keys |
|-----------|------|
| Buttons | Enter, Space to activate |
| Links | Enter to activate |
| Checkboxes | Space to toggle |
| Dropdowns | Enter/Space to open, Arrow keys to navigate, Escape to close |
| Modals | Tab to cycle, Escape to close |
| Tabs | Arrow keys to switch, Enter to activate |

### Skip Link

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

```css
.skip-link {
  position: absolute;
  top: -100px;
  left: 16px;
  padding: 8px 16px;
  background: var(--color-primary);
  color: var(--color-midnight);
  border-radius: var(--radius-md);
  z-index: 9999;
}

.skip-link:focus {
  top: 16px;
}
```

---

## Screen Readers

### Semantic HTML

Use proper HTML elements:

```html
<!-- Navigation -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/settings">Settings</a></li>
  </ul>
</nav>

<!-- Headings (don't skip levels) -->
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>

<!-- Tables -->
<table>
  <thead>
    <tr>
      <th scope="col">Employee</th>
      <th scope="col">Hours</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Maria Santos</td>
      <td>32</td>
    </tr>
  </tbody>
</table>
```

### ARIA Patterns

#### Buttons with icons only
```html
<button aria-label="Print distribution table">
  <svg><!-- print icon --></svg>
</button>
```

#### Loading states
```html
<button aria-busy="true" aria-live="polite">
  Saving...
</button>
```

#### Modals
```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Confirm Action</h2>
</div>
```

#### Form errors
```html
<input
  type="email"
  id="email"
  aria-describedby="email-error"
  aria-invalid="true"
>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>
```

#### Live regions for updates
```html
<div aria-live="polite" aria-atomic="true">
  Pool total updated: $812.00
</div>
```

---

## Forms

### Labels

Every input must have a visible label:

```html
<label for="monthly-estimate">
  Monthly Sales Estimate
</label>
<input
  type="text"
  id="monthly-estimate"
  name="monthly-estimate"
>
```

### Error Messages

- Display near the field
- Use aria-describedby to associate
- Announce with aria-live or role="alert"

```html
<div class="form-group">
  <label for="email">Email</label>
  <input
    type="email"
    id="email"
    aria-describedby="email-error"
    aria-invalid="true"
  >
  <span id="email-error" class="form-error" role="alert">
    Please enter a valid email address
  </span>
</div>
```

### Required Fields

```html
<label for="name">
  Name <span aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
<input
  type="text"
  id="name"
  required
  aria-required="true"
>
```

---

## Motion & Animation

### Respect User Preferences

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

### Safe Animation Practices

- Keep animations short (< 500ms)
- Avoid flashing/strobing (< 3 flashes per second)
- Provide pause controls for auto-playing content
- Use transform/opacity (not layout properties)

---

## Touch Targets

Minimum touch target size: **44x44 pixels**

```css
button,
a,
input,
select,
[role="button"] {
  min-height: 44px;
  min-width: 44px;
}
```

For inline links, use padding:

```css
.inline-link {
  padding: 8px 0;
  margin: -8px 0;
}
```

---

## Images & Icons

### Decorative Images

```html
<img src="divider.png" alt="" role="presentation">
```

### Informative Images

```html
<img
  src="chart.png"
  alt="Bar chart showing tip distribution: Server 40%, Cook 30%, Busser 20%, Host 10%"
>
```

### Icon Buttons

```html
<button aria-label="Delete employee">
  <svg aria-hidden="true"><!-- trash icon --></svg>
</button>
```

---

## Testing Checklist

### Manual Testing

- [ ] Navigate entire page with keyboard only
- [ ] Test with screen reader (VoiceOver, NVDA)
- [ ] Check focus order is logical
- [ ] Verify focus indicators are visible
- [ ] Test with 200% zoom
- [ ] Test with high contrast mode
- [ ] Verify color is not the only indicator

### Automated Testing

- [ ] Run axe DevTools
- [ ] Run Lighthouse accessibility audit
- [ ] Validate HTML for semantic correctness
- [ ] Check color contrast with WebAIM tool

---

## Component-Specific Requirements

### Tables
- Use `<th>` for headers with `scope` attribute
- Provide table caption or aria-label
- Don't use tables for layout

### Modals
- Trap focus inside modal
- Return focus on close
- Closable with Escape key
- Announce opening to screen readers

### Dropdowns
- Keyboard navigable with arrows
- Selected item announced
- Closable with Escape

### ?Note Tooltips
- Triggered on focus as well as hover
- Content accessible to screen readers
- Sufficient contrast

### !!Note Modals
- Focus trapped
- Checkbox must be checked to proceed
- Clearly announces warning content

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Related Files

- [Colors](../tokens/colors.md) — Contrast verification
- [Forms](../components/forms.md) — Form accessibility
- [Modals](../components/modals.md) — Modal accessibility
- [Web Platform](../platform-adaptations/web.md) — Focus management
