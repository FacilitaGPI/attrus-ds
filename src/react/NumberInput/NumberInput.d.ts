import * as React from 'react';

export type NumberInputSize = 'sm' | 'md' | 'lg';

export interface NumberInputProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: NumberInputSize;
  /** Static cell before the field (e.g. "$"). */
  prefix?: React.ReactNode;
  /** Static cell after the field (e.g. "%", "days"). */
  suffix?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  'aria-label'?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export declare const NumberInput: React.FC<NumberInputProps>;
export default NumberInput;
