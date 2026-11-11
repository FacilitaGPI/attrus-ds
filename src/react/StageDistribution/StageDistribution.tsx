import * as React from 'react';

/** ATTRUS StageDistribution (L-40) — the compact funnel: one part per stage,
    width by count, "01 58" under each, shades of `color` from 100% to 32%
    mixed with the surface (preview/components/charts.css .chart-stagedist). */
export interface StageDistributionStage { key: string; count: number; }
export interface StageDistributionProps { stages: StageDistributionStage[]; /** CSS colour, usually var(--color-track-*). */ color: string; label?: string; className?: string; }

export const StageDistribution: React.FC<StageDistributionProps> = ({ stages, color, label, className }) => {
  const n = stages.length;
  return (
    <div className={['chart-stagedist', className || ''].filter(Boolean).join(' ')} role="img" aria-label={label || stages.map((s) => 'Stage ' + s.key + ': ' + s.count).join(', ')}>
      {stages.map((s, i) => {
        const p = n > 1 ? Math.round(100 - (68 * i) / (n - 1)) : 100;
        return (
          <div key={s.key} className="chart-stagedist-col" style={{ flex: Math.max(s.count, 0) + ' 1 0' }}>
            <span className="chart-seg" style={{ ['--seg' as any]: 'color-mix(in srgb, ' + color + ' ' + p + '%, var(--color-background-surface))' }} />
            <span className="chart-stagedist-lbl chart-num" aria-hidden="true"><span className="k">{s.key}</span><span className="v">{s.count}</span></span>
          </div>
        );
      })}
    </div>
  );
};
export default StageDistribution;
