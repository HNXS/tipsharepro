'use client';

import { useState, useRef } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function HelpTooltip({ text, position = 'top' }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const hideTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  return (
    <div className="tooltip-container no-print">
      <button
        type="button"
        className="tooltip-trigger no-print"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Help information"
        aria-describedby={isVisible ? 'tooltip-content' : undefined}
      >
        <HelpCircle size={24} />
      </button>

      {isVisible && (
        <div
          id="tooltip-content"
          role="tooltip"
          className={`help-tooltip help-tooltip-${position}`}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          {text}
        </div>
      )}
    </div>
  );
}
