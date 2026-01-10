# Settings - Implementation Notes

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document provides technical implementation guidance for the Settings feature, including data structures, API contracts, and component architecture.

---

## Data Structures

### Settings Object

```typescript
interface Settings {
  location: LocationSettings;
  payPeriod: PayPeriodSettings;
  contribution: ContributionSettings;
  jobCategories: JobCategory[];
  weights: WeightSettings;
}

interface LocationSettings {
  id: string;
  name: string;
  address: string;
  isMultiLocation: boolean;
  locations?: Location[];
}

interface Location {
  id: string;
  name: string;
  address: string;
  isPrimary: boolean;
}

interface PayPeriodSettings {
  type: 'weekly' | 'biweekly' | 'semimonthly';
  startDate: string; // ISO date
  dayOfWeek?: number; // 0-6 for weekly
}

interface ContributionSettings {
  method: 'cc_sales' | 'cc_tips' | 'all_tips' | 'all_sales';
  rate: number; // Decimal (0.03 = 3%)
}

interface JobCategory {
  id: string;
  name: string;
  type: 'foh' | 'boh' | 'bar' | 'support';
  isDefault: boolean;
  isEnabled: boolean;
  displayOrder: number;
}

interface WeightSettings {
  [categoryId: string]: number; // 1.00 to 5.00
}
```

### User Object

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'designee' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  locationAccess: string[]; // Location IDs
  createdAt: string;
  lastLogin?: string;
}
```

---

## API Contracts

### GET /api/settings

Retrieve all settings for current account.

**Response:**
```json
{
  "location": {
    "id": "loc_123",
    "name": "Downtown Bistro",
    "address": "123 Main St, Cityville, ST 12345",
    "isMultiLocation": false
  },
  "payPeriod": {
    "type": "biweekly",
    "startDate": "2026-01-01"
  },
  "contribution": {
    "method": "all_sales",
    "rate": 0.03
  },
  "jobCategories": [
    {
      "id": "cat_server",
      "name": "Server",
      "type": "foh",
      "isDefault": true,
      "isEnabled": true,
      "displayOrder": 1
    }
  ],
  "weights": {
    "cat_server": 1.00,
    "cat_bartender": 1.25
  }
}
```

### PATCH /api/settings/:section

Update specific settings section.

**Request (Location):**
```json
{
  "name": "Downtown Bistro & Bar",
  "address": "123 Main St, Cityville, ST 12345"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated location settings */ }
}
```

### GET /api/users

Retrieve all users (Admin only).

**Response:**
```json
{
  "users": [
    {
      "id": "usr_123",
      "name": "John Smith",
      "email": "john@restaurant.com",
      "role": "admin",
      "status": "active",
      "locationAccess": ["loc_123"],
      "createdAt": "2026-01-01T00:00:00Z",
      "lastLogin": "2026-01-10T08:30:00Z"
    }
  ]
}
```

### POST /api/users/invite

Invite new user.

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@restaurant.com",
  "role": "manager",
  "locationAccess": ["loc_123", "loc_456"]
}
```

---

## Component Architecture

### Page Component

```jsx
// SettingsPage.jsx
function SettingsPage() {
  const [activeTab, setActiveTab] = useState('location');
  const [settings, setSettings] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  const handleTabChange = (tab) => {
    if (isDirty) {
      showUnsavedWarning(() => {
        setIsDirty(false);
        setActiveTab(tab);
      });
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <main className="settings-page">
      <PageHeader title="Settings" />
      <TabList
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole={currentUser.role}
      />
      <TabPanels
        activeTab={activeTab}
        settings={settings}
        onSettingsChange={(changes) => {
          setSettings({ ...settings, ...changes });
          setIsDirty(true);
        }}
        onSave={handleSave}
      />
    </main>
  );
}
```

### Tab Configuration

```javascript
const TABS = [
  { id: 'location', label: 'Location', minRole: 'manager' },
  { id: 'payperiod', label: 'Pay Period', minRole: 'manager' },
  { id: 'contribution', label: 'Contribution', minRole: 'manager' },
  { id: 'categories', label: 'Job Categories', minRole: 'manager' },
  { id: 'weights', label: 'Weights', minRole: 'manager' },
  { id: 'users', label: 'Users', minRole: 'admin', badge: 'Admin' }
];
```

### Form State Management

```javascript
// useSettingsForm.js
function useSettingsForm(initialData, section) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = validateSection(section, formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validate()) {
      focusFirstError();
      return false;
    }

    setIsSaving(true);
    try {
      await api.patch(`/settings/${section}`, formData);
      setIsDirty(false);
      showToast('success', 'Settings saved successfully');
      return true;
    } catch (error) {
      showToast('error', 'Unable to save settings');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { formData, errors, isDirty, isSaving, updateField, save };
}
```

---

## Validation Rules

### Location Tab

```javascript
const locationValidation = {
  name: {
    required: true,
    maxLength: 100,
    message: 'Establishment name is required (max 100 characters)'
  },
  address: {
    required: true,
    maxLength: 200,
    message: 'Address is required (max 200 characters)'
  }
};
```

### Pay Period Tab

