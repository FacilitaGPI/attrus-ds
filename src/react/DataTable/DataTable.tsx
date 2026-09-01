import * as React from 'react';

/**
 * ATTRUS DataTable — typed wrapper over the canonical `.dt` system
 * (preview/components/table.css). CSS stays the visual source of truth.
 *
 * Renders the full anatomy: .dt-wrap > [.dt-toolbar] + .dt-responsive >
 * table.dt + [.dt-pagination]. Below 560px (container query) rows
 * collapse to label:value cards — string headers feed each td's
 * data-label automatically.
 */

/* Is this slot content already the canonical bar? Compared by displayName rather
   than identity: DTPagination is declared after DataTable, and a name also
   survives a caller re-exporting the component. */
function isOwn(node: React.ReactNode, name: string): boolean {
  return React.isValidElement(node) && (node.type as { displayName?: string })?.displayName === name;
}

export type SortDir = 'asc' | 'desc';
export type DataTableSize = 'sm' | 'md' | 'lg';
export type RowState = 'muted' | 'error' | undefined;

export interface DataTableColumn<T> {
  /** Unique column id — also what onSort receives. */
  key: string;
  /** Column header. Strings also become the responsive data-label. */
  header: React.ReactNode;
  /** Right-aligned tabular numerals (.dt-num). */
  numeric?: boolean;
  /** Monospace identifier (.dt-id). */
  id?: boolean;
  /** Strike this cell's figure through: the amount is annulled (cancelled,
      reversed, voided) while the ROW itself is still live. A fully cancelled row
      uses `rowState: 'muted'`, which strikes its numeric cells for free. Only
      meaningful on a numeric column — striking a name reads as damage. */
  isVoid?: (row: T) => boolean;
  /** Sortable header (.dt-th-sort with chevron). */
  sortable?: boolean;
  /** Cell renderer — defaults to String(row[key]). */
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  /** Stable row identity. */
  rowKey: (row: T) => string;
  /** Makes rows hoverable + clickable (tr.hov). */
  onRowClick?: (row: T) => void;
  /** Row tint: 'muted' (cancelled) or 'error' (danger). */
  rowState?: (row: T) => RowState;
  /** Keys of persistently selected rows (.is-selected). */
  selectedKeys?: string[];
  /** Renders the `.col-select` checkbox column; called with the row key. Pair with selectedKeys. */
  onSelectToggle?: (key: string) => void;
  /** Header checkbox — toggle all (checked when every row key is in selectedKeys). */
  onSelectAll?: () => void;
  /** Loading state — renders `.dt-skeleton` shimmer rows instead of the body. */
  loading?: boolean;
  /** How many skeleton rows. Default 4. */
  loadingRows?: number;
  /** sm | md (default) | lg — .dt-sm / .dt-lg. */
  size?: DataTableSize;
  zebra?: boolean;
  sticky?: boolean;
  bordered?: boolean;
  /** Dark-surface treatment (.dt.on-inverse). */
  onInverse?: boolean;
  /** Toolbar slot (.dt-toolbar) above the table. */
  toolbar?: React.ReactNode;
  /** Pagination slot (.dt-pagination) below the table. */
  pagination?: React.ReactNode;
  /** Surrounding card (.dt-wrap). Default true; disable inside a Card. */
  wrap?: boolean;
  /** Responsive card-collapse wrapper (.dt-responsive). Default true. */
  responsive?: boolean;
  /** Zero state when rows is empty. */
  empty?: { icon?: React.ReactNode; title: React.ReactNode; sub?: React.ReactNode };
  /** Controlled sorting (visual). */
  sortKey?: string;
  sortDir?: SortDir;
  onSort?: (key: string) => void;
  className?: string;
  style?: React.CSSProperties;
  /** Row scale. */
  size?: 'sm' | 'md' | 'lg';
  /** Vertical rules between columns — for dense numeric grids only. */
  bordered?: boolean;
  /** Alternating row tint. Prefer plain rows; zebra competes with row states. */
  zebra?: boolean;
  /** Sticky header. Requires a bounded height, so wrap in DTScrollY. */
  sticky?: boolean;
}

/* Two arrows stacked in a clipped slot; `.chev-track` slides between them so the
   direction change keeps an arrow pointing the whole way. A single chevron
   rotated 180° also reads, but it spins through horizontal — a frame where the
   glyph points at neither value. */
