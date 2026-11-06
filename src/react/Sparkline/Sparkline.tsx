import * as React from 'react';

/** ATTRUS Sparkline (L-42) — a mini chart under a KPI (preview/components/charts.css
    .spark). bars: 6px bars, gap 2, up to 18px, only the last in the tone. line:
    54×18, 1.5px, dot on the last value. Decorative by default (aria-hidden):
    the KPI next to it carries the number; pass `label` to expose it. */
export interface SparklineProps { values: number[]; tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'; variant?: 'chart-bars' | 'line'; label?: string; className?: string; }

export const Sparkline: React.FC<SparklineProps> = ({ values, tone = 'brand', variant = 'chart-bars', label, className }) => {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  const max = Math.max(...values), min = Math.min(...values);
  if (variant === 'line') {
    const w = 54, h = 18, n = Math.max(values.length - 1, 1);
    const pts = values.map((v, i) => [(i / n) * w, h - 1 - ((v - min) / (max - min || 1)) * (h - 2)]);
    const l = pts[pts.length - 1] || [0, h / 2];
    return (
      <svg className={['chart-spark-line', 'tone-' + tone, className || ''].filter(Boolean).join(' ')} viewBox="0 0 54 18" {...a11y}>
        <polyline points={pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={l[0]} cy={l[1]} r={2} fill="currentColor" />
      </svg>
    );
  }
  return (
    <span className={['chart-spark', 'tone-' + tone, className || ''].filter(Boolean).join(' ')} {...a11y}>
      {values.map((v, i) => <i key={i} style={{ height: Math.max(2, Math.round((v / (max || 1)) * 18)) }} />)}
    </span>
  );
};
export default Sparkline;
