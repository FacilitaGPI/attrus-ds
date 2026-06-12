import * as React from 'react';

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

export declare const Stepper: React.FC<StepperProps>;
export default Stepper;
