import * as React from 'react';

export interface DTFilterScope {
  value: string;
  label: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}
export interface DTFilterValue { scope: string | null; query: string; from: string; to: string; }
export interface DTFiltersLabels {
  searchBy: string; period: string; apply: string; clear: string; search: string;
  pendingHint: string; remove: string; undo: string;
}
export interface DTFiltersProps {
  /** "apply" (default): a draft committed by Apply / Enter — large or server lists.
      "live": applies as you go, text debounced — small local lists. */
  mode?: 'apply' | 'live';
  scopes: DTFilterScope[];
  /** The applied filters. */
  value: DTFilterValue;
  onChange: (next: DTFilterValue) => void;
  /** live mode only: show the applied filters as removable pills. */
  showPills?: boolean;
  debounce?: number;
  labels?: Partial<DTFiltersLabels>;
  locale?: string;
  className?: string;
}

export declare const DTFilters: React.FC<DTFiltersProps>;
export declare const EMPTY_FILTERS: DTFilterValue;
/** Compare only the digits of both sides: "40095" finds "40,095.00". */
export declare function matchesDigits(haystack: string | number, needle: string): boolean;
export default DTFilters;
