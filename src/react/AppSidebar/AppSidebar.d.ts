import * as React from 'react';

export interface SidebarChildItem {
  key: string;
  label: React.ReactNode;
  count?: number | string;
}

export interface SidebarItem {
  key: string;
  label: React.ReactNode;
  /** 15px icon slot (.ic). */
  icon?: React.ReactNode;
  /** Status badge text (e.g. "NEW") — mutually exclusive with count. */
  badge?: string;
  badgeTone?: 'alert' | 'warning';
  /** Numeric trailing count. */
  count?: number | string;
  disabled?: boolean;
  /** Sub-items — renders a collapsible .sb-group. */
  children?: SidebarChildItem[];
}

export interface SidebarSection {
  /** Uppercase section label; omit for the first unlabelled block. */
  label?: React.ReactNode;
  items: SidebarItem[];
}

export interface AppSidebarProps {
  sections: SidebarSection[];
  /** Key of the active item/sub-item. */
  active?: string;
  onNav?: (key: string) => void;
  /** Full-height app rail (.sb-app) instead of card framing. */
  app?: boolean;
  /** 60px icon rail. */
  collapsed?: boolean;
  /** Renders the header collapse toggle. */
  onToggleCollapse?: () => void;
  /** Header brand slot (logo img). */
  logo?: React.ReactNode;
  /** Product name beside the brand, e.g. "ONE" (L-30). */
  productName?: React.ReactNode;
  /** Slot under the header for a context selector, e.g. a track Select (L-30). */
  context?: React.ReactNode;
  /** Footer slot (.sb-foot markup is the caller's). */
  foot?: React.ReactNode;
  /** `glass` (.is-glass) for a rail over an image or gradient. */
  surface?: 'default' | 'glass';
  /** Phone drawer: off-canvas over a scrim, focus trapped, Esc / scrim close. Undefined = docked rail. */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  /** Accessible name of the drawer. Default "Navigation". */
  drawerLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export declare const AppSidebar: React.FC<AppSidebarProps>;
export default AppSidebar;
