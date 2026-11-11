import * as React from 'react';
export interface DropdownMenuProps { open: boolean; onClose: () => void; children?: React.ReactNode; 'aria-label'?: string; className?: string; style?: React.CSSProperties; }
/** Generic menu: arrows, Esc and outside click close, focus returns. */
export declare const DropdownMenu: React.FC<DropdownMenuProps>;
export interface MenuItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  title: React.ReactNode; description?: React.ReactNode; meta?: React.ReactNode;
  /** CSS colour of a 7px dot. */ dot?: string; icon?: React.ReactNode; danger?: boolean;
  /** The current choice (menuitemradio). */ selected?: boolean;
}
export declare const MenuItem: React.FC<MenuItemProps>;
export declare const MenuSeparator: React.FC;
export default DropdownMenu;
