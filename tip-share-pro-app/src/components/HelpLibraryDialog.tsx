'use client';

import { HELP_PDFS } from '@/lib/types';
import { X, BookOpen, FileText } from 'lucide-react';

interface HelpLibraryDialogProps {
  onClose: () => void;
}

export default function HelpLibraryDialog({ onClose }: HelpLibraryDialogProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal help-library-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <BookOpen size={24} className="modal-icon" />
            <h2 className="modal-title">Help Library</h2>
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
          <div className="help-library-cards">
            {HELP_PDFS.map((pdf) => (
              <a
                key={pdf.id}
                href={pdf.file}
                target="_blank"
                rel="noopener noreferrer"
                className="help-library-card"
              >
                <FileText size={20} className="help-library-card-icon" />
                <div className="help-library-card-text">
                  <span className="help-library-card-title">{pdf.title}</span>
                  <span className="help-library-card-desc">{pdf.description}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
