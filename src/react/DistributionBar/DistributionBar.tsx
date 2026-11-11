import * as React from 'react';
import { TrackBadge } from '../TrackBadge/TrackBadge';

/** ATTRUS DistributionBar (L-39) — a total split into parts as one 100% bar
    (preview/components/charts.css .chart-dist). Legend below: key · name · value · %.
    `key` = a track renders a TrackBadge and takes the track colour; otherwise a dot in `color`.
    A non-zero part under 1% reads "<1%". */
export type DistributionTrack = 'corporate' | 'enterprise' | 'business';
export interface DistributionSegment { label: string; value: number; color?: string; key?: DistributionTrack; }
export interface DistributionBarProps { segments: DistributionSegment[]; legend?: boolean; format?: (v: number) => React.ReactNode; label?: string; className?: string; }
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');
export const trackColor = (k: DistributionTrack) => 'var(--color-track-' + k + ')';
export const pct = (v: number, t: number) => { const p = t ? Math.round((v / t) * 100) : 0; return v > 0 && p < 1 ? '<1%' : p + '%'; };
const num = (v: number) => v.toLocaleString();

export const DistributionBar: React.FC<DistributionBarProps> = ({ segments, legend = true, format = num, label, className }) => {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const colorOf = (s: DistributionSegment) => s.color || (s.key ? trackColor(s.key) : 'var(--dataviz-cat-8)');
  return (
    <div className={cx('chart-dist', className)}>
      <div className="chart-dist-bar" role="img" aria-label={label || segments.map((s) => s.label + ' ' + String(format(s.value)) + ' (' + pct(s.value, total) + ')').join(', ')}>
        {segments.filter((s) => s.value > 0).map((s, i) => <span key={i} className="chart-seg" style={{ ['--seg' as any]: colorOf(s), flex: s.value + ' 1 0' }} />)}
      </div>
      {legend ? (
        <ul className="chart-dist-legend" aria-hidden="true">
          {segments.map((s, i) => (
            <li key={i}>
              <span className="chart-dist-key">{s.key ? <TrackBadge track={s.key} aria-label={undefined} /> : <span className="chart-dist-dot" style={{ background: colorOf(s) }} />}</span>
              <span className="chart-dist-name">{s.label}</span>
              <span className="chart-dist-val chart-num">{format(s.value)}</span>
              <span className="chart-dist-pct chart-num">{pct(s.value, total)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
export default DistributionBar;
