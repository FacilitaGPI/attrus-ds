import * as React from 'react';

/**
 * ATTRUS NumberInput — typed wrapper over the canonical `.number-input`
 * (preview/components/number-input.css): − / + accelerator buttons
 * around a numeric field. For bounded quantities (counts, %, days).
 */

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

const Minus: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const Plus: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

function clamp(v: number, min?: number, max?: number): number {
  if (min != null && v < min) return min;
  if (max != null && v > max) return max;
  return v;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  size = 'md',
  prefix,
  suffix,
  disabled = false,
  invalid = false,
  className,
  style,
  ...rest
}) => {
  const cls = [
    'number-input',
    size !== 'md' ? `number-input-${size}` : '',
    disabled ? 'is-disabled' : '',
    invalid ? 'is-invalid' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const set = (v: number) => {
    if (!disabled && onChange) onChange(clamp(v, min, max));
  };

  return (
    <div className={cls} style={style}>
      <button
        type="button"
        className="number-input-btn"
        aria-label="Decrease"
        disabled={disabled || (min != null && value <= min)}
        onClick={() => set(value - step)}
      >
        <Minus />
      </button>
      {prefix != null ? <span className="number-input-prefix">{prefix}</span> : null}
      <input
        type="number"
        className="number-input-field"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v)) set(v);
        }}
        {...rest}
      />
      {suffix != null ? <span className="number-input-suffix">{suffix}</span> : null}
      <button
        type="button"
        className="number-input-btn"
        aria-label="Increase"
        disabled={disabled || (max != null && value >= max)}
        onClick={() => set(value + step)}
      >
        <Plus />
      </button>
    </div>
  );
};

export default NumberInput;
