import * as React from 'react';

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
  /** Strike this cell's figure through — an annulled amount inside a row that is
      still live. A fully cancelled row uses `rowState: 'muted'` instead. */
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
  /** Header checkbox — toggle all. */
  onSelectAll?: () => void;
  /** Loading state — `.dt-skeleton` shimmer rows instead of the body. */
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

export declare function DataTable<T>(props: DataTableProps<T>): React.ReactElement;
export declare const DTCellStack: React.FC<{ pri: React.ReactNode; sec?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>>;
export declare const DTCellLead: React.FC<{ lead: React.ReactNode; pri: React.ReactNode; sec?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>>;
export interface DTBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  tone?: 'success' | 'warning' | 'danger' | 'info';
  /** After the label instead of before it. */
  trailing?: boolean;
  size?: 'sm' | 'md';
}
export declare const DTBadge: React.FC<DTBadgeProps>;

export interface DTDeltaProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  direction: 'up' | 'down' | 'flat';
  /** Screen-reader phrasing, e.g. "up 12.4% versus last month". */
  label?: string;
}
export declare const DTDelta: React.FC<DTDeltaProps>;

export declare const DTActions: React.FC<React.HTMLAttributes<HTMLDivElement>>;

/** Lead cell of a subrow — connector glyph, optional mini icon tile, label.
    `parentName` renders a visually-hidden "Item of <parent>:" prefix, since
    native table semantics carry no hierarchy. */
export interface DTGroupDividerProps extends React.HTMLAttributes<HTMLTableRowElement> {
  label: React.ReactNode;
  colSpan: number;
  meta?: React.ReactNode;
}
export declare function DTGroupDivider(props: DTGroupDividerProps): React.ReactElement;

export interface DTDetailProps extends React.HTMLAttributes<HTMLTableRowElement> {
  colSpan: number;
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function DTDetail(props: DTDetailProps): React.ReactElement;

export declare const DTToolbar: React.FC<{
  lead?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  /** Selection state — same bar, preserved height. */
  selecting?: boolean;
  size?: 'md' | 'sm';
} & React.HTMLAttributes<HTMLDivElement>>;

export declare const DTDetailCard: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;

export declare const DTSubrowLead: React.FC<{
  label: React.ReactNode;
  icon?: React.ReactNode;
  parentName?: string;
} & React.HTMLAttributes<HTMLDivElement>>;

/** Disclosure control for a collapsible subrow group — goes in the parent's
    lead cell. `controls` must match the subrow's id. */
export declare const DTSubrowToggle: React.FC<{
  expanded: boolean;
  onToggle: () => void;
  controls: string;
  count?: number;
  label?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-expanded'>>;

/** Animated wrapper for a collapsible subrow's cell content (grid 0fr → 1fr). */
export declare const DTSubrowCell: React.FC<React.HTMLAttributes<HTMLDivElement>>;

export interface DTPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left-side mono range text (e.g. "1–10 of 42"). */
  range?: React.ReactNode;
  /** Current page (1-based). */
  page: number;
  pages: number;
  onPage?: (page: number) => void;
  /** Rows-per-page choices, rendered as a segmented pill (short fixed sets only
      — a <select> hides the options behind a tap). Rendering this implies the
      caller re-fetches and resets to page 1. */
  pageSizes?: number[];
  pageSize?: number;
  onPageSize?: (size: number) => void;
}
export interface DTParentRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode;
  /** subrows share the parent's columns; a detail panel does not. */
  kind?: 'subrows' | 'detail';
  open?: boolean;
  onToggle?: () => void;
  controls?: string;
}
export declare const DTId: React.FC<React.HTMLAttributes<HTMLSpanElement>>;
export declare const DTCheckCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>>;

export declare const DTSubrowMeta: React.FC<{ tag?: React.ReactNode; status?: React.ReactNode; count?: React.ReactNode }>;
export declare const DTDetailGrid: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export declare const DTScrollY: React.FC<React.HTMLAttributes<HTMLDivElement>>;

export declare const DTParentRow: React.FC<DTParentRowProps>;

export declare const DTPagination: React.FC<DTPaginationProps>;

export default DataTable;
