import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'danger-outline' | 'success' | 'link' | 'inverse';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. Default: 'primary'. */
  variant?: ButtonVariant;
  /** Control height: xs=24, sm=32, md=40 (default), lg=48. */
  size?: ButtonSize;
  /** Shows the canonical spinner and disables interaction. */
  loading?: boolean;
  /** Square icon-only button (.btn-icon) — width locks to the height. */
  iconOnly?: boolean;
  /** Leading slot — typically an <Icon/>. */
  icon?: React.ReactNode;
  /** Trailing slot — e.g. a chevron. */
  iconRight?: React.ReactNode;
  /** On dark/brand panels: remaps ghost/secondary to the inverse foreground scale (`.on-inverse`). */
  onInverse?: boolean;
}

export declare const Button: React.FC<ButtonProps>;
export declare const ButtonGroup: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export default Button;
