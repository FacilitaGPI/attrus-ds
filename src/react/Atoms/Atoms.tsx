import * as React from 'react';

/**
 * ATTRUS Atoms — typed wrappers over primitives.css atoms.
 * Money · Metric · Avatar/AvatarGroup · Eyebrow · Flag · Icon.
 * CSS stays the visual source of truth; these compose class names.
 * (Module named Atoms — "Primitives" collides with the legacy
 * ui_kits/dashboard/Primitives.jsx still consumed by the app.)
 */

/* ---------- Money — mono, inline (tables, rows, receipts) ---------- */

export type MoneySize = 'sm' | 'md' | 'lg' | 'xl' | 'display';
export type MoneyTone = 'pos' | 'neg' | 'muted';

export interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Currency code, dimmed uppercase prefix (e.g. "USD"). */
  cur?: string;
  /** Main figure including separators (e.g. "1,000"). */
  amount: React.ReactNode;
  /** Dimmed decimals, rendered after the amount (e.g. ".00"). */
  frac?: React.ReactNode;
  size?: MoneySize;
  tone?: MoneyTone;
}

export const Money: React.FC<MoneyProps> = ({ cur, amount, frac, size = 'md', tone, className, ...rest }) => (
  <span
    className={['money', size !== 'md' ? `money-${size}` : '', tone ? `money-${tone}` : '', className || '']
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {cur ? <span className="money-cur">{cur}</span> : null}
    {amount}
    {frac != null ? <span className="money-frac">{frac}</span> : null}
  </span>
);

/* ---------- Metric — sans display number (heroes, KPIs) ---------- */

export type MetricSize = 'sm' | 'md' | 'lg';
export type MetricTone = 'pos' | 'neg';

export interface MetricProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Currency code, dimmed prefix. */
  cur?: string;
  /** Main figure (include the trailing dot when using frac: "48,920."). */
  amount: React.ReactNode;
  /** Dimmed decimals (e.g. "56"). */
  frac?: React.ReactNode;
  size?: MetricSize;
  /** Colour inherits by default (works on light + inverse). */
  tone?: MetricTone;
}

export const Metric: React.FC<MetricProps> = ({ cur, amount, frac, size = 'md', tone, className, ...rest }) => (
  <span
    className={['metric', size !== 'md' ? `metric-${size}` : '', tone ? `metric-${tone}` : '', className || '']
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {cur ? <span className="metric-cur">{cur}</span> : null}
    {amount}
    {frac != null ? <span className="metric-frac">{frac}</span> : null}
  </span>
);

/* ---------- Avatar ---------- */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarTone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type AvatarDot = boolean | 'busy' | 'away' | 'off';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full name — initials are derived (first + last word). */
  name?: string;
  /** Image avatar; falls back to initials while absent. */
  src?: string;
  size?: AvatarSize;
  tone?: AvatarTone;
  /** Presence dot: true=online, 'busy' | 'away' | 'off'. */
  dot?: AvatarDot;
}

function initials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', tone = 'brand', dot, className, children, ...rest }) => (
  <span
    className={['av', `av-${size}`, `av-${tone}`, className || ''].filter(Boolean).join(' ')}
    aria-label={name}
    {...rest}
  >
    {src ? <img src={src} alt={name || ''} /> : children != null ? children : initials(name)}
    {dot ? <span className={['av-dot', typeof dot === 'string' ? `av-dot-${dot}` : ''].filter(Boolean).join(' ')} /> : null}
  </span>
);

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Render "+N" overflow chip after the avatars. */
  more?: number;
  /** Size applied to the overflow chip. */
  size?: AvatarSize;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ more, size = 'md', className, children, ...rest }) => (
  <span className={['av-group', className || ''].filter(Boolean).join(' ')} {...rest}>
    {children}
    {more ? <span className={`av av-${size} av-more`}>+{more}</span> : null}
  </span>
);

/* ---------- Eyebrow — uppercase micro-label ---------- */

