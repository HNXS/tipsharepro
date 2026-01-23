// Variable weight scale: 1-5 with 0.25 increments (17 options)
export type VariableWeight = 1 | 1.25 | 1.5 | 1.75 | 2 | 2.25 | 2.5 | 2.75 | 3 | 3.25 | 3.5 | 3.75 | 4 | 4.25 | 4.5 | 4.75 | 5;

// Contribution method types
export type ContributionMethod = 'CC_SALES' | 'CC_TIPS' | 'ALL_TIPS' | 'ALL_SALES';

// Contribution rate - depends on method
// ALL_SALES: 1-5% in 0.25 increments
// Others (tips-based): 5-25% in 0.5 increments
export type ContributionRate = number;

// 5 Job Category Colors (Finalized by Tom - January 11, 2026)
// BOH (Kitchen) - Orange, FOH (Non Tipped) - Violet, Bar - Cyan, Support - Lime Green, Custom - Yellow
export type CategoryColor = 'boh' | 'foh' | 'bar' | 'support' | 'custom';

// Category color mapping for display
export const CATEGORY_COLOR_MAP: Record<CategoryColor, { name: string; bgClass: string; hex: string }> = {
  boh: { name: 'BOH (Kitchen)', bgClass: 'badge-boh', hex: '#E85D04' },
  foh: { name: 'FOH (Non Tipped)', bgClass: 'badge-foh', hex: '#8E44AD' },
  bar: { name: 'Bar', bgClass: 'badge-bar', hex: '#35A0D2' },
  support: { name: 'Support', bgClass: 'badge-support', hex: '#82B536' },
  custom: { name: 'Custom', bgClass: 'badge-custom', hex: '#F1C40F' },
};

export interface JobCategory {
  id: string;
  name: string;
  variableWeight: VariableWeight;
  description?: string;
  categoryColor: CategoryColor;  // Required: one of 5 badge colors
  group?: 'kitchen' | 'frontOfHouse' | 'bar' | 'support' | 'custom';
}

// Employee status for tracking (Full version feature)
export type EmployeeStatus = 'active' | 'new' | 'rehired' | 'borrowed' | 'split_job' | 'name_change';

export interface Employee {
  id: string;
  name: string;
  jobCategoryId: string;
  hourlyRate: number;
  hoursWorked: number;
  status?: EmployeeStatus;
  weightAdjustment?: number; // +/- adjustment (0.25 increments, max +0.75)
}

export interface Settings {
  companyName: string;
  contributionMethod: ContributionMethod;
  contributionRate: ContributionRate;
  estimatedMonthlySales: number;
  payPeriodType: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
  jobCategories: JobCategory[];
  selectedCategories: string[]; // IDs of selected categories (predefined + custom)
  payPeriodStartDate?: string;
  payPeriodEndDate?: string;
}

// Stat Card for Distribution Table header
export interface StatCard {
  id: string;
  label: string;
  value: string | number;
  isDemo?: boolean;
  hasHelpNote?: boolean;
  helpText?: string;
  editable?: boolean;
}

// Distribution row for the Distribution Table
export interface DistributionRow {
  employeeId: string;
  employeeName: string;
  categoryColor: CategoryColor;
  categoryName: string;
  wages: number;           // Editable, hidden on print
  hours: number;           // Editable
  baseWeight: VariableWeight;
  weightAdjustment: number; // +/- 0.25 increments (max +0.75)
  effectiveWeight: number;  // baseWeight + adjustment
  sharePercent: number;     // Auto-calculated
  shareDollars: number;     // Auto-calculated, rounded
  dollarsPerHour: number;   // Auto-calculated, optional on print
}

