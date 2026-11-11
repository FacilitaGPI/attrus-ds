import * as React from 'react';
export interface SparklineProps { values: number[]; /** Default brand. */ tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'; /** Default bars. */ variant?: 'bars' | 'line'; /** Exposes it as an image; otherwise aria-hidden. */ label?: string; className?: string; }
/** Mini bar/line chart under a KPI. */
export declare const Sparkline: React.FC<SparklineProps>;
export default Sparkline;
