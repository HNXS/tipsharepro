# TipSharePro Help System

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

The TipSharePro help system provides contextual guidance through two distinct mechanisms:

1. **?Note (Yellow Question Mark)** - Hover tooltips for general guidance and recommendations
2. **!!Note (Red/Orange Double Exclamation)** - Modal dialogs requiring explicit acknowledgment for critical/compliance information

This system is **unique to TipSharePro** and is designed to provide just-in-time education without interrupting workflow.

---

## ?Note - Hover Tooltips

### Purpose

?Notes provide non-intrusive guidance for:
- Explaining field purposes
- Offering recommendations
- Clarifying business rules
- Providing calculation context

### Visual Design

| Property | Value |
|----------|-------|
| Icon | Yellow circle with `?` |
| Icon Size | `18px` |
| Background | `#F59E0B` (Warning Yellow) |
| Icon Color | `#FFFFFF` |
| Tooltip Background | `#FFFFFF` |
| Tooltip Border | `1px solid #E5E5E5` |
| Tooltip Shadow | `0 4px 12px rgba(0,0,0,0.15)` |
| Max Width | `280px` |

### HTML Structure

```html
<div class="form-group">
  <label class="form-label">
    Contribution Rate
    <span class="help-note" data-tooltip="Based on adjusted sales (total sales minus comps). Industry standard is 3% for tip pooling.">
      <span class="help-note-icon">?</span>
    </span>
  </label>
  <select class="form-select">
    <option>3%</option>
  </select>
</div>
```

### CSS Implementation

```css
.help-note {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: var(--space-2);
  position: relative;
  cursor: help;
}

.help-note-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: var(--color-warning);
  color: var(--color-white);
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 50%;
  transition: transform 150ms ease-out;
}

.help-note:hover .help-note-icon {
  transform: scale(1.1);
}

/* Tooltip */
.help-note::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);

  width: max-content;
  max-width: 280px;
  padding: var(--space-3) var(--space-4);

  background: var(--color-white);
  border: 1px solid var(--color-fog);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  font-family: 'Outfit', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-primary);
  text-transform: none;
  letter-spacing: normal;

  opacity: 0;
  visibility: hidden;
  transition: all 150ms ease-out;
  z-index: 100;
}

/* Tooltip arrow */
.help-note::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);

  border: 6px solid transparent;
  border-top-color: var(--color-fog);

  opacity: 0;
  visibility: hidden;
  transition: all 150ms ease-out;
  z-index: 101;
}

.help-note:hover::after,
.help-note:hover::before {
  opacity: 1;
  visibility: visible;
}

/* Positioning variants */
.help-note.tooltip-right::after {
  left: calc(100% + 8px);
  bottom: auto;
  top: 50%;
  transform: translateY(-50%);
}

.help-note.tooltip-left::after {
  right: calc(100% + 8px);
  left: auto;
  bottom: auto;
  top: 50%;
  transform: translateY(-50%);
}

.help-note.tooltip-bottom::after {
  bottom: auto;
  top: calc(100% + 8px);
}
```

### Common ?Note Content Examples

```html
<!-- Contribution Rate -->
<span class="help-note" data-tooltip="Percentage of gross sales contributed to the tip pool. Industry standard ranges from 2-5% depending on tip reporting method.">

<!-- Weight Field -->
<span class="help-note" data-tooltip="Multiplier applied to hours worked. Higher weights mean larger share of tip pool. Range: 1.00 to 5.00 in 0.25 increments.">

<!-- Hourly Rate (Hidden) -->
<span class="help-note" data-tooltip="Used for fair distribution calculation. This information is confidential and not shown on employee reports.">

<!-- Calculated Contribution -->
<span class="help-note" data-tooltip="Auto-calculated based on reported sales × contribution rate. You can adjust this in the 'Actual Contribution' field if needed.">
```

---

## !!Note - Critical Acknowledgment Modals

### Purpose

!!Notes are used for **critical information** that users must acknowledge before proceeding:
- Legal/compliance warnings
- Data privacy notices
- Irreversible action confirmations
- Regulatory requirements

### Visual Design

| Property | Value |
|----------|-------|
| Icon | Red/Orange circle with `!!` |
| Icon Size | `24px` |
| Background Gradient | `#DC2626` to `#E85D04` |
| Icon Color | `#FFFFFF` |
| Modal Border-Top | `4px solid #DC2626` |
| Checkbox Required | Yes |

### Trigger Button

```html
<button class="critical-note-trigger" aria-label="Important information - click to read">
  <span class="critical-note-icon">!!</span>
</button>
```

```css
.critical-note-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-1);
  margin-left: var(--space-2);
}

.critical-note-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--color-error), var(--color-primary));
  color: var(--color-white);
  font-size: 0.75rem;
  font-weight: 800;
  border-radius: 50%;
  animation: attention-pulse 2s infinite;
}

@keyframes attention-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 6px rgba(220, 38, 38, 0);
  }
}

.critical-note-trigger:hover .critical-note-icon {
  animation: none;
  transform: scale(1.1);
}
```

### Modal Structure

