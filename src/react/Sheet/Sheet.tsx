import * as React from 'react';

/**
 * ATTRUS Sheet — the phone form of a side panel (preview/components/overlays.css
 * `.sheet` + `.scrim`). Rises from the bottom edge, within thumb reach. Used for
 * row detail, sort and filters on a phone, or any task that would open a drawer
 * or modal on a wide screen.
 *
 * A dialog in full: named by its title, focus moves in on open (the first
 * control, or the `.is-on` option of a list), Tab is trapped inside, Esc and a
 * scrim click close it, focus returns to the element that opened it, and the
 * page behind stops scrolling. Portaled to <body> so a size container (e.g. a
 * responsive table) cannot become its containing block.
 */
export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** Names the dialog (aria-labelledby). */
  title: React.ReactNode;
  /** Supporting line under the title. */
  sub?: React.ReactNode;
  /** Above the title — a status pill on a detail sheet. */
  eyebrow?: React.ReactNode;
  /** Two actions, secondary · primary (.sheet-footer is a two-column grid). */
  footer?: React.ReactNode;
  /** The ✕ in the header. Default true. */
  closeButton?: boolean;
  /** Esc and scrim close it. false for a flow the user must finish. Default true. */
  dismissible?: boolean;
  /** Element to focus on open. Default: the .is-on option, else the first control. */
  initialFocus?: React.RefObject<HTMLElement>;
  /** Accessible name of the ✕. Default "Close". */
  closeLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';

let sheetSeq = 0;

export const Sheet: React.FC<SheetProps> = ({
  open, onClose, title, sub, eyebrow, footer,
  closeButton = true, dismissible = true, initialFocus, closeLabel = 'Close',
  className, children,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const opener = React.useRef<HTMLElement | null>(null);
  const [titleId] = React.useState(() => 'sheet-t-' + (++sheetSeq));

  React.useEffect(() => {
    if (!open) return undefined;
    opener.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => {
      const el = ref.current; if (!el) return;
      const target = (initialFocus && initialFocus.current)
        || el.querySelector<HTMLElement>('.sheet-opt.is-on')
        || el.querySelector<HTMLElement>('.sheet-body ' + FOCUSABLE.split(', ').join(', .sheet-body '))
        || el.querySelector<HTMLElement>(FOCUSABLE);
      target && target.focus();
    }, 30);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      const back = opener.current;
      if (back && document.contains(back)) back.focus();
    };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && dismissible) { e.preventDefault(); onClose(); return; }
    if (e.key !== 'Tab' || !ref.current) return;
    const f = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  if (typeof document === 'undefined') return null;
  const node = (
    <React.Fragment>
      <div className={['scrim', open ? 'is-open' : ''].filter(Boolean).join(' ')} aria-hidden="true" onClick={dismissible ? onClose : undefined} />
      <div
        ref={ref}
        className={['sheet', open ? 'is-open' : '', className || ''].filter(Boolean).join(' ')}
        role="dialog" aria-modal="true" aria-labelledby={titleId} aria-hidden={!open}
        onKeyDown={onKeyDown}
      >
        <div className="sheet-grab" aria-hidden="true" />
        <div className="sheet-head">
          <div>
            {eyebrow}
            <h3 className="sheet-title" id={titleId}>{title}</h3>
            {sub != null ? <p className="sheet-sub">{sub}</p> : null}
          </div>
          {closeButton ? (
            <button type="button" className="btn btn-tertiary btn-sm btn-icon" aria-label={closeLabel} onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          ) : null}
        </div>
        <div className="sheet-body">{children}</div>
        {footer != null ? <div className="sheet-footer">{footer}</div> : null}
      </div>
    </React.Fragment>
  );
  const RD = (window as unknown as { ReactDOM?: { createPortal: (n: React.ReactNode, el: Element) => React.ReactNode } }).ReactDOM;
  return RD && RD.createPortal ? (RD.createPortal(node, document.body) as React.ReactElement) : node;
};

/** One choice in a sheet list (.sheet-opt, 48px). Inside a `role="radiogroup"`
    body it is a radio; the selected one carries .is-on and a trailing check. */
export interface SheetOptionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  selected?: boolean;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

export const SheetOption: React.FC<SheetOptionProps> = ({ selected = false, icon, onSelect, className, children, onClick, ...rest }) => (
  <button
    type="button" role="radio" aria-checked={selected}
    className={['sheet-opt', selected ? 'is-on' : '', className || ''].filter(Boolean).join(' ')}
    onClick={(e) => { onClick && onClick(e); onSelect && onSelect(); }}
    {...rest}
  >
    {icon}
    <span>{children}</span>
    {selected ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
    ) : null}
  </button>
);

export default Sheet;
