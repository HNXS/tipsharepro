'use client';

import React from 'react';
import { CategoryColor, CATEGORY_COLOR_MAP } from '../lib/types';

// Badge size variants
type BadgeSize = 'sm' | 'md' | 'lg';

interface CategoryBadgeProps {
  categoryColor: CategoryColor;
  label?: string; // Optional custom label, defaults to category name
  size?: BadgeSize;
  className?: string;
}

/**
 * CategoryBadge - Displays a colored badge for job categories
 *
 * 5 Category Colors (Finalized by Tom - January 11, 2026):
 * - BOH (Kitchen) - Orange #E85D04
 * - FOH (Non Tipped) - Violet #8E44AD
 * - Bar - Cyan #35A0D2
 * - Support - Lime Green #82B536
 * - Custom - Yellow #F1C40F
 */
export function CategoryBadge({
  categoryColor,
  label,
  size = 'md',
  className = ''
}: CategoryBadgeProps) {
  const colorInfo = CATEGORY_COLOR_MAP[categoryColor];

  // Size classes
  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };

  return (
    <span
      className={`badge ${colorInfo.bgClass} ${sizeClasses[size]} ${className}`}
      title={colorInfo.name}
    >
      {label || colorInfo.name}
    </span>
  );
}

/**
 * ColorKeyItem - Single item in the color key
 */
interface ColorKeyItemProps {
  categoryColor: CategoryColor;
  showLabel?: boolean;
}

export function ColorKeyItem({ categoryColor, showLabel = true }: ColorKeyItemProps) {
  const colorInfo = CATEGORY_COLOR_MAP[categoryColor];

  return (
    <div className="color-key-item">
      <span
        className={`color-key-dot ${categoryColor}`}
        style={{ backgroundColor: colorInfo.hex }}
      />
      {showLabel && <span>{colorInfo.name}</span>}
    </div>
  );
}

/**
 * CategoryColorKey - Shows all 5 category colors with labels
 * Appears at the bottom of the Distribution Table
 */
interface CategoryColorKeyProps {
  categories?: CategoryColor[]; // Optional: only show specific categories
  className?: string;
}

export function CategoryColorKey({
  categories,
  className = ''
}: CategoryColorKeyProps) {
  // Default to showing all 5 categories
  const categoriesToShow = categories || (['boh', 'foh', 'bar', 'support', 'custom'] as CategoryColor[]);

  return (
    <div className={`category-color-key ${className}`}>
      {categoriesToShow.map((color) => (
        <ColorKeyItem key={color} categoryColor={color} />
      ))}
    </div>
  );
}

/**
 * InlineCategoryDot - Small colored dot for inline use (e.g., in table cells)
 */
interface InlineCategoryDotProps {
  categoryColor: CategoryColor;
  size?: number; // Size in pixels, default 12
  className?: string;
}

export function InlineCategoryDot({
  categoryColor,
  size = 12,
  className = ''
}: InlineCategoryDotProps) {
  const colorInfo = CATEGORY_COLOR_MAP[categoryColor];

  return (
    <span
      className={`inline-block rounded-full ${className}`}
      style={{
        backgroundColor: colorInfo.hex,
        width: `${size}px`,
        height: `${size}px`,
      }}
      title={colorInfo.name}
    />
  );
}

/**
 * getCategoryBadgeClass - Utility to get the badge class for a category
 */
export function getCategoryBadgeClass(categoryColor: CategoryColor): string {
  return CATEGORY_COLOR_MAP[categoryColor].bgClass;
}

/**
 * getCategoryHex - Utility to get the hex color for a category
 */
export function getCategoryHex(categoryColor: CategoryColor): string {
  return CATEGORY_COLOR_MAP[categoryColor].hex;
}

/**
 * getCategoryName - Utility to get the display name for a category
 */
export function getCategoryName(categoryColor: CategoryColor): string {
  return CATEGORY_COLOR_MAP[categoryColor].name;
}

export default CategoryBadge;
