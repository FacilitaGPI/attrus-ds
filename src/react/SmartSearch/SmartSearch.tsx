import * as React from 'react';

/**
 * ATTRUS SmartSearch — typed shell over the canonical `.ss` system
 * (preview/components/smart-search.css). The global ⌘K command palette.
 *
 * The 8 canonical states (combobox.html §03) COMPOSE from props — the
 * component renders whatever slices it receives, in the doc's order:
 *   input → chips → sections/list → hint → typeButtons → empty/loading/
 *   error illo → footer (kbd hints).
 *
 *   inactive    → no popover content (flat input)
 *   active      → chips + sections (recents/suggestions)
 *   word        → resultLabel + sections
 *   similar     → hint + sections
 *   id          → hint + typeButtons
 *   partial id  → hint only
 *   no results  → empty
 *   loading     → loading
 *   error       → error (retry)
 *
 * Keyboard: ↑/↓ move `.is-active` across items, Enter selects, Esc → onClose.
 */

export interface SSItem {
  key: string;
  /** Leading 28px tile glyph. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** Muted second line. */
  sub?: React.ReactNode;
  /** Right-aligned mono hint (id, shortcut). */
  trailing?: React.ReactNode;
}

export interface SSSection {
  /** Uppercase section label (e.g. "Counterparties"). */
  label?: React.ReactNode;
  items: SSItem[];
}

export interface SSTypeButton {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  /** Muted right hint (e.g. "transaction"). */
  hint?: React.ReactNode;
}

export interface SmartSearchProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Leading input glyph (search icon). */
  icon?: React.ReactNode;
  /** Shows the × clear button when value is non-empty. */
  onClear?: () => void;
  /** Esc inside the input. */
  onClose?: () => void;
  /** Suggestion chips row (active state). */
  chips?: Array<{ key: string; icon?: React.ReactNode; label: React.ReactNode }>;
  onChipClick?: (key: string) => void;
  /** Grouped result rows. */
  sections?: SSSection[];
  onSelect?: (key: string) => void;
  /** "RESULTS (N)" line above the list. */
  resultLabel?: React.ReactNode;
  /** Tip card (similar match, ID format hint). */
  hint?: React.ReactNode;
  /** ID-disambiguation buttons. */
  typeButtons?: SSTypeButton[];
  onTypeSelect?: (key: string) => void;
  /** No-results state. */
  empty?: { title: React.ReactNode; sub?: React.ReactNode; illo?: React.ReactNode };
  /** Skeleton rows while fetching. */
  loading?: boolean;
  /** Fetch failed — retry. */
  error?: { title: React.ReactNode; sub?: React.ReactNode; retryLabel?: React.ReactNode; onRetry?: () => void; illo?: React.ReactNode };
  /** Kbd hint footer (↑↓ navigate · ↵ open · esc close). Default true when the popover has content. */
  footer?: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

const SearchGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

