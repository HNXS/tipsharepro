'use client';

import { useState, useMemo } from 'react';
import { useDemo } from '@/lib/DemoContext';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Archive,
  Clock,
  CheckCircle2,
  List,
  X,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import type { PayPeriod } from '@/lib/api';
import type { EmployeeHours } from '@/lib/api/calculations';
import { canAccess } from '@/lib/permissions';

// ============================================================================
// Helper: format date as "Mon, Jan 5"
// ============================================================================

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateRange(start: string, end: string): string {
  return `${formatDateShort(start)} – ${formatDateShort(end)}`;
}

// Get all dates between start and end inclusive
function getDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');
  while (current <= endDate) {
    // Use local date parts to avoid UTC timezone shift
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// ============================================================================
// Status Badge
// ============================================================================

function StatusBadge({ status }: { status: PayPeriod['status'] }) {
  const config = {
    DRAFT: { label: 'Draft', className: 'pay-period-status-badge badge-draft' },
    ACTIVE: { label: 'Active', className: 'pay-period-status-badge badge-active' },
    ARCHIVED: { label: 'Archived', className: 'pay-period-status-badge badge-archived' },
  };
  const c = config[status];
  return <span className={c.className}>{c.label}</span>;
}

// ============================================================================
// Create Pay Period Modal
// ============================================================================

function CreatePayPeriodModal({
  onClose,
  onCreate,
  loading,
}: {
  onClose: () => void;
  onCreate: (start: string, end: string) => void;
  loading: boolean;
}) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const [startDate, setStartDate] = useState(today);
  const later = new Date(now.getTime() + 13 * 86400000);
  const twoWeeksLater = `${later.getFullYear()}-${String(later.getMonth() + 1).padStart(2, '0')}-${String(later.getDate()).padStart(2, '0')}`;
  const [endDate, setEndDate] = useState(twoWeeksLater);

  const isValid = startDate && endDate && endDate > startDate;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New Pay Period</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="form-input"
              min={startDate}
            />
          </div>
          {isValid && (
            <p className="form-hint">
              {getDateRange(startDate, endDate).length} days ({formatDateRange(startDate, endDate)})
            </p>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onCreate(startDate, endDate)}
            disabled={!isValid || loading}
          >
            {loading ? <Loader2 size={16} className="loading-spinner" /> : <Plus size={16} />}
            Create Pay Period
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Pay Period List Modal
// ============================================================================

function PayPeriodListModal({
  periods,
  onSelect,
  onClose,
}: {
  periods: PayPeriod[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Pay Periods</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          {periods.length === 0 ? (
            <p className="text-muted">No pay periods yet.</p>
          ) : (
            <div className="pay-period-list">
              {periods.map(p => (
                <button
                  key={p.id}
                  className="pay-period-list-item"
                  onClick={() => { onSelect(p.id); onClose(); }}
                >
                  <div className="pay-period-list-item-info">
                    <span className="pay-period-list-dates">
                      {formatDateRange(p.startDate, p.endDate)}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="pay-period-list-item-meta">
                    <span>{p.daysEntered}/{p.totalDays} days entered</span>
                    {p.totalPool !== null && (
                      <span>Pool: ${p.totalPool.toLocaleString('en-US')}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Finalize Confirm Modal
// ============================================================================

function FinalizeConfirmModal({
  payPeriod,
  employees,
  runningTotals,
  onConfirm,
  onClose,
  loading,
}: {
  payPeriod: PayPeriod;
  employees: Array<{ id: string; name: string; hoursWorked: number }>;
  runningTotals: { totalSalesCents: number; totalActualContribCents: number; daysEntered: number; daysTotal: number } | null;
  onConfirm: (employeeHours: EmployeeHours[]) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [hours, setHours] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    employees.forEach(e => { init[e.id] = String(e.hoursWorked || 0); });
    return init;
  });

  const handleConfirm = () => {
    const employeeHours: EmployeeHours[] = employees.map(e => ({
      employeeId: e.id,
      hours: parseFloat(hours[e.id] || '0') || 0,
    }));
    onConfirm(employeeHours);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content finalize-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Finalize Pay Period</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="finalize-summary">
            <p><strong>Period:</strong> {formatDateRange(payPeriod.startDate, payPeriod.endDate)}</p>
            {runningTotals && (
              <>
                <p><strong>Days Entered:</strong> {runningTotals.daysEntered} of {runningTotals.daysTotal}</p>
                <p><strong>Total Sales:</strong> ${(runningTotals.totalSalesCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p><strong>Total Pool:</strong> ${(runningTotals.totalActualContribCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </>
            )}
          </div>

          <h4 className="finalize-hours-title">Employee Hours for Period</h4>
          <div className="finalize-hours-list">
            {employees.map(emp => (
              <div key={emp.id} className="finalize-hours-row">
                <span className="finalize-hours-name">{emp.name}</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={hours[emp.id] || '0'}
                  onChange={e => setHours(prev => ({ ...prev, [emp.id]: e.target.value }))}
                  className="form-input finalize-hours-input"
                />
                <span className="finalize-hours-label">hrs</span>
              </div>
            ))}
          </div>

          <div className="finalize-warning">
            <AlertTriangle size={16} />
            <span>This will finalize the period and lock all entries. This cannot be undone.</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={loading}>
            {loading ? <Loader2 size={16} className="loading-spinner" /> : <CheckCircle2 size={16} />}
            Finalize & Calculate
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Date Navigator
// ============================================================================

function DateNavigator({
  navigation,
  selectedDate,
  onNavigate,
}: {
  navigation: { previousDate: string | null; nextDate: string | null; dayNumber: number; totalDays: number };
  selectedDate: string;
  onNavigate: (date: string) => void;
}) {
  return (
    <div className="pay-period-date-nav">
      <button
        className="btn btn-outline btn-icon"
        onClick={() => navigation.previousDate && onNavigate(navigation.previousDate)}
        disabled={!navigation.previousDate}
        title="Previous day"
      >
        <ChevronLeft size={16} />
      </button>
      <div className="pay-period-date-nav-center">
        <span className="pay-period-date-nav-date">{formatDate(selectedDate)}</span>
        <span className="pay-period-date-nav-count">
          Day {navigation.dayNumber} of {navigation.totalDays}
        </span>
      </div>
      <button
        className="btn btn-outline btn-icon"
        onClick={() => navigation.nextDate && onNavigate(navigation.nextDate)}
        disabled={!navigation.nextDate}
        title="Next day"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ============================================================================
// Main PayPeriodBar Component
// ============================================================================

export default function PayPeriodBar() {
  const {
    state,
    createNewPayPeriod,
    selectPayPeriod,
    activatePayPeriod,
    archivePayPeriod,
    selectDate,
    runCalculation,
    clearPayPeriodSelection,
  } = useDemo();

  const isDemo = state.subscriptionStatus === 'DEMO';
  const userRole = state.user?.role;
  const canCreate = canAccess(userRole, 'payPeriod.create');
  const canFinalize = canAccess(userRole, 'payPeriod.finalize');
  const { activePayPeriod, payPeriods, selectedDate, dateNavigation, runningTotals, payPeriodLoading } = state;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  // Don't render for demo accounts
  if (isDemo) return null;

  // Progress bar percentage
  const progressPercent = activePayPeriod
    ? Math.round((activePayPeriod.daysEntered / Math.max(activePayPeriod.totalDays, 1)) * 100)
    : 0;

  // All dates in the active period
  const periodDates = useMemo(() => {
    if (!activePayPeriod) return [];
    return getDateRange(activePayPeriod.startDate, activePayPeriod.endDate);
  }, [activePayPeriod]);

  // Auto-select first date when period loaded and no date selected
  const handleStartEntering = () => {
    if (activePayPeriod && periodDates.length > 0) {
      // If draft, activate first
      if (activePayPeriod.status === 'DRAFT') {
        activatePayPeriod().then(() => {
          selectDate(periodDates[0]);
        });
      } else {
        selectDate(periodDates[0]);
      }
    }
  };

  const handleCreate = async (start: string, end: string) => {
    await createNewPayPeriod(start, end);
    setShowCreateModal(false);
  };

  const handleFinalize = async (employeeHours: EmployeeHours[]) => {
    await runCalculation(employeeHours);
    await archivePayPeriod();
    setShowFinalizeModal(false);
  };

  // Determine if we can finalize (ACTIVE status + has entries + role allows)
  const canFinalizeNow = canFinalize && activePayPeriod?.status === 'ACTIVE' && activePayPeriod.daysEntered > 0;

  return (
    <div className="pay-period-bar no-print">
      {/* Header row */}
      <div className="pay-period-bar-header">
        <h3 className="pay-period-bar-title">
          <Calendar size={18} />
          Pay Periods
        </h3>
        <div className="pay-period-bar-actions">
          {payPeriods.length > 0 && (
            <button className="btn btn-outline btn-sm" onClick={() => setShowListModal(true)}>
              <List size={14} />
              History
            </button>
          )}
          {!activePayPeriod && canCreate && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
              <Plus size={14} />
              New Pay Period
            </button>
          )}
        </div>
      </div>

      {/* Active period info */}
      {activePayPeriod && (
        <div className="pay-period-bar-active">
          <div className="pay-period-bar-info">
            <div className="pay-period-bar-dates">
              <span>{formatDateRange(activePayPeriod.startDate, activePayPeriod.endDate)}</span>
              <StatusBadge status={activePayPeriod.status} />
            </div>

            {/* Progress bar */}
            {activePayPeriod.status !== 'ARCHIVED' && (
              <div className="pay-period-progress">
                <div
                  className="pay-period-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
                <span className="pay-period-progress-label">
                  {activePayPeriod.daysEntered}/{activePayPeriod.totalDays} days
                </span>
              </div>
            )}

            {/* Running totals */}
            {runningTotals && (
              <div className="pay-period-running-totals">
                <span>Sales: ${(runningTotals.totalSalesCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <span>Pool: ${(runningTotals.totalActualContribCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>

          {/* Date navigator or action buttons */}
          <div className="pay-period-bar-nav">
            {selectedDate && dateNavigation ? (
              <DateNavigator
                navigation={dateNavigation}
                selectedDate={selectedDate}
                onNavigate={selectDate}
              />
            ) : activePayPeriod.status === 'ARCHIVED' ? (
              <div className="pay-period-bar-archived-actions">
                <button className="btn btn-outline btn-sm" onClick={clearPayPeriodSelection}>
                  <X size={14} />
                  Close
                </button>
                {canCreate && (
                  <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
                    <Plus size={14} />
                    New Pay Period
                  </button>
                )}
              </div>
            ) : (
              <div className="pay-period-bar-entry-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleStartEntering}
                  disabled={payPeriodLoading}
                >
                  {payPeriodLoading ? (
                    <Loader2 size={14} className="loading-spinner" />
                  ) : (
                    <Clock size={14} />
                  )}
                  Enter Daily Sales
                </button>
                {canFinalizeNow && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowFinalizeModal(true)}
                  >
                    <Archive size={14} />
                    Finalize
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!activePayPeriod && payPeriods.length === 0 && (
        <p className="pay-period-bar-empty">
          Create your first pay period to start tracking daily sales and calculating distributions.
        </p>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreatePayPeriodModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
          loading={payPeriodLoading}
        />
      )}
      {showListModal && (
        <PayPeriodListModal
          periods={payPeriods}
          onSelect={selectPayPeriod}
          onClose={() => setShowListModal(false)}
        />
      )}
      {showFinalizeModal && activePayPeriod && (
        <FinalizeConfirmModal
          payPeriod={activePayPeriod}
          employees={state.employees.map(e => ({ id: e.id, name: e.name, hoursWorked: e.hoursWorked }))}
          runningTotals={runningTotals}
          onConfirm={handleFinalize}
          onClose={() => setShowFinalizeModal(false)}
          loading={payPeriodLoading}
        />
      )}
    </div>
  );
}
