import * as React from 'react';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** Names the dialog (aria-labelledby). */
  title: React.ReactNode;
  sub?: React.ReactNode;
  /** Above the title — a status pill on a detail sheet. */
  eyebrow?: React.ReactNode;
  /** Two actions, secondary · primary. */
  footer?: React.ReactNode;
  /** The ✕ in the header. Default true. */
  closeButton?: boolean;
  /** Esc and scrim close it. false for a flow the user must finish. Default true. */
  dismissible?: boolean;
  /** Element to focus on open. Default: the .is-on option, else the first control. */
  initialFocus?: React.RefObject<HTMLElement>;
  closeLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

/** Bottom sheet for phones: dialog semantics, focus trap, Esc/scrim close, focus return, scroll lock. */
export declare const Sheet: React.FC<SheetProps>;

export interface SheetOptionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  selected?: boolean;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

/** One choice in a sheet list (.sheet-opt, 48px, role="radio"). */
export declare const SheetOption: React.FC<SheetOptionProps>;
export default Sheet;
