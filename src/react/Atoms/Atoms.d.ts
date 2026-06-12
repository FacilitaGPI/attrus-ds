import * as React from 'react';

export type MoneySize = 'sm' | 'md' | 'lg' | 'xl' | 'display';
export type MoneyTone = 'pos' | 'neg' | 'muted';
export interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  cur?: string;
  amount: React.ReactNode;
  frac?: React.ReactNode;
  size?: MoneySize;
  tone?: MoneyTone;
}
export declare const Money: React.FC<MoneyProps>;

export type MetricSize = 'sm' | 'md' | 'lg';
export type MetricTone = 'pos' | 'neg';
export interface MetricProps extends React.HTMLAttributes<HTMLSpanElement> {
  cur?: string;
  amount: React.ReactNode;
  frac?: React.ReactNode;
  size?: MetricSize;
  tone?: MetricTone;
}
export declare const Metric: React.FC<MetricProps>;

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarTone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type AvatarDot = boolean | 'busy' | 'away' | 'off';
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  src?: string;
  size?: AvatarSize;
  tone?: AvatarTone;
  dot?: AvatarDot;
}
export declare const Avatar: React.FC<AvatarProps>;

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  more?: number;
  size?: AvatarSize;
}
export declare const AvatarGroup: React.FC<AvatarGroupProps>;

export type EyebrowSize = 'xs' | 'sm' | 'md';
export type EyebrowTone = 'muted' | 'secondary' | 'default' | 'brand' | 'inverse';
export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: EyebrowSize;
  tone?: EyebrowTone;
  icon?: React.ReactNode;
}
export declare const Eyebrow: React.FC<EyebrowProps>;

export type FlagCountry = 'BR' | 'MX' | 'CO' | 'CL' | 'US' | 'EU';
export type FlagShape = 'rounded' | 'square';
export interface FlagProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  country: FlagCountry;
  size?: number;
  shape?: FlagShape;
  assetsBase?: string;
}
export declare const Flag: React.FC<FlagProps>;

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Lucide name — kebab-case ("arrow-left-right") or PascalCase. */
  name: string;
  size?: number;
  stroke?: number;
}
export declare const Icon: React.FC<IconProps>;

export type DividerWeight = 'default' | 'subtle' | 'strong';
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  weight?: DividerWeight;
  dashed?: boolean;
  /** Vertical hairline for inline rows (1px × 1em). */
  vertical?: boolean;
  /** Midline label — renders the `.divider-labelled` layout. */
  label?: React.ReactNode;
}
export declare const Divider: React.FC<DividerProps>;

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected state (aria-pressed). */
  selected?: boolean;
  icon?: React.ReactNode;
  /** Trailing dropdown indicator (`.chip-chevron`). */
  chevron?: boolean;
}
export declare const FilterChip: React.FC<FilterChipProps>;

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. */
  value: number;
  /** Fill color — any token/var. */
  fill?: string;
  /** Track height px — feeds `--progress-h` (default 6). */
  height?: number;
}
export declare const ProgressBar: React.FC<ProgressBarProps>;

export interface DescTermProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  children?: React.ReactNode;
}
export declare const DescTerm: React.FC<DescTermProps>;

export type StatDeltaDirection = 'up' | 'down' | 'flat';
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono overline label. */
  label: React.ReactNode;
  /** Big tabular figure. */
  value: React.ReactNode;
  /** Delta text, e.g. "+8.2%". Arrow glyph derives from deltaDirection. */
  delta?: React.ReactNode;
  /** up=success ↑ · down=danger ↓ · flat=muted. Default: 'flat'. */
  deltaDirection?: StatDeltaDirection;
  /** Footnote line (.stat-foot). */
  foot?: React.ReactNode;
  /** Leading icon beside the label. */
  icon?: React.ReactNode;
  /** No tile chrome — for use inside a Card (.stat.is-bare). */
  bare?: boolean;
  /** Dense paddings (.stat-compact). */
  compact?: boolean;
}
export declare const Stat: React.FC<StatProps>;

export interface StatRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Equal columns — feeds `--stat-cols`. Default 3. */
  cols?: number;
}
export declare const StatRow: React.FC<StatRowProps>;

export declare const Atoms: {
  Money: React.FC<MoneyProps>;
  Metric: React.FC<MetricProps>;
  Avatar: React.FC<AvatarProps>;
  AvatarGroup: React.FC<AvatarGroupProps>;
  Eyebrow: React.FC<EyebrowProps>;
  Flag: React.FC<FlagProps>;
  Icon: React.FC<IconProps>;
  Divider: React.FC<DividerProps>;
  FilterChip: React.FC<FilterChipProps>;
  ProgressBar: React.FC<ProgressBarProps>;
  DescTerm: React.FC<DescTermProps>;
  Stat: React.FC<StatProps>;
  StatRow: React.FC<StatRowProps>;
};

export default Atoms;
