'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function HelpTooltip({ text, position = 'top' }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[var(--background-tertiary)]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[var(--background-tertiary)]',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-[var(--background-tertiary)]',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-[var(--background-tertiary)]',
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className="text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors p-1 rounded-full hover:bg-[var(--accent-muted)]"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Help"
      >
        <HelpCircle size={16} />
      </button>

      {isVisible && (
        <div
          className={`
            absolute z-50 w-64 px-3 py-2 text-sm rounded-lg shadow-lg
            bg-[var(--background-tertiary)] text-[var(--foreground)]
            border border-[var(--border-light)]
            tooltip-enter
            ${positionClasses[position]}
          `}
        >
          <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
          {text}
        </div>
      )}
    </div>
  );
}
