# TipSharePro Accessibility Testing

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document outlines the accessibility testing procedures for TipSharePro. All features must pass these tests before release.

---

## Testing Methodology

### Testing Levels

| Level | Description | When |
|-------|-------------|------|
| **Automated** | Tool-based scanning | Every build |
| **Manual** | Human verification | Every feature |
| **Screen Reader** | Assistive tech testing | Major releases |
| **User Testing** | Real user feedback | Quarterly |

---

## Automated Testing

### Tools

| Tool | Purpose | Integration |
|------|---------|-------------|
| **axe-core** | WCAG rule checking | CI/CD pipeline |
| **Lighthouse** | Performance + a11y audit | PR reviews |
| **Pa11y** | Automated testing | Scheduled scans |
| **WAVE** | Visual a11y checker | Manual review |

### axe-core Integration

```javascript
// Jest + axe-core example
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<DistributionTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Lighthouse Configuration

```json
{
  "extends": "lighthouse:default",
  "settings": {
    "onlyCategories": ["accessibility"],
    "skipAudits": []
  }
}
```

**Target Score:** 95+ for accessibility

### Automated Test Checklist

- [ ] No WCAG A violations
- [ ] No WCAG AA violations
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Color contrast ratios pass
- [ ] ARIA attributes are valid
- [ ] Heading hierarchy is correct

---

## Manual Testing

### Keyboard Navigation Testing

Test all pages using only keyboard:

| Key | Expected Behavior | Test Status |
|-----|-------------------|-------------|
| **Tab** | Move to next interactive element | ☐ |
| **Shift+Tab** | Move to previous element | ☐ |
| **Enter** | Activate buttons/links | ☐ |
| **Space** | Toggle checkboxes, activate buttons | ☐ |
| **Arrow Keys** | Navigate within components | ☐ |
| **Escape** | Close modals/dropdowns | ☐ |

#### Keyboard Test Procedure

1. Start at top of page
2. Tab through all interactive elements
3. Verify focus is visible at all times
4. Verify focus order matches visual order
5. Test all functionality (buttons, links, forms)
6. Verify trapped focus in modals
7. Verify escape closes overlays

### Page-by-Page Keyboard Tests

| Page | Focus Order | Tab Trapping | Shortcuts |
|------|-------------|--------------|-----------|
| Login | ☐ | N/A | ☐ |
| Navigation Hub | ☐ | N/A | ☐ |
| Settings | ☐ | ☐ (modals) | ☐ |
| Daily Contributions | ☐ | ☐ | ☐ |
| PPE Contributions | ☐ | ☐ | ☐ |
| Distribution | ☐ | ☐ | ☐ |
| YTD Data | ☐ | N/A | ☐ |

### Visual Testing

#### Zoom Testing

1. Set browser zoom to 200%
2. Verify all content is visible
3. Verify no horizontal scrolling on main content
4. Verify text doesn't overlap
5. Verify interactive elements are still usable

#### Color Contrast Testing

Use browser DevTools or WebAIM Contrast Checker:

| Element | Foreground | Background | Ratio | Pass |
|---------|------------|------------|-------|------|
| Body text | #292524 | #FFFFFF | 13.5:1 | ☐ |
| Secondary text | #57534E | #FFFFFF | 7.3:1 | ☐ |
| Primary button text | #FFFFFF | #E85D04 | 4.8:1 | ☐ |
| Error message | #DC2626 | #FFFFFF | 5.5:1 | ☐ |
| Link text | #E85D04 | #FFFFFF | 4.5:1 | ☐ |
| Disabled text | #78716C | #F5F5F4 | 4.5:1 | ☐ |

#### Motion & Animation Testing

1. Enable `prefers-reduced-motion` in browser
2. Verify animations are disabled or reduced
3. Verify no essential information is lost

```css
/* Test this media query is working */
@media (prefers-reduced-motion: reduce) {
  /* Animations should be minimal */
}
```

---

## Screen Reader Testing

### Supported Screen Readers

| Screen Reader | Platform | Priority |
|---------------|----------|----------|
| **NVDA** | Windows | Primary |
| **VoiceOver** | macOS/iOS | Primary |
| **JAWS** | Windows | Secondary |
| **TalkBack** | Android | Secondary |

### Screen Reader Test Procedure

#### Setup
1. Install/enable screen reader
2. Navigate to TipSharePro
3. Start at top of page

#### Tests

**Page Structure:**
- [ ] Page title is announced
- [ ] Landmarks are announced (main, nav, etc.)
- [ ] Headings are properly nested and announced
- [ ] Skip links work correctly

**Forms:**
- [ ] All inputs have announced labels
- [ ] Required fields are announced
- [ ] Error messages are announced
- [ ] Form instructions are available

**Tables:**
- [ ] Table caption/title is announced
- [ ] Column headers are associated with cells
- [ ] Row headers are associated with cells
- [ ] Data makes sense when read linearly

**Interactive Elements:**
- [ ] Buttons announce their purpose
- [ ] Links announce their destination
- [ ] State changes are announced (expanded/collapsed)
- [ ] Modals announce when opened/closed

**Dynamic Content:**
- [ ] Toast notifications are announced
- [ ] Form validation errors are announced
- [ ] Loading states are announced

### NVDA Testing Shortcuts

| Shortcut | Action |
|----------|--------|
| Insert + Down | Read continuously |
| H | Next heading |
| T | Next table |
| F | Next form field |
| B | Next button |
| D | Next landmark |

### VoiceOver Testing Shortcuts (macOS)

| Shortcut | Action |
|----------|--------|
| VO + A | Read all |
| VO + Cmd + H | Next heading |
| VO + Cmd + T | Next table |
| VO + Cmd + J | Next form control |

---

## Component-Specific Tests

### Buttons

- [ ] Role is "button"
- [ ] State announced (disabled, pressed)
- [ ] Purpose is clear from label
- [ ] Keyboard activatable

### Form Inputs

- [ ] Associated label announced
- [ ] Input type announced
- [ ] Required state announced
- [ ] Current value announced
- [ ] Error state announced

### Tables

- [ ] Caption or aria-label present
- [ ] Headers have scope attribute
- [ ] Sort state announced (if sortable)
- [ ] Row/column count announced

### Modals

- [ ] Focus moves to modal when opened
- [ ] Focus is trapped within modal
- [ ] Escape key closes modal
- [ ] Focus returns to trigger on close
- [ ] Background content is inert

### Tabs

- [ ] Tab role announced
- [ ] Selected state announced
- [ ] Arrow keys navigate tabs
- [ ] Tab panel is announced

### Tooltips (?Notes)

- [ ] Trigger is keyboard accessible
- [ ] Tooltip content is announced
- [ ] Tooltip is associated via aria-describedby

### !!Note Modals

- [ ] Alert dialog role announced
- [ ] Content is fully announced
- [ ] Checkbox state is announced
- [ ] Button disabled state is announced

---

## Testing Checklist Template

### Pre-Release Accessibility Checklist

**Feature:** _________________
**Tester:** _________________
**Date:** _________________

#### Automated Tests
- [ ] axe-core: No violations
- [ ] Lighthouse: Score 95+
- [ ] HTML validation: No errors

#### Keyboard Tests
- [ ] All elements focusable
- [ ] Focus visible
- [ ] Focus order logical
- [ ] All functions accessible

#### Screen Reader Tests
- [ ] NVDA: Passed
- [ ] VoiceOver: Passed
- [ ] Content makes sense

#### Visual Tests
- [ ] 200% zoom: No issues
- [ ] Color contrast: Passed
- [ ] Reduced motion: Respected

#### Notes/Issues:
_________________________________

---

## Reporting Issues

### Issue Template

```markdown
## Accessibility Issue

**Component:** [e.g., Distribution Table]
**WCAG Criterion:** [e.g., 1.4.3 Contrast]
**Severity:** [Critical/Major/Minor]
**User Impact:** [Description of impact]

### Steps to Reproduce
1. Navigate to...
2. Use screen reader/keyboard to...
3. Observe that...

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Suggested Fix
[If known]

### Screenshots/Recordings
[If applicable]
```

### Severity Levels

| Level | Definition | Response Time |
|-------|------------|---------------|
| **Critical** | Blocks access completely | Immediate fix |
| **Major** | Significant difficulty | Next sprint |
| **Minor** | Inconvenience but usable | Backlog |

---

## Testing Schedule

| Test Type | Frequency | Responsibility |
|-----------|-----------|----------------|
| Automated (CI) | Every commit | Automated |
| Manual keyboard | Every feature | Developer |
| Screen reader | Major releases | QA team |
| Full audit | Quarterly | External auditor |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial testing documentation |
