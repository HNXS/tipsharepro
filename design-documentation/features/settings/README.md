---
title: Settings Feature Design
description: UX specifications for configuration and settings management
last-updated: 2026-01-08
version: 1.0.0
status: approved
---

# Settings Feature

## Overview

Settings allow administrators to configure how Tip Share Pro works for their restaurant. This includes team management, position rates, pay period configuration, and account settings. The design emphasizes clarity and prevents accidental changes to critical settings.

---

## User Stories

> *As an admin, I want to configure tip rates for each position so that the distribution reflects our restaurant's pay structure.*

> *As a manager, I want to manage team members so I can add new hires and remove people who've left.*

> *As an admin, I want to configure pay periods so that distributions align with our payroll schedule.*

---

## Settings Sections

### 1. Team Management
- Add/edit/remove team members
- Assign positions and rates
- Set active/inactive status

### 2. Positions & Rates
- Define job positions
- Set tip rate multipliers
- Configure position hierarchy

### 3. Pay Periods
- Configure period length
- Set period start day
- Manage period schedule

### 4. Restaurant Profile
- Business information
- Branding settings
- Location details

### 5. User Management (Admin only)
- Invite users
- Assign roles
- Manage permissions

### 6. Account & Security
- Password change
- Two-factor authentication
- Device management

---

## Screen Designs

### 1. Settings Overview

**Layout:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │  Settings                                                    │
│           │  ─────────────────────────────────────────────────────────── │
│  ...      │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │  👥 Team Management                              [→]    ││
│           │  │  Manage team members, positions, and status            ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │  💼 Positions & Rates                            [→]    ││
│           │  │  Configure job positions and tip rate multipliers      ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │  📅 Pay Periods                                  [→]    ││
│           │  │  Set pay period length and schedule                    ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │  🏢 Restaurant Profile                           [→]    ││
│           │  │  Business information and branding                     ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │  👤 User Management                              [→]    ││
│           │  │  Invite users and manage permissions                   ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │  🔒 Account & Security                           [→]    ││
│           │  │  Password, 2FA, and authorized devices                 ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
└───────────┴──────────────────────────────────────────────────────────────┘
```

---

### 2. Team Management

**Team List View:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Settings > Team Management                          [+ Add Team Member]  │
│  ─────────────────────────────────────────────────────────────────────── │
│                                                                           │
│  Active Members (12)                                                      │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  NAME          │ POSITION  │  RATE │ STATUS │ ACTIONS              │ │
│  │─────────────────────────────────────────────────────────────────────│ │
│  │  Maria Santos  │ Server    │ 1.0x  │ Active │ [Edit] [...]         │ │
│  │  James Chen    │ Bartender │ 1.2x  │ Active │ [Edit] [...]         │ │
│  │  Sarah Williams│ Host      │ 0.8x  │ Active │ [Edit] [...]         │ │
│  │  ...                                                                │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  Inactive Members (3)                                          [Show ▼] │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

**Add/Edit Team Member Modal:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Add Team Member                                                [X]    │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐                      │
│  │ FIRST NAME          │  │ LAST NAME           │                      │
│  │ [ Maria           ] │  │ [ Santos          ] │                      │
│  └─────────────────────┘  └─────────────────────┘                      │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ EMAIL (optional)                                                │   │
│  │ [ maria.santos@email.com                                      ] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐                      │
│  │ POSITION            │  │ TIP RATE            │                      │
│  │ [ Server        ▼ ] │  │ [ 1.0           ]x │                      │
│  └─────────────────────┘  └─────────────────────┘                      │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ START DATE                                                      │   │
│  │ [ 01/08/2026                                              📅 ] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ☑ Active - Include in tip calculations                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ───────────────────────────────────────────────────────────────────── │
│  [ Cancel ]                                     [ Add Team Member ]    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Positions & Rates

**Positions Configuration:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Settings > Positions & Rates                           [+ Add Position]  │
│  ─────────────────────────────────────────────────────────────────────── │
│                                                                           │
│  Configure tip rate multipliers for each position.                       │
│  Higher rates mean a larger share of the tip pool.                       │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                                                                     │ │
│  │  POSITION      │ RATE    │ TEAM MEMBERS │ ACTIONS                  │ │
│  │─────────────────────────────────────────────────────────────────────│ │
│  │  Bartender     │ 1.2x    │ 2            │ [Edit] [Delete]          │ │
│  │  ████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │                                                                     │ │
│  │  Server        │ 1.0x    │ 4            │ [Edit] [Delete]          │ │
│  │  ███████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │                                                                     │ │
│  │  Host          │ 0.8x    │ 2            │ [Edit] [Delete]          │ │
│  │  ███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │                                                                     │ │
│  │  Busser        │ 0.6x    │ 3            │ [Edit] [Delete]          │ │
│  │  ███████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │                                                                     │ │
│  │  Food Runner   │ 0.5x    │ 1            │ [Edit] [Delete]          │ │
│  │  █████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  ℹ Rate Explanation                                                │ │
│  │                                                                     │ │
│  │  A rate of 1.0x is the baseline. A bartender at 1.2x earns         │ │
│  │  20% more per hour than a server at 1.0x. A busser at 0.6x         │ │
│  │  earns 40% less per hour.                                          │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

**Rate Visualization:**
```css
.rate-bar {
  height: 8px;
  background: var(--walnut);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: var(--space-2);
}

.rate-bar-fill {
  height: 100%;
  background: var(--brass);
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-standard);
}

