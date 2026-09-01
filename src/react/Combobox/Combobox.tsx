import * as React from 'react';
import { createPortal } from 'react-dom';

/**
 * ATTRUS Combobox — typed wrapper over the canonical `.combobox`
 * (preview/components/combobox.css): trigger + popover listbox with
 * filterable options, groups, metas, selected check and footer action.
 */

export interface ComboOption {
  value: string;
  label: React.ReactNode;
  /** Secondary line under the label. */
  meta?: React.ReactNode;
  /** Right-aligned mono hint (e.g. a code). */
  trailing?: React.ReactNode;
  /** Optional group header this option sits under. */
  group?: string;
  /** Non-selectable (`.is-disabled`). */
  disabled?: boolean;
  /** Text used by the search filter when label isn't a plain string. */
  searchText?: string;
}

export type ComboboxStatus = 'default' | 'error';

export interface ComboboxProps {
  options: ComboOption[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Shows the search header inside the popover. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Trigger leading icon (`.combobox-trigger-icon`). */
  icon?: React.ReactNode;
  /** Validation state — error ring on the trigger (`.is-invalid`). */
  status?: ComboboxStatus;
  /** Filter-chip row inside the popover (`.combobox-filters`) — use `.combobox-filter-chip` buttons. */
  filters?: React.ReactNode;
  /** Results meta line above the list (`.combobox-meta`), e.g. "Results (21)". */
  meta?: React.ReactNode;
  /** Muted meta line below the list (`.combobox-foot-meta`). */
  footMeta?: React.ReactNode;
  /** Popover starts open (galleries/docs). */
  defaultOpen?: boolean;
  /** Footer action (e.g. "Create new counterparty"). */
  footer?: React.ReactNode;
  onFooterClick?: () => void;
  emptyTitle?: React.ReactNode;
  emptySub?: React.ReactNode;
  disabled?: boolean;
  /** Gallery/doc rendering: popover stays inline (absolute under the trigger),
      not portaled. Use inside relative frames for side-by-side examples. */
  static?: boolean;
  /** Which trigger edge the portaled popover is pinned to. It matches the
      trigger's width as a MINIMUM and grows with its content, so the growth has
      to have a direction: 'start' grows right (default), 'end' grows left. Use
      'end' for a compact control near the right edge, where growing right would
      run off the viewport. */
  align?: 'start' | 'end';
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

const Chevron: React.FC = () => (
  <svg className="combobox-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const Check: React.FC = () => (
  <svg className="combobox-option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function optionText(o: ComboOption): string {
  if (o.searchText) return o.searchText;
  return typeof o.label === 'string' ? o.label : String(o.value);
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value = null,
  onChange,
  placeholder = 'Select…',
  searchable = false,
  searchPlaceholder = 'Search…',
  icon,
  status = 'default',
  filters,
  meta,
  footMeta,
  defaultOpen = false,
  footer,
  onFooterClick,
  emptyTitle = 'No matches',
  emptySub,
  disabled = false,
  static: isStatic = false,
  align = 'start',
  className,
  style,
  ...rest
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState<string | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const popRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ left: number; right: number; top: number; width: number } | null>(null);

  // Position the portaled popover under the trigger (fixed coords from rect).
  // Both edges are captured because `align` decides which one anchors.
  React.useLayoutEffect(() => {
    if (!open || isStatic) return undefined;
    const place = () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (r) setPos({ left: r.left, right: window.innerWidth - r.right, top: r.bottom + 8, width: r.width });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, isStatic]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current && wrapRef.current.contains(t)) return;
      if (popRef.current && popRef.current.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value) || null;
  const filtered = q
    ? options.filter((o) => optionText(o).toLowerCase().indexOf(q.toLowerCase()) !== -1)
    : options;
  const selectable = filtered.filter((o) => !o.disabled);

  // Keyboard nav — wrapper-level so it works from the trigger AND the search
  // input. Arrow keys move `.is-active`; Enter commits the active option.
  const onWrapKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !selectable.length) return;
    const idx = selectable.findIndex((o) => o.value === active);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = e.key === 'ArrowDown'
        ? selectable[Math.min(idx + 1, selectable.length - 1)]
        : selectable[Math.max(idx - 1, 0)];
      setActive(next.value);
      const list = popRef.current?.querySelector('.combobox-list') || wrapRef.current?.querySelector('.combobox-list');
      const el = list?.querySelector(`[data-value="${next.value}"]`) as HTMLElement | null;
      if (list && el) {
        const lt = (list as HTMLElement).scrollTop;
        const lb = lt + (list as HTMLElement).clientHeight;
        if (el.offsetTop < lt) (list as HTMLElement).scrollTop = el.offsetTop;
        else if (el.offsetTop + el.offsetHeight > lb) (list as HTMLElement).scrollTop = el.offsetTop + el.offsetHeight - (list as HTMLElement).clientHeight;
      }
    } else if (e.key === 'Enter') {
      const hit = selectable.find((o) => o.value === active);
      if (hit) {
        e.preventDefault();
        if (onChange) onChange(hit.value);
        setOpen(false);
        setQ('');
      }
    }
  };

  // group-preserving render order
  const rendered: React.ReactNode[] = [];
  let lastGroup: string | undefined;
  filtered.forEach((o) => {
    if (o.group && o.group !== lastGroup) {
      rendered.push(
        <li key={`g-${o.group}`} className="combobox-group-label">
          {o.group}
        </li>
      );
      lastGroup = o.group;
    }
    const isSel = o.value === value;
    rendered.push(
      <li
        key={o.value}
        data-value={o.value}
        className={['combobox-option', isSel ? 'is-selected' : '', o.value === active ? 'is-active' : '', o.disabled ? 'is-disabled' : ''].filter(Boolean).join(' ')}
        role="option"
        aria-selected={isSel}
        aria-disabled={o.disabled || undefined}
        onMouseEnter={() => { if (!o.disabled) setActive(o.value); }}
        onClick={() => {
          if (o.disabled) return;
          if (onChange) onChange(o.value);
          setOpen(false);
          setQ('');
        }}
      >
        <span className="combobox-option-content">
          <span className="combobox-option-label">{o.label}</span>
          {o.meta != null ? <span className="combobox-option-meta">{o.meta}</span> : null}
        </span>
        {o.trailing != null ? <span className="combobox-option-trailing">{o.trailing}</span> : null}
        <Check />
      </li>
    );
  });

  const popoverInner = (
    <React.Fragment>
      {searchable ? (
        <div className="combobox-search">
          <svg className="combobox-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input autoFocus placeholder={searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      ) : null}
      {filters != null ? <div className="combobox-filters">{filters}</div> : null}
      {meta != null ? <div className="combobox-meta">{meta}</div> : null}
      {filtered.length === 0 ? (
        <div className="combobox-empty">
          <strong>{emptyTitle}</strong>
          {emptySub}
        </div>
      ) : (
        <ul className="combobox-list" role="listbox">
          {rendered}
        </ul>
      )}
      {footMeta != null ? <div className="combobox-foot-meta">{footMeta}</div> : null}
      {footer ? (
        <div className="combobox-footer">
          <button type="button" className="combobox-footer-action" onClick={onFooterClick}>
            {footer}
          </button>
        </div>
      ) : null}
    </React.Fragment>
  );

  const tree = (
    <div
      ref={wrapRef}
      className={['combobox', open ? 'is-open' : '', status === 'error' ? 'is-invalid' : '', className || ''].filter(Boolean).join(' ')}
      style={style}
      onKeyDown={onWrapKeyDown}
    >
      <button
        type="button"
        className="combobox-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => { setOpen((o) => !o); setActive(value); }}
        {...rest}
      >
        {icon != null ? <span className="combobox-trigger-icon">{icon}</span> : null}
        <span className="combobox-value">
          {selected ? selected.label : <span className="combobox-placeholder">{placeholder}</span>}
        </span>
        <Chevron />
      </button>
      {open && isStatic ? (
        <div className="combobox-popover" ref={popRef}>{popoverInner}</div>
      ) : null}
    </div>
  );

  // Portal the popover to <body> (fixed coords) so it escapes any overflow /
  // stacking ancestor. Static (gallery/doc) keeps it inline under the trigger.
  if (isStatic || typeof document === 'undefined') return tree;
  return (
    <React.Fragment>
      {tree}
      {open && pos
        ? createPortal(
            <div
              className={['combobox', 'is-open', status === 'error' ? 'is-invalid' : '', className || ''].filter(Boolean).join(' ')}
              style={{
                /* MIN-width, not width: matching the trigger is right for a form
                   field, but as a fixed width it traps the list — a 50px chip
                   crushes its own options with no floor to rescue them. The
                   trigger sets the floor; content sets the rest. */
                position: 'fixed',
                top: pos.top,
                ...(align === 'end' ? { right: pos.right } : { left: pos.left }),
                minWidth: pos.width,
                margin: 0,
                zIndex: 7000,
                /* The consumer's own style comes last so it can override the
                   floor when the content still needs more room. */
                ...style,
              }}
              onKeyDown={onWrapKeyDown}
            >
              <div className="combobox-popover" ref={popRef} style={{ position: 'static' }}>{popoverInner}</div>
            </div>,
            document.body
          )
        : null}
    </React.Fragment>
  );
};

export default Combobox;
