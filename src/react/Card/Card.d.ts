import * as React from 'react';

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
}

export interface CardSlotProps extends React.HTMLAttributes<HTMLDivElement> {}

export declare const Card: React.FC<CardProps>;
/** `compact`: 54px minimum, title 14 bold, optional second line (.card-header.is-compact). */
export declare const CardHeader: React.FC<CardSlotProps & { compact?: boolean }>;
export declare const CardBody: React.FC<CardSlotProps>;
/** Footer slot. plain: detail-card action footer — line edge to edge, no fill, actions left. */
/** `note` + `actions`: split footer (.card-footer.is-split) — note left, at most two actions right. */
export declare const CardFooter: React.FC<CardSlotProps & { plain?: boolean; note?: React.ReactNode; actions?: React.ReactNode }>;
export declare const CardCanvas: React.FC<CardSlotProps>;
export declare const CardDivider: React.FC<CardSlotProps>;
export declare const CardStat: React.FC<CardStatProps>;
export default Card;
