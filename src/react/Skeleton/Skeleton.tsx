import * as React from 'react';

/**
 * ATTRUS Skeleton — a placeholder in the shape of the content that is coming
 * (preview/components/primitives.css `.skeleton`). Build it to match the real
 * layout so nothing moves when the data lands: one text line per real line,
 * the same avatar size, the same button size.
 *
 * Shapes are aria-hidden. Wrap a loading region in <SkeletonGroup label> so a
 * screen reader hears one "Loading …" instead of nothing (or every bar).
 */
export type SkeletonShape = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  /** text (default) · circle · rect */
  shape?: SkeletonShape;
  /** CSS width. text: defaults to 100% of the line; rect: required in practice. */
  width?: number | string;
  /** CSS height (rect). text takes its height from the parent font size. */
  height?: number | string;
  /** circle: diameter in px. */
  size?: number;
  /** text: number of lines; the last ends short. */
  lines?: number;
  /** text: line-height the real text will use. Default 1.4 (the data line-height). */
  lineHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

const px = (v?: number | string) => (typeof v === 'number' ? v + 'px' : v);

export const Skeleton: React.FC<SkeletonProps> = ({ shape = 'text', width, height, size, lines, lineHeight, className, style }) => {
  const cls = (extra: string) => ['skeleton', 'skeleton-' + shape, extra, className || ''].filter(Boolean).join(' ');
  const lh = lineHeight != null ? ({ ['--sk-lh' as string]: String(lineHeight) } as React.CSSProperties) : undefined;
  if (shape === 'text' && lines && lines > 1) {
    return (
      <span className="skeleton-lines" aria-hidden="true" style={{ ...lh, width: px(width), ...style }}>
        {Array.from({ length: lines }, (_, i) => <span key={i} className={['skeleton', 'skeleton-text', className || ''].filter(Boolean).join(' ')} />)}
      </span>
    );
  }
  const dims: React.CSSProperties = shape === 'circle'
    ? { width: px(size ?? 32), height: px(size ?? 32) }
    : { width: px(width), height: shape === 'rect' ? px(height) : undefined };
  return <span className={cls('')} aria-hidden="true" style={{ ...lh, ...dims, ...style }} />;
};

export interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Announced to screen readers, e.g. "Loading transactions". */
  label: string;
  /** While true the region is aria-busy. Default true. */
  busy?: boolean;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({ label, busy = true, className, children, ...rest }) => (
  <div className={['skeleton-group', className || ''].filter(Boolean).join(' ')} aria-busy={busy} role="status" {...rest}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);

export default Skeleton;
