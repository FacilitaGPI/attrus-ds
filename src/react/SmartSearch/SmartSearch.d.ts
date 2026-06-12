import * as React from 'react';

export interface SSItem {
  key: string;
  /** Leading 28px tile glyph (`.icon-leading`). */
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** Muted second line (`.text .meta`). */
  sub?: React.ReactNode;
  /** Right-aligned mono hint (id). */
  trailing?: React.ReactNode;
}

export interface SSSection {
  /** Uppercase section label (e.g. "Counterparties"). */
  label?: React.ReactNode;
  items: SSItem[];
}

export interface SSTypeButton {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  /** Muted right hint (e.g. "transaction"). */
  hint?: React.ReactNode;
}

export interface SmartSearchProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Leading input glyph (search icon). */
  icon?: React.ReactNode;
  /** Shows the × clear button when value is non-empty. */
  onClear?: () => void;
  /** Esc inside the input. */
  onClose?: () => void;
  /** Suggestion chips row (active state — `.ss-chips`). */
  chips?: Array<{ key: string; icon?: React.ReactNode; label: React.ReactNode }>;
  onChipClick?: (key: string) => void;
  /** Grouped result rows (`.ss-section` + `.ss-list`). */
  sections?: SSSection[];
  onSelect?: (key: string) => void;
  /** "RESULTS (N)" line above the list (`.ss-result-label`). */
  resultLabel?: React.ReactNode;
  /** Tip card — similar match / ID format hint (`.ss-hint`). */
  hint?: React.ReactNode;
  /** ID-disambiguation buttons (`.ss-typebtns`). */
  typeButtons?: SSTypeButton[];
  onTypeSelect?: (key: string) => void;
  /** No-results state (`.ss-illo`). */
  empty?: { title: React.ReactNode; sub?: React.ReactNode; illo?: React.ReactNode };
  /** Skeleton rows while fetching (`.ss-skeleton`). */
  loading?: boolean;
  /** Fetch failed — retry. */
  error?: { title: React.ReactNode; sub?: React.ReactNode; retryLabel?: React.ReactNode; onRetry?: () => void; illo?: React.ReactNode };
  /** Kbd hint footer (`.ss-foot`). Default: true when the popover has content. */
  footer?: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export declare const SmartSearch: React.FC<SmartSearchProps>;
export default SmartSearch;
