import * as React from 'react';

export type HeroVariant = 'dashboard' | 'subtle';
export type HeroSize = 'compact' | 'default' | 'large';

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** dashboard (default): brand gradient · subtle: light surface. */
  variant?: HeroVariant;
  /** compact · default · large (replaces "marketing"). */
  size?: HeroSize;
  eyebrow?: React.ReactNode;
  /** Wrap the emphasised word in <em> — it takes the product accent. */
  title: React.ReactNode;
  sub?: React.ReactNode;
  /** DS Buttons: inverse (primary) + secondary on the dark hero. */
  actions?: React.ReactNode;
  /** <HeroTile> elements. */
  tiles?: React.ReactNode;
  /** Heading level. Default 1. */
  level?: 1 | 2 | 3;
}

/** Top of a dashboard or section. The dark hero re-points text/border tokens to the inverse pair. */
export declare const Hero: React.FC<HeroProps>;

export interface HeroTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  /** Leading mark, e.g. <Flag country="EUA" size={16} />. */
  flag?: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  trend?: 'up' | 'down' | 'flat';
}

/** KPI tile inside a Hero. */
export declare const HeroTile: React.FC<HeroTileProps>;
export default Hero;
