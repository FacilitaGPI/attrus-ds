import * as React from 'react';

/**
 * ATTRUS Drawer — typed wrapper over the canonical `.drawer` + `.scrim`
 * (preview/components/overlays.css). Slide-in panel from right/left/
 * bottom with sticky glassy header/footer, lead tile and sizes sm→xl.
 *
 * Open/close: same proven pattern as Modal — internal flag flips
 * `.is-open` via setTimeout (not rAF). Esc and scrim-click call onClose.
 * Exit: when `open` flips false the panel stays MOUNTED for the exit
 * transition (slide back + fade, --duration-slow = 320ms) and only then
 * unmounts — so closing plays the exact reverse of opening.
 */

export type DrawerSide = 'right' | 'left' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  side?: DrawerSide;
  /** Width preset for right/left drawers. */
  size?: DrawerSize;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** 40×40 header lead tile — caller sets bg/color via leadStyle. */
  lead?: React.ReactNode;
  leadStyle?: React.CSSProperties;
  /** Sticky footer row — canonical Buttons. */
  footer?: React.ReactNode;
  /** Left-side footer aux (total, agreement note) — switches the footer to space-between. */
  footerAux?: React.ReactNode;
  /** Second header row (search pill, tabs) — `.drawer-header-extra`. */
  headerExtra?: React.ReactNode;
  /** Tight header chrome for utility drawers (`.drawer-header.is-dense`). */
  denseHeader?: boolean;
  /** Drag handle bar (bottom drawers). */
  handle?: boolean;
  /** Gallery/doc rendering: panel only (no scrim), overlay behaviours off
      (focus trap, scroll-lock, Esc). Position it inside a relative frame. */
  static?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const XGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  side = 'right',
  size,
  title,
  subtitle,
  lead,
  leadStyle,
  footer,
  footerAux,
  headerExtra,
  denseHeader = false,
  handle = false,
  static: isStatic = false,
  children,
  className,
}) => {
  const [shown, setShown] = React.useState(false);
  const [mounted, setMounted] = React.useState(open);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    // Closing: drop .is-open first so the CSS exit transition (reverse
    // slide + fade) plays, THEN unmount after it finishes (320ms exit).
    setShown(false);
    const t = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(t);
  }, [open]);

  // Entry: after the CLOSED state is committed to the DOM, force a layout
  // flush (offsetHeight) so the browser computes the start position, then
  // flip .is-open — guarantees the slide-in transition plays every time.
  // (A bare 10ms timer was flaky: when it fired before first style calc,
  // the panel appeared already open — no animation.)
  React.useEffect(() => {
    if (!open || !mounted || shown) return;
    void panelRef.current?.offsetHeight;
    setShown(true);
  }, [open, mounted, shown]);

  React.useEffect(() => {
    if (!open || isStatic) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, isStatic]);

  // Body scroll-lock while open (doc a11y contract).
  React.useEffect(() => {
    if (!open || !mounted || isStatic) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open, mounted]);

  // Focus management: remember the opener, move focus into the panel on
  // open, restore it after close. Tab cycles inside (light focus trap).
  const prevFocus = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (isStatic) return;
    if (shown) {
      prevFocus.current = document.activeElement as HTMLElement | null;
      const first = panelRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (first || panelRef.current)?.focus?.();
    } else if (prevFocus.current) {
      prevFocus.current.focus?.();
      prevFocus.current = null;
    }
  }, [shown]);

  const onTrapKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled'));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // Bottom drawer: swipe-down on the handle dismisses past a threshold.
  const touchY = React.useRef<number | null>(null);
  const onHandleTouchStart = (e: React.TouchEvent) => { touchY.current = e.touches[0].clientY; };
  const onHandleTouchMove = (e: React.TouchEvent) => {
    if (touchY.current == null || !panelRef.current) return;
    const dy = Math.max(0, e.touches[0].clientY - touchY.current);
    panelRef.current.style.transform = `translateY(${dy}px)`;
    panelRef.current.style.transition = 'none';
  };
  const onHandleTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current == null || !panelRef.current) return;
    const dy = e.changedTouches[0].clientY - touchY.current;
    panelRef.current.style.transform = '';
    panelRef.current.style.transition = '';
    touchY.current = null;
    if (dy > 80 && onClose) onClose();
  };

  if (!mounted) return null;

  const cls = [
    'drawer',
    `drawer-${side}`,
    size && side !== 'bottom' ? `drawer-${size}` : '',
    shown ? 'is-open' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <React.Fragment>
      {isStatic ? null : <div className={['scrim', shown ? 'is-open' : ''].filter(Boolean).join(' ')} onClick={onClose} />}
      <div
        ref={panelRef}
        className={cls}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onKeyDown={onTrapKeyDown}
      >
        {handle ? (
          <div
            className="drawer-handle"
            onTouchStart={onHandleTouchStart}
            onTouchMove={onHandleTouchMove}
            onTouchEnd={onHandleTouchEnd}
          />
        ) : null}
        {title != null || subtitle != null || lead != null || onClose ? (
          <div className={['drawer-header', denseHeader ? 'is-dense' : '', headerExtra != null ? 'has-extra' : ''].filter(Boolean).join(' ')}>
            {lead != null ? (
              <span className="drawer-lead" style={leadStyle}>
                {lead}
              </span>
            ) : null}
            <div className="drawer-header-text">
              {title != null ? <div className="drawer-title">{title}</div> : null}
              {subtitle != null ? <div className="drawer-subtitle">{subtitle}</div> : null}
            </div>
            {onClose ? (
              <button type="button" className="drawer-close" aria-label="Close" onClick={onClose}>
                <XGlyph />
              </button>
            ) : null}
            {headerExtra != null ? <div className="drawer-header-extra">{headerExtra}</div> : null}
          </div>
        ) : null}
        {children != null ? <div className="drawer-body">{children}</div> : null}
        {footer != null || footerAux != null ? (
          <div className="drawer-footer" style={footerAux != null ? { justifyContent: 'space-between' } : undefined}>
            {footerAux != null ? <span className="drawer-footer-aux">{footerAux}</span> : null}
            {footer != null ? (footerAux != null ? <span style={{ display: 'inline-flex', gap: 'var(--space-3)' }}>{footer}</span> : footer) : null}
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default Drawer;
