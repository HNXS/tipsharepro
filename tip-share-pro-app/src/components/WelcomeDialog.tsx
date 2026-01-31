'use client';

import { DEMO_WELCOME_TEXT } from '@/lib/types';
import { X, ArrowRight, Info } from 'lucide-react';

interface WelcomeDialogProps {
  onClose: () => void;
}

export default function WelcomeDialog({ onClose }: WelcomeDialogProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal welcome-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <Info size={24} className="modal-icon" />
            <h2 className="modal-title">Welcome to TipSharePro Demo</h2>
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
          <div className="welcome-text">
            {DEMO_WELCOME_TEXT.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="welcome-highlights">
            <h3>Quick Tips:</h3>
            <ul>
              <li>
                <strong>Settings above</strong> - Configure your contribution method, % and job category weights
              </li>
              <li>
                <strong>Distribution Table below</strong> - View and adjust the tip pool totals
              </li>
              <li>
                <strong>Edit inline</strong> - Click on hours or wages to modify values
              </li>
              <li>
                <strong>Weight adjustment</strong> - Use +/- buttons to fine-tune individual weights
              </li>
              <li>
                <strong>Print ready</strong> - Print the distribution table (wages are hidden on print)
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
