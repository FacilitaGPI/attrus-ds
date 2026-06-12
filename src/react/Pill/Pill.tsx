import * as React from 'react';

/**
 * ATTRUS Pill — typed wrapper over the canonical `.pill` system
 * (preview/components/status-pills.css). CSS stays the visual source
 * of truth; this component only composes class names.
 */

export type PillTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
export type PillSize = 'sm' | 'md' | 'lg';
export type PillAppearance = 'soft' | 'solid' | 'outline';

export interface PillProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic tone. Variant carries meaning; label is required. Default: 'neutral'. */
  tone?: PillTone;
  /** sm=20px, md=24px (default), lg=28px. */
  size?: PillSize;
  /** soft (tinted, default) | solid (filled) | outline (transparent bg). */
  appearance?: PillAppearance;
  /** Leading status dot (decorative — meaning lives in label + tone). */
  dot?: boolean;
  /** Leading icon slot. */
  icon?: React.ReactNode;
  /** Renders a <button> with hover/focus/selected states (filter chips). */
  interactive?: boolean;
  /** Selected state for interactive pills (sets aria-pressed). */
  selected?: boolean;
  /** Glassy translucent treatment for dark surfaces. */
  onInverse?: boolean;
  /** Renders the trailing close (×) — `.pill-x` — and calls back on click (removable filter chips). */
  onRemove?: (e: React.MouseEvent) => void;
  /** Dimmed, non-interactive. */
  disabled?: boolean;
}

export const Pill: React.FC<PillProps> = ({
  tone = 'neutral',
  size = 'md',
  appearance = 'soft',
  dot = false,
  icon,
  interactive = false,
  selected = false,
  onInverse = false,
  onRemove,
  disabled = false,
  className,
  children,
  ...rest
}) => {
  const cls = [
    'pill',
    tone,
    size !== 'md' ? size : '',
    appearance !== 'soft' ? appearance : '',
    interactive ? 'interactive' : '',
    onInverse ? 'on-inverse' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <React.Fragment>
      {dot ? <span className="dot" /> : null}
      {icon}
      {children != null ? <span className="pill-label">{children}</span> : null}
      {onRemove ? (
        <span
          className="pill-x"
          role="button"
          tabIndex={0}
          aria-label="Remove"
          onClick={(e) => { e.stopPropagation(); onRemove(e); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onRemove(e as unknown as React.MouseEvent); } }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
        </span>
      ) : null}
    </React.Fragment>
  );

  if (interactive) {
    return (
      <button
        type="button"
        className={cls}
        aria-pressed={selected}
        disabled={disabled}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={cls} aria-disabled={disabled || undefined} {...rest}>
      {content}
    </span>
  );
};

export default Pill;