export interface DistributionResult {
  employeeId: string;
  employeeName: string;
  jobCategory: string;
  categoryColor: CategoryColor;
  hoursWorked: number;
  hourlyRate: number;
  variableWeight: VariableWeight;
  weightAdjustment: number;
  effectiveWeight: number;
  // basis is calculated but NEVER shown to users
  // basis = hoursWorked * hourlyRate * effectiveWeight
  sharePercentage: number;
  shareAmount: number;
  receivedAmount: number; // rounded share or adjusted for exact matching
  dollarsPerHour: number;
}

export interface DemoState {
  currentStep: 0 | 1 | 2 | 3; // 0 = login page
  settings: Settings;
  employees: Employee[];
  estimatedMonthlySales: number;
  projectedPool: number; // (Monthly Sales / 2) * Contribution %
  distributionResults: DistributionResult[];
  // Demo-specific state
  prePaidAmount: number;
  netPool: number;
  showWelcomeDialog: boolean;
  printIncludeSharePerHour: boolean;
}

// Predefined job categories organized by 5 color groups (from PRD)
export const PREDEFINED_CATEGORIES = {
  // BOH (Kitchen) - Orange #E85D04
  boh: [
    { id: 'lead-cook', name: 'Lead Cook', variableWeight: 4 as VariableWeight, categoryColor: 'boh' as CategoryColor, group: 'kitchen' as const },
    { id: 'line-cook', name: 'Line Cook', variableWeight: 3 as VariableWeight, categoryColor: 'boh' as CategoryColor, group: 'kitchen' as const },
    { id: 'pastry-chef', name: 'Pastry Chef', variableWeight: 3 as VariableWeight, categoryColor: 'boh' as CategoryColor, group: 'kitchen' as const },
    { id: 'pantry-chef', name: 'Pantry Chef', variableWeight: 3 as VariableWeight, categoryColor: 'boh' as CategoryColor, group: 'kitchen' as const },
  ],
  // FOH (Non Tipped) - Violet #8E44AD
  foh: [
    { id: 'host-hostess', name: 'Host/Hostess', variableWeight: 2 as VariableWeight, categoryColor: 'foh' as CategoryColor, group: 'frontOfHouse' as const },
    { id: 'busser', name: 'Busser', variableWeight: 2 as VariableWeight, categoryColor: 'foh' as CategoryColor, group: 'frontOfHouse' as const },
    { id: 'cashier', name: 'Cashier', variableWeight: 2 as VariableWeight, categoryColor: 'foh' as CategoryColor, group: 'frontOfHouse' as const },
    { id: 'runner', name: 'Runner', variableWeight: 2 as VariableWeight, categoryColor: 'foh' as CategoryColor, group: 'frontOfHouse' as const },
  ],
  // Bar - Cyan #35A0D2
  bar: [
    { id: 'bartender', name: 'Bartender', variableWeight: 4 as VariableWeight, categoryColor: 'bar' as CategoryColor, group: 'bar' as const },
    { id: 'barista', name: 'Barista', variableWeight: 3 as VariableWeight, categoryColor: 'bar' as CategoryColor, group: 'bar' as const },
    { id: 'bar-back', name: 'Bar Back', variableWeight: 2 as VariableWeight, categoryColor: 'bar' as CategoryColor, group: 'bar' as const },
  ],
  // Support (FOH or BOH) - Lime Green #82B536
  support: [
    { id: 'dishwasher', name: 'Dishwasher', variableWeight: 1 as VariableWeight, categoryColor: 'support' as CategoryColor, group: 'support' as const },
    { id: 'prep-cook', name: 'Prep Cook', variableWeight: 2 as VariableWeight, categoryColor: 'support' as CategoryColor, group: 'support' as const },
  ],
  // Custom (Big Leagues) - Yellow #F1C40F
  custom: [
    { id: 'maitre-d', name: "Maitre D'", variableWeight: 5 as VariableWeight, categoryColor: 'custom' as CategoryColor, group: 'custom' as const },
    { id: 'sommelier', name: 'Sommelier', variableWeight: 5 as VariableWeight, categoryColor: 'custom' as CategoryColor, group: 'custom' as const },
    { id: 'banquet-chef', name: 'Banquet Chef', variableWeight: 5 as VariableWeight, categoryColor: 'custom' as CategoryColor, group: 'custom' as const },
  ],
};

