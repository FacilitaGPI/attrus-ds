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
/** Frosted surface by role: surface (over imagery, in content) · chrome (fixed bar/panel) · overlay (popover, menu) · hero (over a dark hero or photo; dark in both themes). */
export type CardGlass = 'surface' | 'chrome' | 'overlay' | 'hero';
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
  /** Frosted surface by role (.card.glass-<role>). Put the card over an image or gradient — on a flat surface glass has nothing to blur. */
  glass?: CardGlass;
  /** Hover/press affordance (`.card.interactive`) — wrap the card in an <a>/<button>, or pass onClick. */
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  accent,
  density = 'default',
  clip = false,
  interactive = false,
  glass,
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
    glass ? `glass-${glass}` : '',
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

/** Header slot. `compact`: 54px minimum, title 14 bold and an optional second
    line (subtitle, or a breadcrumb in .card-crumb) — the header band of a
    four-band card (.card-header.is-compact). One element fits on the right. */
/** Header slot. Pass `title` (bold), `meta` (muted, e.g. "30 days") and `action`
    (e.g. a "See all" link) for the standard header; or `children` for free content. */
export const CardHeader: React.FC<CardSlotProps & { compact?: boolean; title?: React.ReactNode; meta?: React.ReactNode; action?: React.ReactNode }> = ({ compact = false, title, meta, action, className, children, ...rest }) => {
  const structured = title != null || meta != null || action != null;
  return (
    <div className={['card-header', compact ? 'is-compact' : '', structured ? 'has-aside' : '', className || ''].filter(Boolean).join(' ')} {...rest}>
      {title != null ? <h3 className="card-header-title">{title}</h3> : null}
      {children}
      {meta != null || action != null ? <span className="card-header-aside">{meta != null ? <span className="card-header-meta">{meta}</span> : null}{action}</span> : null}
    </div>
  );
};
export const CardBody: React.FC<CardSlotProps> = ({ className, ...rest }) => (
  <div className={['card-body', className || ''].filter(Boolean).join(' ')} {...rest} />
);
/** Footer slot. `plain`: a detail card's action footer — a 1px line edge to
    edge, no fill, buttons left-aligned with the text. Works on a single-padding
    card (bleeds through its padding) and on a card built from slots. */
/** `note` + `actions` make a split footer (.card-footer.is-split): subtle fill,
    52px minimum, the note on the left states the consequence of the action,
    at most two actions on the right. Children are ignored in that form. */
export const CardFooter: React.FC<CardSlotProps & { plain?: boolean; note?: React.ReactNode; actions?: React.ReactNode }> = ({ plain, note, actions, className, children, ...rest }) => {
  const split = !plain && (note != null || actions != null);
  return (
    <div className={[plain ? 'card-footer-plain' : 'card-footer', split ? 'is-split' : '', className || ''].filter(Boolean).join(' ')} {...rest}>
      {split ? (
        <React.Fragment>
          {note != null ? <span className="card-footer-note">{note}</span> : null}
          {actions != null ? <div className="card-footer-actions">{actions}</div> : null}
        </React.Fragment>
      ) : children}
    </div>
  );
};
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
  /** Colours the number: a state or a team (L-37). */
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'team-sales' | 'team-compliance' | 'team-implementation' | 'team-payment-desk' | 'team-product';
  /** Line under the number (e.g. "1 due today"). */
  foot?: React.ReactNode;
  /** Tone of the foot line. */
  footTone?: 'default' | 'success' | 'warning' | 'danger';
}
export const CardStat: React.FC<CardStatProps> = ({ label, value, delta, deltaDirection = 'flat', tone = 'default', foot, footTone = 'default', className, children, ...rest }) => (
  <div className={['card-stat', className || ''].filter(Boolean).join(' ')} {...rest}>
    <span className="stat-label">{label}</span>
    <span className={['stat-value', tone !== 'default' ? 'tone-' + tone : ''].filter(Boolean).join(' ')}>{value}</span>
    {foot != null ? <span className={['stat-foot', footTone !== 'default' ? 'tone-' + footTone : ''].filter(Boolean).join(' ')}>{foot}</span> : null}
    {delta != null ? <span className={`stat-delta ${deltaDirection}`}>{delta}</span> : null}
    {children}
  </div>
);

export default Card;
