'use client';

import { DEMO_WELCOME_TEXT } from '@/lib/types';
import { X, ArrowRight, Info } from 'lucide-react';

interface WelcomeDialogProps {
  onClose: () => void;
  subscriptionStatus?: string;
}

export default function WelcomeDialog({ onClose, subscriptionStatus = 'DEMO' }: WelcomeDialogProps) {
  const isDemo = subscriptionStatus === 'DEMO';
  const title = isDemo ? 'Welcome to TipSharePro Demo' : 'Welcome to TipSharePro';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal welcome-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <Info size={24} className="modal-icon" />
            <h2 className="modal-title">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {isDemo && (
            <div className="welcome-text">
              {DEMO_WELCOME_TEXT.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          <div className="welcome-highlights">
            <h3>Quick Tips:</h3>
            <ul>
              <li>
                <strong>Settings</strong> - Use the ? for tips in each box.
              </li>
              <li>
                <strong>Distribution Table</strong> &ndash; Click on hours or wages to modify values to any 2 decimal places.
              </li>
              <li>
                <strong>Edit inline</strong> - Add or Subtract Employees for a fair representation of your restaurant whenever you&apos;re ready.
              </li>
              <li>
                <strong>Weight adjustment</strong> - Use +/- buttons to fine-tune individual weights. We call this the experience bump.
              </li>
              <li>
                <strong>Print ready</strong> - Print the distribution table (wages are hidden on print). Check the box to add a $/Hr. column so workers know how much the pool is netting them in terms they understand.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary btn-lg">
            Get Started
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
