import * as React from 'react';

export interface ComboOption {
  value: string;
  label: React.ReactNode;
  /** Secondary line under the label. */
  meta?: React.ReactNode;
  /** Right-aligned mono hint (e.g. a code). */
  trailing?: React.ReactNode;
  /** Optional group header this option sits under. */
  group?: string;
  /** Non-selectable (`.is-disabled`). */
  disabled?: boolean;
  /** Text used by the search filter when label isn't a plain string. */
  searchText?: string;
}

export type ComboboxStatus = 'default' | 'error';

export interface ComboboxProps {
  options: ComboOption[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Shows the search header inside the popover. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Trigger leading icon (`.combobox-trigger-icon`). */
  icon?: React.ReactNode;
  /** Validation state — error ring on the trigger (`.combobox.is-invalid` on the wrapper). */
  status?: ComboboxStatus;
  /** Filter-chip row inside the popover (`.combobox-filters`). */
  filters?: React.ReactNode;
  /** Results meta line above the list (`.combobox-meta`). */
  meta?: React.ReactNode;
  /** Muted meta line below the list (`.combobox-foot-meta`). */
  footMeta?: React.ReactNode;
  /** Popover starts open (galleries/docs). */
  defaultOpen?: boolean;
  /** Footer action (e.g. "Create new counterparty"). */
  footer?: React.ReactNode;
  onFooterClick?: () => void;
  emptyTitle?: React.ReactNode;
  emptySub?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export declare const Combobox: React.FC<ComboboxProps>;
export default Combobox;
