import * as React from 'react';

/**
 * ATTRUS Callout — typed wrapper over the canonical `.callout` system
 * (preview/components/callout.css). Scales from a one-line note up to a
 * rich panel (title + body + actions + dismiss) and a full-width alert bar.
 * CSS stays the visual source of truth.
 *
 * Action buttons convention: keep them SMALL and DISCREET — Button
 * size="xs" with ghost/tertiary/secondary; reserve solid fills and
 * danger for destructive actions.
 */

export type CalloutTone = 'info' | 'warn' | 'success' | 'danger' | 'neutral';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Semantic tone. Default 'info' (brand royal tint). */
  tone?: CalloutTone;
  /** Compact density for dense panels & forms. */
  small?: boolean;
  /** Leading icon slot (18px, 16px when small). */
  icon?: React.ReactNode;
  /** Bold heading line — wraps content in the rich vertical layout. */
  title?: React.ReactNode;
  /** Action row (canonical Buttons). Implies the rich layout. */
  actions?: React.ReactNode;
  /** Full-width alert bar: centered row, left accent rule, actions inline-right. */
  bar?: boolean;
  /** On a bar: re-adds radius + full border for in-container use. */
  rounded?: boolean;
  /** Content-sized, single line (badges, hero notices). */
  inline?: boolean;
  /** Glassy translucent tint + light text for dark surfaces. */
  onInverse?: boolean;
  /** When set, renders the × dismiss button and calls back on click. */
  onDismiss?: () => void;
}

const DismissGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export const Callout: React.FC<CalloutProps> = ({
  tone = 'info',
  small = false,
  icon,
  title,
  actions,
  bar = false,
  rounded = false,
  inline = false,
  onInverse = false,
  onDismiss,
  className,
  children,
  ...rest
}) => {
  const cls = [
    'callout',
    `callout-${tone}`, /* always emitted — .callout-info pairs with .on-inverse in CSS */
    small ? 'callout-sm' : '',
    bar ? 'callout-bar' : '',
    bar && rounded ? 'callout-rounded' : '',
    inline ? 'callout-inline' : '',
    onInverse ? 'on-inverse' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const rich = Boolean(title || actions);
  const body = children != null ? <div className="callout-body">{children}</div> : null;

  return (
    <div className={cls} role={tone === 'danger' ? 'alert' : 'status'} {...rest}>
      {icon}
      {rich ? (
        <div className="callout-content">
          {title ? <div className="callout-title">{title}</div> : null}
          {body}
          {actions ? <div className="callout-actions">{actions}</div> : null}
        </div>
      ) : (
        body
      )}
      {onDismiss ? (
        <button type="button" className="callout-dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <DismissGlyph />
        </button>
      ) : null}
    </div>
  );
};

export default Callout;
