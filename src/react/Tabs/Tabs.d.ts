import * as React from 'react';

export interface TabItem {
  /** Stable identity — also what onChange receives. */
  key: string;
  /** Label. Strings get the bold-width reservation (no reflow on select). */
  label: React.ReactNode;
  /** Optional count badge (.tab-count). */
  count?: number | string;
  /** Icon-only segment (`.tab.is-icon`, pill variant) — label becomes aria-label; pass the glyph here. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export type TabsVariant = 'underline' | 'pill';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsLayout = 'auto' | 'block' | 'equal' | 'scroll';

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  /** Key of the selected tab (controlled). */
  value: string;
  onChange?: (key: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  layout?: TabsLayout;
  /** Sliding indicator (`.is-animated` + `.tab-indicator`), ON by default; false = static indicator. */
  animated?: boolean;
}

export declare const Tabs: React.FC<TabsProps>;
export default Tabs;
