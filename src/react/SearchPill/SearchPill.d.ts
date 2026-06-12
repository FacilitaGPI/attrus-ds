import * as React from 'react';

export interface SearchPillProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Keyboard hint rendered as a .kbd chip (e.g. "⌘K"). */
  shortcut?: string;
  /** Leading icon — defaults to the canonical search glyph. */
  icon?: React.ReactNode;
  /** Wrapper (pill) className/style — the input itself fills it. */
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
}

export declare const SearchPill: React.FC<SearchPillProps>;
export default SearchPill;
