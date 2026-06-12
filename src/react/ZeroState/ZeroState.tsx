import * as React from 'react';

/**
 * ATTRUS ZeroState — typed wrapper over the canonical `.empty` block
 * (preview/components/empty-states.css): centered illustration + title +
 * body + actions for zero-data surfaces.
 * (Module named ZeroState — "EmptyState" collides with the legacy
 * ui_kits/dashboard/EmptyState.jsx still consumed by the app.)
 */

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

export const ZeroState: React.FC<ZeroStateProps> = ({
  illo,
  title,
  actions,
  compact = false,
  warning = false,
  className,
  children,
  ...rest
}) => (
  <div
    className={['empty', compact ? 'empty-compact' : 'empty-default', warning ? 'empty-warning' : '', className || ''].filter(Boolean).join(' ')}
    {...rest}
  >
    {illo != null ? <span className="empty-illo">{illo}</span> : null}
    <h4>{title}</h4>
    {children != null ? <p>{children}</p> : null}
    {actions != null ? <div className="empty-actions">{actions}</div> : null}
  </div>
);

export default ZeroState;