const Chev: React.FC = () => (
  <span className="chev" aria-hidden="true">
    <span className="chev-track">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  </span>
);

const SelectBox: React.FC<{ checked: boolean; onChange: () => void; label: string }> = ({ checked, onChange, label }) => (
  <label className="check" onClick={(e) => e.stopPropagation()}>
    <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
    <span className="check-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  </label>
);

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  rowState,
  selectedKeys,
  onSelectToggle,
  onSelectAll,
  loading = false,
  loadingRows = 4,
  size = 'md',
  zebra = false,
  sticky = false,
  bordered = false,
  onInverse = false,
  toolbar,
  pagination,
  wrap = true,
  responsive = true,
  empty,
  sortKey,
  sortDir,
  onSort,
  className,
  style,
}: DataTableProps<T>): React.ReactElement {
  const tableCls = [
    'dt',
    size ? 'dt-' + size : '',
    bordered ? 'dt-bordered' : '',
    zebra ? 'dt-zebra' : '',
    sticky ? 'dt-sticky' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const selectable = Boolean(onSelectToggle);
  const colCount = columns.length + (selectable ? 1 : 0);
  const allSelected = selectable && rows.length > 0 && rows.every((r) => (selectedKeys || []).indexOf(rowKey(r)) !== -1);

  const SKW = ['w-lg', 'w-md', 'w-sm'];
  const table = (
    <table className={tableCls} aria-busy={loading || undefined}>
      <thead>
        <tr>
          {selectable ? (
            <th className="col-select">
              {onSelectAll ? <SelectBox checked={allSelected} onChange={onSelectAll} label="Select all rows" /> : null}
            </th>
          ) : null}
          {columns.map((c) => {
            /* The control is a <button>, not the <th> with onClick: a click
               handler on a header cell is unreachable by keyboard and announces
               nothing, and sorting is the one table action a keyboard user needs
               most. The th keeps aria-sort (the ARIA home for sort state) and
               `.dt-num`; the button carries `.dt-th-sort` and the chevron. */
            const sortCls = c.sortable
              ? ['dt-th-sort', sortKey === c.key && sortDir === 'asc' ? 'is-asc' : '', sortKey === c.key && sortDir === 'desc' ? 'is-desc' : '']
                  .filter(Boolean)
                  .join(' ')
              : undefined;
            return (
              <th
                key={c.key}
                className={c.numeric ? 'dt-num' : undefined}
                aria-sort={c.sortable ? (sortKey === c.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
              >
                {c.sortable ? (
                  <button type="button" className={sortCls} onClick={onSort ? () => onSort(c.key) : undefined}>
                    {c.header}
                    <Chev />
                  </button>
                ) : (
                  c.header
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          Array.from({ length: loadingRows }, (_, i) => (
            <tr key={`sk-${i}`} className="dt-skeleton" aria-hidden="true">
              {selectable ? <td className="col-select"><span className="w-sm" style={{ width: 16 }} /></td> : null}
              {columns.map((c, ci) => (
                <td key={c.key}><span className={SKW[(i + ci) % SKW.length]} /></td>
              ))}
            </tr>
          ))
        ) : rows.length === 0 && empty ? (
          <tr className="dt-empty">
            <td colSpan={colCount}>
              {empty.icon ? <span className="ic">{empty.icon}</span> : null}
              <span className="ttl">{empty.title}</span>
              {empty.sub ? <span className="sub">{empty.sub}</span> : null}
            </td>
          </tr>
        ) : (
          rows.map((row) => {
            const k = rowKey(row);
            const state = rowState ? rowState(row) : undefined;
            const cls = [
              onRowClick ? 'hov' : '',
              state === 'muted' ? 'is-muted' : '',
              state === 'error' ? 'is-error' : '',
              selectedKeys && selectedKeys.indexOf(k) !== -1 ? 'is-selected' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <tr
                key={k}
                className={cls || undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {selectable ? (
                  <td className="col-select" data-label="">
                    <SelectBox
                      checked={(selectedKeys || []).indexOf(k) !== -1}
                      onChange={() => onSelectToggle!(k)}
                      label="Select row"
                    />
                  </td>
                ) : null}
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={[c.numeric ? 'dt-num' : '', c.id ? 'dt-id' : '', c.isVoid && c.isVoid(row) ? 'is-void' : ''].filter(Boolean).join(' ') || undefined}
                    data-label={typeof c.header === 'string' ? c.header : undefined}
                  >
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );

  const inner = responsive ? <div className="dt-responsive">{table}</div> : table;

  if (!wrap) return inner;

  return (
    <div className={['dt-wrap', className || ''].filter(Boolean).join(' ')} style={style}>
      {/* Same rule as the pagination slot: DTToolbar already IS a .dt-toolbar,
          so wrapping it would nest two bars and the inner one would shrink-wrap. */}
      {toolbar ? (isOwn(toolbar, 'DTToolbar') ? toolbar : <div className="dt-toolbar">{toolbar}</div>) : null}
      {inner}
      {/* The slot does NOT wrap: DTPagination already IS a .dt-pagination, and
          wrapping it produced a 958px footer holding a 438px footer — the inner
          one shrink-wrapped and sat left, so the pager looked bunched even though
          its own margin-left:auto was working. Raw children still get the frame,
          which is what the slot is for. */}
      {pagination ? (isOwn(pagination, 'DTPagination') ? pagination : <div className="dt-pagination">{pagination}</div>) : null}
    </div>
  );
}

export default DataTable;

/* ----------------------------------------------------------------
   Typed cell-pattern helpers — compose inside a column's render().
   ---------------------------------------------------------------- */

/** Stacked primary + secondary lines — `.dt-cell-stack` (.pri / .sub). */
export const DTCellStack: React.FC<{ pri: React.ReactNode; sec?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>> = ({ pri, sec, className, ...rest }) => (
  <div className={['dt-cell-stack', className || ''].filter(Boolean).join(' ')} {...rest}>
    <span className="pri">{pri}</span>
    {sec != null ? <span className="sub">{sec}</span> : null}
  </div>
);

/** Leading avatar/icon + stacked label — `.dt-cell-lead`. */
export const DTCellLead: React.FC<{ lead: React.ReactNode; pri: React.ReactNode; sec?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>> = ({ lead, pri, sec, className, ...rest }) => (
  <div className={['dt-cell-lead', className || ''].filter(Boolean).join(' ')} {...rest}>
    {lead}
    <div className="dt-cell-stack">
      <span className="pri">{pri}</span>
      {sec != null ? <span className="sub">{sec}</span> : null}
    </div>
  </div>
);

/** Group separator — a full-width overline that labels the rows beneath it.
    It is a LABEL, not data: it carries no row state, no hover, and spans every
    column, so `colSpan` must match the table's column count. */
export interface DTGroupDividerProps extends React.HTMLAttributes<HTMLTableRowElement> {
  label: React.ReactNode;
  colSpan: number;
  /** Optional right-aligned aggregate ("4 payouts · −$18,750.00"). */
  meta?: React.ReactNode;
}
export function DTGroupDivider(props: DTGroupDividerProps): React.ReactElement {
  const { label, colSpan, meta, className, ...rest } = props;
  return (
    <tr className={['dt-row-divider', className || ''].filter(Boolean).join(' ')} {...rest}>
      <td colSpan={colSpan}>
        {label}
        {meta != null ? <span className="dt-row-divider-meta">{meta}</span> : null}
      </td>
    </tr>
  );
}

/** Detail panel — a child row that keeps its OWN columns instead of borrowing
    the parent's. Use when the child data shares no schema with the row above
    (an audit trail under a payment); use a subrow when it does. The parent must
    carry `has-detail` so its bottom border is dropped and the pair reads as
    one block. */
export interface DTDetailProps extends React.HTMLAttributes<HTMLTableRowElement> {
  colSpan: number;
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
}
export function DTDetail(props: DTDetailProps): React.ReactElement {
  const { colSpan, open, title, children, className, ...rest } = props;
  return (
    <tr className={['dt-detail', open ? 'is-open' : '', className || ''].filter(Boolean).join(' ')} {...rest}>
      <td colSpan={colSpan}>
        <div className="dt-detail-body">
          {title != null ? <div className="dt-detail-title">{title}</div> : null}
          {children}
        </div>
      </td>
    </tr>
  );
}

/** Table chrome — the bar above the data. Three zones with fixed roles: lead
    carries identity, filters the middle, actions cluster right via
    margin-left:auto (never a flex:1 spacer, which collapses the lead).
    `selecting` is the same bar in another state, not a second bar — the height
    is preserved so the table does not jump when the first row is ticked. */
export interface DTToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  lead?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  selecting?: boolean;
  size?: 'md' | 'sm';
}
export function DTToolbar(props: DTToolbarProps): React.ReactElement {
  const { lead, filters, actions, selecting, size, className, ...rest } = props;
  const cls = ['dt-toolbar', size === 'sm' ? 'dt-toolbar-sm' : '', selecting ? 'is-selecting' : '', className || ''].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {lead != null ? <div className="dt-toolbar-lead">{lead}</div> : null}
      {filters != null ? <div className="dt-toolbar-filters">{filters}</div> : null}
      {actions != null ? <div className="dt-toolbar-actions">{actions}</div> : null}
    </div>
  );
}

/** Clickable key-value card inside a detail panel. */
export function DTDetailCard(props: React.ButtonHTMLAttributes<HTMLButtonElement>): React.ReactElement {
  const { children, className, ...rest } = props;
  return <button type="button" className={['dt-detail-card', className || ''].filter(Boolean).join(' ')} {...rest}>{children}</button>;
}

/** Lead cell of a subrow — connector glyph, optional mini icon tile, label.
    The glyph is a CSS ::before so it is neither copied with the text nor
    announced as a character. `parentName` renders a visually-hidden prefix:
    native table semantics carry no hierarchy, so the relationship is stated in
    CONTENT rather than by claiming role="treegrid" without its keyboard model. */
export const DTSubrowLead: React.FC<{
  label: React.ReactNode;
  icon?: React.ReactNode;
  parentName?: string;
} & React.HTMLAttributes<HTMLDivElement>> = ({ label, icon, parentName, className, ...rest }) => (
  <div className={['dt-subrow-lead', className || ''].filter(Boolean).join(' ')} {...rest}>
    {icon != null ? <span className="ic-mini">{icon}</span> : null}
    <span className="txt">
      {parentName ? <span className="sr-only">{'Item of ' + parentName + ': '}</span> : null}
      {label}
    </span>
  </div>
);

/** Disclosure control for a collapsible subrow group — put it in the parent's
    lead cell. Wire `controls` to the subrow's id so `aria-controls` resolves. */
export const DTSubrowToggle: React.FC<{
  expanded: boolean;
  onToggle: () => void;
  controls: string;
  /** Announced as "Show 2 items" / "Hide 2 items". */
  count?: number;
  label?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-expanded'>> = ({
  expanded, onToggle, controls, count, label, className, ...rest
}) => (
  <button
    type="button"
    className={['dt-subrow-toggle', className || ''].filter(Boolean).join(' ')}
    aria-expanded={expanded}
    aria-controls={controls}
    aria-label={(expanded ? 'Hide' : 'Show') + ' ' + (count != null ? count + ' ' : '') + (label || 'linked items')}
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    {...rest}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </button>
);

/** Animated wrapper for a collapsible subrow's cell content. A <tr> cannot be
    animated and display:grid on a <td> breaks column alignment, so the height
    transition lives here: a grid going 0fr -> 1fr, which needs no magic pixel
    value and therefore survives a two-line subrow on mobile. */
export const DTSubrowCell: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...rest }) => (
  <div className="dt-subrow-inner" {...rest}>
    <div className={['dt-subrow-cell', className || ''].filter(Boolean).join(' ')}>{children}</div>
  </div>
);

/** Round tone badge inside a cell — `.ic-round`.
    Leading answers "what kind of row is this" and is scanned DOWN the column, so
    keep one icon per kind. Trailing annotates the label itself ("verified", "has
    a note") and hugs the text rather than floating to the cell edge, where it
    would read as another column. Reach for a Pill when the state needs a word;
    a badge only when the icon is unambiguous on its own. */
export interface DTBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  tone?: 'success' | 'warning' | 'danger' | 'info';
  /** After the label instead of before it. */
  trailing?: boolean;
  size?: 'sm' | 'md';
}
export const DTBadge: React.FC<DTBadgeProps> = ({ children, tone, trailing, size = 'md', className, ...rest }) => (
  <span
    className={['ic-round', tone ? 'tone-' + tone : '', trailing ? 'is-trailing' : '', size === 'sm' ? 'is-sm' : '', className || ''].filter(Boolean).join(' ')}
    aria-hidden="true"
    {...rest}
  >
    {children}
  </span>
);

/** Trend delta inside a cell — `.stat-delta`.
    Use when the COMPARISON is the point; when the amount is the point, use
    `.dt-num` and put the delta in its own column. Direction is carried by the
    arrow and the sign, never by colour alone — and `flat` is worth rendering,
    because an empty cell reads as missing data rather than "unchanged". Down is
    not automatically bad: label the polarity when it is ambiguous. */
export interface DTDeltaProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  direction: 'up' | 'down' | 'flat';
  /** Screen-reader phrasing, e.g. "up 12.4% versus last month". */
  label?: string;
}
export const DTDelta: React.FC<DTDeltaProps> = ({ children, direction, label, className, ...rest }) => {
  const path = direction === 'up' ? 'm3 17 6-6 4 4 8-8' : direction === 'down' ? 'm3 7 6 6 4-4 8 8' : 'M5 12h14';
  return (
    <span className={['stat-delta', 'stat-delta-' + direction, className || ''].filter(Boolean).join(' ')} {...rest}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={path} />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
      {children}
    </span>
  );
};

/** Trailing actions cluster — `.dt-actions` (ghost icon buttons). */export const DTActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={['dt-actions', className || ''].filter(Boolean).join(' ')} {...rest} />
);

export interface DTPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left-side mono range text (e.g. "1–10 of 42"). */
  range?: React.ReactNode;
  /** Current page (1-based). */
  page: number;
  /** Total pages. */
  pages: number;
  onPage?: (page: number) => void;
  /** Rows-per-page choices. Rendering this control implies the caller re-fetches
      and resets to page 1 — the component owns neither. */
  pageSizes?: number[];
  pageSize?: number;
  onPageSize?: (size: number) => void;
}
/* Which page numbers to print. Always the first and last step plus the current
   one and its neighbours; an ellipsis stands in for each gap. Under 8 pages
   everything fits, so no gap is worth the visual noise. */
function pageWindow(page: number, pages: number): Array<number | '…'> {
  if (pages <= 7) return Array.from({ length: pages }, (_, n) => n + 1);
  const out: Array<number | '…'> = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(pages - 1, page + 1);
  if (from > 2) out.push('…');
  for (let p = from; p <= to; p++) out.push(p);
  if (to < pages - 1) out.push('…');
  out.push(pages);
  return out;
}

/* Rows-per-page. The sliding white pill is a single .tab-indicator positioned by
   custom properties, so SOMETHING has to measure the selected tab and write them:
   the markup alone renders the indicator parked at zero width, which looks like a
   dead control even though the clicks work. Re-measured on value change and on
   resize, since the tab widths depend on the digits ("25" vs "100"). */
const PageSizeTabs: React.FC<{
  sizes: number[];
  value?: number;
  onChange?: (n: number) => void;
}> = ({ sizes, value, onChange }) => {
  const groupRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const place = () => {
      const group = groupRef.current;
      if (!group) return;
      const active = group.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!active) return;
      group.style.setProperty('--ind-x', active.offsetLeft + 'px');
      group.style.setProperty('--ind-w', active.offsetWidth + 'px');
    };
    place();
    /* Fonts land after first paint and change every tab's width, so a single
       measurement at mount puts the pill in the wrong place. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place).catch(() => {});
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [value, sizes.join(',')]);

  return (
    <span className="dt-pagination-size">
      Rows
      <span ref={groupRef} className="tabs tabs-pill tabs-sm is-animated" role="tablist" aria-label="Rows per page">
        <span className="tab-indicator" aria-hidden="true" />
        {sizes.map((n) => (
          <button
            key={n}
            type="button"
            role="tab"
            className="tab"
            aria-selected={n === value}
            onClick={() => onChange && onChange(n)}
          >
            {n}
          </button>
        ))}
      </span>
    </span>
  );
};

/** Canonical pagination row — `.range` + `.pager` with `.page-btn`s (prev · numbered · next).
    Pass as the DataTable `pagination` slot. */
export const DTPagination: React.FC<DTPaginationProps> = ({ range, page, pages, onPage, pageSizes, pageSize, onPageSize, className, ...rest }) => (
  <div className={['dt-pagination', className || ''].filter(Boolean).join(' ')} {...rest}>
    {range != null ? <span className="dt-pagination-range">{range}</span> : null}
    {pageSizes && pageSizes.length ? (
      <PageSizeTabs sizes={pageSizes} value={pageSize} onChange={onPageSize} />
    ) : null}
    <nav className="dt-pagination-nav" aria-label="Pagination">
      {/* `.page-btn` is the canonical control the stylesheet defines: a bordered
          box with a square minimum and mono figures, current step in accent. The
          previous markup reached for `.btn.btn-ghost` instead, so the pager
          rendered as borderless pills and the boxed style the DS ships went
          unused — a class with rules and no callers. */}
      <button type="button" className="page-btn" disabled={page <= 1} onClick={() => onPage && onPage(page - 1)} aria-label="Previous page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      {/* Windowed: first, last, and the neighbours of the current step, with an
          ellipsis for the gap. Printing every page turns a 40-page table's footer
          into a wall of numbers nobody scans. */}
      {pageWindow(page, pages).map((p, i) =>
        p === '…' ? (
          <span key={'gap' + i} className="page-gap" aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={p === page ? 'page-btn is-current' : 'page-btn'}
            aria-current={p === page ? 'page' : undefined}
            aria-label={'Page ' + p}
            onClick={() => onPage && onPage(p as number)}
          >
            {p}
          </button>
        )
      )}
      <button type="button" className="page-btn" disabled={page >= pages} onClick={() => onPage && onPage(page + 1)} aria-label="Next page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      </button>
    </nav>
  </div>
);

/** Cell utilities. `noTab` turns OFF tabular figures — for IDs and codes,
    where fixed-width digits look mechanical; `check` is the selection gutter,
    a fixed 40px so the first data column starts at the same x either way. */
export const DTId: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, className, ...rest }) => (
  <span className={['dt-id', 'dt-no-tab', className || ''].filter(Boolean).join(' ')} {...rest}>{children}</span>
);
export const DTCheckCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...rest }) => (
  <td className={['dt-check', className || ''].filter(Boolean).join(' ')} {...rest}>{children}</td>
);

/** Trailing chips on a subrow: what KIND of child it is, and its state.
    Kept separate from the label so the two never merge into one string — an
    agent reading the row can tell the taxonomy from the status. */
export const DTSubrowMeta: React.FC<{ tag?: React.ReactNode; status?: React.ReactNode; count?: React.ReactNode }> = ({ tag, status, count }) => (
  <React.Fragment>
    {tag != null ? <span className="dt-subrow-tag">{tag}</span> : null}
    {status != null ? <span className="dt-subrow-status">{status}</span> : null}
    {count != null ? <span className="dt-subrow-count">{count}</span> : null}
  </React.Fragment>
);

/** Key–value grid inside a detail panel — for ONE record's attributes. Use a
    nested table instead when the panel holds many records of one type. */
export const DTDetailGrid: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...rest }) => (
  <div className={['dt-detail-grid', className || ''].filter(Boolean).join(' ')} {...rest}>{children}</div>
);

