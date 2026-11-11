import * as React from 'react';

/** ATTRUS BarChart (L-41) — columns per period, series stacked by default
    (preview/components/charts.css .chart-bars). Periods outside `highlightRange`
    drop to 35%. `valueLabel` puts the last column's total above it (the scale
    keeps 15% headroom for it). Mono axis. A sr-only table repeats the numbers. */
export interface BarSeries { label: string; values: number[]; /** CSS colour; default dataviz-cat-N. */ color?: string; }
export interface BarChartProps { labels: string[]; series: BarSeries[]; stacked?: boolean; /** Inclusive [from, to] indexes. */ highlightRange?: [number, number]; valueLabel?: boolean; legend?: boolean; height?: number; format?: (v: number) => string; label: string; className?: string; }

export const BarChart: React.FC<BarChartProps> = ({ labels, series, stacked = true, highlightRange, valueLabel = false, legend = true, height = 160, format = (v) => v.toLocaleString(), label, className }) => {
  const col = (s: BarSeries, i: number) => s.color || 'var(--dataviz-cat-' + ((i % 8) + 1) + ')';
  const tot = labels.map((_, i) => series.reduce((a, s) => a + (s.values[i] || 0), 0));
  const peak = stacked ? Math.max(0, ...tot) : Math.max(0, ...series.flatMap((s) => s.values));
  const max = (peak || 1) * (valueLabel ? 1.15 : 1);
  const inR = (i: number) => !highlightRange || (i >= highlightRange[0] && i <= highlightRange[1]);
  const last = labels.length - 1;
  const lastTop = stacked ? tot[last] : Math.max(0, ...series.map((s) => s.values[last] || 0));
  return (
    <figure className={['chart-bars', className || ''].filter(Boolean).join(' ')}>
      <div className={'chart-bars-plot' + (stacked ? '' : ' is-grouped')} aria-hidden="true" style={{ height }}>
        {labels.map((_, i) => (
          <div key={i} className={'chart-bars-col' + (inR(i) ? '' : ' is-dim')}>
            {series.map((s, j) => <span key={j} className="chart-seg" style={{ ['--seg' as any]: col(s, j), height: ((s.values[i] || 0) / max) * 100 + '%' }} />)}
            {valueLabel && i === last ? <span className="chart-bars-vl chart-num" style={{ bottom: (lastTop / max) * 100 + '%' }}>{format(tot[last])}</span> : null}
          </div>
        ))}
      </div>
      <div className="chart-bars-axis chart-num" aria-hidden="true">{labels.map((l, i) => <span key={i} className={inR(i) ? undefined : 'is-dim'}>{l}</span>)}</div>
      {legend ? <ul className="chart-legend" aria-hidden="true">{series.map((s, j) => <li key={j}><i className="chart-seg" style={{ ['--seg' as any]: col(s, j) }} />{s.label}</li>)}</ul> : null}
      <table className="sr-only">
        <caption>{label}</caption>
        <thead><tr><th scope="col"></th>{series.map((s, j) => <th key={j} scope="col">{s.label}</th>)}</tr></thead>
        <tbody>{labels.map((l, i) => <tr key={i}><th scope="row">{l}</th>{series.map((s, j) => <td key={j}>{format(s.values[i] || 0)}</td>)}</tr>)}</tbody>
      </table>
    </figure>
  );
};
export default BarChart;
