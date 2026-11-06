import * as React from 'react';
export interface StageDistributionStage { key: string; count: number; }
export interface StageDistributionProps { stages: StageDistributionStage[]; color: string; label?: string; className?: string; }
/** Compact funnel: width by count, key + count under each part, shaded 100% → 32%. */
export declare const StageDistribution: React.FC<StageDistributionProps>;
export default StageDistribution;