```html
<div class="modal-overlay" role="alertdialog" aria-modal="true" aria-labelledby="critical-title">
  <div class="modal modal-critical">
    <div class="modal-header modal-header-critical">
      <span class="critical-badge">!!</span>
      <h2 id="critical-title" class="modal-title">Wage Confidentiality Notice</h2>
    </div>
    <div class="modal-body">
      <div class="critical-content">
        <p>
          <strong>Important:</strong> The hourly wage rates displayed in this distribution
          report are confidential employee information protected by labor law.
        </p>
        <p>
          Disclosing wage information to other employees or unauthorized parties may:
        </p>
        <ul>
          <li>Violate employee privacy rights</li>
          <li>Create legal liability for the establishment</li>
          <li>Breach company confidentiality policies</li>
        </ul>
        <p>
          When sharing distribution results with employees, always use the
          <strong>"Employee View"</strong> which omits wage data.
        </p>
      </div>
      <label class="critical-acknowledgment">
        <input type="checkbox" class="form-checkbox" id="acknowledge-wages" required>
        <span>I understand that wage information is confidential and will not be shared inappropriately.</span>
      </label>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" id="critical-continue" disabled>
        I Understand, Continue
      </button>
    </div>
  </div>
</div>
```

### CSS Implementation

```css
.modal-critical {
  border-top: 4px solid var(--color-error);
  max-width: 520px;
}

.modal-header-critical {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-6);
  background: var(--color-error-light);
}

.critical-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-error), var(--color-primary));
  color: var(--color-white);
  font-weight: 800;
  font-size: 0.875rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.critical-content {
  background: var(--color-stone);
  border-left: 4px solid var(--color-error);
  padding: var(--space-4);
  border-radius: 0 8px 8px 0;
  margin-bottom: var(--space-5);
}

.critical-content p,
.critical-content ul {
  margin: 0 0 var(--space-3);
  line-height: 1.6;
  color: var(--color-text-primary);
}

.critical-content p:last-child,
.critical-content ul:last-child {
  margin-bottom: 0;
}

.critical-content ul {
  padding-left: var(--space-5);
}

.critical-content li {
  margin-bottom: var(--space-1);
}

.critical-acknowledgment {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-warning-light);
  border: 2px solid var(--color-warning);
  border-radius: 8px;
  cursor: pointer;
}

.critical-acknowledgment span {
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.5;
}

.critical-acknowledgment input {
  margin-top: 3px;
  flex-shrink: 0;
}

/* Disabled button until acknowledged */
.modal-critical .btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### JavaScript Behavior

```javascript
// Enable continue button only when checkbox is checked
document.getElementById('acknowledge-wages').addEventListener('change', function(e) {
  document.getElementById('critical-continue').disabled = !e.target.checked;
});

// Store acknowledgment in session/local storage
document.getElementById('critical-continue').addEventListener('click', function() {
  localStorage.setItem('acknowledged_wages_notice', Date.now());
  closeModal();
});

// Check if already acknowledged (within session)
function shouldShowCriticalNotice(noticeKey) {
  const acknowledged = localStorage.getItem(`acknowledged_${noticeKey}`);
  if (!acknowledged) return true;

  // Re-show after 24 hours
  const hoursSinceAck = (Date.now() - parseInt(acknowledged)) / (1000 * 60 * 60);
  return hoursSinceAck > 24;
}
```

---

## Common !!Note Scenarios

### 1. Wage Confidentiality (Distribution Page)
Shown when accessing detailed distribution with hourly rates.

### 2. Data Export Warning (Export Functions)
Shown before exporting reports containing sensitive data.

### 3. Irreversible Action (Post Distribution)
Shown before finalizing a distribution that cannot be undone.

### 4. First-Time Setup (Initial Settings)
Shown when configuring critical settings for the first time.

### 5. Compliance Reminder (Quarterly)
Shown periodically to remind users of compliance obligations.

---

## Help System Placement Guidelines

### Where to Use ?Notes

- Form field labels (complex fields)
- Table column headers
- Settings pages
- Calculation results
- Feature explanations

### Where to Use !!Notes

- Actions with legal implications
- Access to sensitive data
- Irreversible operations
- Compliance-critical features
- First-time critical feature access

---

## Accessibility

### ?Notes
- Use `cursor: help` to indicate interactive tooltip
- Ensure tooltip content is accessible via keyboard focus
- Provide adequate color contrast
- Don't hide critical information in tooltips only

### !!Notes
- Use `role="alertdialog"` for modals
- Trap focus within modal
- Require explicit acknowledgment
- Allow keyboard navigation
- Announce modal opening to screen readers

```html
<!-- Accessible ?Note with keyboard support -->
<button class="help-note"
        data-tooltip="Help text here"
        aria-label="Help: explanation of this field"
        tabindex="0">
  <span class="help-note-icon" aria-hidden="true">?</span>
</button>
```

---

## Usage Guidelines

### DO
- Keep ?Note text concise (under 100 words)
- Use !!Notes sparingly for truly critical information
- Provide clear, actionable guidance
- Position tooltips to avoid content overlap
- Remember acknowledgment state appropriately

### DON'T
- Don't use !!Notes for minor warnings (use inline alerts)
- Don't hide required information behind ?Notes
- Don't require acknowledgment for non-critical info
- Don't use multiple !!Notes on the same page
- Don't reset acknowledgment state unnecessarily

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial help system specifications |
