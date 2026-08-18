import * as React from 'react';

/**
 * ATTRUS SelectableCard — typed wrapper over the canonical `.sel-card`
 * (preview/components/sel-card.css): a card that IS a control.
 *
 * Prefer this over hand-rolling `.card + .radio` in onboarding / KYC /
 * plan-picker flows — that composition reinvents padding, radius and the
 * selected state every time.
 *
 * `multi` switches the marker to a square (checkbox semantics) and renders a
 * checkbox input; the default is radio semantics. Pass `name` to group radios.
 */
export interface SelectableCardProps {
  title: React.ReactNode;
  /** Supporting copy under the title. */
  desc?: React.ReactNode;
  /** Leading index chip — "01", "02"… */
  index?: React.ReactNode;
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
  /** Dark-surface treatment (hero, permanently-dark onboarding). */
  onInverse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  desc,
  index,
  selected = false,
  onSelect,
  name,
  value,
  multi = false,
  disabled = false,
  size = 'md',
  onInverse = false,
  className,
  style,
}) => {
  const cls = [
    'sel-card',
    size === 'sm' ? 'sel-card-sm' : '',
    multi ? 'sel-card-multi' : '',
    selected ? 'is-selected' : '',
    onInverse ? 'on-inverse' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <label className={cls} style={style} aria-disabled={disabled || undefined}>
      <input
        type={multi ? 'checkbox' : 'radio'}
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={(e) => onSelect?.(e.target.checked)}
      />
      {index != null ? <span className="sel-card-index">{index}</span> : null}
      <span className="sel-card-body">
        <span className="sel-card-title">{title}</span>
        {desc != null ? <span className="sel-card-desc">{desc}</span> : null}
      </span>
      <span className="sel-card-mark" aria-hidden="true" />
    </label>
  );
};

export interface SelectableCardGroupProps {
  children?: React.ReactNode;
  /** Auto-fit grid instead of a single column. */
  grid?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SelectableCardGroup: React.FC<SelectableCardGroupProps> = ({ children, grid = false, className, style }) => (
  <div className={['sel-card-group', grid ? 'is-grid' : '', className || ''].filter(Boolean).join(' ')} style={style} role="group">
    {children}
  </div>
);

export default SelectableCard;
