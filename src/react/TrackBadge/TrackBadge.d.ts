import * as React from 'react';

export type Track = 'corporate' | 'enterprise' | 'business';

export interface TrackBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  track: Track;
  /** Visible short code. Default CORP / ENT / BIZ. */
  label?: React.ReactNode;
}

/** Client track tag (CORP · ENT · BIZ), white caps on the track colour. */
export declare const TrackBadge: React.FC<TrackBadgeProps>;
export default TrackBadge;
