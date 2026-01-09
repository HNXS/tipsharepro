// Variable weight scale: 1-5 with 0.25 increments (17 options)
export type VariableWeight = 1 | 1.25 | 1.5 | 1.75 | 2 | 2.25 | 2.5 | 2.75 | 3 | 3.25 | 3.5 | 3.75 | 4 | 4.25 | 4.5 | 4.75 | 5;

// Contribution rate scale: same as variable weight
export type ContributionRate = VariableWeight;

export interface JobCategory {
  id: string;
  name: string;
  variableWeight: VariableWeight;
  description?: string;
}

export interface Settings {
  companyName: string;
  contributionRate: ContributionRate;
  payPeriodType: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
  jobCategories: JobCategory[];
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
  currentStep: 1 | 2 | 3;
  settings: Settings;
  employees: Employee[];
  estimatedMonthlySales: number;
  projectedPool: number; // (Monthly Sales / 2) * Contribution %
  distributionResults: DistributionResult[];
}

// Default job categories based on requirements
export const DEFAULT_JOB_CATEGORIES: JobCategory[] = [
  { id: 'server', name: 'Server', variableWeight: 3, description: 'Front of house servers' },
  { id: 'bartender', name: 'Bartender', variableWeight: 3.25, description: 'Bar staff' },
  { id: 'cook', name: 'Cook', variableWeight: 2.5, description: 'Kitchen line cooks' },
  { id: 'busser', name: 'Busser', variableWeight: 2, description: 'Table bussers' },
  { id: 'host', name: 'Host', variableWeight: 2, description: 'Host/hostess staff' },
  { id: 'dishwasher', name: 'Dishwasher', variableWeight: 1.5, description: 'Dishwashing staff' },
];

// Default employees for demo
export const DEFAULT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Johnson', jobCategoryId: 'server', hourlyRate: 18.00, hoursWorked: 72 },
  { id: '2', name: 'Mike Chen', jobCategoryId: 'server', hourlyRate: 17.50, hoursWorked: 68 },
  { id: '3', name: 'Lisa Park', jobCategoryId: 'server', hourlyRate: 16.00, hoursWorked: 64 },
  { id: '4', name: 'Tom Wilson', jobCategoryId: 'bartender', hourlyRate: 19.00, hoursWorked: 56 },
  { id: '5', name: 'Juan Martinez', jobCategoryId: 'cook', hourlyRate: 22.00, hoursWorked: 80 },
  { id: '6', name: 'Amy Rodriguez', jobCategoryId: 'busser', hourlyRate: 15.00, hoursWorked: 60 },
  { id: '7', name: 'Dan Torres', jobCategoryId: 'host', hourlyRate: 14.00, hoursWorked: 45 },
  { id: '8', name: 'Katie Middleton', jobCategoryId: 'server', hourlyRate: 16.50, hoursWorked: 52 },
];

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  companyName: "Tom's Restaurant Group",
  contributionRate: 3.25,
  payPeriodType: 'bi-weekly',
  jobCategories: DEFAULT_JOB_CATEGORIES,
};

// Generate variable weight options (1-5 with 0.25 increments)
export const VARIABLE_WEIGHT_OPTIONS: VariableWeight[] = [
  1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5
];

// Help text for tooltips
export const HELP_TEXT = {
  contributionRate: 'The percentage of sales that servers contribute to the tip pool. This is the same calculation method used by the IRS.',
  variableWeight: 'A factor (1-5) that reflects each job category\'s impact on customer satisfaction. Higher weights mean a larger share of the tip pool.',
  payPeriodType: 'How often your pay periods occur. This affects when tip pool distributions are calculated.',
  estimatedMonthlySales: 'Your estimated total sales for the month. Used to project the tip pool amount.',
  projectedPool: 'Calculated as: (Monthly Sales / 2) x Contribution Rate. This is the approximate amount available for distribution each pay period.',
  hoursWorked: 'Total hours worked during the pay period.',
  hourlyRate: 'The employee\'s regular hourly pay rate.',
};
