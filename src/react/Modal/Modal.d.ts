import * as React from 'react';

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

export declare const Modal: React.FC<ModalProps>;
export default Modal;
