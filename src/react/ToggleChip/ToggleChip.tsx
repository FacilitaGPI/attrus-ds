import * as React from 'react';

/**
 * ATTRUS ToggleChip — typed wrapper over the canonical `.toggle-chip`
 * (preview/components/toggle-chip.css): a chip that is a FORM CONTROL.
 *
 * Use for multi-select filters, tag pickers and preference pills. Do NOT use
 * `.chip` (that is a removable token, it ships `.chip-x`) or `.pill.interactive`
 * (that is a status pill) for selection.
 *
 * Renders a `<button aria-pressed>` by default — the accessible pattern for a
 * toggle. Provide `name` to render a hidden checkbox instead (form submission).
 */
export interface ToggleChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  children?: React.ReactNode;
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Trailing count. */
  count?: React.ReactNode;
  pressed?: boolean;
  onToggle?: (next: boolean) => void;
  disabled?: boolean;
  size?: 'md' | 'sm';
  /** Dark-surface treatment. */
  onInverse?: boolean;
}

export const ToggleChip: React.FC<ToggleChipProps> = ({
  children,
  icon,
  count,
  pressed = false,
  onToggle,
  disabled = false,
  size = 'md',
  onInverse = false,
  className,
  ...rest
}) => {
  const cls = [
    'toggle-chip',
    size === 'sm' ? 'toggle-chip-sm' : '',
    onInverse ? 'on-inverse' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={cls}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => onToggle?.(!pressed)}
      {...rest}
    >
      {icon}
      {children}
      {count != null ? <span className="toggle-chip-count">{count}</span> : null}
    </button>
  );
};

export interface ToggleChipGroupProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export const ToggleChipGroup: React.FC<ToggleChipGroupProps> = ({ children, className, ...rest }) => (
  <div className={['toggle-chip-group', className || ''].filter(Boolean).join(' ')} role="group" {...rest}>
    {children}
  </div>
);

export default ToggleChip;
