import * as React from 'react';

/**
 * ATTRUS Stepper — typed wrapper over the canonical `.stepper` flow
 * indicator (preview/components/stepper.css). States: todo / current /
 * done / error / skipped. Orientations: horizontal (default), vertical.
 * Density: compact. Minimal: rule (4px capsule, mono labels).
 */

export type StepState = 'todo' | 'current' | 'done' | 'error' | 'skipped';

export interface StepItem {
  key: string;
  label: React.ReactNode;
  help?: React.ReactNode;
  state?: StepState;
}

export interface StepperProps extends React.OlHTMLAttributes<HTMLOListElement> {
  steps: StepItem[];
  vertical?: boolean;
  compact?: boolean;
  /** Minimal capsule+label variant (.is-rule) for tight headers. */
  rule?: boolean;
  /** ≤640px: hide labels, keep markers (.is-collapse-sm). */
  collapseOnMobile?: boolean;
  /** Step click (e.g. jump back to a done step). */
  onStepClick?: (key: string) => void;
}

const CheckGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const XGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Stepper: React.FC<StepperProps> = ({
  steps,
  vertical = false,
  compact = false,
  rule = false,
  collapseOnMobile = false,
  onStepClick,
  className,
  ...rest
}) => {
  const cls = [
    'stepper',
    vertical ? 'is-vertical' : '',
    compact ? 'is-compact' : '',
    rule ? 'is-rule' : '',
    collapseOnMobile ? 'is-collapse-sm' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ol className={cls} {...rest}>
      {steps.map((s, i) => {
        const state = s.state || 'todo';
        const stepCls = ['step', state !== 'todo' ? `is-${state}` : ''].filter(Boolean).join(' ');
        const marker =
          state === 'done' ? <CheckGlyph /> : state === 'error' ? <XGlyph /> : <span>{i + 1}</span>;
        const clickable = onStepClick && (state === 'done' || state === 'error');
        return (
          <li key={s.key} className={stepCls} aria-current={state === 'current' ? 'step' : undefined}>
            <span
              className="step-marker"
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              style={clickable ? { cursor: 'pointer' } : undefined}
              onClick={clickable ? () => onStepClick!(s.key) : undefined}
            >
              {marker}
            </span>
            <span className="step-body">
              <span className="step-label">{s.label}</span>
              {s.help != null ? <span className="step-help">{s.help}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