export type EyebrowSize = 'xs' | 'sm' | 'md';
export type EyebrowTone = 'muted' | 'secondary' | 'default' | 'brand' | 'inverse';

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: EyebrowSize;
  tone?: EyebrowTone;
  /** Inline icon — adds .has-icon for the flex layout. */
  icon?: React.ReactNode;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ size = 'md', tone = 'muted', icon, className, children, ...rest }) => (
  <span
    className={['eyebrow', `eyebrow-${size}`, `eyebrow-${tone}`, icon != null ? 'has-icon' : '', className || '']
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {icon}
    {children}
  </span>
);

/* ---------- Flag — brand flag SVGs from assets/flags ---------- */

export type FlagCountry = 'BR' | 'MX' | 'CO' | 'CL' | 'US' | 'EU';
export type FlagShape = 'rounded' | 'square';

const FLAG_FILE: Record<FlagCountry, string> = {
  BR: 'Brazil',
  MX: 'Mexico',
  CO: 'Colombia',
  CL: 'Chile',
  US: 'EUA',
  EU: 'EUR',
};

export interface FlagProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  country: FlagCountry;
  /** Pixel size (width = height). Default 16. */
  size?: number;
  /** rounded (circular) | square. Default rounded. */
  shape?: FlagShape;
  /** Base path to assets/flags — default works two levels below root
      (component benches and ui_kits/dashboard). Override elsewhere. */
  assetsBase?: string;
}

export const Flag: React.FC<FlagProps> = ({ country, size = 16, shape = 'rounded', assetsBase = '../../assets/flags', style, ...rest }) => (
  <img
    src={`${assetsBase}/${FLAG_FILE[country]}-${shape}.svg`}
    alt={country}
    width={size}
    height={size}
    style={{ borderRadius: shape === 'rounded' ? '50%' : 'var(--radius-2xs)', display: 'inline-block', verticalAlign: '-0.18em', ...style }}
    {...rest}
  />
);

/* ---------- Icon — canonical Lucide glyphs ---------- */

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Lucide name — kebab-case ("arrow-left-right") or PascalCase. */
  name: string;
  /** Pixel size. Default 18. */
  size?: number;
  /** Stroke width. Default 1.75 (matches the system). */
  stroke?: number;
}

type LucideNode = Array<unknown>;

function lucideLookup(name: string): LucideNode | null {
  const lucide = (window as unknown as { lucide?: { icons?: Record<string, LucideNode> } }).lucide;
  if (!lucide || !lucide.icons) return null;
  const pascal = name
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
  return lucide.icons[pascal] || lucide.icons[name] || null;
}

/* Lucide UMD ships two icon-data shapes depending on version:
   - pair list:  [['path', {...}], ['line', {...}]]            (newer)
   - triple:     ['svg', {...attrs}, [['path', {...}], ...]]   (0.4xx)
   Render both, recursively (children may themselves be triples). */
function renderLucideChildren(nodes: unknown, keyPrefix: string): React.ReactNode[] {
  if (!Array.isArray(nodes)) return [];
  return (nodes as Array<unknown>).map((child, i) => {
    if (!Array.isArray(child) || typeof child[0] !== 'string') return null;
    const tag = child[0] as string;
    const attrs = (child[1] && typeof child[1] === 'object' ? child[1] : {}) as Record<string, string>;
    const kids = renderLucideChildren(child[2], `${keyPrefix}${i}-`);
    return React.createElement(tag, { ...attrs, key: `${keyPrefix}${i}` }, kids.length ? kids : undefined);
  });
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, stroke = 1.75, ...rest }) => {
  const node = lucideLookup(name);
  if (!node) return <span style={{ display: 'inline-block', width: size, height: size }} aria-hidden="true" />;
  // Triple form: ['svg', attrs, children] — unwrap to the children list.
  const children =
    node.length >= 2 && node[0] === 'svg' ? (node[2] as unknown) : (node as unknown);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {renderLucideChildren(children, 'n')}
    </svg>
  );
};

/* ---------- Divider ---------- */

export type DividerWeight = 'default' | 'subtle' | 'strong';

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  weight?: DividerWeight;
  dashed?: boolean;
  /** Vertical hairline for inline rows (1px × 1em). */
  vertical?: boolean;
  /** Midline label — renders the `.divider-labelled` layout. */
  label?: React.ReactNode;
}

