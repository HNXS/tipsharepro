# Settings - Interactions

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document details all user interactions within the Settings feature, including triggers, behaviors, and feedback.

---

## Tab Navigation

### Tab Click/Tap

**Trigger:** Click or tap on tab button
**Behavior:**
1. Active tab indicator moves to selected tab
2. Previous panel hides (no animation)
3. New panel displays immediately
4. Focus moves to first focusable element in panel (optional)

**States:**
- Tab receives `:active` styling on click
- Tab shows `:focus-visible` ring on keyboard focus
- Disabled tabs show `not-allowed` cursor

**Keyboard:**
- `Tab`: Move focus to tab list, then to active panel
- `Arrow Left/Right`: Navigate between tabs
- `Home`: Focus first tab
- `End`: Focus last tab
- `Enter/Space`: Activate focused tab

### Tab Switch with Unsaved Changes

**Trigger:** Switch tabs when current tab has unsaved changes
**Behavior:**
1. Intercept tab switch
2. Display unsaved changes warning modal
3. User chooses: Save, Discard, or Cancel

```javascript
// Pseudo-code
onTabSwitch(newTab) {
  if (hasUnsavedChanges) {
    showUnsavedWarning({
      onSave: () => { saveChanges(); switchTo(newTab); },
      onDiscard: () => { discardChanges(); switchTo(newTab); },
      onCancel: () => { /* stay on current tab */ }
    });
  } else {
    switchTo(newTab);
  }
}
```

---

## Form Interactions

### Text Input

**Focus:**
- Border changes to primary color (2px)
- Focus ring appears (3px rgba glow)
- Label may animate (if floating label pattern)

**Input:**
- Real-time character entry
- No auto-save on input
- Validation on blur (optional)

**Blur:**
- Focus styling removed
- Validation triggered (if configured)
- Error message displayed (if invalid)

### Select Dropdown

**Click to Open:**
1. Dropdown button shows pressed state
2. Options menu appears below/above (based on space)
3. Current selection highlighted
4. Focus moves to options list

**Option Selection:**
1. Clicked option receives selection
2. Menu closes
3. Selected value displays in button
4. Focus returns to dropdown button
5. Change event fires

**Keyboard (Closed):**
- `Space/Enter`: Open dropdown
- `Arrow Down`: Open and focus first option
- `Arrow Up`: Open and focus last option

**Keyboard (Open):**
- `Arrow Up/Down`: Navigate options
- `Enter/Space`: Select focused option
- `Escape`: Close without selecting
- `Home`: Focus first option
- `End`: Focus last option
- Type-ahead: Focus matching option

### Checkbox

**Click/Tap:**
1. Toggle checked state
2. Checkmark animates in/out (150ms)
3. Checkbox receives momentary active styling
4. Associated label activates checkbox on click

**Keyboard:**
- `Space`: Toggle checked state (when focused)
- `Tab`: Move focus between checkboxes

**State Change Animation:**
```css
.checkbox-checkmark {
  transform: scale(0);
  opacity: 0;
  transition: all 150ms ease-out;
}

.checkbox:checked + .checkbox-checkmark {
  transform: scale(1);
  opacity: 1;
}
```

### Radio Button

**Click/Tap:**
1. Selected radio becomes checked
2. Previously selected radio unchecks
3. Fill animation (center dot scales in)

**Keyboard:**
- `Arrow Up/Down/Left/Right`: Move selection within group
- `Tab`: Move focus to/from radio group

### Weight Dropdown (Special)

**Options:** 1.00 to 5.00 in 0.25 increments (17 options)

**Behavior:**
- Same as standard dropdown
- Monospace font for alignment
- Current selection shown with checkmark

**Keyboard Enhancement:**
- Type "1.5" to jump to 1.50
- Type "2" to jump to 2.00

---

## Help System Interactions

### ?Note Hover Tooltip

**Trigger:** Hover over yellow `?` icon (desktop) or tap (touch)

**Desktop Behavior:**
1. Mouse enters icon area
2. 200ms delay before showing tooltip
3. Tooltip fades in (150ms)
4. Tooltip positioned above icon by default
5. Repositions if near viewport edge
6. Mouse leaves → 100ms delay → tooltip fades out

**Touch Behavior:**
1. Tap icon
2. Tooltip appears immediately
3. Tap anywhere else to dismiss
4. Second tap on same icon dismisses

**Positioning Logic:**
```javascript
function positionTooltip(trigger, tooltip) {
  const triggerRect = trigger.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  // Default: above
  let top = triggerRect.top - tooltipRect.height - 8;
  let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

  // Flip if too close to top
  if (top < 8) {
    top = triggerRect.bottom + 8;
    tooltip.classList.add('tooltip-bottom');
  }

  // Constrain to viewport
  left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}
```

