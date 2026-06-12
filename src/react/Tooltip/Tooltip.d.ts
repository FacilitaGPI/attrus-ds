import * as React from 'react';

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

export declare const Tooltip: React.FC<TooltipProps>;
export declare const TooltipTitle: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export declare const TooltipDesc: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
export declare const TooltipRow: React.FC<{ k: React.ReactNode; v: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>>;
export default Tooltip;
