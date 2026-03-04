'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { CONTRIBUTION_METHOD_LABELS, HELP_TEXT, CategoryColor, CATEGORY_COLOR_MAP, JobCategory } from '@/lib/types';
import { InlineCategoryDot } from './CategoryBadge';
import HelpTooltip from './HelpTooltip';
import PrintDialog from './PrintDialog';
import { Plus, Minus, Printer, ChevronLeft, RotateCcw, Mail, Lock, GripVertical, Trash2, LogOut, Loader2, Send } from 'lucide-react';
import { getAuthorizedContacts, sendReport } from '@/lib/api/authorizedContacts';
import type { AuthorizedContact } from '@/lib/api/authorizedContacts';
import { jsPDF } from 'jspdf';

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
  sublabel?: string;
  centerLabel?: boolean;
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

function StatCard({ label, sublabel, centerLabel, value, isDemo, helpText, helpPdfLink, helpPdfTitle, editable, onChange, prefix, className }: StatCardProps) {
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
      {centerLabel ? (
        <div className="stat-card-label-centered">
          <span />
          <span className="label-text">{label}</span>
          <span className="label-help">
            {helpText && <HelpTooltip text={helpText} pdfLink={helpPdfLink} pdfTitle={helpPdfTitle} />}
          </span>
        </div>
      ) : (
        <div className="stat-card-label">
          {label}
          {helpText && <HelpTooltip text={helpText} pdfLink={helpPdfLink} pdfTitle={helpPdfTitle} />}
        </div>
      )}
      {sublabel && <div className="stat-card-sublabel"><span className="demo-label">{sublabel}</span></div>}
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


// ============================================================================
// Archived Distribution View (read-only results from finalized period)
// ============================================================================

function ArchivedDistributionTable() {
  const { state } = useDemo();
  const { calculationResult, activePayPeriod } = state;

  if (!calculationResult || !activePayPeriod) {
    return <p className="text-muted" style={{ padding: '1rem' }}>No distribution data available for this period.</p>;
  }

  const { distribution, summary } = calculationResult;

  return (
    <div className="table-container">
      <div className="archived-distribution-header">
        <span className="archived-distribution-title">Finalized Distribution</span>
        <span className="archived-distribution-date">
          Calculated {new Date(calculationResult.calculatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Summary cards */}
      <div className="stat-cards-row" style={{ marginBottom: '0.75rem' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Pool</div>
          <div className="stat-card-value">${(summary.totalPoolCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Participants</div>
          <div className="stat-card-value">{summary.totalParticipants}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total Hours</div>
          <div className="stat-card-value">{summary.totalHours.toFixed(1)}</div>
        </div>
      </div>

      <table className="distribution-table">
        <thead>
          <tr>
            <th className="col-name">Name</th>
            <th className="col-category">Category</th>
            <th className="col-hours">Hours</th>
            <th className="col-share-percent">Share %</th>
            <th className="col-share-dollars">Share $</th>
            <th className="col-dollars-per-hour">$/Hr</th>
          </tr>
        </thead>
        <tbody>
          {distribution.map(emp => {
            const dollarsPerHour = emp.hoursWorked > 0 ? (emp.receivedCents / 100) / emp.hoursWorked : 0;
            return (
              <tr key={emp.employeeId}>
                <td className="col-name">
                  <span className="employee-name-static">{emp.employeeName}</span>
                </td>
                <td className="col-category">{emp.jobCategory.name}</td>
                <td className="col-hours">{emp.hoursWorked.toFixed(2)}</td>
                <td className="col-share-percent">{emp.percentage.toFixed(2)}%</td>
                <td className="col-share-dollars">${(emp.receivedCents / 100).toLocaleString('en-US')}</td>
                <td className="col-dollars-per-hour">${dollarsPerHour.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="totals-row">
            <td className="col-name"><strong>Totals</strong></td>
            <td className="col-category">—</td>
            <td className="col-hours"><strong>{summary.totalHours.toFixed(2)}</strong></td>
            <td className="col-share-percent"><strong>100.00%</strong></td>
            <td className="col-share-dollars"><strong>${(summary.distributedCents / 100).toLocaleString('en-US')}</strong></td>
            <td className="col-dollars-per-hour">—</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// Help text for distribution table (Demo mode)
const DISTRIBUTION_HELP_DEMO = `The Distribution Table shows how the tip pool is divided among employees.

Each employee's share is calculated based on:
• Hours worked during the pay period
• Hourly wage rate
• Category weight (set in Settings)
• Individual weight adjustments (up to +0.75)

A person in a category with weight 3.0 can be "experience bumped" up to 3.75, then back down to 3.0, but not out of the whole number category weight. That way a ten year veteran may be distinguished from someone who started yesterday.

Print the table for transparency posting or email to payroll (full version).`;

// Help text for distribution table (Full version)
const DISTRIBUTION_HELP_FULL = `For initial entries Follow the Numbered Steps - Use the "?" for tips in each box. The Distribution Table is how the tip pool is divided among recipient employees. Standard rounding to the nearest $ is used in the final column.

Each employee's share is calculated based on:
• Hours worked during the pay period
• Hourly wage rate
• Category weight (set in Settings)
• Individual weight adjustments (up to +0.75)

A person in a category with weight 3.0 can be "experience bumped" up to 3.75, then back down to 3.0, but not out of the whole number category weight. That way a ten-year veteran may be distinguished from someone who started yesterday.

The ability to "Experience Bump" is reserved for Manager and Admin permissions.

Print the table for transparency posting and email to payroll.`;

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
    handleLogout,
    clearSamples,
  } = useDemo();

  const { settings, employees, distributionResults, projectedPool, prePaidAmount, netPool, printIncludeSharePerHour, locations, activeLocationId, selectedLocationName } = state;
  const isDemo = state.subscriptionStatus === 'DEMO';
  const userRole = state.user?.role;
  const canBumpWeight = isDemo || userRole === 'ADMIN' || userRole === 'MANAGER';

  // Mode detection for real accounts
  const isArchivedViewMode = !isDemo && !!state.activePayPeriod && state.activePayPeriod.status === 'ARCHIVED' && !!state.calculationResult;

  // Print dialog state
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  // Email dropdown state
  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);
  const [emailContacts, setEmailContacts] = useState<AuthorizedContact[]>([]);
  const [emailContactsLoading, setEmailContactsLoading] = useState(false);
  const [selectedEmailIds, setSelectedEmailIds] = useState<Set<string>>(new Set());
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const emailDropdownRef = useRef<HTMLDivElement>(null);

  const toggleEmailContact = (id: string) => {
    setSelectedEmailIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const buildPdfNative = () => {
    const includeDolPerHr = printIncludeSharePerHour;
    const isLandscape = includeDolPerHr;
    const pageW = isLandscape ? 279.4 : 215.9;
    const pageMargin = 15;
    const contentW = pageW - pageMargin * 2;

    const findJob = (jobCatId: string) => {
      for (const jc of settings.jobCategories) { if (jc.id === jobCatId) return jc; }
      return null;
    };

    const catHexMap: Record<string, [number, number, number]> = {
      boh: [232, 93, 4], foh: [142, 68, 173], bar: [53, 160, 210], support: [130, 181, 54], custom: [241, 196, 15],
    };

    const pdf = new jsPDF({ orientation: isLandscape ? 'landscape' : 'portrait', unit: 'mm', format: 'letter' });
    let y = pageMargin;

    pdf.setFontSize(16);
    pdf.setTextColor(251, 146, 60);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TipSharePro.com', pageW / 2, y + 6, { align: 'center' });
    y += 8;
    pdf.setFontSize(6);
    pdf.setTextColor(200, 120, 40);
    pdf.setFont('helvetica', 'normal');
    pdf.text('TRACKABLE \u2022 TRUSTED \u2022 TRANSPARENT', pageW / 2, y + 3, { align: 'center' });
    y += 6;

    const activeLocation = locations?.find((l: { id: string; name: string }) => l.id === activeLocationId);
    const locationName = selectedLocationName || activeLocation?.name || settings.companyName || '';
    if (locationName) {
      pdf.setFontSize(12);
      pdf.setTextColor(50);
      pdf.setFont('helvetica', 'bold');
      pdf.text(locationName, pageW / 2, y + 4, { align: 'center' });
      y += 8;
    }

    pdf.setDrawColor(200);
    pdf.line(pageMargin, y, pageW - pageMargin, y);
    y += 4;

    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    pdf.setFontSize(7);
    pdf.setTextColor(100);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Tip Distribution Report', pageMargin, y + 2);
    pdf.text(dateStr + ' \u2014 ' + timeStr, pageW - pageMargin, y + 2, { align: 'right' });
    y += 6;

    const stats = [
      { label: 'PAY PERIOD', value: '\u2014' },
      { label: 'GROSS POOL', value: '$' + Math.round(projectedPool).toLocaleString('en-US') },
      { label: 'PRE-PAID', value: '$' + prePaidAmount.toLocaleString('en-US') },
      { label: 'NET POOL', value: '$' + Math.round(netPool).toLocaleString('en-US') },
    ];
    const cardW = 32;
    const cardH = 12;
    const cardGap = 3;
    let cx = pageMargin;
    stats.forEach(s => {
      pdf.setDrawColor(37, 99, 235);
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(cx, y, cardW, cardH, 1, 1, 'FD');
      pdf.setFontSize(5);
      pdf.setTextColor(100);
      pdf.setFont('helvetica', 'normal');
      pdf.text(s.label, cx + cardW / 2, y + 4, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(0);
      pdf.setFont('helvetica', 'bold');
      pdf.text(s.value, cx + cardW / 2, y + 10, { align: 'center' });
      cx += cardW + cardGap;
    });
    y += cardH + 6;

    const headers = ['NAME', 'HOURS', 'WEIGHT', 'SHARE %', 'SHARE $'];
    if (includeDolPerHr) headers.push('$/HR');
    const nameColW = contentW * 0.34;
    const dataColW = (contentW - nameColW) / (headers.length - 1);
    const colWidths = headers.map((_, i) => i === 0 ? nameColW : dataColW);

    const rowH = 8;
    const headerH = 6;

    pdf.setFillColor(30, 64, 138);
    pdf.setDrawColor(30, 64, 138);
    pdf.rect(pageMargin, y, contentW, headerH, 'FD');

    pdf.setFontSize(7);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    let hx = pageMargin;
    headers.forEach((h, i) => {
      pdf.text(h, hx + colWidths[i] / 2, y + headerH / 2 + 2, { align: 'center' });
      hx += colWidths[i];
    });
    y += headerH;

    sortedResults.forEach(r => {
      const job = findJob(r.jobCategoryId);
      const catColor = catHexMap[r.categoryColor] || [200, 200, 200];
      let rx = pageMargin;

      pdf.setDrawColor(150);
      colWidths.forEach((w) => {
        pdf.rect(rx, y, w, rowH);
        rx += w;
      });

      pdf.setFillColor(catColor[0], catColor[1], catColor[2]);
      pdf.rect(pageMargin, y, 1.5, rowH, 'F');

      const dotX = pageMargin + 4;
      const dotY = y + (job ? 3 : rowH / 2);
      pdf.setFillColor(catColor[0], catColor[1], catColor[2]);
      pdf.circle(dotX, dotY, 1.2, 'F');

      pdf.setFontSize(7);
      pdf.setTextColor(0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(r.employeeName, pageMargin + 7, y + (job ? 4 : rowH / 2 + 1.5));
      if (job) {
        pdf.setFontSize(5);
        pdf.setTextColor(100);
        pdf.text(job.name, pageMargin + 7, y + 7);
      }

      const vals = [
        r.hoursWorked.toFixed(2),
        r.effectiveWeight.toFixed(2),
        r.sharePercentage.toFixed(2) + '%',
        '$' + r.receivedAmount.toLocaleString('en-US'),
      ];
      if (includeDolPerHr) vals.push('$' + r.dollarsPerHour.toFixed(2));

      pdf.setFontSize(7);
      pdf.setTextColor(0);
      pdf.setFont('helvetica', 'normal');
      let vx = pageMargin + nameColW;
      vals.forEach((v, i) => {
        pdf.text(v, vx + colWidths[i + 1] / 2, y + rowH / 2 + 1.5, { align: 'center' });
        vx += colWidths[i + 1];
      });

      y += rowH;
    });

    pdf.setFillColor(243, 244, 246);
    pdf.setDrawColor(150);
    let tx = pageMargin;
    colWidths.forEach((w) => {
      pdf.rect(tx, y, w, rowH, 'FD');
      tx += w;
    });
    pdf.setFontSize(7);
    pdf.setTextColor(0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Totals', pageMargin + 4, y + rowH / 2 + 1.5);
    const totVals = [
      totalHours.toFixed(2),
      '\u2014',
      totalSharePercent.toFixed(2) + '%',
      '$' + totalShareDollars.toLocaleString('en-US'),
    ];
    if (includeDolPerHr) totVals.push('\u2014');
    let tvx = pageMargin + nameColW;
    totVals.forEach((v, i) => {
      pdf.text(v, tvx + colWidths[i + 1] / 2, y + rowH / 2 + 1.5, { align: 'center' });
      tvx += colWidths[i + 1];
    });
    y += rowH + 4;

    let kx = pageMargin;
    Object.entries(catHexMap).forEach(([key, rgb]) => {
      const label = settings.categoryNames?.[key as CategoryColor] || CATEGORY_COLOR_MAP[key as CategoryColor]?.name || key;
      pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
      pdf.circle(kx + 1.5, y + 1, 1.2, 'F');
      pdf.setFontSize(5.5);
      pdf.setTextColor(60);
      pdf.setFont('helvetica', 'normal');
      pdf.text(label, kx + 4, y + 2);
      kx += pdf.getTextWidth(label) + 8;
    });
    y += 8;

    pdf.setDrawColor(220);
    pdf.line(pageMargin, y, pageW - pageMargin, y);
    y += 3;
    pdf.setFontSize(6);
    pdf.setTextColor(150);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TipSharePro', pageMargin, y + 2);
    pdf.setFont('helvetica', 'normal');
    pdf.text(dateStr + ' ' + timeStr, pageW - pageMargin, y + 2, { align: 'right' });

    return pdf;
  };

  const handleSendEmail = async () => {
    if (selectedEmailIds.size === 0) return;
    try {
      setEmailSending(true);

      const pdf = buildPdfNative();
      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      const activeLoc = locations?.find((l: { id: string; name: string }) => l.id === activeLocationId);
      const locationName = selectedLocationName || activeLoc?.name || settings.companyName || 'Restaurant';
      const fileDateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).replace(/[^a-zA-Z0-9]/g, '_');
      const pdfFilename = 'TipSharePro_Distribution_' + fileDateStr + '.pdf';
      const subject = 'TipSharePro - Distribution Report - ' + locationName;

      const result = await sendReport({
        contactIds: Array.from(selectedEmailIds),
        reportType: 'distribution',
        subject,
        pdfBase64,
        pdfFilename,
      });
      setEmailDropdownOpen(false);
      setEmailSent('Sent to ' + result.sent + ' recipient' + (result.sent !== 1 ? 's' : ''));
      setTimeout(() => setEmailSent(null), 3000);
    } catch (err) {
      setEmailSent('Failed to send');
      setTimeout(() => setEmailSent(null), 3000);
    } finally {
      setEmailSending(false);
    }
  };

  const openEmailDropdown = async () => {
    setEmailDropdownOpen(true);
    setSelectedEmailIds(new Set());
    try {
      setEmailContactsLoading(true);
      const contacts = await getAuthorizedContacts();
      setEmailContacts(contacts);
    } catch {
      setEmailContacts([]);
    } finally {
      setEmailContactsLoading(false);
    }
  };

  useEffect(() => {
    if (!emailDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (emailDropdownRef.current && !emailDropdownRef.current.contains(e.target as Node)) {
        setEmailDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [emailDropdownOpen]);

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
      {/* Print-only Letterhead */}
      <div className="print-letterhead print-only">
        <div className="print-letterhead-left">
          <img src="/letterhead/contact-text.png" alt="Questions or Comments? contact@tipsharepro.com" className="print-letterhead-contact" />
          <img src="/letterhead/qr-code.png" alt="QR Code" className="print-letterhead-qr" />
        </div>
        <div className="print-letterhead-center">
          <img src="/logo-full.png" alt="TipSharePro" className="print-letterhead-logo" />
        </div>
        <div className="print-letterhead-right">
          <img src="/letterhead/right-border.png" alt="" className="print-letterhead-border" />
        </div>
      </div>

      {/* Print-only sub-line: report type + date */}
      <div className="print-report-line print-only">
        <span className="print-report-type">Tip Distribution Report</span>
        <span className="print-report-date">{new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} &mdash; {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
      </div>

      {/* Section Header - hidden on print */}
      <div className="distribution-header no-print">
        <h2 className="section-title">
          Distribution Table
          <HelpTooltip text={isDemo ? DISTRIBUTION_HELP_DEMO : DISTRIBUTION_HELP_FULL} />
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
          {isDemo ? (
            <button className="btn btn-faded btn-sm" title="Email feature available in full version">
              <Mail size={16} />
              <Lock size={12} className="lock-icon" />
            </button>
          ) : (
            <>
            {emailSent && (
              <span style={{ color: emailSent.startsWith('Failed') ? '#ef4444' : '#22c55e', fontWeight: 700, fontSize: '0.7rem', marginRight: '0.25rem' }}>{emailSent}</span>
            )}
            <div ref={emailDropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
              <button
                className={`btn btn-outline btn-sm${emailDropdownOpen ? ' btn-active' : ''}`}
                title="Email distribution report"
                onClick={() => emailDropdownOpen ? setEmailDropdownOpen(false) : openEmailDropdown()}
                data-testid="email-distribution-btn"
              >
                <Mail size={16} />
                Email
              </button>
              {emailDropdownOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '0.25rem',
                  background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  minWidth: '240px', zIndex: 50, overflow: 'hidden'
                }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--bg-border)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Select Recipients
                  </div>
                  {emailContactsLoading && (
                    <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      <Loader2 size={14} style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '0.25rem' }} /> Loading...
                    </div>
                  )}
                  {!emailContactsLoading && emailContacts.length === 0 && (
                    <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      No authorized contacts. Add them in Settings Card 5.
                    </div>
                  )}
                  {!emailContactsLoading && emailContacts.map((contact) => (
                    <label
                      key={contact.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.7rem',
                        borderBottom: '1px solid var(--bg-border)',
                        background: selectedEmailIds.has(contact.id) ? 'var(--bg-elevated)' : 'transparent',
                      }}
                      data-testid={`email-contact-${contact.id}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmailIds.has(contact.id)}
                        onChange={() => toggleEmailContact(contact.id)}
                        style={{ accentColor: '#fb923c', width: '0.9rem', height: '0.9rem', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.name}</div>
                        {contact.company && <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{contact.company}</div>}
                        <div style={{ color: '#fb923c', fontSize: '0.6rem' }}>{contact.email}</div>
                      </div>
                    </label>
                  ))}
                  {!emailContactsLoading && emailContacts.length > 0 && (
                    <div style={{ padding: '0.5rem 0.75rem', display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-outline btn-xs"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setEmailDropdownOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary btn-xs"
                        style={{ fontSize: '0.6rem', opacity: (selectedEmailIds.size > 0 && !emailSending) ? 1 : 0.4, cursor: (selectedEmailIds.size > 0 && !emailSending) ? 'pointer' : 'not-allowed' }}
                        disabled={selectedEmailIds.size === 0 || emailSending}
                        onClick={handleSendEmail}
                        data-testid="send-email-btn"
                      >
                        {emailSending ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={12} />}
                        {emailSending ? 'Sending...' : `Send (${selectedEmailIds.size})`}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            </>
          )}
        </div>
      </div>



      {/* Stat Cards Row */}
      <div className="stat-cards-container">
        <div className="stat-cards-row print-stat-cards">
          <StatCard label="Day/Date" value={isDemo ? '' : '\u2014'} isDemo={isDemo} className="hide-print" />
          <StatCard label="Location" value={isDemo ? '' : '\u2014'} isDemo={isDemo} className="hide-print" />
          <StatCard label="Pay Period" value={isDemo ? '' : '\u2014'} isDemo={isDemo} />
          <StatCard
            label="Contrib. Method"
            value={CONTRIBUTION_METHOD_LABELS[settings.contributionMethod]}
            className="hide-print"
          />
          <StatCard
            label="Gross Pool"
            centerLabel
            value={Math.round(projectedPool)}
            prefix="$"
            helpText={HELP_TEXT.grossPool}
          />
          <StatCard
            label="Pre-Paid"
            sublabel="Demo"
            centerLabel
            value={prePaidAmount}
            prefix="$"
            editable
            onChange={setPrePaidAmount}
            helpText={HELP_TEXT.prePaid}
            helpPdfLink="/help/what-does-pre-paid-demo.pdf"
            helpPdfTitle="What Does Pre-Paid Mean (PDF)"
          />
          <StatCard
            label="Net Pool"
            value={Math.round(netPool)}
            prefix="$"
            className="stat-card-drop-label"
          />
          {isDemo && (
            <StatCard
              label="Top Contributors"
              value="Barb B. (aka: Malibu) & Ken Dahl"
            />
          )}
        </div>
      </div>

      {/* Table: conditional rendering based on mode */}
      {isArchivedViewMode ? (
        <ArchivedDistributionTable />
      ) : (
        <>
          {/* Distribution Table (demo / normal mode) */}
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
                        <div className="employee-name-row">
                          <InlineCategoryDot categoryColor={result.categoryColor} size={10} />
                          <span className="table-input table-input-name employee-name-static">
                            {result.employeeName}
                          </span>
                        </div>
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
                      {canBumpWeight ? (
                        <WeightAdjuster
                          baseWeight={result.variableWeight}
                          adjustment={result.weightAdjustment}
                          effectiveWeight={result.effectiveWeight}
                          onAdjust={(delta) => adjustIndividualWeight(result.employeeId, delta)}
                        />
                      ) : (
                        <span className="weight-adjuster-value">{result.effectiveWeight.toFixed(2)}</span>
                      )}
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
        </>
      )}

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

      {/* Back to Settings & Log Out Buttons */}
      <div className="distribution-footer">
        <button onClick={goToSettings} className="btn btn-outline">
          <ChevronLeft size={16} />
          Back to Settings
        </button>
        <button onClick={handleLogout} className="btn btn-outline">
          <LogOut size={16} />
          Log Out
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
