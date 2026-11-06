import * as React from 'react';

/** ATTRUS DropdownMenu (L-34) — a generic menu (preview/components/menu.css).
    Positioned under its anchor; ↑/↓ move, Esc and an outside click close it and
    return focus to the trigger. Children are <MenuItem> and <MenuSeparator>. */
export interface DropdownMenuProps { open: boolean; onClose: () => void; children?: React.ReactNode; 'aria-label'?: string; className?: string; style?: React.CSSProperties; }

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ open, onClose, children, className, style, ...rest }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const opener = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (!open) return undefined;
    opener.current = document.activeElement as HTMLElement;
    const t = window.setTimeout(() => { const el = ref.current; const f = el && (el.querySelector<HTMLElement>('[aria-checked="true"]') || el.querySelector<HTMLElement>('.menu-item')); f && f.focus(); }, 20);
    const out = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', out);
    return () => { window.clearTimeout(t); document.removeEventListener('mousedown', out); const b = opener.current; if (b && document.contains(b)) b.focus(); };
  }, [open]);
  if (!open) return null;
  const onKey = (e: React.KeyboardEvent) => {
    const it = Array.from(ref.current!.querySelectorAll<HTMLElement>('.menu-item:not([disabled])')); const i = it.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); it[(i + 1) % it.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); it[(i - 1 + it.length) % it.length].focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };
  return <div ref={ref} className={['menu', className || ''].filter(Boolean).join(' ')} role="menu" aria-label={rest['aria-label']} style={style} onKeyDown={onKey}>{children}</div>;
};

export interface MenuItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned mono value (a count). */
  meta?: React.ReactNode;
  /** CSS colour of a 7px dot, e.g. "var(--color-team-compliance)". */
  dot?: string;
  icon?: React.ReactNode;
  danger?: boolean;
  /** The current choice — the item becomes a menuitemradio. */
  selected?: boolean;
}
export const MenuItem: React.FC<MenuItemProps> = ({ title, description, meta, dot, icon, danger, selected, className, ...rest }) => (
  <button type="button" className={['menu-item', danger ? 'is-danger' : '', className || ''].filter(Boolean).join(' ')}
    role={selected !== undefined ? 'menuitemradio' : 'menuitem'} aria-checked={selected !== undefined ? selected : undefined} tabIndex={-1} {...rest}>
    {dot ? <span className="menu-item-dot" style={{ background: dot }} /> : icon ? <span className="menu-item-icon">{icon}</span> : <span />}
    <span><span className="menu-item-title">{title}</span>{description != null ? <span className="menu-item-desc">{description}</span> : null}</span>
    {meta != null ? <span className="menu-item-meta">{meta}</span> : <span />}
  </button>
);
export const MenuSeparator: React.FC = () => <div className="menu-sep" role="separator" />;
export default DropdownMenu;