/* Width calculation: rate / max_rate * 100% */
/* e.g., 1.2x / 1.5x = 80% */
```

---

### 4. Pay Period Configuration

**Pay Period Settings:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Settings > Pay Periods                                                   │
│  ─────────────────────────────────────────────────────────────────────── │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  PAY PERIOD LENGTH                                                 │ │
│  │                                                                     │ │
│  │  ○ Weekly (7 days)                                                 │ │
│  │  ● Bi-weekly (14 days)                                             │ │
│  │  ○ Semi-monthly (1st-15th, 16th-end)                               │ │
│  │  ○ Monthly                                                         │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  PERIOD START DAY                                                  │ │
│  │                                                                     │ │
│  │  ┌───────────────────────────────────────────┐                     │ │
│  │  │ [ Monday                            ▼ ]   │                     │ │
│  │  └───────────────────────────────────────────┘                     │ │
│  │                                                                     │ │
│  │  Current period: Jan 6 - Jan 19, 2026                              │ │
│  │  Next period: Jan 20 - Feb 2, 2026                                 │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  AUTO-CREATE PERIODS                                               │ │
│  │                                                                     │ │
│  │  ┌────┐                                                            │ │
│  │  │ ON │  Automatically create new pay periods                      │ │
│  │  └────┘                                                            │ │
│  │                                                                     │ │
│  │  New periods are created at midnight on the start day.             │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  [ Save Changes ]                                                        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### 5. User Management (Admin)

**User List:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Settings > User Management                              [+ Invite User]  │
│  ─────────────────────────────────────────────────────────────────────── │
│                                                                           │
│  Users with access to this restaurant.                                   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  USER               │ EMAIL              │ ROLE    │ STATUS│ ACTIONS│ │
│  │─────────────────────────────────────────────────────────────────────│ │
│  │  Tom LaChaussee     │ tom@golden...     │ Admin   │ Active│ [...]   │ │
│  │  Maria Santos       │ maria@email...    │ Designee│ Active│ [...]   │ │
│  │  James Chen         │ james@email...    │ Member  │ Active│ [...]   │ │
│  │  Pending Invite     │ new@email.com     │ Manager │Pending│ [...]   │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  ROLES EXPLANATION                                                 │ │
│  │                                                                     │ │
│  │  Admin     Full access, can manage all settings and users          │ │
│  │  Manager   Can manage team, enter data, view distributions         │ │
│  │  Designee  Can enter daily data only                               │ │
│  │  Member    Can view own tip share only                             │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

**Invite User Modal:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Invite User                                                    [X]    │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ EMAIL ADDRESS                                                   │   │
│  │ [ newuser@email.com                                           ] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ROLE                                                            │   │
│  │ [ Manager                                                  ▼ ] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ☑ Link to team member: [ Maria Santos                     ▼ ] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  An invitation email will be sent with a link to create an account.    │
│                                                                         │
│  ───────────────────────────────────────────────────────────────────── │
│  [ Cancel ]                                       [ Send Invitation ]   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 6. Account & Security

**Security Settings:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Settings > Account & Security                                            │
│  ─────────────────────────────────────────────────────────────────────── │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  PASSWORD                                                          │ │
│  │                                                                     │ │
│  │  Last changed: December 15, 2025                                   │ │
│  │                                                        [Change]    │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  TWO-FACTOR AUTHENTICATION                                         │ │
│  │                                                                     │ │
│  │  ✓ Enabled via SMS to (555) ***-1234                               │ │
│  │                                                                     │ │
│  │  [Change Method]  [Disable 2FA]                                    │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  AUTHORIZED DEVICES                                                │ │
│  │                                                                     │ │
│  │  Chrome on MacBook Pro          Last active: Now         [Remove]  │ │
│  │  Safari on iPhone 14            Last active: 2 hrs ago   [Remove]  │ │
│  │  Firefox on Windows PC          Last active: 3 days ago  [Remove]  │ │
│  │                                                                     │ │
│  │  [Sign Out All Other Devices]                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  ⚠ DANGER ZONE                                                     │ │
│  │                                                                     │ │
│  │  [Delete My Account]                                               │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Interaction Patterns

### Destructive Action Confirmation

For actions like deleting team members or removing users:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Remove Team Member?                                            [X]    │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                         │
│  Are you sure you want to remove Maria Santos?                         │
│                                                                         │
│  • They will be removed from all future calculations                   │
│  • Past distribution records will be preserved                         │
│  • This action cannot be undone                                        │
│                                                                         │
│  ───────────────────────────────────────────────────────────────────── │
│  [ Cancel ]                                             [ Remove ]     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Inline Editing

For quick edits without opening modals:

```css
.inline-edit {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.inline-edit-input {
  background: transparent;
  border: 1px solid transparent;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-standard);
}

.inline-edit-input:hover {
  background: var(--midnight);
  border-color: var(--walnut);
}

.inline-edit-input:focus {
  background: var(--midnight);
  border-color: var(--brass);
  box-shadow: var(--shadow-glow);
}
```

### Settings Save Pattern

**Auto-save with feedback:**
- Changes save automatically after 1 second of inactivity
- "Saved" confirmation appears briefly
- Undo option available for 10 seconds

**Manual save (for critical settings):**
- "Save Changes" button required
- Warning if navigating away with unsaved changes

---

## Accessibility

### Form Labels

All form inputs have visible labels and `aria-describedby` for help text.

### Danger Zone

- Uses `role="alert"` for important warnings
- Color + icon + text for danger actions
- Confirmation requires typing or checkbox

### Navigation

- All settings reachable by keyboard
- Tab order follows visual layout
- Focus returns to trigger after modal close

---

## Related Documentation

- [Forms Component](../../design-system/components/forms.md)
- [Modals Component](../../design-system/components/modals.md)
- [Navigation Component](../../design-system/components/navigation.md)
