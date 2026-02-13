'use client';

import { useState, useRef, useEffect } from 'react';
import { useDemo } from '@/lib/DemoContext';
import {
  WHOLE_WEIGHT_OPTIONS,
  HELP_TEXT,
  ContributionMethod,
  getContributionRateOptions,
  CONTRIBUTION_METHOD_LABELS,
  CategoryColor,
  CATEGORY_COLOR_MAP,
  isSalesBasedMethod,
} from '@/lib/types';
import HelpTooltip from './HelpTooltip';
import { InlineCategoryDot } from './CategoryBadge';
import { Lock, ChevronRight, RotateCcw, GripVertical, X, Plus, Printer } from 'lucide-react';
import PrintDialog from './PrintDialog';

// The 5 category color keys in display order
const CATEGORY_COLORS: CategoryColor[] = ['boh', 'foh', 'bar', 'support', 'custom'];

// CSS hex colors for category backgrounds
const CATEGORY_HEX: Record<CategoryColor, string> = {
  boh: '#E85D04',
  foh: '#8E44AD',
  bar: '#35A0D2',
  support: '#82B536',
  custom: '#F1C40F',
};

export default function SettingsPage() {
  const {
    state,
    updateSettings,
    setContributionMethod,
    updateCategoryWeight,
    updateCategoryName,
    moveJobToCategory,
    addJobToCategory,
    removeJob,
    setCurrentStep,
    resetSettingsToDefaults,
    resetToDefaults,
  } = useDemo();

  const { settings } = state;
  const contributionRateOptions = getContributionRateOptions(settings.contributionMethod);

  // Local state for monthly estimate input (only format with commas on blur)
  const [monthlyInputValue, setMonthlyInputValue] = useState(
    settings.estimatedMonthlySales > 0 ? settings.estimatedMonthlySales.toLocaleString('en-US') : '0'
  );
  const [monthlyInputFocused, setMonthlyInputFocused] = useState(false);
  
  // Ref for the contribution rate select to focus on Enter
  const contributionRateRef = useRef<HTMLSelectElement>(null);

  // Sync from external state when not focused
  useEffect(() => {
    if (!monthlyInputFocused) {
      setMonthlyInputValue(
        settings.estimatedMonthlySales > 0 ? settings.estimatedMonthlySales.toLocaleString('en-US') : '0'
      );
    }
  }, [settings.estimatedMonthlySales, monthlyInputFocused]);

  // Print dialog state
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  // Local state for new job input
  const [newJobName, setNewJobName] = useState('');
  // Track which job is being dragged
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<CategoryColor | null>(null);

  // Calculate projected pool for display
  const projectedPool = (settings.estimatedMonthlySales / 2) * (settings.contributionRate / 100);

  // Group jobs by category
  const jobsByCategory: Record<CategoryColor, typeof settings.jobCategories> = {
    boh: [], foh: [], bar: [], support: [], custom: [],
  };
  settings.jobCategories.forEach(job => {
    if (jobsByCategory[job.categoryColor]) {
      jobsByCategory[job.categoryColor].push(job);
    }
  });

  // Smooth scroll to Distribution Table section
  const goToDistribution = () => {
    const element = document.getElementById('distribution-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle adding a new job via the write-in input
  const handleAddJob = () => {
    const name = newJobName.trim();
    if (!name) return;
    // Add to first category with fewest jobs, or 'custom' by default
    addJobToCategory(name, 'custom');
    setNewJobName('');
  };

  // Drag and drop handlers
  const handleDragStart = (jobId: string) => {
    setDraggedJobId(jobId);
  };

  const handleDragOver = (e: React.DragEvent, categoryColor: CategoryColor) => {
    e.preventDefault();
    setDragOverCategory(categoryColor);
  };

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleDrop = (e: React.DragEvent, categoryColor: CategoryColor) => {
    e.preventDefault();
    if (draggedJobId) {
      moveJobToCategory(draggedJobId, categoryColor);
    }
    setDraggedJobId(null);
    setDragOverCategory(null);
  };

  const handleDragEnd = () => {
    setDraggedJobId(null);
    setDragOverCategory(null);
  };

  return (
    <div className="content-container">
      {/* Print-only Settings Header with Logo */}
      <div className="print-settings-header print-only">
        <img src="/logo-full.png" alt="TipSharePro" className="print-settings-logo" />
        <div className="print-settings-title">Demo Settings</div>
      </div>

      {/* Settings Header with Actions */}
      <div className="settings-header no-print">
        <h1 className="page-title">Demo Settings</h1>
        <div className="settings-actions">
          <button
            onClick={resetSettingsToDefaults}
            className="btn btn-outline btn-sm"
            title="Reset settings to defaults"
          >
            <RotateCcw size={16} />
            Reset Settings
          </button>
          <button
            onClick={resetToDefaults}
            className="btn btn-outline btn-sm"
            title="Reset everything to defaults"
          >
            <RotateCcw size={16} />
            Reset All
          </button>
          <button
            onClick={() => setShowPrintDialog(true)}
            className="btn btn-outline btn-sm"
            title="Print settings configuration"
          >
            <Printer size={16} />
            Print Settings
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
          <HelpTooltip text={HELP_TEXT.contributionMethod} pdfLink="/help/why-sales-contribution-factor.pdf" pdfTitle="Why Sales as Contribution Factor" />
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
              type="text"
              inputMode="numeric"
              value={monthlyInputValue}
              onChange={(e) => {
                // Allow free typing - strip non-digits for the stored value
                const display = e.target.value;
                setMonthlyInputValue(display);
                const rawValue = display.replace(/[^0-9]/g, '');
                updateSettings({ estimatedMonthlySales: parseInt(rawValue) || 0 });
              }}
              onFocus={(e) => {
                setMonthlyInputFocused(true);
                // Show raw number (no commas) for easier editing, empty if 0 so user can type fresh
                const raw = settings.estimatedMonthlySales;
                setMonthlyInputValue(raw > 0 ? String(raw) : '');
                // Select all text for easy replacement
                setTimeout(() => e.target.select(), 0);
              }}
              onBlur={() => {
                setMonthlyInputFocused(false);
                // Format with commas on blur, show "0" if empty
                const val = settings.estimatedMonthlySales;
                setMonthlyInputValue(val > 0 ? val.toLocaleString('en-US') : '0');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // Move focus to the contribution rate dropdown
                  contributionRateRef.current?.focus();
                }
              }}
              className="form-input form-input-money"
              placeholder="0"
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
            text={
              settings.contributionMethod === 'ALL_SALES'
                ? HELP_TEXT.contributionRateAllSales
                : settings.contributionMethod === 'CC_SALES'
                ? HELP_TEXT.contributionRateCCSales
                : HELP_TEXT.contributionRateTips
            }
          />
        </div>

        <div className="form-group">
          <div className="input-with-suffix">
            <select
              ref={contributionRateRef}
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
              : settings.contributionMethod === 'CC_SALES'
              ? 'Range: 1% - 10% in 0.25% increments'
              : 'Range: 1% - 35% in 0.5% increments'}
          </p>
        </div>
      </div>

      {/* Step 4: Define Categories */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">4</span>
            Job Categories
          </h2>
          <HelpTooltip text={HELP_TEXT.jobCategories} />
        </div>

        <p className="form-help mb-4">
          Categories are groups of jobs. You can rename any category below. Names and colors can be customized.
        </p>

        <div className="category-boxes-grid">
          {CATEGORY_COLORS.map((color) => (
            <div
              key={color}
              className="category-name-box"
              style={{
                borderColor: CATEGORY_HEX[color],
                backgroundColor: `${CATEGORY_HEX[color]}20`,
              }}
            >
              <InlineCategoryDot categoryColor={color} size={14} />
              <input
                type="text"
                value={settings.categoryNames?.[color] || CATEGORY_COLOR_MAP[color].name}
                onChange={(e) => updateCategoryName(color, e.target.value)}
                className="category-name-input"
                style={{ color: CATEGORY_HEX[color] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step 5: Assign Jobs to Categories */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">5</span>
            Assign Jobs to Categories
          </h2>
          <HelpTooltip text="Drag and drop jobs between categories to reassign them. Type a new job name and press Enter to add it." />
        </div>

        {/* Add new job input */}
        <div className="add-job-row">
          <input
            type="text"
            value={newJobName}
            onChange={(e) => setNewJobName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddJob()}
            placeholder="Type a new job title and press Enter..."
            className="form-input add-job-input"
          />
          <button
            onClick={handleAddJob}
            disabled={!newJobName.trim()}
            className="btn btn-outline btn-sm"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Category drop zones with jobs */}
        <div className="job-assignment-grid">
          {CATEGORY_COLORS.map((color) => (
            <div
              key={color}
              className={`job-category-zone ${dragOverCategory === color ? 'job-category-zone-active' : ''}`}
              style={{ borderColor: CATEGORY_HEX[color] }}
              onDragOver={(e) => handleDragOver(e, color)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, color)}
            >
              <div
                className={`job-category-zone-header${color === 'custom' ? ' job-category-zone-header-custom' : ''}`}
                style={{ backgroundColor: CATEGORY_HEX[color] }}
              >
                <span className="job-category-zone-title">
                  {settings.categoryNames?.[color] || CATEGORY_COLOR_MAP[color].name}
                </span>
              </div>
              <div className="job-category-zone-body">
                {jobsByCategory[color].length === 0 ? (
                  <p className="job-zone-empty">Drop jobs here</p>
                ) : (
                  jobsByCategory[color].map((job) => (
                    <div
                      key={job.id}
                      className={`job-pill ${draggedJobId === job.id ? 'job-pill-dragging' : ''}`}
                      draggable
                      onDragStart={() => handleDragStart(job.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <GripVertical size={12} className="job-pill-grip" />
                      <span className="job-pill-name">{job.name}</span>
                      <button
                        className="job-pill-remove"
                        onClick={() => removeJob(job.id)}
                        title="Remove job"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 6: Job Category Weights */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">6</span>
            Job Category Weights
          </h2>
          <HelpTooltip text={HELP_TEXT.variableWeight} pdfLink="/help/job-categories-and-weights.pdf" pdfTitle="Job Categories & Weights" />
        </div>

        <div className="weight-list">
          {CATEGORY_COLORS.map((color) => (
            <div key={color} className="weight-item">
              <div className="weight-item-info">
                <div
                  className="category-weight-badge"
                  style={{ backgroundColor: CATEGORY_HEX[color] }}
                >
                  {settings.categoryNames?.[color] || CATEGORY_COLOR_MAP[color].name}
                </div>
                <span className="weight-item-jobs">
                  {jobsByCategory[color].map(j => j.name).join(', ') || 'No jobs assigned'}
                </span>
              </div>
              <select
                value={settings.categoryWeights?.[color] || 1}
                onChange={(e) => updateCategoryWeight(color, parseInt(e.target.value))}
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

        <p className="form-help mt-4">
          Weight scale: 1 = Lowest share, 5 = Highest share of the tip pool.
          Fine-tune individual weights by +0.25 increments (up to +0.75) on the Distribution Table page.
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

      {/* Print Footer — hidden on screen, shown on print */}
      <div className="print-footer">
        <span className="print-footer-brand">TipSharePro</span>
        <span className="print-footer-date">
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>

      {/* Print Dialog */}
      {showPrintDialog && (
        <PrintDialog
          target="settings"
          onClose={() => setShowPrintDialog(false)}
        />
      )}
    </div>
  );
}