// Flattened list of all predefined categories
export const ALL_PREDEFINED_CATEGORIES: JobCategory[] = [
  ...PREDEFINED_CATEGORIES.boh,
  ...PREDEFINED_CATEGORIES.foh,
  ...PREDEFINED_CATEGORIES.bar,
  ...PREDEFINED_CATEGORIES.support,
  ...PREDEFINED_CATEGORIES.custom,
];

// Default job categories (selected by default for demo) - 5 representing each color
export const DEFAULT_JOB_CATEGORIES: JobCategory[] = [
  { id: 'line-cook', name: 'Line Cook', variableWeight: 3, categoryColor: 'boh', group: 'kitchen' },
  { id: 'host-hostess', name: 'Host/Hostess', variableWeight: 2, categoryColor: 'foh', group: 'frontOfHouse' },
  { id: 'bartender', name: 'Bartender', variableWeight: 4, categoryColor: 'bar', group: 'bar' },
  { id: 'dishwasher', name: 'Dishwasher', variableWeight: 1, categoryColor: 'support', group: 'support' },
  { id: 'busser', name: 'Busser', variableWeight: 2, categoryColor: 'foh', group: 'frontOfHouse' },
];

// Demo employees (10 pre-set as per PRD)
export const DEFAULT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Maria Santos', jobCategoryId: 'line-cook', hourlyRate: 22.00, hoursWorked: 80, status: 'active' },
  { id: '2', name: 'James Wilson', jobCategoryId: 'bartender', hourlyRate: 24.00, hoursWorked: 64, status: 'active' },
  { id: '3', name: 'Sarah Johnson', jobCategoryId: 'host-hostess', hourlyRate: 16.00, hoursWorked: 48, status: 'active' },
  { id: '4', name: 'Mike Chen', jobCategoryId: 'busser', hourlyRate: 15.50, hoursWorked: 56, status: 'active' },
  { id: '5', name: 'Lisa Park', jobCategoryId: 'dishwasher', hourlyRate: 16.00, hoursWorked: 72, status: 'active' },
  { id: '6', name: 'Tom Rodriguez', jobCategoryId: 'line-cook', hourlyRate: 20.00, hoursWorked: 68, status: 'active' },
  { id: '7', name: 'Amy Martinez', jobCategoryId: 'host-hostess', hourlyRate: 15.00, hoursWorked: 40, status: 'active' },
  { id: '8', name: 'Dan Torres', jobCategoryId: 'busser', hourlyRate: 15.00, hoursWorked: 52, status: 'active' },
  { id: '9', name: 'Katie Middleton', jobCategoryId: 'bartender', hourlyRate: 22.00, hoursWorked: 56, status: 'active' },
  { id: '10', name: 'Chris Lee', jobCategoryId: 'dishwasher', hourlyRate: 15.50, hoursWorked: 64, status: 'active' },
];

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  companyName: "Demo Restaurant",
  contributionMethod: 'ALL_SALES',
  contributionRate: 3.25,
  estimatedMonthlySales: 80000,
  payPeriodType: 'bi-weekly',
  jobCategories: DEFAULT_JOB_CATEGORIES,
  selectedCategories: ['line-cook', 'host-hostess', 'bartender', 'dishwasher', 'busser'],
};

// Generate variable weight options (1-5 with 0.25 increments)
export const VARIABLE_WEIGHT_OPTIONS: VariableWeight[] = [
  1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5
];

// Whole number weight options (for Settings Step 5)
export const WHOLE_WEIGHT_OPTIONS: number[] = [1, 2, 3, 4, 5];

