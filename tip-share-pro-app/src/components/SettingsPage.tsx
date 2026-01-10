'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/DemoContext';
import {
  VARIABLE_WEIGHT_OPTIONS,
  HELP_TEXT,
  VariableWeight,
  ContributionMethod,
  PREDEFINED_CATEGORIES,
  getContributionRateOptions,
} from '@/lib/types';
import HelpTooltip from './HelpTooltip';
import { Lock, ChevronRight, Plus } from 'lucide-react';

// Contribution method display labels
const METHOD_LABELS: Record<ContributionMethod, string> = {
  CC_SALES: 'CC Sales',
  CC_TIPS: 'CC Tips',
  ALL_TIPS: 'All Tips',
  ALL_SALES: 'All Sales',
};

export default function SettingsPage() {
  const {
    state,
    updateSettings,
    setContributionMethod,
    toggleCategorySelection,
    updateJobCategory,
    addCustomCategory,
    setCurrentStep,
  } = useDemo();

  const [customCategoryInputs, setCustomCategoryInputs] = useState<string[]>(['', '', '', '', '']);

  const { settings } = state;
  const contributionRateOptions = getContributionRateOptions(settings.contributionMethod);

  // Handle custom category input
  const handleCustomCategoryChange = (index: number, value: string) => {
    const newInputs = [...customCategoryInputs];
    newInputs[index] = value;
    setCustomCategoryInputs(newInputs);
  };

  // Add custom category on Enter or blur
  const handleAddCustomCategory = (index: number) => {
    const name = customCategoryInputs[index].trim();
    if (name) {
      addCustomCategory(name);
      const newInputs = [...customCategoryInputs];
      newInputs[index] = '';
      setCustomCategoryInputs(newInputs);
    }
  };

  // Get custom categories from jobCategories
  const customCategories = settings.jobCategories.filter(cat => cat.group === 'custom');

  return (
    <div className="content-container">
      {/* Step 1: Contribution Method */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Step 1: Method for Contribution %</h2>
          <HelpTooltip text={HELP_TEXT.contributionMethod} />
        </div>

        <div className="method-selector">
          {(Object.keys(METHOD_LABELS) as ContributionMethod[]).map((method) => (
            <label key={method} className="method-option">
              <input
                type="radio"
                name="contributionMethod"
                value={method}
                checked={settings.contributionMethod === method}
                onChange={() => setContributionMethod(method)}
                className="method-radio"
              />
              <span className="method-label">{METHOD_LABELS[method]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Step 2: Estimated Monthly Amount */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Step 2: Estimate Monthly $ Amount</h2>
          <HelpTooltip text={HELP_TEXT.estimatedMonthlySales} />
        </div>

        <div className="form-group">
          <div className="input-with-prefix">
            <span className="input-prefix">$</span>
            <input
              type="number"
              value={settings.estimatedMonthlySales}
              onChange={(e) => updateSettings({ estimatedMonthlySales: parseInt(e.target.value) || 0 })}
              className="form-input form-input-money"
              placeholder="80000"
              min={0}
              step={1000}
            />
          </div>
          <p className="form-help">Enter whole dollars only</p>
        </div>
      </div>

      {/* Step 3: Contribution Percentage */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Step 3: Enter Contribution %</h2>
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
          <h2 className="card-title">Step 4: Enter Job Categories</h2>
          <HelpTooltip text={HELP_TEXT.jobCategories} />
        </div>

        <div className="category-grid">
          {/* Kitchen (BOH) */}
          <div className="category-group">
            <h3 className="category-group-title">Kitchen (BOH)</h3>
            {PREDEFINED_CATEGORIES.kitchen.map((cat) => (
              <label key={cat.id} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={settings.selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategorySelection(cat.id)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>

          {/* Front of House */}
          <div className="category-group">
            <h3 className="category-group-title">Front of House</h3>
            {PREDEFINED_CATEGORIES.frontOfHouse.map((cat) => (
              <label key={cat.id} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={settings.selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategorySelection(cat.id)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>

          {/* Bar */}
          <div className="category-group">
            <h3 className="category-group-title">Bar</h3>
            {PREDEFINED_CATEGORIES.bar.map((cat) => (
              <label key={cat.id} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={settings.selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategorySelection(cat.id)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Categories */}
        <div className="custom-categories">
          <h3 className="category-group-title">Custom Categories</h3>
          <div className="custom-category-inputs">
            {customCategoryInputs.map((value, index) => (
              <div key={index} className="custom-category-input-wrapper">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleCustomCategoryChange(index, e.target.value)}
                  onBlur={() => handleAddCustomCategory(index)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomCategory(index)}
                  placeholder={`Custom ${index + 1}`}
                  className="form-input form-input-dashed"
                />
              </div>
            ))}
          </div>
          {customCategories.length > 0 && (
            <div className="custom-categories-list">
              {customCategories.map((cat) => (
                <span key={cat.id} className="custom-category-tag">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 5: Job Category Weights */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Step 5: Job Category Weights</h2>
          <HelpTooltip text={HELP_TEXT.variableWeight} />
        </div>

        {settings.jobCategories.length === 0 ? (
          <p className="form-help">Select job categories in Step 4 to assign weights.</p>
        ) : (
          <div className="weight-list">
            {settings.jobCategories.map((category) => (
              <div key={category.id} className="weight-item">
                <span className="weight-item-name">{category.name}</span>
                <select
                  value={category.variableWeight}
                  onChange={(e) =>
                    updateJobCategory(category.id, {
                      variableWeight: parseFloat(e.target.value) as VariableWeight,
                    })
                  }
                  className="form-select weight-select"
                >
                  {VARIABLE_WEIGHT_OPTIONS.map((weight) => (
                    <option key={weight} value={weight}>
                      {weight.toFixed(2)}
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
      </div>

      {/* Blocked Features Teaser */}
      <div className="card card-promo">
        <div className="promo-header">
          <Lock size={20} className="promo-icon" />
          <h3 className="promo-title">Full Version Features</h3>
        </div>
        <div className="promo-features">
          <div className="promo-feature">
            <Lock size={14} className="text-muted" />
            <span>Location Settings</span>
          </div>
          <div className="promo-feature">
            <Lock size={14} className="text-muted" />
            <span>Pay Period Start/End Dates</span>
          </div>
          <div className="promo-feature">
            <Lock size={14} className="text-muted" />
            <span>Launch Date</span>
          </div>
          <div className="promo-feature">
            <Lock size={14} className="text-muted" />
            <span>Users/Permissions</span>
          </div>
          <div className="promo-feature">
            <Lock size={14} className="text-muted" />
            <span>Scenario Sand Box</span>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="nav-buttons nav-buttons-end">
        <button
          onClick={() => setCurrentStep(2)}
          className="btn btn-primary btn-lg"
        >
          Continue to Data Entry
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
