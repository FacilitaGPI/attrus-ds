import * as React from 'react';
export interface BarSeries { label: string; values: number[]; color?: string; }
export interface BarChartProps { labels: string[]; series: BarSeries[]; /** Default true; false sets series side by side. */ stacked?: boolean; highlightRange?: [number, number]; valueLabel?: boolean; legend?: boolean; /** Plot height in px. Default 160. */ height?: number; format?: (v: number) => string; /** Caption of the sr-only table. */ label: string; className?: string; }
/** Stacked (or grouped) column chart on dataviz tokens. */
export declare const BarChart: React.FC<BarChartProps>;
export default BarChart;
