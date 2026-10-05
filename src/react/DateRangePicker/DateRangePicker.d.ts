import * as React from 'react';

export interface DateRangePreset { label: string; from: string; to: string; }

export interface DateRangePickerProps {
  /** ISO date ("2026-03-10"); "" = open on that side. */
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  placeholder?: string;
  /** sm = 32px trigger, for a table toolbar. */
  size?: 'sm' | 'md';
  /** Render the panel in <body> (default true) — .dt-wrap clips overflow. */
  portal?: boolean;
  presets?: DateRangePreset[];
  locale?: string;
  className?: string;
  'aria-label'?: string;
}

export declare const DateRangePicker: React.FC<DateRangePickerProps>;
export declare function defaultDatePresets(today?: Date): DateRangePreset[];
export declare function formatDateRange(from: string, to: string, locale?: string): string;
export default DateRangePicker;
