import * as React from 'react';

/**
 * ATTRUS AmbientBackdrop — typed wrapper over the canonical `.ambient`
 * (preview/components/ambient.css): the official decorative layer of soft
 * radial brand blobs behind hero / marketing content.
 *
 * Use this instead of hand-rolling radial gradients on every landing: the blobs
 * derive from the product's brand + accent tokens, the readability scrim is
 * built in (mandatory — copy drops below AA over a bare blob), and motion
 * respects prefers-reduced-motion.
 */
export interface AmbientBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** How many blobs to render (1–3). */
  blobs?: 1 | 2 | 3;
  /** Blob opacity preset. */
  intensity?: 'subtle' | 'default' | 'strong';
  /** Dark hero: ink background + ink scrim. */
  onInverse?: boolean;
  /** Drop the readability veil. Only for purely decorative strips with no text. */
  noScrim?: boolean;
}

export const AmbientBackdrop: React.FC<AmbientBackdropProps> = ({
  children,
  blobs = 2,
  intensity = 'default',
  onInverse = false,
  noScrim = false,
  className,
  ...rest
}) => {
  const cls = [
    'ambient',
    intensity === 'subtle' ? 'is-subtle' : '',
    intensity === 'strong' ? 'is-strong' : '',
    onInverse ? 'on-inverse' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} {...rest}>
      {Array.from({ length: blobs }, (_, i) => (
        <div key={i} className={`ambient-blob is-${i + 1}`} aria-hidden="true" />
      ))}
      {noScrim ? null : <div className="ambient-scrim" aria-hidden="true" />}
      <div className="ambient-content">{children}</div>
    </div>
  );
};

export default AmbientBackdrop;
