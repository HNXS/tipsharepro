'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Printer, Monitor, Smartphone } from 'lucide-react';

interface PrintDialogProps {
  target: 'distribution' | 'settings';
  onClose: () => void;
  printIncludeSharePerHour?: boolean;
  setPrintIncludeSharePerHour?: (v: boolean) => void;
}

export default function PrintDialog({
  target,
  onClose,
  printIncludeSharePerHour,
  setPrintIncludeSharePerHour,
}: PrintDialogProps) {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    target === 'settings' ? 'landscape' : 'portrait'
  );

  const cleanup = useCallback(() => {
    document.body.classList.remove(
      'print-landscape',
      'print-portrait',
      'print-target-distribution',
      'print-target-settings'
    );
    // Remove any injected @page style
    const injected = document.getElementById('print-page-style');
    if (injected) injected.remove();
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const handlePrint = () => {
    // Add target scoping class
    document.body.classList.add(`print-target-${target}`);
    // Add orientation class
    document.body.classList.add(`print-${orientation}`);

    // Inject @page style for orientation (since @page can't be scoped to body classes)
    const style = document.createElement('style');
    style.id = 'print-page-style';
    style.textContent = `@page { size: ${orientation}; margin: 0; }`;
    document.head.appendChild(style);

    // Listen for afterprint to clean up
    const handleAfterPrint = () => {
      cleanup();
      onClose();
      window.removeEventListener('afterprint', handleAfterPrint);
    };
    window.addEventListener('afterprint', handleAfterPrint);

    // Fallback timeout in case afterprint doesn't fire
    setTimeout(() => {
      window.removeEventListener('afterprint', handleAfterPrint);
      cleanup();
    }, 10000);

    window.print();
  };

  return (
    <div className="modal-overlay no-print" onClick={onClose}>
      <div className="modal print-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <Printer size={20} className="modal-icon" />
            <h2 className="modal-title">
              Print {target === 'distribution' ? 'Distribution Table' : 'Settings'}
            </h2>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Orientation Toggle */}
          <div className="print-dialog-field">
            <label className="print-dialog-label">Orientation</label>
            <div className="print-dialog-toggle">
              <button
                className={`print-toggle-btn ${orientation === 'portrait' ? 'print-toggle-active' : ''}`}
                onClick={() => setOrientation('portrait')}
              >
                <Smartphone size={16} />
                Portrait
              </button>
              <button
                className={`print-toggle-btn ${orientation === 'landscape' ? 'print-toggle-active' : ''}`}
                onClick={() => setOrientation('landscape')}
              >
                <Monitor size={16} />
                Landscape
              </button>
            </div>
          </div>

          {/* $/Hr checkbox — only for distribution */}
          {target === 'distribution' && setPrintIncludeSharePerHour && (
            <div className="print-dialog-field">
              <label className="print-dialog-checkbox-label">
                <input
                  type="checkbox"
                  checked={printIncludeSharePerHour ?? false}
                  onChange={(e) => setPrintIncludeSharePerHour(e.target.checked)}
                />
                <span>Include $/Hr column</span>
              </label>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
