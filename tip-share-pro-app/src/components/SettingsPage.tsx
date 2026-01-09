'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { VARIABLE_WEIGHT_OPTIONS, HELP_TEXT, JobCategory, VariableWeight } from '@/lib/types';
import HelpTooltip from './HelpTooltip';
import { Plus, Trash2, Lock, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const { state, updateSettings, updateJobCategory, addJobCategory, removeJobCategory, setCurrentStep } = useDemo();
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: JobCategory = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        name: newCategoryName.trim(),
        variableWeight: 2.5,
      };
      addJobCategory(newCategory);
      setNewCategoryName('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Contribution Rate Card */}
      <div className="bg-[var(--background-secondary)] rounded-xl p-6 border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold text-white">Tip Pool Settings</h2>
          <HelpTooltip text="Configure how your tip pool operates. These settings affect how contributions are calculated and distributed." />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contribution Rate */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-[var(--foreground-muted)]">
                Contribution Rate
              </label>
              <HelpTooltip text={HELP_TEXT.contributionRate} />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={state.settings.contributionRate}
                onChange={(e) => updateSettings({ contributionRate: parseFloat(e.target.value) as VariableWeight })}
                className="flex-1 bg-[var(--background-tertiary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
              >
                {VARIABLE_WEIGHT_OPTIONS.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate.toFixed(2)}
                  </option>
                ))}
              </select>
              <span className="text-xl font-bold text-[var(--accent)]">%</span>
            </div>
            <p className="mt-2 text-xs text-[var(--foreground-dim)]">
              Percentage of sales contributed to the tip pool
            </p>
          </div>

          {/* Pay Period Type */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-[var(--foreground-muted)]">
                Pay Period Type
              </label>
              <HelpTooltip text={HELP_TEXT.payPeriodType} />
            </div>
            <select
              value={state.settings.payPeriodType}
              onChange={(e) => updateSettings({ payPeriodType: e.target.value as 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly' })}
              className="w-full bg-[var(--background-tertiary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
            >
              <option value="weekly">Weekly (7 days)</option>
              <option value="bi-weekly">Bi-Weekly (14 days)</option>
              <option value="semi-monthly">Semi-Monthly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Date Settings (Blocked in Demo) */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-[var(--foreground-muted)]">
                Pay Period Start Date
              </label>
              <Lock size={14} className="text-[var(--foreground-dim)]" />
            </div>
            <input
              type="date"
              disabled
              className="w-full bg-[var(--background-tertiary)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--foreground-dim)] cursor-not-allowed opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-tertiary)]/50 rounded-lg">
              <span className="text-xs text-[var(--accent)] bg-[var(--background-secondary)] px-2 py-1 rounded">
                Full Version
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-[var(--foreground-muted)]">
                Pay Period End Date
              </label>
              <Lock size={14} className="text-[var(--foreground-dim)]" />
            </div>
            <input
              type="date"
              disabled
              className="w-full bg-[var(--background-tertiary)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--foreground-dim)] cursor-not-allowed opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-tertiary)]/50 rounded-lg">
              <span className="text-xs text-[var(--accent)] bg-[var(--background-secondary)] px-2 py-1 rounded">
                Full Version
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Categories Card */}
      <div className="bg-[var(--background-secondary)] rounded-xl p-6 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white">Job Categories & Weights</h2>
            <HelpTooltip text="Each job category has a variable weight (1-5) that reflects its impact on customer satisfaction. Higher weights result in a larger share of the tip pool." />
          </div>
        </div>

        <div className="space-y-3">
          {state.settings.jobCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-4 p-4 bg-[var(--background-tertiary)] rounded-lg border border-[var(--border)] hover:border-[var(--border-light)] transition-colors"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => updateJobCategory(category.id, { name: e.target.value })}
                  className="bg-transparent text-white font-medium focus:outline-none focus:text-[var(--accent)] transition-colors w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--foreground-muted)]">Weight:</span>
                <select
                  value={category.variableWeight}
                  onChange={(e) => updateJobCategory(category.id, { variableWeight: parseFloat(e.target.value) as VariableWeight })}
                  className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-white focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                >
                  {VARIABLE_WEIGHT_OPTIONS.map((weight) => (
                    <option key={weight} value={weight}>
                      {weight.toFixed(2)}
                    </option>
                  ))}
                </select>
                <HelpTooltip text={HELP_TEXT.variableWeight} position="left" />
              </div>

              <button
                onClick={() => removeJobCategory(category.id)}
                className="p-2 text-[var(--foreground-dim)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg transition-colors"
                aria-label="Remove category"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Category */}
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Add new job category..."
            className="flex-1 bg-[var(--background-tertiary)] border border-[var(--border)] border-dashed rounded-lg px-4 py-3 text-white placeholder-[var(--foreground-dim)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
            className="px-4 py-3 bg-[var(--accent-muted)] text-[var(--accent)] rounded-lg hover:bg-[var(--accent)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </button>
        </div>

        <p className="mt-4 text-xs text-[var(--foreground-dim)]">
          Weight scale explanation: 1 = Low impact, 3 = Average, 5 = High impact on customer satisfaction
        </p>
      </div>

      {/* Blocked Features Teaser */}
      <div className="bg-gradient-to-r from-[var(--accent-muted)] to-transparent rounded-xl p-6 border border-[var(--accent)]/30">
        <div className="flex items-center gap-4">
          <Lock size={24} className="text-[var(--accent)]" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Unlock More Features</h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Full version includes: 2FA authentication, multi-location support, cloud storage, YTD reports, and audit logs.
            </p>
          </div>
          <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors font-medium flex items-center gap-2 shadow-lg"
        >
          Continue to Data Entry
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
