import * as React from 'react';

/**
 * ATTRUS Button — typed wrapper over the canonical `.btn` system
 * (preview/components/buttons.css). The CSS stays the single source
 * of visual truth; this component only composes class names.
 */

export type ButtonVariant =
  | 'primary'        /* brand fill — main action */
  | 'secondary'      /* neutral fill + hairline border — alternative actions */
  | 'tertiary'       /* soft neutral fill, borderless — quiet affirmative */
  | 'ghost'          /* nothing until hover — toolbars, table rows */
  | 'danger'         /* destructive solid */
  | 'danger-outline' /* destructive contextual — outline, surface bg */
  | 'success'        /* strong positive (rare) */
  | 'link'           /* looks like an inline text link */
  | 'inverse';       /* white on dark/brand panels */

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
  /** On dark/brand panels: remaps ghost/secondary to the inverse foreground
   *  scale (`.on-inverse`). Only meaningful with variant 'ghost' | 'secondary'. */
  onInverse?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconOnly = false,
  icon,
  iconRight,
  onInverse = false,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}) => {
  const cls = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    iconOnly ? 'btn-icon' : '',
    loading ? 'is-loading' : '',
    onInverse ? 'on-inverse' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
};

export default Button;

/** Segmented / toolbar cluster — children must be <Button>s (`.btn-group`):
 *  outer corners pill-rounded, inner seams collapsed. */
export const ButtonGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div role="group" className={['btn-group', className || ''].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);
