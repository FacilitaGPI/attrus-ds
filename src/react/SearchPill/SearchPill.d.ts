import * as React from 'react';
import type { InputAddon } from '../Input/Input';

export interface SearchPillProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Field height: 'md' (40px, default) or 'sm' (32px). Named fieldSize because
      the native input `size` attribute means character count, not height. */
  fieldSize?: 'sm' | 'md';
  /** Keyboard hint rendered as a .kbd chip (e.g. "⌘K"). */
  shortcut?: string | string[];
  /** Interactive segment before the search (scope selector). Replaces the icon. */
  before?: InputAddon;
  /** Interactive segment after the search (Search button). Replaces the shortcut. */
  after?: InputAddon;
  /** Leading icon — defaults to the canonical search glyph. */
  icon?: React.ReactNode;
  /** Wrapper (pill) className/style — the input itself fills it. */
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
}

export declare const SearchPill: React.FC<SearchPillProps>;
export default SearchPill;
