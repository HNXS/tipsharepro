'use client';

import { useState, useEffect, useRef } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { CONTRIBUTION_METHOD_LABELS, HELP_TEXT, CategoryColor, CATEGORY_COLOR_MAP } from '@/lib/types';
import { InlineCategoryDot } from './CategoryBadge';
import HelpTooltip from './HelpTooltip';
import { Plus, Minus, Printer, ChevronLeft, RotateCcw, Mail, Lock } from 'lucide-react';

// Editable text input for names
interface EditableTextInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

function EditableTextInput({ value, onChange, className, placeholder }: EditableTextInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value);
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (localValue.trim()) {
      onChange(localValue.trim());
    } else {
      setLocalValue(value);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.blur()}
      className={className}
      placeholder={placeholder}
    />
  );
}

// Editable number input that properly handles backspace and typing
interface EditableNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  decimals?: number;
  className?: string;
}

function EditableNumberInput({ value, onChange, decimals = 2, className }: EditableNumberInputProps) {
  const [localValue, setLocalValue] = useState(value.toFixed(decimals));
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local value when external value changes (but not during focus)
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toFixed(decimals));
    }
  }, [value, decimals, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // Select all text on focus for easy replacement
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(localValue.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
      setLocalValue(parsed.toFixed(decimals));
    } else {
      // Reset to original value if invalid
      setLocalValue(value.toFixed(decimals));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow typing freely - validate on blur
    setLocalValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  isDemo?: boolean;
  helpText?: string;
  editable?: boolean;
  onChange?: (value: number) => void;
  prefix?: string;
  className?: string;
}

function StatCard({ label, value, isDemo, helpText, editable, onChange, prefix, className }: StatCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(typeof value === 'number' ? value : 0);

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(editValue);
    }
  };

  return (
    <div className={`stat-card ${className || ''}`}>
      <div className="stat-card-label">
        {label}
        {helpText && <HelpTooltip text={helpText} />}
      </div>
      {editable && isEditing ? (
        <div className="stat-card-input-wrapper">
          {prefix && <span className="stat-card-prefix">{prefix}</span>}
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="stat-card-input"
            autoFocus
          />
        </div>
      ) : (
        <div
          className={`stat-card-value ${editable ? 'stat-card-value-editable' : ''} ${isDemo ? 'stat-card-value-demo' : ''}`}
          onClick={() => editable && setIsEditing(true)}
        >
          {isDemo ? (
            <span className="demo-label">Demo</span>
          ) : (
            <>
              {prefix && <span className="stat-card-prefix">{prefix}</span>}
              {typeof value === 'number' ? value.toLocaleString('en-US') : value}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Weight Adjuster Component
interface WeightAdjusterProps {
  baseWeight: number;
  adjustment: number;
  effectiveWeight: number;
  onAdjust: (delta: number) => void;
}

function WeightAdjuster({ baseWeight, adjustment, effectiveWeight, onAdjust }: WeightAdjusterProps) {
  // Can only decrease back to base weight (adjustment >= 0), not below
  const canDecrease = adjustment > 0;
  // Can increase up to +0.75 above base weight
  const canIncrease = adjustment < 0.75;

  return (
    <div className="weight-adjuster">
      <button
        className="weight-adjuster-btn"
        onClick={() => onAdjust(-0.25)}
        disabled={!canDecrease}
        title="Decrease weight back toward base"
      >
        <Minus size={12} />
      </button>
      <span className="weight-adjuster-value">
        {effectiveWeight.toFixed(2)}
        {adjustment !== 0 && (
          <span className={`weight-adjustment-indicator ${adjustment > 0 ? 'positive' : 'negative'}`}>
            ({adjustment > 0 ? '+' : ''}{adjustment.toFixed(2)})
          </span>
        )}
      </span>
      <button
        className="weight-adjuster-btn"
        onClick={() => onAdjust(0.25)}
        disabled={!canIncrease}
        title="Increase weight by 0.25"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

// Help text for distribution table
const DISTRIBUTION_HELP = `The Distribution Table shows how the tip pool is divided among employees.

Each employee's share is calculated based on:
• Hours worked during the pay period
• Hourly wage rate
• Category weight (set in Settings)
• Individual weight adjustments (up to +0.75)

A person in a category with weight 3.0 can be bumped up to 3.75, then back down to 3.0, but never below the category weight.

Print the table for transparency posting or email to payroll (full version).`;

export default function DistributionTable() {
  const {
    state,
    updateEmployee,
    adjustIndividualWeight,
    setPrePaidAmount,
    setPrintIncludeSharePerHour,
    setCurrentStep,
    resetDistributionToDefaults,
  } = useDemo();

  const { settings, employees, distributionResults, projectedPool, prePaidAmount, netPool, printIncludeSharePerHour } = state;

  // Calculate totals from distribution results (active employees only)
  const totalHours = distributionResults.reduce((sum, r) => sum + r.hoursWorked, 0);
  const totalSharePercent = distributionResults.reduce((sum, r) => sum + r.sharePercentage, 0);
  const totalShareDollars = distributionResults.reduce((sum, r) => sum + r.receivedAmount, 0);

  // Always show all 5 categories in the color key
  const allCategories: CategoryColor[] = ['boh', 'foh', 'bar', 'support', 'custom'];

  // Build display rows from ALL employees (including those with 0 hours)
  const allEmployeeRows = employees.map(emp => {
    const category = settings.jobCategories.find(cat => cat.id === emp.jobCategoryId);
    const distResult = distributionResults.find(r => r.employeeId === emp.id);
    const categoryColor = (category?.categoryColor || 'support') as CategoryColor;
    // Use category-level weight from settings.categoryWeights
    const baseWeight = settings.categoryWeights?.[categoryColor] ?? category?.variableWeight ?? 2;

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      categoryColor,
      jobCategory: category?.name || 'Unknown',
      hoursWorked: emp.hoursWorked,
      hourlyRate: emp.hourlyRate,
      variableWeight: baseWeight,
      weightAdjustment: emp.weightAdjustment || 0,
      effectiveWeight: baseWeight + (emp.weightAdjustment || 0),
      sharePercentage: distResult?.sharePercentage || 0,
      receivedAmount: distResult?.receivedAmount || 0,
      dollarsPerHour: distResult?.dollarsPerHour || 0,
    };
  });

  // Sort: active employees (hours > 0) first by category then share, then inactive at the end
  const sortedResults = [...allEmployeeRows].sort((a, b) => {
    // Active employees come first
    if (a.hoursWorked > 0 && b.hoursWorked === 0) return -1;
    if (a.hoursWorked === 0 && b.hoursWorked > 0) return 1;

    const categoryOrder: Record<CategoryColor, number> = {
      boh: 1,
      bar: 2,
      foh: 3,
      support: 4,
      custom: 5,
    };
    const aOrder = categoryOrder[a.categoryColor] || 6;
    const bOrder = categoryOrder[b.categoryColor] || 6;
    if (aOrder !== bOrder) return aOrder - bOrder;
    // Within same category, sort by share amount (highest first)
    return b.receivedAmount - a.receivedAmount;
  });

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Navigate back to settings page
  const goToSettings = () => {
    setCurrentStep(1);
  };

  return (
    <div id="distribution-table" className="distribution-section">
      {/* Print-only Header */}
      <div className="print-header">
        <img src="/tipsharepro-logo.svg" alt="TipSharePro" className="print-logo" />
        <div className="print-header-text">
          <h1 className="print-title">Distribution Table</h1>
          <span className="print-location">Company/Location (Demo)</span>
        </div>
      </div>

      {/* Section Header - hidden on print */}
      <div className="distribution-header no-print">
        <h2 className="section-title">
          Distribution Table
          <HelpTooltip text={DISTRIBUTION_HELP} />
        </h2>
        <div className="distribution-actions">
          <button
            onClick={resetDistributionToDefaults}
            className="btn btn-outline btn-sm"
            title="Reset distribution table to defaults"
          >
            <RotateCcw size={16} />
            Reset Table
          </button>
          <label className="print-option">
            <input
              type="checkbox"
              checked={printIncludeSharePerHour}
              onChange={(e) => setPrintIncludeSharePerHour(e.target.checked)}
            />
            <span>Include $/Hr on print</span>
          </label>
          <button onClick={handlePrint} className="btn btn-outline btn-sm">
            <Printer size={16} />
            Print
          </button>
          <button className="btn btn-faded btn-sm" title="Email feature available in full version">
            <Mail size={16} />
            <Lock size={12} className="lock-icon" />
          </button>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="stat-cards-row print-stat-cards">
        <StatCard label="Day/Date" value="" isDemo className="hide-print" />
        <StatCard label="Location" value="" isDemo className="hide-print" />
        <StatCard label="Pay Period" value="" isDemo />
        <StatCard
          label="Contrib. Method"
          value={CONTRIBUTION_METHOD_LABELS[settings.contributionMethod]}
          className="hide-print"
        />
        <StatCard
          label="Gross Pool"
          value={Math.round(projectedPool)}
          prefix="$"
          helpText={HELP_TEXT.projectedPool}
        />
        <StatCard
          label="Pre-Paid"
          value={prePaidAmount}
          prefix="$"
          editable
          onChange={setPrePaidAmount}
          helpText={HELP_TEXT.prePaid}
        />
        <StatCard
          label="Net Pool"
          value={Math.round(netPool)}
          prefix="$"
        />
        <StatCard
          label="Top Contributors"
          value="Barb B. (aka: Malibu) & Ken Dahl"
          isDemo
        />
      </div>

      {/* Distribution Table */}
      <div className="table-container">
        <table className="distribution-table">
          <thead>
            <tr>
              <th className="col-name">Name</th>
              <th className="col-wages hide-print">Wages</th>
              <th className="col-hours">Hours</th>
              <th className="col-weight">Weight</th>
              <th className="col-share-percent">Share %</th>
              <th className="col-share-dollars">Share $</th>
              <th className={`col-dollars-per-hour ${!printIncludeSharePerHour ? 'hide-print' : ''}`}>$/Hr</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result) => (
              <tr key={result.employeeId}>
                <td className={`col-name name-cell-${result.categoryColor}`}>
                  <div className="employee-name-cell">
                    <InlineCategoryDot categoryColor={result.categoryColor} size={10} />
                    <EditableTextInput
                      value={result.employeeName}
                      onChange={(name) => updateEmployee(result.employeeId, { name })}
                      className="table-input table-input-name"
                      placeholder="Enter name"
                    />
                    <span className="employee-category">{result.jobCategory}</span>
                  </div>
                </td>
                <td className="col-wages hide-print">
                  <EditableNumberInput
                    value={result.hourlyRate}
                    onChange={(val) => updateEmployee(result.employeeId, { hourlyRate: val })}
                    decimals={2}
                    className="table-input"
                  />
                </td>
                <td className="col-hours">
                  <EditableNumberInput
                    value={result.hoursWorked}
                    onChange={(val) => updateEmployee(result.employeeId, { hoursWorked: val })}
                    decimals={2}
                    className="table-input"
                  />
                </td>
                <td className="col-weight">
                  <WeightAdjuster
                    baseWeight={result.variableWeight}
                    adjustment={result.weightAdjustment}
                    effectiveWeight={result.effectiveWeight}
                    onAdjust={(delta) => adjustIndividualWeight(result.employeeId, delta)}
                  />
                </td>
                <td className="col-share-percent">
                  {result.sharePercentage.toFixed(2)}%
                </td>
                <td className="col-share-dollars">
                  ${result.receivedAmount.toLocaleString('en-US')}
                </td>
                <td className={`col-dollars-per-hour ${!printIncludeSharePerHour ? 'hide-print' : ''}`}>
                  ${result.dollarsPerHour.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td className="col-name">
                <strong>Totals</strong>
              </td>
              <td className="col-wages hide-print">
                <span className="totals-placeholder">—</span>
              </td>
              <td className="col-hours">
                <strong>{totalHours.toFixed(2)}</strong>
              </td>
              <td className="col-weight">
                <span className="totals-placeholder">—</span>
              </td>
              <td className="col-share-percent">
                <strong>{totalSharePercent.toFixed(2)}%</strong>
              </td>
              <td className="col-share-dollars">
                <strong>${totalShareDollars.toLocaleString('en-US')}</strong>
              </td>
              <td className={`col-dollars-per-hour ${!printIncludeSharePerHour ? 'hide-print' : ''}`}>
                <span className="totals-placeholder">—</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Color Key - always show all 5 categories */}
      <div className="category-color-key mt-4">
        {allCategories.map((color) => (
          <div key={color} className="color-key-item">
            <span
              className={`color-key-dot ${color}`}
              style={{ backgroundColor: CATEGORY_COLOR_MAP[color].hex }}
            />
            <span>{settings.categoryNames?.[color] || CATEGORY_COLOR_MAP[color].name}</span>
          </div>
        ))}
      </div>

      {/* Back to Settings Button */}
      <div className="distribution-footer">
        <button onClick={goToSettings} className="btn btn-outline">
          <ChevronLeft size={16} />
          Back to Settings
        </button>
      </div>
    </div>
  );
}
