import * as React from 'react';
export type DistributionTrack = 'corporate' | 'enterprise' | 'business';
export interface DistributionSegment { label: string; value: number; /** CSS colour; defaults to the track colour when `key` is set. */ color?: string; /** Renders a TrackBadge in the legend. */ key?: DistributionTrack; }
export interface DistributionBarProps { segments: DistributionSegment[]; /** Default true. */ legend?: boolean; format?: (v: number) => React.ReactNode; /** Accessible name; default lists every part. */ label?: string; className?: string; }
/** 100% stacked bar with key · name · value · % legend. */
export declare const DistributionBar: React.FC<DistributionBarProps>;
export default DistributionBar;
