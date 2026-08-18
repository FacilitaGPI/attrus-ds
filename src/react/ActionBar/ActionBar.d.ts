import * as React from 'react';

export interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left cluster — back / secondary actions. */
  lead?: React.ReactNode;
  /** Middle context — progress text, count, hint. */
  context?: React.ReactNode;
  /** Right cluster — primary action(s). Right-aligned via margin-left:auto. */
  actions?: React.ReactNode;
  /** Pin to the viewport bottom. */
  fixed?: boolean;
  size?: 'md' | 'sm';
  /** Dark-surface treatment. */
  onInverse?: boolean;
}

export declare const ActionBar: React.FC<ActionBarProps>;

export default ActionBar;
