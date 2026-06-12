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
  /** Footer slot (.sb-foot markup is the caller's). */
  foot?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export declare const AppSidebar: React.FC<AppSidebarProps>;
export default AppSidebar;
