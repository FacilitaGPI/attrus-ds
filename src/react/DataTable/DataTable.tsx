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
  /** sm | md (default) | lg — .dt--sm / .dt--lg. */
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
}

const Chev: React.FC = () => (
  <span className="chev" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
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
    size === 'sm' ? 'dt--sm' : '',
    size === 'lg' ? 'dt--lg' : '',
    zebra ? 'dt--zebra' : '',
    sticky ? 'dt--sticky' : '',
    bordered ? 'dt--bordered' : '',
    onInverse ? 'on-inverse' : '',
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
            const sortCls = c.sortable
              ? ['dt-th-sort', sortKey === c.key && sortDir === 'asc' ? 'is-asc' : '', sortKey === c.key && sortDir === 'desc' ? 'is-desc' : '']
                  .filter(Boolean)
                  .join(' ')
              : undefined;
            return (
              <th
                key={c.key}
                className={[c.numeric ? 'dt-num' : '', sortCls || ''].filter(Boolean).join(' ') || undefined}
                onClick={c.sortable && onSort ? () => onSort(c.key) : undefined}
                aria-sort={sortKey === c.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                {c.header}
                {c.sortable ? <Chev /> : null}
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
                    className={[c.numeric ? 'dt-num' : '', c.id ? 'dt-id' : ''].filter(Boolean).join(' ') || undefined}
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
      {toolbar ? <div className="dt-toolbar">{toolbar}</div> : null}
      {inner}
      {pagination ? <div className="dt-pagination">{pagination}</div> : null}
    </div>
  );
}

export default DataTable;

/* ----------------------------------------------------------------
   Typed cell-pattern helpers — compose inside a column's render().
   ---------------------------------------------------------------- */

/** Stacked primary + secondary lines — `.dt-cell-stack` (.pri / .sec). */
export const DTCellStack: React.FC<{ pri: React.ReactNode; sec?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>> = ({ pri, sec, className, ...rest }) => (
  <div className={['dt-cell-stack', className || ''].filter(Boolean).join(' ')} {...rest}>
    <span className="pri">{pri}</span>
    {sec != null ? <span className="sec">{sec}</span> : null}
  </div>
);

/** Leading avatar/icon + stacked label — `.dt-cell-lead`. */
export const DTCellLead: React.FC<{ lead: React.ReactNode; pri: React.ReactNode; sec?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>> = ({ lead, pri, sec, className, ...rest }) => (
  <div className={['dt-cell-lead', className || ''].filter(Boolean).join(' ')} {...rest}>
    {lead}
    <div className="dt-cell-stack">
      <span className="pri">{pri}</span>
      {sec != null ? <span className="sec">{sec}</span> : null}
    </div>
  </div>
);

/** Trailing actions cluster — `.dt-actions` (ghost icon buttons). */
export const DTActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
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
}
/** Canonical pagination row — `.range` + `.pager` with `.page-btn`s (prev · numbered · next).
    Pass as the DataTable `pagination` slot. */
export const DTPagination: React.FC<DTPaginationProps> = ({ range, page, pages, onPage, className, ...rest }) => (
  <div className={className} style={{ display: 'contents' }} {...rest}>
    {range != null ? <span className="range">{range}</span> : null}
    <nav className="pager" aria-label="Pagination">
      <button type="button" className="page-btn" disabled={page <= 1} onClick={() => onPage && onPage(page - 1)} aria-label="Previous page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          className={p === page ? 'page-btn is-current' : 'page-btn'}
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onPage && onPage(p)}
        >
          {p}
        </button>
      ))}
      <button type="button" className="page-btn" disabled={page >= pages} onClick={() => onPage && onPage(page + 1)} aria-label="Next page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      </button>
    </nav>
  </div>
);
