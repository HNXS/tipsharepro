'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { CONTRIBUTION_METHOD_LABELS, HELP_TEXT, CategoryColor } from '@/lib/types';
import { CategoryBadge, CategoryColorKey, InlineCategoryDot } from './CategoryBadge';
import HelpTooltip from './HelpTooltip';
import { Plus, Minus, Printer, ChevronLeft } from 'lucide-react';

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  isDemo?: boolean;
  helpText?: string;
  editable?: boolean;
  onChange?: (value: number) => void;
  prefix?: string;
}

function StatCard({ label, value, isDemo, helpText, editable, onChange, prefix }: StatCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(typeof value === 'number' ? value : 0);

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(editValue);
    }
  };

  return (
    <div className="stat-card">
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
              {typeof value === 'number' ? value.toLocaleString() : value}
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
  const canDecrease = adjustment > -0.75;
  const canIncrease = adjustment < 0.75;

  return (
    <div className="weight-adjuster">
      <button
        className="weight-adjuster-btn"
        onClick={() => onAdjust(-0.25)}
        disabled={!canDecrease}
        title="Decrease weight by 0.25"
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

export default function DistributionTable() {
  const {
    state,
    updateEmployee,
    adjustIndividualWeight,
    setPrePaidAmount,
    setPrintIncludeSharePerHour,
    setCurrentStep,
  } = useDemo();

  const { settings, distributionResults, projectedPool, prePaidAmount, netPool, printIncludeSharePerHour } = state;

  // Calculate totals
  const totalHours = distributionResults.reduce((sum, r) => sum + r.hoursWorked, 0);
  const totalSharePercent = distributionResults.reduce((sum, r) => sum + r.sharePercentage, 0);
  const totalShareDollars = distributionResults.reduce((sum, r) => sum + r.receivedAmount, 0);

  // Get unique categories used in distribution
  const usedCategories = [...new Set(distributionResults.map(r => r.categoryColor))] as CategoryColor[];

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
      {/* Section Header */}
      <div className="distribution-header">
        <h2 className="section-title">Distribution Table</h2>
        <div className="distribution-actions">
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
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="stat-cards-row">
        <StatCard label="Day/Date" value="" isDemo />
        <StatCard label="Location" value="" isDemo />
        <StatCard label="Pay Period" value="" isDemo />
        <StatCard
          label="Contrib. Method"
          value={CONTRIBUTION_METHOD_LABELS[settings.contributionMethod]}
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
          value="Barb B (aka: Malibu), Ken Dahl"
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
            {distributionResults.map((result) => (
              <tr key={result.employeeId}>
                <td className="col-name">
                  <div className="employee-name-cell">
                    <InlineCategoryDot categoryColor={result.categoryColor} size={10} />
                    <span className="employee-name">{result.employeeName}</span>
                    <span className="employee-category">{result.jobCategory}</span>
                  </div>
                </td>
                <td className="col-wages hide-print">
                  <input
                    type="number"
                    value={result.hourlyRate}
                    onChange={(e) => updateEmployee(result.employeeId, {
                      hourlyRate: parseFloat(e.target.value) || 0
                    })}
                    className="table-input"
                    step="0.25"
                    min="0"
                  />
                </td>
                <td className="col-hours">
                  <input
                    type="number"
                    value={result.hoursWorked}
                    onChange={(e) => updateEmployee(result.employeeId, {
                      hoursWorked: parseFloat(e.target.value) || 0
                    })}
                    className="table-input"
                    step="0.5"
                    min="0"
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
                  ${result.receivedAmount.toLocaleString()}
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
              <td className="col-wages hide-print">—</td>
              <td className="col-hours">
                <strong>{totalHours.toFixed(1)}</strong>
              </td>
              <td className="col-weight">—</td>
              <td className="col-share-percent">
                <strong>{totalSharePercent.toFixed(2)}%</strong>
              </td>
              <td className="col-share-dollars">
                <strong>${totalShareDollars.toLocaleString()}</strong>
              </td>
              <td className={`col-dollars-per-hour ${!printIncludeSharePerHour ? 'hide-print' : ''}`}>
                —
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Color Key */}
      <CategoryColorKey categories={usedCategories} className="mt-4" />

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
