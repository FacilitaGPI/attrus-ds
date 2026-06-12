import * as React from 'react';

/**
 * ATTRUS AppSidebar — typed wrapper over the canonical `.sb` system
 * (preview/components/sidebar.css). Single visual source shared with
 * the live app shell and the doc page. Sections, items with badge OR
 * count, collapsible groups, disabled rows, collapsed 60px icon rail.
 * (Named AppSidebar — "Shell"/"Sidebar" collide with legacy app files.)
 */

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

const PanelGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);
const ChevGlyph: React.FC = () => (
  <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const AppSidebar: React.FC<AppSidebarProps> = ({
  sections,
  active,
  onNav,
  app = false,
  collapsed = false,
  onToggleCollapse,
  logo,
  foot,
  className,
  style,
}) => {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) =>
    setOpenGroups((g) => ({ ...g, [key]: !g[key] }));

  const renderItem = (item: SidebarItem) => {
    const isGroup = !!(item.children && item.children.length);
    const childActive = isGroup && item.children!.some((c) => c.key === active);
    const expanded = isGroup ? (openGroups[item.key] ?? childActive) : false;
    const itemCls = [
      'sb-item',
      item.key === active ? 'active' : '',
      item.disabled ? 'disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const row = (
      <div
        className={itemCls}
        role="button"
        tabIndex={item.disabled ? undefined : 0}
        aria-disabled={item.disabled || undefined}
        aria-current={item.key === active ? 'page' : undefined}
        onClick={() => {
          if (item.disabled) return;
          if (isGroup) toggleGroup(item.key);
          else if (onNav) onNav(item.key);
        }}
      >
        {item.icon != null ? <span className="ic">{item.icon}</span> : null}
        <span className="label">{item.label}</span>
        {item.badge ? (
          <span className={['sb-badge', item.badgeTone || ''].filter(Boolean).join(' ')}>{item.badge}</span>
        ) : item.count != null ? (
          <span className="sb-count">{item.count}</span>
        ) : null}
        {isGroup ? <ChevGlyph /> : null}
      </div>
    );

    if (!isGroup) return <React.Fragment key={item.key}>{row}</React.Fragment>;

    return (
      <div key={item.key} className="sb-group" aria-expanded={expanded}>
        {row}
        <div className="sb-children">
          <div className="sb-children-inner">
            {item.children!.map((c) => (
              <div
                key={c.key}
                className={['sb-subitem', c.key === active ? 'active' : ''].filter(Boolean).join(' ')}
                role="button"
                tabIndex={0}
                aria-current={c.key === active ? 'page' : undefined}
                onClick={() => onNav && onNav(c.key)}
              >
                <span className="label">{c.label}</span>
                {c.count != null ? <span className="sb-count">{c.count}</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside
      className={['sb', app ? 'sb-app' : '', collapsed ? 'collapsed' : '', className || ''].filter(Boolean).join(' ')}
      style={style}
      onKeyDown={(e) => {
        // Rail keyboard nav (doc a11y contract): ↑/↓ move between items
        // (wrapping), Home/End jump; Enter/Space activate via role=button.
        const nav = e.currentTarget;
        const target = e.target as HTMLElement;
        if (e.key === 'Enter' || e.key === ' ') {
          if (target.matches('.sb-item, .sb-subitem')) { e.preventDefault(); target.click(); }
          return;
        }
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
        const rows = Array.from(nav.querySelectorAll<HTMLElement>('.sb-item:not(.disabled), .sb-subitem'))
          .filter((el) => el.offsetParent !== null); // skip collapsed-group children
        if (!rows.length) return;
        e.preventDefault();
        const idx = rows.indexOf(target);
        let next = 0;
        if (e.key === 'ArrowDown') next = idx === -1 ? 0 : (idx + 1) % rows.length;
        else if (e.key === 'ArrowUp') next = idx === -1 ? rows.length - 1 : (idx - 1 + rows.length) % rows.length;
        else if (e.key === 'End') next = rows.length - 1;
        rows[next].focus();
      }}
    >
      {(logo != null || onToggleCollapse) && (
        <div className="sb-head">
          {logo}
          {onToggleCollapse ? (
            <button type="button" className="toggle" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={onToggleCollapse}>
              <PanelGlyph />
            </button>
          ) : null}
        </div>
      )}
      <div className="sb-body">
        {sections.map((s, i) => (
          <React.Fragment key={i}>
            {s.label != null ? <div className="sb-section">{s.label}</div> : null}
            {s.items.map(renderItem)}
          </React.Fragment>
        ))}
      </div>
      {foot}
    </aside>
  );
};

export default AppSidebar;
