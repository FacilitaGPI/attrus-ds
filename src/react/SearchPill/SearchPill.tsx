import * as React from 'react';
import type { InputAddon } from '../Input/Input';

/**
 * ATTRUS SearchPill — typed wrapper over the canonical `.pill-search`
 * (preview/components/inputs.css): leading icon + borderless input +
 * optional .kbd shortcut hint. The ⌘K-style global search bar.
 */

export interface SearchPillProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Field height: 'md' (40px, default) or 'sm' (32px). Named fieldSize because
      the native input `size` attribute means character count, not height. Use
      'sm' inside a toolbar, where a 40px field towers over 32px buttons. */
  fieldSize?: 'sm' | 'md';
  /** Keyboard hint rendered as a .kbd chip. A string with a modifier glyph is
      split into one cell per key ("⌘K" → ⌘ · K) so symbol and letter share a
      baseline. Pass an array for multi-letter keys: ['Ctrl', 'K']. */
  shortcut?: string | string[];
  /** Interactive segment before the search — e.g. a scope selector ("All ▾").
      Replaces the leading icon: a pill has room for one lead. */
  before?: InputAddon;
  /** Interactive segment after the search — e.g. a "Search" button. Replaces
      the shortcut hint: a field that shows a button does not need a hint. */
  after?: InputAddon;
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

const MODIFIERS = /^[⌘⌥⇧⌃]/;
function keys(s: string | string[]): string[] {
  if (Array.isArray(s)) return s;
  // "⌘K" → ["⌘","K"]; "⇧⌘P" → ["⇧","⌘","P"]; a plain word stays one key
  const out: string[] = [];
  let rest = s;
  while (MODIFIERS.test(rest)) { out.push(rest[0]); rest = rest.slice(1); }
  if (rest) out.push(rest);
  return out;
}

function renderAddon(a: InputAddon, side: 'l' | 'r'): React.ReactNode {
  if (a.type === 'select') {
    return (
      <span className={'fix-select ' + side}>
        <select aria-label={a['aria-label']} value={a.value} onChange={a.onChange ? (e) => a.onChange!(e.target.value) : undefined}>
          {a.options.map((o) =>
            typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>
          )}
        </select>
        <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    );
  }
  return (
    <button type="button" className={['fix-btn', side, a.primary ? 'is-primary' : ''].filter(Boolean).join(' ')}
      onClick={a.onClick} disabled={a.disabled} aria-label={a['aria-label']}>
      {a.icon}
      {a.label}
    </button>
  );
}

export const SearchPill: React.FC<SearchPillProps> = ({
  shortcut,
  icon,
  fieldSize = 'md',
  before,
  after,
  wrapperClassName,
  wrapperStyle,
  ...rest
}) => (
  <div className={['pill-search', fieldSize === 'sm' ? 'pill-search-sm' : '', wrapperClassName || ''].filter(Boolean).join(' ')} style={wrapperStyle}>
    {before != null ? renderAddon(before, 'l') : icon != null ? icon : <SearchGlyph />}
    <input type="search" {...rest} />
    {after != null
      ? renderAddon(after, 'r')
      : shortcut
        ? <span className="kbd">{keys(shortcut).map((k) => <kbd key={k}>{k}</kbd>)}</span>
        : null}
  </div>
);

export default SearchPill;