// Contribution rate options based on method
export function getContributionRateOptions(method: ContributionMethod): number[] {
  if (method === 'ALL_SALES') {
    // 1-5% in 0.25 increments
    const options: number[] = [];
    for (let rate = 1; rate <= 5; rate += 0.25) {
      options.push(rate);
    }
    return options;
  } else {
    // Tips-based: 5-25% in 0.5 increments
    const options: number[] = [];
    for (let rate = 5; rate <= 25; rate += 0.5) {
      options.push(rate);
    }
    return options;
  }
}

// Get default contribution rate for a method
export function getDefaultRateForMethod(method: ContributionMethod): number {
  return method === 'ALL_SALES' ? 3.25 : 15;
}

// Get category color CSS class from category ID
export function getCategoryColorClass(categoryId: string, categories: JobCategory[]): string {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return 'badge-support'; // default fallback
  return `badge-${category.categoryColor}`;
}

// Get category by ID
export function getCategoryById(categoryId: string, categories: JobCategory[]): JobCategory | undefined {
  return categories.find(c => c.id === categoryId);
}

// Help text for tooltips - aligned with PRD
export const HELP_TEXT = {
  // Step 1: Contribution Method
  contributionMethod: 'Choose how servers contribute to the tip pool:\n• CC Sales: Based on credit card sales only\n• CC Tips: Based on credit card tips only\n• All Tips: Based on all tips (cash + credit card)\n• All Sales: Based on all sales (recommended - same method IRS uses for tip allocation)',
  // Step 2: Estimated Monthly Amount
  estimatedMonthlySales: 'Use whichever criteria you selected above. Any relatively close estimate will suffice.',
  // Step 3: Contribution Rate (dynamic based on method)
  contributionRateSales: 'For sales-based calculations, choose a rate between 1% and 5% in 0.25% increments.',
  contributionRateTips: 'For tips-based calculations, choose a rate between 5% and 25% in 0.5% increments.',
  // Step 4: Job Categories
  jobCategories: 'Check the job categories you intend to use. Keep it simple and use as few positions as possible at first.',
  // Step 5: Variable Weights
  variableWeight: '1 is the lowest category in the pool. 5 is the highest. Don\'t get bogged down the first time.',
  // Other help text
  payPeriodType: 'How often your pay periods occur. This affects when tip pool distributions are calculated.',
  projectedPool: 'Calculated as: (Monthly Sales / 2) x Contribution Rate. This is the approximate amount available for distribution each pay period.',
  hoursWorked: 'Total hours worked during the pay period.',
  hourlyRate: 'The employee\'s regular hourly pay rate.',
  prePaid: 'Amount paid early to terminated employees or corrections from previous periods. Link to PDF for details.',
  // Backwards compatibility
  contributionRate: 'The percentage used to calculate the contribution to the tip pool.',
};

// Contribution method display labels
export const CONTRIBUTION_METHOD_LABELS: Record<ContributionMethod, string> = {
  CC_SALES: 'CC Sales',
  CC_TIPS: 'CC Tips',
  ALL_TIPS: 'All Tips',
  ALL_SALES: 'All Sales',
};

// Demo welcome dialog text (from PRD)
export const DEMO_WELCOME_TEXT = `The table displayed assumes your distribution employee's data is up to date and all that is needed is the hours entered. This is a good representation of the finalizing of Distributions. All updating of any employee data (new employee, wage increase, category change etc) can be accomplished before PPE so as not to hold up Pay Day.

Enter Hours, Double Check for Errors, Print for posting and Email to Payroll.

At this point just enter hours and see how your settings affected the pool. You can change wages, hours and if you click on the name cell, change category weights by .25 increments up to .75. Whole number Category weights are changeable in the Demo settings above. Return to the original Distribution table settings by pressing the 'default settings' button.`;

// Demo dialog for reducing employees
export const DEMO_EMPLOYEE_DIALOG = 'You can set hours to zero on any employee you want to eliminate from the pool if it holds too many recipients.';
