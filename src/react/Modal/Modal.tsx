import * as React from 'react';

/**
 * ATTRUS Modal — typed wrapper over the canonical `.modal` + `.scrim`
 * (preview/components/overlays.css). Centered dialog with header/body/
 * footer, sizes sm→xl and the destructive variant (top accent strip).
 *
 * Open/close: mount with open=true; an internal flag flips `.is-open`
 * a tick later via setTimeout (NOT requestAnimationFrame — rAF is
 * throttled in background tabs and the overlay would stay invisible).
 * Esc and scrim-click call onClose. Exit: on open=false the dialog stays
 * mounted for the exit transition (fade + slide, --duration-base = 200ms)
 * and only then unmounts — closing mirrors opening.
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  size?: ModalSize;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Icon tile above the title (destructive confirmations). */
  icon?: React.ReactNode;
  /** Danger accent strip + icon tint (.modal-destructive). */
  destructive?: boolean;
  /** Footer row (.modal-footer) — canonical Buttons, right-aligned. */
  footer?: React.ReactNode;
  /** Left-side footer aux content (enables space-between). */
  footerAux?: React.ReactNode;
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

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'md',
  title,
  subtitle,
  icon,
  destructive = false,
  footer,
  footerAux,
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
    // Closing: drop .is-open → CSS exit transition plays → unmount after.
    setShown(false);
    const t = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(t);
  }, [open]);

  // Entry: commit the CLOSED state, force a layout flush, then flip
  // .is-open — the fade+slide entry plays deterministically (a bare
  // 10ms timer raced the first style calc and often skipped it).
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
  }, [open, mounted, isStatic]);

  // Focus: into the dialog on open, restore the opener on close; Tab cycles.
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

  if (!mounted) return null;

  const cls = [
    'modal',
    `modal-${size}`,
    destructive ? 'modal-destructive' : '',
    shown ? 'is-open' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <React.Fragment>
      {isStatic ? null : <div className={['scrim', shown ? 'is-open' : ''].filter(Boolean).join(' ')} onClick={onClose} />}
      <div ref={panelRef} className={cls} role="dialog" aria-modal="true" tabIndex={-1} onKeyDown={onTrapKeyDown}>
        {title != null || subtitle != null || onClose ? (
          <div className="modal-header">
            <div className="modal-header-text">
              {icon != null ? <span className="modal-icon">{icon}</span> : null}
              {title != null ? <div className="modal-title">{title}</div> : null}
              {subtitle != null ? <div className="modal-subtitle">{subtitle}</div> : null}
            </div>
            {onClose ? (
              <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
                <XGlyph />
              </button>
            ) : null}
          </div>
        ) : null}
        {children != null ? <div className="modal-body">{children}</div> : null}
        {footer != null ? (
          <div className={['modal-footer', footerAux != null ? 'modal-footer-spread' : ''].filter(Boolean).join(' ')}>
            {footerAux != null ? <div className="modal-footer-aux">{footerAux}</div> : null}
            {footer}
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default Modal;
