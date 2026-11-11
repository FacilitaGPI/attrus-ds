import * as React from 'react';

/** ATTRUS SegmentedControl (L-27) — one choice among a few, in a row
    (preview/components/segmented.css). Segments are sized by their label, may
    carry a count, and one may open a menu (pass `menu`). role="radiogroup";
    ←/→ move the choice. */
export interface SegmentedOption { value: string; label: React.ReactNode; count?: React.ReactNode; /** Renders a chevron and calls onMenu instead of selecting. */ menu?: boolean; }
export interface SegmentedControlProps { options: SegmentedOption[]; value: string; onChange: (v: string) => void; onMenu?: (v: string, el: HTMLButtonElement) => void; 'aria-label': string; className?: string; }

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, value, onChange, onMenu, className, ...rest }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const i = options.findIndex((o) => o.value === value);
    const n = options[(i + (e.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length];
    onChange(n.value);
    const b = ref.current && ref.current.querySelectorAll<HTMLButtonElement>('.seg-item')[options.indexOf(n)]; b && b.focus();
  };
  return (
    <div ref={ref} className={['seg', className || ''].filter(Boolean).join(' ')} role="radiogroup" aria-label={rest['aria-label']} onKeyDown={onKey}>
      {options.map((o) => (
        <button key={o.value} type="button" className="seg-item" role="radio" aria-checked={o.value === value} tabIndex={o.value === value ? 0 : -1}
          aria-haspopup={o.menu ? 'menu' : undefined}
          onClick={(e) => (o.menu && onMenu ? onMenu(o.value, e.currentTarget) : onChange(o.value))}>
          <span className="seg-text">{o.label}{o.count != null ? <span className="seg-count">{o.count}</span> : null}</span>
          {o.menu ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg> : null}
        </button>
      ))}
    </div>
  );
};
export default SegmentedControl;
