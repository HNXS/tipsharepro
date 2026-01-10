// Variable weight scale: 1-5 with 0.25 increments (17 options)
export type VariableWeight = 1 | 1.25 | 1.5 | 1.75 | 2 | 2.25 | 2.5 | 2.75 | 3 | 3.25 | 3.5 | 3.75 | 4 | 4.25 | 4.5 | 4.75 | 5;

// Contribution method types
export type ContributionMethod = 'CC_SALES' | 'CC_TIPS' | 'ALL_TIPS' | 'ALL_SALES';

// Contribution rate - depends on method
// ALL_SALES: 1-5% in 0.25 increments
// Others (tips-based): 5-25% in 0.5 increments
export type ContributionRate = number;

export interface JobCategory {
  id: string;
  name: string;
  variableWeight: VariableWeight;
  description?: string;
  group?: 'kitchen' | 'frontOfHouse' | 'bar' | 'custom';
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

export interface Employee {
  id: string;
  name: string;
  jobCategoryId: string;
  hourlyRate: number;
  hoursWorked: number;
}

export interface DistributionResult {
  employeeId: string;
  employeeName: string;
  jobCategory: string;
  hoursWorked: number;
  hourlyRate: number;
  variableWeight: VariableWeight;
  // basis is calculated but NEVER shown to users
  // basis = hoursWorked * hourlyRate * variableWeight
  sharePercentage: number;
  shareAmount: number;
  receivedAmount: number; // rounded share or adjusted for exact matching
}

export interface DemoState {
  currentStep: 0 | 1 | 2 | 3; // 0 = login page
  settings: Settings;
  employees: Employee[];
  estimatedMonthlySales: number;
  projectedPool: number; // (Monthly Sales / 2) * Contribution %
  distributionResults: DistributionResult[];
}

// Predefined job categories organized by group (from PRD)
export const PREDEFINED_CATEGORIES = {
  kitchen: [
    { id: 'lead-cook', name: 'Lead Cook', variableWeight: 3.5 as VariableWeight, group: 'kitchen' },
    { id: 'line-cook', name: 'Line Cook', variableWeight: 3 as VariableWeight, group: 'kitchen' },
    { id: 'pastry-chef', name: 'Pastry Chef', variableWeight: 3.25 as VariableWeight, group: 'kitchen' },
    { id: 'prep-cook', name: 'Prep Cook', variableWeight: 2.5 as VariableWeight, group: 'kitchen' },
    { id: 'pantry-chef', name: 'Pantry Chef', variableWeight: 2.75 as VariableWeight, group: 'kitchen' },
  ],
  frontOfHouse: [
    { id: 'maitre-d', name: "Maitre D'", variableWeight: 4 as VariableWeight, group: 'frontOfHouse' },
    { id: 'host-hostess', name: 'Host/Hostess', variableWeight: 2.5 as VariableWeight, group: 'frontOfHouse' },
    { id: 'cashier', name: 'Cashier', variableWeight: 2 as VariableWeight, group: 'frontOfHouse' },
    { id: 'runner', name: 'Runner', variableWeight: 2.25 as VariableWeight, group: 'frontOfHouse' },
    { id: 'busser', name: 'Busser', variableWeight: 2 as VariableWeight, group: 'frontOfHouse' },
  ],
  bar: [
    { id: 'barista', name: 'Barista', variableWeight: 2.75 as VariableWeight, group: 'bar' },
    { id: 'bartender', name: 'Bartender', variableWeight: 3.5 as VariableWeight, group: 'bar' },
    { id: 'sommelier', name: 'Sommelier', variableWeight: 4 as VariableWeight, group: 'bar' },
    { id: 'bar-back', name: 'Bar Back', variableWeight: 2.25 as VariableWeight, group: 'bar' },
    { id: 'dishwasher', name: 'Dishwasher', variableWeight: 1.5 as VariableWeight, group: 'bar' },
  ],
};

// Flattened list of all predefined categories
export const ALL_PREDEFINED_CATEGORIES: JobCategory[] = [
  ...PREDEFINED_CATEGORIES.kitchen.map(c => ({ ...c, group: 'kitchen' as const })),
  ...PREDEFINED_CATEGORIES.frontOfHouse.map(c => ({ ...c, group: 'frontOfHouse' as const })),
  ...PREDEFINED_CATEGORIES.bar.map(c => ({ ...c, group: 'bar' as const })),
];

// Default job categories (selected by default for demo)
export const DEFAULT_JOB_CATEGORIES: JobCategory[] = [
  { id: 'bartender', name: 'Bartender', variableWeight: 3.5, group: 'bar' },
  { id: 'line-cook', name: 'Line Cook', variableWeight: 3, group: 'kitchen' },
  { id: 'busser', name: 'Busser', variableWeight: 2, group: 'frontOfHouse' },
  { id: 'host-hostess', name: 'Host/Hostess', variableWeight: 2.5, group: 'frontOfHouse' },
  { id: 'dishwasher', name: 'Dishwasher', variableWeight: 1.5, group: 'bar' },
];

// Default employees for demo (using new category IDs)
export const DEFAULT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Johnson', jobCategoryId: 'host-hostess', hourlyRate: 18.00, hoursWorked: 72 },
  { id: '2', name: 'Mike Chen', jobCategoryId: 'busser', hourlyRate: 17.50, hoursWorked: 68 },
  { id: '3', name: 'Lisa Park', jobCategoryId: 'host-hostess', hourlyRate: 16.00, hoursWorked: 64 },
  { id: '4', name: 'Tom Wilson', jobCategoryId: 'bartender', hourlyRate: 19.00, hoursWorked: 56 },
  { id: '5', name: 'Juan Martinez', jobCategoryId: 'line-cook', hourlyRate: 22.00, hoursWorked: 80 },
  { id: '6', name: 'Amy Rodriguez', jobCategoryId: 'busser', hourlyRate: 15.00, hoursWorked: 60 },
  { id: '7', name: 'Dan Torres', jobCategoryId: 'host-hostess', hourlyRate: 14.00, hoursWorked: 45 },
  { id: '8', name: 'Katie Middleton', jobCategoryId: 'dishwasher', hourlyRate: 16.50, hoursWorked: 52 },
];

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  companyName: "Tom's Restaurant Group",
  contributionMethod: 'ALL_SALES',
  contributionRate: 3.25,
  estimatedMonthlySales: 80000,
  payPeriodType: 'bi-weekly',
  jobCategories: DEFAULT_JOB_CATEGORIES,
  selectedCategories: ['bartender', 'line-cook', 'busser', 'host-hostess', 'dishwasher'],
};

// Generate variable weight options (1-5 with 0.25 increments)
export const VARIABLE_WEIGHT_OPTIONS: VariableWeight[] = [
  1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5
];

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

// Help text for tooltips - aligned with PRD
export const HELP_TEXT = {
  // Step 1: Contribution Method
  contributionMethod: 'TipSharePro recommends a percentage of sales. The taxing authorities require 8% of sales be reported for tip income as a true up (allocations) at the end of the year.',
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
  // Backwards compatibility
  contributionRate: 'The percentage used to calculate the contribution to the tip pool.',
};
