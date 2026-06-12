import * as React from 'react';

/**
 * ATTRUS Card — typed wrapper over the canonical `.card` system
 * (preview/components/cards.css). CSS stays the visual source of truth.
 *
 * Slots: compose with <CardHeader/>, <CardBody/>, <CardFooter/>,
 * <CardCanvas/>, <CardDivider/> — the CSS `:has()` rules drop the base
 * padding automatically when slots are present (each slot pads itself).
 */

export type CardVariant = 'default' | 'flat' | 'subtle' | 'sunken' | 'raised' | 'floating' | 'hero' | 'inverse';
export type CardAccent = 'success' | 'warning' | 'danger' | 'info';
export type CardDensity = 'compact' | 'default' | 'spacious';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface role. Default: surface + hairline + xs shadow. */
  variant?: CardVariant;
  /** Semantic banner tint (success/warning/danger/info). */
  accent?: CardAccent;
  /** Padding density for the card and its slots. */
  density?: CardDensity;
  /** Clip children to the rounded corners (tables, images). */
  clip?: boolean;
  /** Hover/press affordance (`.card.interactive`) — wrap the card in an <a>/<button>, or pass onClick. */
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  accent,
  density = 'default',
  clip = false,
  interactive = false,
  className,
  style,
  children,
  ...rest
}) => {
  const cls = [
    'card',
    variant !== 'default' ? variant : '',
    accent ? `accent-${accent}` : '',
    density !== 'default' ? density : '',
    interactive ? 'interactive' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} style={clip ? { overflow: 'hidden', ...style } : style} {...rest}>
      {children}
    </div>
  );
};

export interface CardSlotProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader: React.FC<CardSlotProps> = ({ className, ...rest }) => (
  <div className={['card-header', className || ''].filter(Boolean).join(' ')} {...rest} />
);
export const CardBody: React.FC<CardSlotProps> = ({ className, ...rest }) => (
  <div className={['card-body', className || ''].filter(Boolean).join(' ')} {...rest} />
);
export const CardFooter: React.FC<CardSlotProps> = ({ className, ...rest }) => (
  <div className={['card-footer', className || ''].filter(Boolean).join(' ')} {...rest} />
);
export const CardCanvas: React.FC<CardSlotProps> = ({ className, ...rest }) => (
  <div className={['card-canvas', className || ''].filter(Boolean).join(' ')} {...rest} />
);
export const CardDivider: React.FC<CardSlotProps> = ({ className, ...rest }) => (
  <div className={['card-divider', className || ''].filter(Boolean).join(' ')} {...rest} />
);

/** KPI/stat layout inside a card — `.card-stat` (mono label, bold value, tinted delta). */
export interface CardStatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Delta text, e.g. "+8.2%". */
  delta?: React.ReactNode;
  /** Direction tints the delta: up=success, down=danger, flat=muted. Default: 'flat'. */
  deltaDirection?: 'up' | 'down' | 'flat';
}
export const CardStat: React.FC<CardStatProps> = ({ label, value, delta, deltaDirection = 'flat', className, children, ...rest }) => (
  <div className={['card-stat', className || ''].filter(Boolean).join(' ')} {...rest}>
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
    {delta != null ? <span className={`stat-delta ${deltaDirection}`}>{delta}</span> : null}
    {children}
  </div>
);

export default Card;
