import * as React from 'react';
export interface StageProgressProps { steps: number; /** 1-based. */ current: number; late?: boolean; label?: string; className?: string; }
/** Step strip for a table row. */
export declare const StageProgress: React.FC<StageProgressProps>;
export default StageProgress;
