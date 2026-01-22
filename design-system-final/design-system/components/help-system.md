# Help System Components - ?Note and !!Note

**Version:** 1.0
**Date:** January 15, 2026

---

## Overview

TipSharePro uses two types of contextual help indicators:

| Type | Visual | Behavior | Purpose |
|------|--------|----------|---------|
| **?Note** | Yellow/Amber "?" | Hover tooltip | General help, recommendations |
| **!!Note** | Red/Orange "!!" | Modal with checkbox | Critical compliance warnings |

---

## ?Note (Help Tooltip)

For general guidance and recommendations.

### Visual Specification

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  Label with ?Note                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Contribution %  ⓘ ← Yellow/amber color                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  On Hover:                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Contribution %  ⓘ                                      │   │
│  │         ┌────────────────────────────────────────────┐  │   │
│  │         │ TipSharePro recommends a percentage of     │  │   │
│  │         │ sales. The taxing authorities require 8%   │  │   │
│  │         │ of sales be reported for tip income.       │  │   │
│  │         └────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Specifications

| Property | Value |
|----------|-------|
| Icon | Question mark in circle (?) |
| Icon Color | `--color-info` (#35A0D2) |
| Icon Size | 16px |
| Trigger | Hover |
| Tooltip Background | `--bg-surface` (#1A1510) |
| Tooltip Border | 1px solid `--bg-border` |
| Tooltip Text | `--text-primary` |
| Tooltip Padding | 12px 16px |
| Tooltip Max Width | 280px |
| Tooltip Radius | 8px |
| Animation | Fade in 150ms |

### CSS

```css
.help-note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.help-note-icon {
  width: 16px;
  height: 16px;
  color: var(--color-info);
  cursor: help;
  transition: color var(--transition-fast);
}

.help-note-icon:hover {
  color: var(--color-primary);
}

.help-note-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  padding: 12px 16px;
  max-width: 280px;
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  font-size: var(--text-body-sm);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  z-index: var(--z-tooltip);
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-fast), visibility var(--transition-fast);
}

.help-note:hover .help-note-tooltip {
  opacity: 1;
  visibility: visible;
}

/* Arrow */
.help-note-tooltip::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: var(--bg-border);
}
```

### Content Examples

| Setting | ?Note Text |
|---------|-----------|
| Contribution % | "TipSharePro recommends a percentage of sales. The taxing authorities require 8% of sales be reported for tip income as a true up (allocations) at the end of the year." |
| Monthly Estimate | "Use whichever criteria you used above. Any relatively close estimate will suffice." |
| Job Categories | "Check the job categories you intend to use. Keep it simple and use as few positions as possible at first." |
| Job Weights | "1 is the lowest category in the pool. 5 is the highest. Don't get bogged down the first time." |

---

## !!Note (Critical Warning Modal)

For compliance warnings that require acknowledgment.

### Visual Specification

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  Setting with !!Note                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Change Weights  ⚠️ ← Red/orange color                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  On Click (after Launch Date):                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ╔═══════════════════════════════════════════════════╗   │   │
│  │ ║  ⚠️ IMPORTANT NOTICE                              ║   │   │
│  │ ║                                                   ║   │   │
│  │ ║  Changing job category weights after Launch      ║   │   │
│  │ ║  Date requires proper employee notification.     ║   │   │
│  │ ║                                                   ║   │   │
│  │ ║  Affected employees must receive:                ║   │   │
│  │ ║  • 1 full pay period written notice             ║   │   │
│  │ ║  • Signed acknowledgment form                   ║   │   │
│  │ ║                                                   ║   │   │
│  │ ║  ☐ I Have Read and Agree                        ║   │   │
│  │ ║                                                   ║   │   │
│  │ ║  [Cancel]  [Continue →]                         ║   │   │
│  │ ╚═══════════════════════════════════════════════════╝   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Specifications

| Property | Value |
|----------|-------|
| Icon | Exclamation in triangle (⚠️) |
| Icon Color | `--color-warning` (#F59E0B) or `--color-error` (#DC2626) |
| Icon Size | 16px |
| Trigger | Click (blocks action) |
| Modal Background | `--bg-surface` (#1A1510) |
| Modal Border | 2px solid `--color-warning` |
| Modal Padding | 24px |
| Modal Max Width | 480px |
| Checkbox | Required before Continue |
| Logging | Timestamp + User ID stored |

### CSS

```css
.critical-note-icon {
  width: 16px;
  height: 16px;
  color: var(--color-warning);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.critical-note-icon:hover {
  color: var(--color-error);
}

/* Modal */
.critical-note-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 10, 7, 0.9);
  z-index: var(--z-modal-backdrop);
}

.critical-note-content {
  width: 100%;
  max-width: 480px;
  margin: 16px;
  padding: 24px;
  background: var(--bg-surface);
  border: 2px solid var(--color-warning);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.critical-note-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: var(--text-h4);
  font-weight: var(--font-semibold);
  color: var(--color-warning);
}

.critical-note-body {
  margin-bottom: 20px;
  font-size: var(--text-body);
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
}

.critical-note-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
}

.critical-note-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
}

.critical-note-checkbox label {
  font-size: var(--text-body);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  cursor: pointer;
}

.critical-note-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

### Behavior Rules

| Timing | !!Note Behavior |
|--------|-----------------|
| **Before Launch Date** | Visible but non-blocking (informational) |
| **After Launch Date** | Requires checkbox acknowledgment |
| **On Acknowledge** | Log: timestamp, user ID, setting changed |

### Content Examples

| Setting Change | !!Note Content |
|----------------|----------------|
| Contribution Rate Increase | "Changing contribution rate requires 30 days written notice to all contributing employees (servers). Affected employees must sign acknowledgment form." |
| Job Category Weight Change | "Changing job category weights after Launch Date requires proper employee notification. Affected employees must receive 1 full pay period written notice." |
| Admin Privileges | "Do not give Admin privileges to anyone you do not trust to keep you out of trouble from Labor Department scrutiny." |

---

## Accessibility

### ?Note Tooltips
- Tooltips appear on focus as well as hover
- Content is readable by screen readers
- Keyboard: focus icon, tooltip appears

### !!Note Modals
- Modal traps focus when open
- Escape key closes modal
- Screen reader announces "Important notice"
- Checkbox must be checked to enable Continue

---

## Related Files

- [Forms](./forms.md)
- [Modals](./modals.md)
- [Colors](../tokens/colors.md)
