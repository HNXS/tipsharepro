'use client';

import { useState, useEffect, useRef } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { CONTRIBUTION_METHOD_LABELS, HELP_TEXT, CategoryColor, CATEGORY_COLOR_MAP, JobCategory } from '@/lib/types';
import { InlineCategoryDot } from './CategoryBadge';
import HelpTooltip from './HelpTooltip';
import { Plus, Minus, Printer, ChevronLeft, RotateCcw, Mail, Lock, GripVertical, Trash2 } from 'lucide-react';
import PrintDialog from './PrintDialog';

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
  const selectOnFocus = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value);
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    selectOnFocus.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (selectOnFocus.current) {
      selectOnFocus.current = false;
      e.preventDefault();
      inputRef.current?.select();
    }
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
      onMouseUp={handleMouseUp}
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
  const selectOnFocus = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local value when external value changes (but not during focus)
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toFixed(decimals));
    }
  }, [value, decimals, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    selectOnFocus.current = true;
  };

  // Use mouseUp to select all - more reliable than selecting in onFocus
  const handleMouseUp = (e: React.MouseEvent) => {
    if (selectOnFocus.current) {
      selectOnFocus.current = false;
      e.preventDefault();
      inputRef.current?.select();
    }
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
      onMouseUp={handleMouseUp}
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
  helpPdfLink?: string;
  helpPdfTitle?: string;
  editable?: boolean;
  onChange?: (value: number) => void;
  prefix?: string;
  className?: string;
}

function StatCard({ label, value, isDemo, helpText, helpPdfLink, helpPdfTitle, editable, onChange, prefix, className }: StatCardProps) {
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
        {helpText && <HelpTooltip text={helpText} pdfLink={helpPdfLink} pdfTitle={helpPdfTitle} />}
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

  const hasAdjustment = adjustment !== 0;

  return (
    <div className={`weight-adjuster ${hasAdjustment ? 'weight-adjuster-compact' : ''}`}>
      <button
        className="weight-adjuster-btn"
        onClick={() => onAdjust(-0.25)}
        disabled={!canDecrease}
        title="Decrease weight back toward base"
      >
        <Minus size={12} />
      </button>
      <span className={`weight-adjuster-value ${hasAdjustment ? 'weight-adjuster-value-compact' : ''}`}>
        {effectiveWeight.toFixed(2)}
        {hasAdjustment && (
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

// Job/Category Selector - grouped <select> with jobs organized by category color
interface JobCategorySelectorProps {
  value: string; // current jobCategoryId
  jobCategories: JobCategory[];
  categoryNames: Record<CategoryColor, string>;
  onChange: (jobCategoryId: string) => void;
  className?: string;
}

function JobCategorySelector({ value, jobCategories, categoryNames, onChange, className }: JobCategorySelectorProps) {
  const categoryColors: CategoryColor[] = ['boh', 'bar', 'foh', 'support', 'custom'];
  const selectedJob = jobCategories.find(j => j.id === value);

  return (
    <>
      {/* Screen: interactive dropdown */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`table-select-job no-print ${className || ''}`}
        onDragStart={(e) => e.stopPropagation()}
      >
        {categoryColors.map(color => {
          const jobs = jobCategories.filter(j => j.categoryColor === color);
          if (jobs.length === 0) return null;
          return (
            <optgroup key={color} label={categoryNames[color] || CATEGORY_COLOR_MAP[color].name}>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.name}</option>
              ))}
            </optgroup>
          );
        })}
      </select>
      {/* Print: plain text job name */}
      <span className="job-name-print print-only">{selectedJob?.name || ''}</span>
    </>
  );
}

// Add Employee Row component
interface AddEmployeeRowProps {
  jobCategories: JobCategory[];
  categoryNames: Record<CategoryColor, string>;
  onAdd: (name: string, jobCategoryId: string) => void;
  isDragging: boolean;
  dragOverTrash: boolean;
  onTrashDragOver: (e: React.DragEvent) => void;
  onTrashDragLeave: (e: React.DragEvent) => void;
  onTrashDrop: (e: React.DragEvent) => void;
}