```javascript
const payPeriodValidation = {
  type: {
    required: true,
    enum: ['weekly', 'biweekly', 'semimonthly'],
    message: 'Select a pay period type'
  },
  startDate: {
    required: true,
    date: true,
    notPast: true,
    message: 'Enter a valid start date'
  }
};
```

### Contribution Tab

```javascript
const contributionValidation = {
  method: {
    required: true,
    enum: ['cc_sales', 'cc_tips', 'all_tips', 'all_sales'],
    message: 'Select a contribution method'
  },
  rate: {
    required: true,
    min: 0.01,
    max: 0.25,
    step: 0.0025, // 0.25% increments
    message: 'Rate must be between 1% and 25%'
  }
};
```

### Weights Tab

```javascript
const weightValidation = {
  weight: {
    required: true,
    min: 1.00,
    max: 5.00,
    step: 0.25,
    message: 'Weight must be between 1.00 and 5.00'
  }
};
```

---

## State Persistence

### Local Storage Keys

```javascript
const STORAGE_KEYS = {
  UNSAVED_SETTINGS: 'tsp_unsaved_settings',
  ACKNOWLEDGED_NOTICES: 'tsp_acknowledged_notices',
  LAST_TAB: 'tsp_settings_last_tab'
};
```

### Auto-Save Draft

```javascript
// Save draft to localStorage on change
useEffect(() => {
  if (isDirty) {
    localStorage.setItem(
      STORAGE_KEYS.UNSAVED_SETTINGS,
      JSON.stringify({ section: activeTab, data: formData })
    );
  }
}, [formData, isDirty]);

// Restore draft on mount
useEffect(() => {
  const draft = localStorage.getItem(STORAGE_KEYS.UNSAVED_SETTINGS);
  if (draft) {
    const { section, data } = JSON.parse(draft);
    if (section === activeTab) {
      showRestorePrompt(data);
    }
  }
}, []);
```

---

## Permission Checks

### Role-Based Access

```javascript
const PERMISSIONS = {
  admin: ['location', 'payperiod', 'contribution', 'categories', 'weights', 'users'],
  manager: ['location', 'payperiod', 'contribution', 'categories', 'weights'],
  designee: [],
  viewer: []
};

function canAccessTab(userRole, tabId) {
  return PERMISSIONS[userRole]?.includes(tabId) ?? false;
}

function canManageUsers(userRole) {
  return userRole === 'admin';
}
```

### Route Protection

```javascript
// SettingsRoute.jsx
function SettingsRoute() {
  const { user } = useAuth();

  if (!canAccessTab(user.role, 'location')) {
    return <Navigate to="/nav" replace />;
  }

  return <SettingsPage />;
}
```

---

## Error Handling

### API Error Handling

```javascript
async function handleApiError(error, context) {
  if (error.status === 401) {
    // Session expired
    redirectToLogin();
  } else if (error.status === 403) {
    // Permission denied
    showToast('error', 'You do not have permission to perform this action');
  } else if (error.status === 422) {
    // Validation error
    return error.data.errors; // Return field errors
  } else {
    // Generic error
    showToast('error', `Error ${context}: Please try again`);
    logError(error);
  }
}
```

### Optimistic Updates

```javascript
async function updateWeight(categoryId, newWeight) {
  const previousWeight = weights[categoryId];

  // Optimistic update
  setWeights(prev => ({ ...prev, [categoryId]: newWeight }));

  try {
    await api.patch('/settings/weights', { [categoryId]: newWeight });
  } catch (error) {
    // Rollback on failure
    setWeights(prev => ({ ...prev, [categoryId]: previousWeight }));
    showToast('error', 'Failed to update weight');
  }
}
```

---

## Performance Considerations

### Lazy Loading

```javascript
// Lazy load tab content
const TabPanels = {
  location: lazy(() => import('./tabs/LocationTab')),
  payperiod: lazy(() => import('./tabs/PayPeriodTab')),
  contribution: lazy(() => import('./tabs/ContributionTab')),
  categories: lazy(() => import('./tabs/CategoriesTab')),
  weights: lazy(() => import('./tabs/WeightsTab')),
  users: lazy(() => import('./tabs/UsersTab'))
};
```

### Debounced Validation

```javascript
const debouncedValidate = useMemo(
  () => debounce(validate, 300),
  [validate]
);
```

---

## Testing

### Unit Tests

```javascript
describe('Settings Validation', () => {
  test('validates required establishment name', () => {
    const errors = validateSection('location', { name: '' });
    expect(errors.name).toBe('Establishment name is required');
  });

  test('validates contribution rate range', () => {
    const errors = validateSection('contribution', { rate: 0.30 });
    expect(errors.rate).toBe('Rate must be between 1% and 25%');
  });
});
```

### Integration Tests

```javascript
describe('Settings Page', () => {
  test('loads and displays settings', async () => {
    render(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByLabelText('Establishment Name')).toHaveValue('Downtown Bistro');
    });
  });

  test('shows unsaved changes warning', async () => {
    render(<SettingsPage />);
    await userEvent.type(screen.getByLabelText('Establishment Name'), ' Updated');
    await userEvent.click(screen.getByRole('tab', { name: 'Pay Period' }));
    expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
  });
});
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial implementation notes |
