import * as React from 'react';

/** The four sides, plus edge-aligned top/bottom. Near the viewport edge the balloon shifts inside or flips — measured on open. */
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

export declare const Tooltip: React.FC<TooltipProps>;
export declare const TooltipTitle: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export declare const TooltipDesc: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
export declare const TooltipRow: React.FC<{ k: React.ReactNode; v: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>>;
export default Tooltip;
