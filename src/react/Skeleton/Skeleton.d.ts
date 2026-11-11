import * as React from 'react';

export type SkeletonShape = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  /** text (default) · circle · rect */
  shape?: SkeletonShape;
  width?: number | string;
  /** rect only; text takes its height from the parent font size. */
  height?: number | string;
  /** circle diameter in px. Default 32. */
  size?: number;
  /** text: number of lines; the last ends short. */
  lines?: number;
  /** text: line-height the real text will use. Default 1.4. */
  lineHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Placeholder in the shape of the coming content. aria-hidden. */
export declare const Skeleton: React.FC<SkeletonProps>;

export interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Announced to screen readers, e.g. "Loading transactions". */
  label: string;
  /** aria-busy while true. Default true. */
  busy?: boolean;
}

/** Loading region: role=status, aria-busy, screen-reader label. */
export declare const SkeletonGroup: React.FC<SkeletonGroupProps>;
export default Skeleton;
