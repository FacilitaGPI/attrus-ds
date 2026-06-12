import * as React from 'react';

export interface AppTopbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left CTA slot — the canonical Button (primary). */
  primary?: React.ReactNode;
  /** Search slot — the canonical SearchPill (grows to fill). */
  search?: React.ReactNode;
  /** Right-aligned cluster (.tb-spacer): TopbarControl/Live/Bell/Account. */
  children?: React.ReactNode;
}

export interface TopbarControlProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading slot (icon, flag…). */
  icon?: React.ReactNode;
  /** Square icon-only control (.tb-control.icon). */
  iconOnly?: boolean;
  /** Trailing disclosure chevron. */
  chev?: boolean;
}

export interface TopbarLiveProps {
  label?: React.ReactNode;
  /** Elapsed mono clock (e.g. "0:19"). */
  clock?: React.ReactNode;
}

export interface TopbarBellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unread red dot. */
  badge?: boolean;
}

export interface TopbarAccountItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  /** Renders a separator before this item. */
  sep?: boolean;
}

export interface TopbarAccountProps {
  initials: string;
  name: React.ReactNode;
  company: React.ReactNode;
  /** Second line in the dropdown head (e.g. "Acme Corp · Admin"). */
  detail?: React.ReactNode;
  items?: TopbarAccountItem[];
  onSelect?: (key: string) => void;
  /** Hide name/company in the trigger (mobile). */
  compact?: boolean;
}

export declare const AppTopbar: React.FC<AppTopbarProps>;
export declare const TopbarControl: React.FC<TopbarControlProps>;
export declare const TopbarLive: React.FC<TopbarLiveProps>;
export declare const TopbarBell: React.FC<TopbarBellProps>;
export declare const TopbarAccount: React.FC<TopbarAccountProps>;
export default AppTopbar;
