import * as React from 'react';

/** ATTRUS StageProgress (L-29) — the step strip in a table row
    (preview/components/primitives.css .stage-progress). 18×3 segments: done,
    current (warning when late), todo. The accessible name states the step. */
export interface StageProgressProps { steps: number; /** 1-based current step. */ current: number; late?: boolean; label?: string; className?: string; }
export const StageProgress: React.FC<StageProgressProps> = ({ steps, current, late = false, label, className }) => (
  <span className={['stage-progress', className || ''].filter(Boolean).join(' ')} role="img" aria-label={label || ('Step ' + current + ' of ' + steps + (late ? ', late' : ''))}>
    {Array.from({ length: steps }, (_, i) => <i key={i} className={i + 1 < current ? 'is-done' : i + 1 === current ? (late ? 'is-late' : 'is-current') : undefined} />)}
  </span>
);
export default StageProgress;
