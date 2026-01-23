'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/DemoContext';
import {
  WHOLE_WEIGHT_OPTIONS,
  HELP_TEXT,
  VariableWeight,
  ContributionMethod,
  PREDEFINED_CATEGORIES,
  getContributionRateOptions,
  CONTRIBUTION_METHOD_LABELS,
  CategoryColor,
  isSalesBasedMethod,
} from '@/lib/types';
import HelpTooltip from './HelpTooltip';
import { CategoryBadge, InlineCategoryDot } from './CategoryBadge';
import { Lock, ChevronRight, RotateCcw } from 'lucide-react';

// Category group display info
const CATEGORY_GROUPS: { key: keyof typeof PREDEFINED_CATEGORIES; title: string; color: CategoryColor }[] = [
  { key: 'boh', title: 'BOH (Kitchen)', color: 'boh' },
  { key: 'foh', title: 'FOH (Non Tipped)', color: 'foh' },
  { key: 'bar', title: 'Bar', color: 'bar' },
  { key: 'support', title: 'Support', color: 'support' },
  { key: 'custom', title: 'Custom (Big Leagues)', color: 'custom' },
];

export default function SettingsPage() {
  const {
    state,
    updateSettings,
    setContributionMethod,
    toggleCategorySelection,
    updateJobCategory,
    addCustomCategory,
    setCurrentStep,
    resetToDefaults,
  } = useDemo();

  // Local state for 5 custom category write-in inputs
  const [customInputs, setCustomInputs] = useState<string[]>(['', '', '', '', '']);
  // Track which custom input slots have been used
  const [usedCustomSlots, setUsedCustomSlots] = useState<Set<number>>(new Set());

  const { settings } = state;
  const contributionRateOptions = getContributionRateOptions(settings.contributionMethod);

  // Handle custom category input change
  const handleCustomInputChange = (index: number, value: string) => {
    const newInputs = [...customInputs];
    newInputs[index] = value;
    setCustomInputs(newInputs);
  };

  // Add custom category when user finishes typing
  const handleAddCustom = (index: number) => {
    const name = customInputs[index].trim();
    if (name && !usedCustomSlots.has(index)) {
      addCustomCategory(name);
      setUsedCustomSlots(new Set([...usedCustomSlots, index]));
    }
  };

  // Calculate projected pool for display
  const projectedPool = (settings.estimatedMonthlySales / 2) * (settings.contributionRate / 100);

  // Get custom categories from jobCategories
  const customCategories = settings.jobCategories.filter(cat => cat.group === 'custom');

  // Navigate to Distribution Table page
  const goToDistribution = () => {
    setCurrentStep(2);
  };

  return (
    <div className="content-container">
      {/* Settings Header with Actions */}
      <div className="settings-header">
        <h1 className="page-title">Demo Settings</h1>
        <div className="settings-actions">
          <button
            onClick={resetToDefaults}
            className="btn btn-outline btn-sm"
            title="Reset to default settings"
          >
            <RotateCcw size={16} />
            Default Settings
          </button>
        </div>
      </div>

      {/* Projected Pool Preview */}
      <div className="projected-pool-card">
        <div className="projected-pool-label">
          Projected Pool (per pay period)
          <HelpTooltip text={HELP_TEXT.projectedPool} />
        </div>
        <div className="projected-pool-value">
          ${projectedPool.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </div>
        <div className="projected-pool-formula">
          (${settings.estimatedMonthlySales.toLocaleString('en-US')} {isSalesBasedMethod(settings.contributionMethod) ? 'sales' : 'tips'} / 2) x {settings.contributionRate}%
        </div>
      </div>

      {/* Step 1: Contribution Method */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">1</span>
            Method for Contribution %
          </h2>
          <HelpTooltip text={HELP_TEXT.contributionMethod} />
        </div>

        <div className="method-selector">
          {(Object.keys(CONTRIBUTION_METHOD_LABELS) as ContributionMethod[]).map((method) => (
            <label key={method} className="method-option">
              <input
                type="radio"
                name="contributionMethod"
                value={method}
                checked={settings.contributionMethod === method}
                onChange={() => setContributionMethod(method)}
                className="method-radio"
              />
              <span className="method-label">{CONTRIBUTION_METHOD_LABELS[method]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Step 2: Estimated Monthly Amount */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">2</span>
            Estimate Monthly {isSalesBasedMethod(settings.contributionMethod) ? 'Sales' : 'Tips'}
          </h2>
          <HelpTooltip text={HELP_TEXT.estimatedMonthlySales} />
        </div>

        <div className="form-group">
          <div className="input-with-prefix">
            <span className="input-prefix">$</span>
            <input
              type="number"
              value={settings.estimatedMonthlySales || ''}
              onChange={(e) => updateSettings({ estimatedMonthlySales: parseInt(e.target.value) || 0 })}
              className="form-input form-input-money"
              placeholder={isSalesBasedMethod(settings.contributionMethod) ? '80000' : '12000'}
              min={0}
              step={1000}
            />
          </div>
          <p className="form-help">
            Enter your estimated monthly {isSalesBasedMethod(settings.contributionMethod) ? 'sales' : 'tips'} in whole dollars
          </p>
        </div>
      </div>

      {/* Step 3: Contribution Percentage */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">3</span>
            Enter Contribution %
          </h2>
          <HelpTooltip
            text={settings.contributionMethod === 'ALL_SALES'
              ? HELP_TEXT.contributionRateSales
              : HELP_TEXT.contributionRateTips}
          />
        </div>

        <div className="form-group">
          <div className="input-with-suffix">
            <select
              value={settings.contributionRate}
              onChange={(e) => updateSettings({ contributionRate: parseFloat(e.target.value) })}
              className="form-select"
            >
              {contributionRateOptions.map((rate) => (
                <option key={rate} value={rate}>
                  {rate.toFixed(rate % 1 === 0 ? 0 : rate % 0.5 === 0 ? 1 : 2)}
                </option>
              ))}
            </select>
            <span className="input-suffix">%</span>
          </div>
          <p className="form-help">
            {settings.contributionMethod === 'ALL_SALES'
              ? 'Range: 1% - 5% in 0.25% increments'
              : 'Range: 5% - 25% in 0.5% increments'}
          </p>
        </div>
      </div>

      {/* Step 4: Job Categories */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">4</span>
            Enter Job Categories
          </h2>
          <HelpTooltip text={HELP_TEXT.jobCategories} />
        </div>

        <div className="category-grid">
          {CATEGORY_GROUPS.map(({ key, title, color }) => (
            <div key={key} className="category-group">
              <h3 className="category-group-title">
                <InlineCategoryDot categoryColor={color} size={10} className="mr-2" />
                {title}
              </h3>
              {PREDEFINED_CATEGORIES[key].map((cat) => (
                <label key={cat.id} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategorySelection(cat.id)}
                  />
                  <span className="category-checkbox-label">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>

        {/* Custom Write-in Fields */}
        <div className="custom-categories-section">
          <h3 className="category-group-title mt-4">
            <InlineCategoryDot categoryColor="custom" size={10} className="mr-2" />
            Your Custom Categories (5 available)
          </h3>
          <p className="form-help mb-3">
            Add up to 5 custom job categories for your specific needs.
          </p>
          <div className="custom-category-inputs">
            {customInputs.map((value, index) => (
              <div key={index} className="custom-category-input-wrapper">
                {usedCustomSlots.has(index) ? (
                  <div className="custom-category-filled">
                    <CategoryBadge categoryColor="custom" label={customCategories[index]?.name || value} size="sm" />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleCustomInputChange(index, e.target.value)}
                    onBlur={() => handleAddCustom(index)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustom(index)}
                    placeholder={`Custom ${index + 1}`}
                    className="form-input form-input-dashed"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 5: Job Category Weights */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">5</span>
            Job Category Weights
          </h2>
          <HelpTooltip text={HELP_TEXT.variableWeight} />
        </div>

        {settings.jobCategories.length === 0 ? (
          <p className="form-help">Select job categories in Step 4 to assign weights.</p>
        ) : (
          <div className="weight-list">
            {/* Sort by category (BOH, Bar, FOH, Support, Custom), then by weight (highest first), then alphabetically */}
            {[...settings.jobCategories]
              .sort((a, b) => {
                const colorOrder = { boh: 1, bar: 2, foh: 3, support: 4, custom: 5 };
                const aOrder = colorOrder[a.categoryColor] || 6;
                const bOrder = colorOrder[b.categoryColor] || 6;
                if (aOrder !== bOrder) return aOrder - bOrder;
                // Within same category, sort by weight (highest first)
                if (b.variableWeight !== a.variableWeight) return b.variableWeight - a.variableWeight;
                // Finally, alphabetically
                return a.name.localeCompare(b.name);
              })
              .map((category) => (
              <div key={category.id} className="weight-item">
                <div className="weight-item-info">
                  <CategoryBadge categoryColor={category.categoryColor} size="sm" />
                  <span className="weight-item-name">{category.name}</span>
                </div>
                <select
                  value={Math.round(category.variableWeight)}
                  onChange={(e) =>
                    updateJobCategory(category.id, {
                      variableWeight: parseInt(e.target.value) as VariableWeight,
                    })
                  }
                  className="form-select weight-select"
                >
                  {WHOLE_WEIGHT_OPTIONS.map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <p className="form-help mt-4">
          Weight scale: 1 = Lowest share, 5 = Highest share of the tip pool
        </p>
        <p className="form-help">
          Fine-tune individual weights by ±0.25 increments on the Distribution Table page.
        </p>
      </div>

      {/* Blocked Features Teaser */}
      <div className="card card-promo">
        <div className="promo-header">
          <Lock size={20} className="promo-icon" />
          <h3 className="promo-title">Full Version Features</h3>
        </div>
        <div className="promo-features">
          <div className="promo-feature promo-feature-disabled">
            <Lock size={14} />
            <span>Location Settings</span>
          </div>
          <div className="promo-feature promo-feature-disabled">
            <Lock size={14} />
            <span>Pay Period Start/End Dates</span>
          </div>
          <div className="promo-feature promo-feature-disabled">
            <Lock size={14} />
            <span>Launch Date</span>
          </div>
          <div className="promo-feature promo-feature-disabled">
            <Lock size={14} />
            <span>Users/Permissions</span>
          </div>
          <div className="promo-feature promo-feature-disabled">
            <Lock size={14} />
            <span>Scenario Sand Box</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="nav-buttons nav-buttons-between">
        <button
          onClick={goToDistribution}
          className="btn btn-primary btn-lg"
        >
          Go To Distribution Table
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
