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
    <div className="step-indicator">
      <div className="step-indicator-container">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = state.currentStep === step.id;
          const isCompleted = state.currentStep > step.id;

          return (
            <div key={step.id} className="step-wrapper">
              <button
                onClick={() => setCurrentStep(step.id as 1 | 2 | 3)}
                className={`step-button ${isActive ? 'step-active' : ''} ${isCompleted ? 'step-completed' : ''}`}
              >
                <div className={`step-number ${isActive ? 'step-number-active' : ''} ${isCompleted ? 'step-number-completed' : ''}`}>
                  {isCompleted ? '✓' : step.id}
                </div>
                <div className="step-content">
                  <Icon size={18} />
                  <span className="step-label">{step.label}</span>
                </div>
              </button>

              {index < steps.length - 1 && (
                <div className={`step-connector ${state.currentStep > step.id ? 'step-connector-active' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
