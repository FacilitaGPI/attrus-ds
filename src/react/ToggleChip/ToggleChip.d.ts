import * as React from 'react';

export interface ToggleChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  children?: React.ReactNode;
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Trailing count. */
  count?: React.ReactNode;
  /** On state (controlled) — drives aria-pressed. */
  pressed?: boolean;
  onToggle?: (next: boolean) => void;
  disabled?: boolean;
  size?: 'md' | 'sm';
  /** Dark-surface treatment. */
  onInverse?: boolean;
}

export declare const ToggleChip: React.FC<ToggleChipProps>;

export interface ToggleChipGroupProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export declare const ToggleChipGroup: React.FC<ToggleChipGroupProps>;

export default ToggleChip;
