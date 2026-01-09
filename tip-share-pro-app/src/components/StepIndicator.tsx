'use client';

import { useDemo } from '@/lib/DemoContext';
import { Settings, Users, PieChart } from 'lucide-react';

const steps = [
  { id: 1, label: 'Settings', icon: Settings },
  { id: 2, label: 'Data Entry', icon: Users },
  { id: 3, label: 'Results', icon: PieChart },
];

export default function StepIndicator() {
  const { state, setCurrentStep } = useDemo();

  return (
    <div className="flex items-center justify-center py-6 px-4">
      <div className="flex items-center gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = state.currentStep === step.id;
          const isCompleted = state.currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id as 1 | 2 | 3)}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg transition-all
                  ${isActive
                    ? 'bg-[var(--accent)] text-white shadow-lg'
                    : isCompleted
                    ? 'bg-[var(--accent-muted)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white'
                    : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:bg-[var(--border-light)]'
                  }
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${isActive
                    ? 'bg-white/20'
                    : isCompleted
                    ? 'bg-[var(--accent)]/30'
                    : 'bg-[var(--border)]'
                  }
                `}>
                  {isCompleted ? '✓' : step.id}
                </div>
                <div className="flex items-center gap-2">
                  <Icon size={18} />
                  <span className="font-medium">{step.label}</span>
                </div>
              </button>

              {index < steps.length - 1 && (
                <div className={`
                  w-12 h-0.5 mx-2
                  ${state.currentStep > step.id ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
