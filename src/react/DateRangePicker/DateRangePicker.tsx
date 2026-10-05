import * as React from 'react';
import { createPortal } from 'react-dom';

/**
 * ATTRUS DateRangePicker — a period control for a table toolbar.
 *
 * Trigger + panel: presets on the left, two date fields on the right. Values are
 * ISO dates ("2026-03-10"); an empty string means "open on that side".
 *
 * `portal` (default true) renders the panel in <body> with fixed coordinates —
 * a .dt-wrap clips overflow, so an inline panel would be cut by the table.
 */
export interface DateRangePreset { label: string; from: string; to: string; }

export interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  placeholder?: string;
  /** sm = 32px trigger, for a table toolbar. */
  size?: 'sm' | 'md';
  portal?: boolean;
  /** Defaults to last 7 / 30 days, this month, last month — relative to today. */
  presets?: DateRangePreset[];
  locale?: string;
  className?: string;
  'aria-label'?: string;
}

const iso = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export function defaultDatePresets(today = new Date()): DateRangePreset[] {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const minus = (n: number) => { const d = new Date(t); d.setDate(d.getDate() - n); return d; };
  const mStart = new Date(t.getFullYear(), t.getMonth(), 1);
  const lmStart = new Date(t.getFullYear(), t.getMonth() - 1, 1);
  const lmEnd = new Date(t.getFullYear(), t.getMonth(), 0);
  return [
    { label: 'Last 7 days', from: iso(minus(6)), to: iso(t) },
    { label: 'Last 30 days', from: iso(minus(29)), to: iso(t) },
    { label: 'This month', from: iso(mStart), to: iso(t) },
    { label: 'Last month', from: iso(lmStart), to: iso(lmEnd) },
  ];
}

export function formatDateRange(from: string, to: string, locale = 'en-US'): string {
  if (!from && !to) return '';
  const f = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  };
  return (from ? f(from) : '…') + ' – ' + (to ? f(to) : '…');
}

const CalendarRange = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M17 14h-6M13 18H7M7 14h.01M17 18h.01" />
  </svg>
);

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  from, to, onChange, placeholder = 'Period', size = 'md', portal = true, presets, locale = 'en-US', className, ...rest
}) => {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ left: number; top: number } | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const list = presets || defaultDatePresets();
  const label = formatDateRange(from, to, locale);

  React.useLayoutEffect(() => {
    if (!open || !portal) return undefined;
    const place = () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (r) setPos({ left: Math.min(r.left, window.innerWidth - 16 - (panelRef.current?.offsetWidth || 0)), top: r.bottom + 8 });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => { window.removeEventListener('scroll', place, true); window.removeEventListener('resize', place); };
  }, [open, portal]);

  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const panel = (
    <div ref={panelRef} className="date-range-panel" role="dialog" aria-label={rest['aria-label'] || placeholder}
      style={portal ? { position: 'fixed', left: pos ? pos.left : -9999, top: pos ? pos.top : 0 } : undefined}>
      <div className="date-range-presets">
        {list.map((p) => (
          <button key={p.label} type="button"
            className={['date-range-preset', p.from === from && p.to === to ? 'is-active' : ''].filter(Boolean).join(' ')}
            onClick={() => { onChange(p.from, p.to); setOpen(false); }}>{p.label}</button>
        ))}
      </div>
      <div className="date-range-fields">
        <label className="date-range-field">From
          <input className="input input-sm" type="date" value={from} max={to || undefined} onChange={(e) => onChange(e.target.value, to)} />
        </label>
        <label className="date-range-field">To
          <input className="input input-sm" type="date" value={to} min={from || undefined} onChange={(e) => onChange(from, e.target.value)} />
        </label>
        <div className="date-range-actions">
          {from || to ? <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange('', '')}>Clear</button> : null}
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(false)}>Done</button>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={wrapRef}
      className={['date-range', size === 'sm' ? 'date-range-sm' : '', portal ? 'is-portal' : '', className || ''].filter(Boolean).join(' ')}>
      <button type="button" className="date-trigger" aria-haspopup="dialog" aria-expanded={open}
        aria-label={rest['aria-label'] ? rest['aria-label'] + (label ? ': ' + label : '') : undefined}
        onClick={() => setOpen((o) => !o)}>
        {/* Canonical .date-trigger anatomy: icon + text grouped in ONE leading span
            (the trigger is space-between), and a trailing chevron. */}
        <span className="date-range-label">
          <CalendarRange />
          {label ? <span>{label}</span> : <span className="placeholder">{placeholder}</span>}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open ? (portal && typeof document !== 'undefined' ? createPortal(panel, document.body) : panel) : null}
    </div>
  );
};

export default DateRangePicker;
