import * as React from 'react';

export interface ZeroStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Illustration slot (.empty-illo) — SVG or image. */
  illo?: React.ReactNode;
  /** Heading (h4). */
  title: React.ReactNode;
  /** Action row (.empty-actions) — canonical Buttons. */
  actions?: React.ReactNode;
  /** Dense variant for cards/panels (.empty-compact). */
  compact?: boolean;
  /** Warning tone — tinted panel (.empty-warning). */
  warning?: boolean;
}

export declare const ZeroState: React.FC<ZeroStateProps>;
export default ZeroState;
