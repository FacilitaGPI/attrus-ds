import * as React from 'react';

export type CalloutTone = 'info' | 'warn' | 'success' | 'danger' | 'neutral';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Semantic tone. Default 'info' (brand royal tint). */
  tone?: CalloutTone;
  /** Compact density for dense panels & forms. */
  small?: boolean;
  /** Leading icon slot (18px, 16px when small). */
  icon?: React.ReactNode;
  /** Bold heading line — wraps content in the rich vertical layout. */
  title?: React.ReactNode;
  /** Action row (canonical Buttons). Implies the rich layout. */
  actions?: React.ReactNode;
  /** Full-width alert bar: centered row, left accent rule, actions inline-right. */
  bar?: boolean;
  /** On a bar: re-adds radius + full border for in-container use. */
  rounded?: boolean;
  /** Content-sized, single line (badges, hero notices). */
  inline?: boolean;
  /** Glassy translucent tint + light text for dark surfaces. */
  onInverse?: boolean;
  /** When set, renders the × dismiss button and calls back on click. */
  onDismiss?: () => void;
}

export declare const Callout: React.FC<CalloutProps>;
export default Callout;
