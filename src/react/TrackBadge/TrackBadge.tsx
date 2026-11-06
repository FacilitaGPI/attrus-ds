import * as React from 'react';

/**
 * ATTRUS TrackBadge — the client's track (CORP · ENT · BIZ) as a small filled
 * tag with white caps (preview/components/track-badge.css). Identity, not
 * state: the colour is the track's own token, the same in every product.
 * Pass `label` to override the short code; the full track name is the
 * accessible name.
 */
export type Track = 'corporate' | 'enterprise' | 'business';

export interface TrackBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  track: Track;
  /** Visible short code. Default CORP / ENT / BIZ. */
  label?: React.ReactNode;
}

const CODE: Record<Track, string> = { corporate: 'Corp', enterprise: 'Ent', business: 'Biz' };
const NAME: Record<Track, string> = { corporate: 'Corporate', enterprise: 'Enterprise', business: 'Business' };

export const TrackBadge: React.FC<TrackBadgeProps> = ({ track, label, className, title, ...rest }) => (
  <span className={['track-badge', 'track-' + track, className || ''].filter(Boolean).join(' ')} title={title ?? NAME[track]} aria-label={NAME[track]} {...rest}>
    {label ?? CODE[track]}
  </span>
);

export default TrackBadge;
