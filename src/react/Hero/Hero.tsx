import * as React from 'react';

/**
 * ATTRUS Hero — the top of a dashboard or a section (preview/components/hero.css).
 * Eyebrow, display title, sub, actions and optional KPI tiles.
 *
 * The dark (dashboard) hero re-points the text and border tokens to the
 * inverse pair, so put DS components in it as they are: actions are
 * <Button variant="inverse"> for the primary and <Button variant="secondary">
 * for the rest — no hero-specific button. `em` in the title takes the
 * product accent.
 */
export type HeroVariant = 'dashboard' | 'subtle';
export type HeroSize = 'compact' | 'default' | 'large';

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** dashboard (default): brand gradient · subtle: light surface inside the app. */
  variant?: HeroVariant;
  /** compact · default · large (large replaces the old "marketing" variant). */
  size?: HeroSize;
  eyebrow?: React.ReactNode;
  /** The heading. Wrap the emphasised word in <em>. */
  title: React.ReactNode;
  sub?: React.ReactNode;
  /** DS Buttons: inverse (primary) + secondary on the dark hero. */
  actions?: React.ReactNode;
  /** <HeroTile> elements. */
  tiles?: React.ReactNode;
  /** Heading level. Default 1. */
  level?: 1 | 2 | 3;
}

export const Hero: React.FC<HeroProps> = ({ variant = 'dashboard', size = 'default', eyebrow, title, sub, actions, tiles, level = 1, className, children, ...rest }) => {
  const H = ('h' + level) as 'h1' | 'h2' | 'h3';
  return (
    <section className={['hero', variant === 'subtle' ? 'is-subtle' : 'hero-ink', size === 'compact' ? 'is-compact' : '', size === 'large' ? 'is-large' : '', className || ''].filter(Boolean).join(' ')} {...rest}>
      {eyebrow != null ? <div className="hero-eyebrow">{eyebrow}</div> : null}
      <H className="hero-title">{title}</H>
      {sub != null ? <p className="hero-sub">{sub}</p> : null}
      {actions != null ? <div className="hero-actions">{actions}</div> : null}
      {tiles != null ? <div className="hero-tiles">{tiles}</div> : null}
      {children}
    </section>
  );
};

export interface HeroTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  /** Leading mark, e.g. <Flag country="EUA" size={16} />. */
  flag?: React.ReactNode;
  value: React.ReactNode;
  /** Change line, e.g. "+2.4% today". */
  delta?: React.ReactNode;
  /** Colours the delta and picks its arrow. */
  trend?: 'up' | 'down' | 'flat';
}

const Arrow: React.FC<{ down?: boolean }> = ({ down }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {down ? <path d="M7 7l10 10M17 7v10H7" /> : <path d="M7 17 17 7M7 7h10v10" />}
  </svg>
);

export const HeroTile: React.FC<HeroTileProps> = ({ label, flag, value, delta, trend = 'flat', className, ...rest }) => (
  <div className={['hero-tile', className || ''].filter(Boolean).join(' ')} {...rest}>
    <span className="hero-tile-k">{flag}{label}</span>
    <span className="hero-tile-v">{value}</span>
    {delta != null ? (
      <span className={['hero-tile-d', trend === 'up' ? 'is-up' : trend === 'down' ? 'is-down' : ''].filter(Boolean).join(' ')}>
        {trend !== 'flat' ? <Arrow down={trend === 'down'} /> : null}{delta}
      </span>
    ) : null}
  </div>
);

export default Hero;
