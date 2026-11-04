import * as React from 'react';

/**
 * ATTRUS Tooltip — typed wrapper over the canonical `.tooltip` system
 * (preview/components/tooltip.css). Wraps the trigger in .tooltip-target;
 * visibility is pure CSS (:hover / :focus-within) — no JS listeners.
 * `rich` enables the larger interactive panel (title/desc/rows blocks).
 */

/** The four sides, plus edge-aligned top/bottom. Near the viewport edge the
    balloon shifts inside (8px margin) or flips side — measured on open. */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** Tooltip content — plain label, or rich blocks when rich=true. */
  content: React.ReactNode;
  placement?: TooltipPlacement;
  /** Larger interactive panel (.tooltip-rich) that stays open on hover. */
  rich?: boolean;
  /** Force-show (testing / controlled cases) — .is-open. */
  open?: boolean;
  /** Keyboard hint — renders a trailing <kbd> (`.tooltip-kbd`). */
  shortcut?: string;
  /** The trigger element(s). */
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  rich = false,
  open = false,
  shortcut,
  className,
  children,
  ...rest
}) => {
  // Escape hides the tooltip while focus stays on the target (doc a11y
  // contract); suppression clears on blur or when the pointer re-enters.
  const [suppressed, setSuppressed] = React.useState(false);
  const [side, setSide] = React.useState(placement);
  const tipRef = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => { setSide(placement); }, [placement]);
  const tipCls = [
    'tooltip',
    `tooltip-${side}`,
    rich ? 'tooltip-rich' : '',
    shortcut ? 'tooltip-kbd' : '',
    open ? 'is-open' : '',
  ]
    .filter(Boolean)
    .join(' ');
  /* Measure on open and keep the balloon on screen: shift along the edge it
     overflows (8px margin, the arrow compensates via --tip-shift), and flip
     top <-> bottom when there is no room on the chosen side. */
  const fit = React.useCallback(() => {
    const el = tipRef.current;
    if (!el || typeof window === 'undefined') return;
    el.style.setProperty('--tip-shift', '0px');
    const M = 8;
    const r = el.getBoundingClientRect();
    let s = 0;
    if (r.right > window.innerWidth - M) s = window.innerWidth - M - r.right;
    if (r.left + s < M) s = M - r.left;
    el.style.setProperty('--tip-shift', s + 'px');
    const v = placement.split('-')[0];
    if (v === 'top' && r.top < M) setSide(placement.replace('top', 'bottom') as TooltipPlacement);
    else if (v === 'bottom' && r.bottom > window.innerHeight - M) setSide(placement.replace('bottom', 'top') as TooltipPlacement);
    else setSide(placement);
  }, [placement]);
  return (
    <span
      className={['tooltip-target', suppressed ? 'is-suppressed' : '', className || ''].filter(Boolean).join(' ')}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Escape') setSuppressed(true); }}
      onBlur={() => setSuppressed(false)}
      onMouseEnter={() => { setSuppressed(false); fit(); }}
      onFocus={fit}
      {...rest}
    >
      {children}
      <span ref={tipRef} className={tipCls} role="tooltip">
        {content}
        {shortcut ? <kbd>{shortcut}</kbd> : null}
      </span>
    </span>
  );
};

/* Rich-panel slots — compose inside `content` with rich=true. */
export const TooltipTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={['tooltip-title', className || ''].filter(Boolean).join(' ')} {...rest} />
);
export const TooltipDesc: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...rest }) => (
  <p className={['tooltip-desc', className || ''].filter(Boolean).join(' ')} {...rest} />
);
export const TooltipRow: React.FC<{ k: React.ReactNode; v: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>> = ({ k, v, className, ...rest }) => (
  <div className={['tooltip-row', className || ''].filter(Boolean).join(' ')} {...rest}>
    <span className="k">{k}</span>
    <span className="v">{v}</span>
  </div>
);

export default Tooltip;
