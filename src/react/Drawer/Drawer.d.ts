import * as React from 'react';

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
  /** Drag handle bar (bottom drawers) — swipe-down past ~80px dismisses. */
  handle?: boolean;
  /** Gallery/doc rendering: panel only (no scrim), overlay behaviours off
      (focus trap, scroll-lock, Esc). Position it inside a relative frame. */
  static?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export declare const Drawer: React.FC<DrawerProps>;
export default Drawer;