### !!Note Critical Modal

**Trigger:** Click red/orange `!!` icon or system-triggered on critical action

**Open Sequence:**
1. Icon clicked
2. Overlay fades in (150ms)
3. Modal slides up (200ms)
4. Focus moves to modal
5. Body scroll disabled

**Acknowledgment Flow:**
1. User reads content
2. User checks acknowledgment checkbox
3. Continue button enables
4. User clicks Continue
5. Modal closes
6. Acknowledgment stored (session/local storage)

**Close Sequence:**
1. Continue button clicked OR Escape pressed (if allowed)
2. Modal slides down (150ms)
3. Overlay fades out (150ms)
4. Focus returns to trigger element
5. Body scroll re-enabled

**Blocking Behavior:**
- User cannot proceed without acknowledgment
- Checkbox is required
- No "X" close button (must acknowledge)
- Escape key may be disabled for critical notices

---

## Save/Cancel Interactions

### Save Changes Button

**Default State:**
- Enabled when form has changes
- Disabled when no changes (optional)

**Click Sequence:**
1. Button shows loading state (spinner)
2. Form data validated
3. API call made
4. Success: Toast shown, button returns to default
5. Error: Toast shown, button returns to default, form data preserved

**Loading State:**
```html
<button class="btn btn-primary" disabled>
  <span class="spinner-sm"></span>
  Saving...
</button>
```

### Cancel Button

**Click Sequence:**
1. If no changes: Navigate away immediately
2. If changes: Show unsaved changes warning
3. User confirms: Discard changes, navigate away
4. User cancels: Stay on page

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save current tab |
| `Escape` | Cancel/close modal |

---

## Validation Interactions

### Field-Level Validation

**On Blur:**
1. Validate field value
2. If invalid: Show error styling + message
3. If valid: Show success styling (optional)

**On Input (after error):**
1. Re-validate on each keystroke
2. Remove error when valid
3. Don't show error on empty (until blur)

**Error Styling:**
```css
.form-input.error {
  border-color: var(--color-error);
  border-width: 2px;
}

.form-error {
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  animation: slideIn 150ms ease-out;
}
```

### Form-Level Validation

**On Submit:**
1. Validate all fields
2. If errors: Focus first error field, show all errors
3. If valid: Proceed with save

---

## Multi-Location Interactions

### Enable Multi-Location Toggle

**Trigger:** Toggle multi-location switch ON

**Behavior:**
1. Toggle animates to ON position
2. Confirmation modal appears (!!Note style)
3. User acknowledges implications
4. Location management section expands
5. "Add Location" button appears

### Add Location

**Trigger:** Click "Add Location" button

**Behavior:**
1. Modal appears with location form
2. User enters location details
3. Save creates new location
4. Location appears in list

### Switch Location Context

**Trigger:** Select different location from list

**Behavior:**
1. Settings reload for selected location
2. Location indicator updates
3. All tab data reflects selected location

---

## User Management Interactions (Admin)

### Add User

**Trigger:** Click "Add User" button

**Behavior:**
1. Modal opens with user form
2. Admin enters user details
3. Admin selects role from dropdown
4. Admin selects location access (if multi-location)
5. Click "Send Invitation"
6. Email sent to new user
7. User appears in list as "Pending"

### Edit User

**Trigger:** Click "Edit" dropdown on user row

**Options:**
- Edit Details → Opens edit modal
- Change Role → Role dropdown
- Deactivate → Confirmation dialog
- Reset Password → Send reset email

### Deactivate User

**Trigger:** Select "Deactivate" from user menu

**Behavior:**
1. Confirmation dialog appears
2. Admin confirms
3. User status changes to "Inactive"
4. User cannot log in
5. User data preserved for records

---

## Responsive Interactions

### Mobile Tab Navigation

**Behavior on narrow screens:**
- Tabs scroll horizontally
- Swipe gesture to scroll
- Active tab auto-scrolls into view

### Touch Optimization

**Touch targets:**
- All interactive elements minimum 44×44px
- Adequate spacing between targets
- No hover-only interactions on touch devices

---

## Animation Specifications

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Tab indicator | transform | 200ms | ease-out |
| Tooltip show | opacity | 150ms | ease-out |
| Tooltip hide | opacity | 100ms | ease-in |
| Modal open | transform, opacity | 200ms | ease-out |
| Modal close | transform, opacity | 150ms | ease-in |
| Checkbox check | transform, opacity | 150ms | ease-out |
| Error message | opacity, transform | 150ms | ease-out |
| Button loading | opacity | 150ms | ease-out |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial interactions documentation |
