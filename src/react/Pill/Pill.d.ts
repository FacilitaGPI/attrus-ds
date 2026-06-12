import * as React from 'react';

export type PillTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
export type PillSize = 'sm' | 'md' | 'lg';
export type PillAppearance = 'soft' | 'solid' | 'outline';

export interface PillProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic tone. Variant carries meaning; label is required. Default: 'neutral'. */
  tone?: PillTone;
  /** sm=20px, md=24px (default), lg=28px. */
  size?: PillSize;
  /** soft (tinted, default) | solid (filled) | outline (transparent bg). */
  appearance?: PillAppearance;
  /** Leading status dot (decorative — meaning lives in label + tone). */
  dot?: boolean;
  /** Leading icon slot. */
  icon?: React.ReactNode;
  /** Renders a <button> with hover/focus/selected states (filter chips). */
  interactive?: boolean;
  /** Selected state for interactive pills (sets aria-pressed). */
  selected?: boolean;
  /** Glassy translucent treatment for dark surfaces. */
  onInverse?: boolean;
  /** Renders the trailing close (×) — `.pill-x` — and calls back on click (removable filter chips). */
  onRemove?: (e: React.MouseEvent) => void;
  /** Dimmed, non-interactive. */
  disabled?: boolean;
}

export declare const Pill: React.FC<PillProps>;
export default Pill;
