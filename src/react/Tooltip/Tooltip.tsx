import * as React from 'react';

/**
 * ATTRUS Tooltip — typed wrapper over the canonical `.tooltip` system
 * (preview/components/tooltip.css). Wraps the trigger in .tooltip-target;
 * visibility is pure CSS (:hover / :focus-within) — no JS listeners.
 * `rich` enables the larger interactive panel (title/desc/rows blocks).
 */

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
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
  const tipCls = [
    'tooltip',
    `tooltip-${placement}`,
    rich ? 'tooltip-rich' : '',
    shortcut ? 'tooltip-kbd' : '',
    open ? 'is-open' : '',
  ]
    .filter(Boolean)
    .join(' ');
  // Escape hides the tooltip while focus stays on the target (doc a11y
  // contract); suppression clears on blur or when the pointer re-enters.
  const [suppressed, setSuppressed] = React.useState(false);
  return (
    <span
      className={['tooltip-target', suppressed ? 'is-suppressed' : '', className || ''].filter(Boolean).join(' ')}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Escape') setSuppressed(true); }}
      onBlur={() => setSuppressed(false)}
      onMouseEnter={() => setSuppressed(false)}
      {...rest}
    >
      {children}
      <span className={tipCls} role="tooltip">
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
