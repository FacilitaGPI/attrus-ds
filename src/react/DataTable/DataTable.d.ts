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
export declare const DTActions: React.FC<React.HTMLAttributes<HTMLDivElement>>;

export interface DTPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left-side mono range text (e.g. "1–10 of 42"). */
  range?: React.ReactNode;
  /** Current page (1-based). */
  page: number;
  pages: number;
  onPage?: (page: number) => void;
}
export declare const DTPagination: React.FC<DTPaginationProps>;

export default DataTable;