function AddEmployeeRow({ jobCategories, categoryNames, onAdd, isDragging, dragOverTrash, onTrashDragOver, onTrashDragLeave, onTrashDrop }: AddEmployeeRowProps) {
  const [name, setName] = useState('');
  const [jobCategoryId, setJobCategoryId] = useState(jobCategories[0]?.id || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedJob = jobCategories.find(j => j.id === jobCategoryId);
  const selectedColor = (selectedJob?.categoryColor || 'support') as CategoryColor;

  const handleAdd = () => {
    if (!name.trim() || !jobCategoryId) return;
    onAdd(name.trim(), jobCategoryId);
    setName('');
    inputRef.current?.focus();
  };

  return (
    <div className="add-employee-row no-print">
      <InlineCategoryDot categoryColor={selectedColor} size={10} />
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="New employee name"
        className="add-employee-name-input"
      />
      <JobCategorySelector
        value={jobCategoryId}
        jobCategories={jobCategories}
        categoryNames={categoryNames}
        onChange={setJobCategoryId}
        className="add-employee-job-select"
      />
      <button
        onClick={handleAdd}
        disabled={!name.trim()}
        className="btn btn-outline btn-sm add-employee-btn"
      >
        <Plus size={14} />
        Add
      </button>
      <div
        className={`trash-drop-zone ${isDragging ? 'trash-drop-zone-active' : ''} ${dragOverTrash ? 'trash-drop-zone-hover' : ''}`}
        onDragOver={onTrashDragOver}
        onDragLeave={onTrashDragLeave}
        onDrop={onTrashDrop}
        title="Drag and drop to delete employee"
      >
        <Trash2 size={18} />
      </div>
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
    addEmployee,
    removeEmployee,
    adjustIndividualWeight,
    reorderEmployees,
    setPrePaidAmount,
    setPrintIncludeSharePerHour,
    setCurrentStep,
    resetDistributionToDefaults,
    resetToDefaults,
  } = useDemo();

  const { settings, employees, distributionResults, projectedPool, prePaidAmount, netPool, printIncludeSharePerHour } = state;

  // Print dialog state
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  // Drag-and-drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverTrash, setDragOverTrash] = useState(false);

  // Calculate totals from distribution results (active employees only)
  const totalHours = distributionResults.reduce((sum, r) => sum + r.hoursWorked, 0);
  const totalSharePercent = distributionResults.reduce((sum, r) => sum + r.sharePercentage, 0);
  const totalShareDollars = distributionResults.reduce((sum, r) => sum + r.receivedAmount, 0);

  // Always show all 5 categories in the color key
  const allCategories: CategoryColor[] = ['boh', 'foh', 'bar', 'support', 'custom'];

  // Check if any employee has sortOrder defined (manual sort mode)
  const hasManualSort = employees.some(emp => emp.sortOrder !== undefined);

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
      jobCategoryId: emp.jobCategoryId,
      jobCategory: category?.name || 'Unknown',
      sortOrder: emp.sortOrder,
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

  // Sort: if manual sortOrder exists use it, otherwise auto-sort
  const sortedResults = [...allEmployeeRows].sort((a, b) => {
    if (hasManualSort && a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }

    // Auto-sort: active employees (hours > 0) first by category then share, then inactive at the end
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

  // DnD handlers
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, employeeId: string) => {
    setDraggedId(employeeId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', employeeId);
    // Slight delay to let the browser capture the drag image before fading
    requestAnimationFrame(() => {
      const row = e.currentTarget;
      row.classList.add('row-dragging');
    });
  };

  const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.classList.remove('row-dragging');
    setDraggedId(null);
    setDragOverIndex(null);
    setDragOverTrash(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (!draggedId) return;

    const sourceIndex = sortedResults.findIndex(r => r.employeeId === draggedId);
    if (sourceIndex === -1 || sourceIndex === targetIndex) return;

    // Build new order from the current sorted display, then splice
    const newOrder = sortedResults.map(r => r.employeeId);
    newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, draggedId);

    reorderEmployees(newOrder);
    setDraggedId(null);
  };

  // Handle job change from the row dropdown
  const handleJobChange = (employeeId: string, newJobCategoryId: string) => {
    updateEmployee(employeeId, { jobCategoryId: newJobCategoryId, weightAdjustment: 0 });
  };

  // Trash drop zone handlers
  const handleTrashDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTrash(true);
  };

  const handleTrashDragLeave = (e: React.DragEvent) => {
    setDragOverTrash(false);
  };

  const handleTrashDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverTrash(false);
    if (draggedId) {
      removeEmployee(draggedId);
      setDraggedId(null);
      setDragOverIndex(null);
    }
  };

  // Handle adding a new employee from the add row
  const handleAddEmployee = (name: string, jobCategoryId: string) => {
    const newId = String(Date.now());
    addEmployee({
      id: newId,
      name,
      jobCategoryId,
      hourlyRate: 15,
      hoursWorked: 0,
      status: 'active',
    });
  };

  // Handle print
  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  // Smooth scroll back to settings section
  const goToSettings = () => {
    const element = document.getElementById('settings-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="distribution-table" className="distribution-section">
      {/* Print-only Header */}
      <div className="print-header">
        <div className="print-header-left">
          <span className="print-url">demo.tipsharepro.com</span>
        </div>
        <div className="print-header-center">
          <span className="print-date">{new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} &mdash; {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
        </div>
        <div className="print-header-right">
          <span className="print-fine-print">Tip Distribution Report</span>
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
          <button
            onClick={resetToDefaults}
            className="btn btn-outline btn-sm"
            title="Reset everything to defaults"
          >
            <RotateCcw size={16} />
            Reset All
          </button>
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

      {/* Print-only Distribution Header with Big Logo */}
      <div className="print-dist-header print-only">
        <img src="/logo-full.png" alt="TipSharePro" className="print-dist-logo" />
      </div>

      {/* Stat Cards Row */}
      <div className="stat-cards-container">
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
            helpText={HELP_TEXT.grossPool}
          />
          <StatCard
            label="Pre-Paid"
            value={prePaidAmount}
            prefix="$"
            editable
            onChange={setPrePaidAmount}
            helpText={HELP_TEXT.prePaid}
            helpPdfLink="/help/what-does-pre-paid-mean.pdf"
            helpPdfTitle="What Does Pre-Paid Mean (PDF)"
          />
          <StatCard
            label="Net Pool"
            value={Math.round(netPool)}
            prefix="$"
          />
          <StatCard
            label="Top Contributors"
            value="Barb B. (aka: Malibu) & Ken Dahl"
          />
        </div>
      </div>

      {/* Distribution Table */}
      <div className="table-container">
        <table className="distribution-table">
          <thead>
            <tr>
              <th className="col-grip no-print"></th>
              <th className="col-name">Name</th>
              <th className="col-wages hide-print">Wages</th>
              <th className="col-hours">Hours</th>
              <th className="col-weight">Weight</th>
              <th className="col-share-percent">Share %</th>
              <th className="col-share-dollars">Share $</th>
              <th className={`col-dollars-per-hour ${!printIncludeSharePerHour ? 'hide-print' : ''}`}>$/Hr</th>
              <th className="col-actions no-print"></th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result, index) => (
              <tr
                key={result.employeeId}
                draggable
                onDragStart={(e) => handleDragStart(e, result.employeeId)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`${draggedId === result.employeeId ? 'row-dragging' : ''} ${dragOverIndex === index && draggedId !== result.employeeId ? 'row-drag-over' : ''}`}
              >
                <td className="col-grip no-print">
                  <span className="row-grip-handle" title="Drag to reorder">
                    <GripVertical size={14} />
                  </span>
                </td>
                <td className={`col-name name-cell-${result.categoryColor}`}>
                  <div className="employee-name-cell">
                    <InlineCategoryDot categoryColor={result.categoryColor} size={10} />
                    <EditableTextInput
                      value={result.employeeName}
                      onChange={(name) => updateEmployee(result.employeeId, { name })}
                      className="table-input table-input-name"
                      placeholder="Enter name"
                    />
                    <JobCategorySelector
                      value={result.jobCategoryId}
                      jobCategories={settings.jobCategories}
                      categoryNames={settings.categoryNames}
                      onChange={(jobId) => handleJobChange(result.employeeId, jobId)}
                    />
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
                <td className="col-actions no-print">
                  <button
                    className="btn-delete-employee"
                    onClick={() => removeEmployee(result.employeeId)}
                    title="Remove employee"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td className="col-grip no-print"></td>
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
              <td className="col-actions no-print"></td>
            </tr>
          </tfoot>
        </table>

        {/* Add Employee Row */}
        <AddEmployeeRow
          jobCategories={settings.jobCategories}
          categoryNames={settings.categoryNames}
          onAdd={handleAddEmployee}
          isDragging={draggedId !== null}
          dragOverTrash={dragOverTrash}
          onTrashDragOver={handleTrashDragOver}
          onTrashDragLeave={handleTrashDragLeave}
          onTrashDrop={handleTrashDrop}
        />
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
          target="distribution"
          onClose={() => setShowPrintDialog(false)}
          printIncludeSharePerHour={printIncludeSharePerHour}
          setPrintIncludeSharePerHour={setPrintIncludeSharePerHour}
        />
      )}
    </div>
  );
}