/** Vertical scroller for a sticky-header table. Belongs inside .dt-wrap so the
    wrap keeps ownership of the radius and the border. */
export const DTScrollY: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, style, ...rest }) => (
  <div className={['dt-scroll-y', className || ''].filter(Boolean).join(' ')} style={style} {...rest}>{children}</div>
);

/** Parent of a subrow or detail group. It exists because the FUSION is the
    parent's job: `has-subrows` drops the parent's bottom border so the pair
    reads as one block, and without it a caller gets an indented child floating
    under a fully-ruled row — the exact defect the docs warn against. */
export interface DTParentRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode;
  /** The group's kind: subrows share the parent's columns, a detail panel does not. */
  kind?: 'subrows' | 'detail';
  open?: boolean;
  /** Whole-row disclosure — adds role/tabindex and the pointer affordance. */
  onToggle?: () => void;
  controls?: string;
}
export const DTParentRow: React.FC<DTParentRowProps> = ({ children, kind = 'subrows', open, onToggle, controls, className, ...rest }) => (
  <tr
    className={[kind === 'detail' ? 'has-detail' : 'has-subrows', onToggle ? 'is-collapsible is-clickable' : '', open ? 'is-open' : '', className || ''].filter(Boolean).join(' ')}
    role={onToggle ? 'button' : undefined}
    tabIndex={onToggle ? 0 : undefined}
    aria-expanded={onToggle ? !!open : undefined}
    aria-controls={controls}
    onClick={onToggle}
    onKeyDown={onToggle ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } } : undefined}
    {...rest}
  >
    {children}
  </tr>
);

/* Slot markers, set after both declarations exist. DataTable reads these to tell
   "already the canonical bar" from "raw children that still need the frame" —
   assigning them earlier put DTPagination in its temporal dead zone and took the
   whole module down with it. */
DTToolbar.displayName = 'DTToolbar';
DTPagination.displayName = 'DTPagination';