export const SmartSearch: React.FC<SmartSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search or jump to…',
  icon,
  onClear,
  onClose,
  chips,
  onChipClick,
  sections,
  onSelect,
  resultLabel,
  hint,
  typeButtons,
  onTypeSelect,
  empty,
  loading = false,
  error,
  footer,
  className,
  style,
  ...rest
}) => {
  const [active, setActive] = React.useState<string | null>(null);
  const flat = React.useMemo(() => (sections || []).reduce<SSItem[]>((a, s) => a.concat(s.items), []), [sections]);

  const hasBody = Boolean(
    (chips && chips.length) || (sections && sections.length) || hint != null ||
    (typeButtons && typeButtons.length) || empty != null || loading || error != null
  );
  const showFooter = footer != null ? footer : hasBody;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { if (onClose) onClose(); return; }
    if (!flat.length) return;
    const idx = flat.findIndex((i) => i.key === active);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = e.key === 'ArrowDown'
        ? flat[Math.min(idx + 1, flat.length - 1)]
        : flat[Math.max(idx - 1, 0)];
      setActive(next.key);
    } else if (e.key === 'Enter') {
      const hit = flat.find((i) => i.key === active);
      if (hit && onSelect) { e.preventDefault(); onSelect(hit.key); }
    }
  };

  const renderItem = (it: SSItem) => (
    <li
      key={it.key}
      className={['ss-list-item', it.key === active ? 'is-active' : ''].filter(Boolean).join(' ')}
      onMouseEnter={() => setActive(it.key)}
      onClick={() => onSelect && onSelect(it.key)}
    >
      {it.icon != null ? <span className="icon-leading">{it.icon}</span> : null}
      <span className="text">
        <span className="label">{it.title}</span>
        {it.sub != null ? <span className="meta">{it.sub}</span> : null}
      </span>
      {it.trailing != null ? (
        <span style={{ marginLeft: 'auto', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', color: 'var(--color-foreground-muted)' }}>{it.trailing}</span>
      ) : null}
    </li>
  );

  return (
    <div className={['ss', className || ''].filter(Boolean).join(' ')} style={style} role="search" aria-label={rest['aria-label'] || 'Smart search'}>
      <div className={['ss-input', hasBody ? '' : 'ss-input-flat'].filter(Boolean).join(' ')}>
        {icon != null ? icon : <SearchGlyph />}
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={hasBody}
        />
        {onClear && value ? (
          <button type="button" className="ss-clear" aria-label="Clear" onClick={onClear}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        ) : null}
      </div>

      {chips && chips.length ? (
        <div className="ss-section">
          <div className="ss-chips">
            {chips.map((c) => (
              <button key={c.key} type="button" className="ss-chip" onClick={() => onChipClick && onChipClick(c.key)}>
                {c.icon}
                {c.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {resultLabel != null ? (
        <div className="ss-section ss-result-label" style={{ borderBottom: 0, paddingBottom: 0 }}><span className="l">{resultLabel}</span></div>
      ) : null}

      {sections && sections.length ? sections.map((s, i) => (
        <div key={i} className="ss-section">
          {s.label != null ? <div className="ss-section-label">{s.label}</div> : null}
          <ul className="ss-list">{s.items.map(renderItem)}</ul>
        </div>
      )) : null}

      {hint != null ? (
        <div className="ss-section"><div className="ss-hint">{hint}</div></div>
      ) : null}

      {typeButtons && typeButtons.length ? (
        <div className="ss-section">
          <div className="ss-typebtns">
            {typeButtons.map((b) => (
              <button key={b.key} type="button" className="ss-typebtn" onClick={() => onTypeSelect && onTypeSelect(b.key)}>
                {b.icon}
                <span className="grow">{b.label}</span>
                {b.hint != null ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', color: 'var(--color-foreground-muted)' }}>{b.hint}</span> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {empty != null && !loading && !error ? (
        <div className="ss-section">
          <div className="ss-illo">
            {empty.illo}
            <span className="title">{empty.title}</span>
            {empty.sub != null ? <span className="body">{empty.sub}</span> : null}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="ss-skeleton" aria-busy="true" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="ss-skel-row">
              <span className="ss-skel-circle ss-skel-shimmer" />
              <span className="ss-skel-bars">
                <span className="ss-skel-bar long ss-skel-shimmer" />
                <span className="ss-skel-bar short ss-skel-shimmer" />
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {error != null ? (
        <div className="ss-section">
          <div className="ss-illo" role="alert">
            {error.illo}
            <span className="title">{error.title}</span>
            {error.sub != null ? <span className="body">{error.sub}</span> : null}
            {error.onRetry ? (
              <button type="button" className="ss-typebtn" style={{ marginTop: 'var(--space-2)' }} onClick={error.onRetry}>
                {error.retryLabel != null ? error.retryLabel : 'Try again'}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {showFooter ? (
        <div className="ss-foot">
          <span className="kbd-group"><kbd className="ss-kbd">↑</kbd><kbd className="ss-kbd">↓</kbd> navigate</span>
          <span className="sep" />
          <span className="kbd-group"><kbd className="ss-kbd">↵</kbd> open</span>
          <span className="sep" />
          <span className="kbd-group"><kbd className="ss-kbd">esc</kbd> close</span>
        </div>
      ) : null}
    </div>
  );
};

export default SmartSearch;
