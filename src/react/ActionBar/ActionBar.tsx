import * as React from 'react';

/**
 * ATTRUS ActionBar — typed wrapper over the canonical `.action-bar`
 * (preview/components/action-bar.css): persistent action strip for wizards,
 * drawers and editors.
 *
 * The right cluster uses `margin-left:auto` (never a flex:1 spacer — a spacer
 * competing with a Stepper in the same row collapses it).
 */
export interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left cluster — back / secondary actions. */
  lead?: React.ReactNode;
  /** Middle context — progress text, count, hint. */
  context?: React.ReactNode;
  /** Right cluster — primary action(s). */
  actions?: React.ReactNode;
  /** Pin to the viewport bottom. */
  fixed?: boolean;
  size?: 'md' | 'sm';
  /** Dark-surface treatment. */
  onInverse?: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  lead,
  context,
  actions,
  fixed = false,
  size = 'md',
  onInverse = false,
  className,
  children,
  ...rest
}) => {
  const cls = [
    'action-bar',
    size === 'sm' ? 'action-bar-sm' : '',
    fixed ? 'is-fixed' : '',
    onInverse ? 'on-inverse' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} {...rest}>
      {lead != null ? <div className="action-bar-lead">{lead}</div> : null}
      {context != null ? <div className="action-bar-context">{context}</div> : null}
      {children}
      {actions != null ? <div className="action-bar-actions">{actions}</div> : null}
    </div>
  );
};

export default ActionBar;
