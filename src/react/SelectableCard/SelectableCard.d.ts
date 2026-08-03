import * as React from 'react';

export interface SelectableCardProps {
  /** Primary line. */
  title: React.ReactNode;
  /** Supporting copy under the title. */
  desc?: React.ReactNode;
  /** Leading index chip — "01", "02"… */
  index?: React.ReactNode;
  /** Selected state (controlled). */
  selected?: boolean;
  onSelect?: (next: boolean) => void;
  /** Radio group name (single-select). */
  name?: string;
  value?: string;
  /** Pick-many: square marker + checkbox input. */
  multi?: boolean;
  disabled?: boolean;
  /** Dense padding + smaller type. */
  size?: 'md' | 'sm';
  /** Dark-surface treatment. */
  onInverse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export declare const SelectableCard: React.FC<SelectableCardProps>;

export interface SelectableCardGroupProps {
  children?: React.ReactNode;
  /** Auto-fit grid instead of a single column. */
  grid?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export declare const SelectableCardGroup: React.FC<SelectableCardGroupProps>;

export default SelectableCard;
