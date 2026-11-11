import * as React from 'react';

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
  /** Hover/press affordance (`.card.interactive`). */
  interactive?: boolean;
}

export interface CardStatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Delta text, e.g. "+8.2%". */
  delta?: React.ReactNode;
  /** up=success, down=danger, flat=muted. Default: 'flat'. */
  deltaDirection?: 'up' | 'down' | 'flat';
  /** Colours the number: a state or a team (L-37). */
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'team-sales' | 'team-compliance' | 'team-implementation' | 'team-payment-desk' | 'team-product';
  /** Line under the number (e.g. "1 due today"). */
  foot?: React.ReactNode;
  /** Tone of the foot line. */
  footTone?: 'default' | 'success' | 'warning' | 'danger';
}

export interface CardSlotProps extends React.HTMLAttributes<HTMLDivElement> {}

export declare const Card: React.FC<CardProps>;
/** `compact`: 54px minimum, title 14 bold, optional second line (.card-header.is-compact). */
export declare const CardHeader: React.FC<CardSlotProps & { compact?: boolean; title?: React.ReactNode; meta?: React.ReactNode; action?: React.ReactNode }>;
export declare const CardBody: React.FC<CardSlotProps>;
/** Footer slot. plain: detail-card action footer — line edge to edge, no fill, actions left. */
/** `note` + `actions`: split footer (.card-footer.is-split) — note left, at most two actions right. */
export declare const CardFooter: React.FC<CardSlotProps & { plain?: boolean; note?: React.ReactNode; actions?: React.ReactNode }>;
export declare const CardCanvas: React.FC<CardSlotProps>;
export declare const CardDivider: React.FC<CardSlotProps>;
export declare const CardStat: React.FC<CardStatProps>;
export default Card;
