import * as React from 'react';

/**
 * ATTRUS SearchPill — typed wrapper over the canonical `.pill-search`
 * (preview/components/inputs.css): leading icon + borderless input +
 * optional .kbd shortcut hint. The ⌘K-style global search bar.
 */

export interface SearchPillProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Keyboard hint rendered as a .kbd chip (e.g. "⌘K"). */
  shortcut?: string;
  /** Leading icon — defaults to the canonical search glyph. */
  icon?: React.ReactNode;
  /** Wrapper (pill) className/style — the input itself fills it. */
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
}

const SearchGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const SearchPill: React.FC<SearchPillProps> = ({
  shortcut,
  icon,
  wrapperClassName,
  wrapperStyle,
  ...rest
}) => (
  <div className={['pill-search', wrapperClassName || ''].filter(Boolean).join(' ')} style={wrapperStyle}>
    {icon != null ? icon : <SearchGlyph />}
    <input type="search" {...rest} />
    {shortcut ? <span className="kbd">{shortcut}</span> : null}
  </div>
);

export default SearchPill;