export const Divider: React.FC<DividerProps> = ({ weight = 'default', dashed = false, vertical = false, label, className, ...rest }) => {
  const mods = [weight !== 'default' ? `divider-${weight}` : '', dashed ? 'divider-dashed' : '', className || ''];
  if (label != null) {
    return (
      <div className={['divider-labelled', ...mods].filter(Boolean).join(' ')} {...rest}>
        <span>{label}</span>
      </div>
    );
  }
  if (vertical) return <span className={['divider-vertical', ...mods].filter(Boolean).join(' ')} {...(rest as React.HTMLAttributes<HTMLSpanElement>)} />;
  return <hr className={['divider', ...mods].filter(Boolean).join(' ')} {...(rest as React.HTMLAttributes<HTMLHRElement>)} />;
};

/* ---------- FilterChip — pill button for filter rows (40px) ---------- */

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected state (aria-pressed + active styling from CSS). */
  selected?: boolean;
  icon?: React.ReactNode;
  /** Trailing dropdown indicator (`.chip-chevron`). */
  chevron?: boolean;
}

export const FilterChip: React.FC<FilterChipProps> = ({ selected = false, icon, chevron = false, className, children, ...rest }) => (
  <button type="button" className={['filter-chip', className || ''].filter(Boolean).join(' ')} aria-pressed={selected} {...rest}>
    {icon}
    {children}
    {chevron ? (
      <svg className="chip-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ) : null}
  </button>
);

/* ---------- ProgressBar — slim track + data-driven fill ---------- */

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. */
  value: number;
  /** Fill color — any token/var; defaults to the CSS fallback. */
  fill?: string;
  /** Track height px — feeds `--progress-h` (default 6). */
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, fill, height, style, className, ...rest }) => (
  <div
    className={['progress', className || ''].filter(Boolean).join(' ')}
    role="progressbar"
    aria-valuenow={Math.round(value)}
    aria-valuemin={0}
    aria-valuemax={100}
    style={{ ...(height != null ? ({ '--progress-h': `${height}px` } as React.CSSProperties) : null), ...style }}
    {...rest}
  >
    <span className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%`, ...(fill ? { background: fill } : null) }} />
  </div>
);

/* ---------- DescTerm — labelled term/definition pair ---------- */

export interface DescTermProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  children?: React.ReactNode;
}

export const DescTerm: React.FC<DescTermProps> = ({ label, className, children, ...rest }) => (
  <div className={['desc-term', className || ''].filter(Boolean).join(' ')} {...rest}>
    <span className="desc-term-label">{label}</span>
    <span className="desc-term-value">{children}</span>
  </div>
);

/* ---------- Stat — standalone KPI tile ---------- */

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
  /** Footnote line (.stat-foot) — context under the figure. */
  foot?: React.ReactNode;
  /** Leading icon beside the label. */
  icon?: React.ReactNode;
  /** No tile chrome (bg/border/padding) — for use INSIDE a Card. */
  bare?: boolean;
  /** Dense paddings (.stat-compact). */
  compact?: boolean;
}

const STAT_ARROW: Record<StatDeltaDirection, string> = { up: '↑ ', down: '↓ ', flat: '' };

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  delta,
  deltaDirection = 'flat',
  foot,
  icon,
  bare = false,
  compact = false,
  className,
  children,
  ...rest
}) => (
  <div
    className={['stat', bare ? 'is-bare' : '', compact ? 'stat-compact' : '', className || ''].filter(Boolean).join(' ')}
    {...rest}
  >
    <span className="stat-label" style={icon != null ? { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' } : undefined}>
      {icon}
      {label}
    </span>
    <span style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
      <span className="stat-value">{value}</span>
      {delta != null ? (
        <span className={`stat-delta stat-delta-${deltaDirection}`}>
          {STAT_ARROW[deltaDirection]}
          {delta}
        </span>
      ) : null}
    </span>
    {foot != null ? <div className="stat-foot">{foot}</div> : null}
    {children}
  </div>
);

export interface StatRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Equal columns — feeds `--stat-cols`. Default 3. */
  cols?: number;
}

export const StatRow: React.FC<StatRowProps> = ({ cols, className, style, children, ...rest }) => (
  <div
    className={['stat-row', className || ''].filter(Boolean).join(' ')}
    style={cols != null ? ({ '--stat-cols': cols, ...style } as React.CSSProperties) : style}
    {...rest}
  >
    {children}
  </div>
);

/* Collection export — the bundler requires the module-name symbol. */
export const Atoms = { Money, Metric, Avatar, AvatarGroup, Eyebrow, Flag, Icon, Divider, FilterChip, ProgressBar, DescTerm, Stat, StatRow };

export default Atoms;
