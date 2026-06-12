import * as React from 'react';

/**
 * ATTRUS AppTopbar — typed wrapper over the canonical `.topbar` system
 * (preview/components/topbar.css). The app's top edge: primary action,
 * global search, and a right-aligned cluster of 36px controls
 * (--tb-control-h drives every item). Includes the live indicator,
 * notification bell and the account menu (identity + dropdown).
 * (Named AppTopbar — "Shell"/"TopBar" collide with legacy app files.)
 */

export interface AppTopbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left CTA slot — the canonical Button (primary). */
  primary?: React.ReactNode;
  /** Search slot — the canonical SearchPill (grows to fill). */
  search?: React.ReactNode;
  /** Right-aligned cluster (.tb-spacer): TopbarControl/Live/Bell/Account. */
  children?: React.ReactNode;
}

export const AppTopbar: React.FC<AppTopbarProps> = ({ primary, search, children, className, ...rest }) => (
  <div className={['topbar', className || ''].filter(Boolean).join(' ')} {...rest}>
    {primary}
    {search}
    <div className="tb-spacer">{children}</div>
  </div>
);

/* ---------- Generic 36px control ---------- */

export interface TopbarControlProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading slot (icon, flag…). */
  icon?: React.ReactNode;
  /** Square icon-only control (.tb-control.icon). */
  iconOnly?: boolean;
  /** Trailing disclosure chevron. */
  chev?: boolean;
}

const ChevDown: React.FC = () => (
  <span className="chev" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </span>
);

export const TopbarControl: React.FC<TopbarControlProps> = ({ icon, iconOnly = false, chev = false, className, children, ...rest }) => (
  <button
    type="button"
    className={['tb-control', iconOnly ? 'icon' : '', className || ''].filter(Boolean).join(' ')}
    {...rest}
  >
    {icon}
    {children}
    {chev ? <ChevDown /> : null}
  </button>
);

/* ---------- Live session indicator (non-interactive) ---------- */

export interface TopbarLiveProps {
  label?: React.ReactNode;
  /** Elapsed mono clock (e.g. "0:19"). */
  clock?: React.ReactNode;
}

export const TopbarLive: React.FC<TopbarLiveProps> = ({ label = 'Live', clock }) => (
  <div className="tb-control tb-live">
    <span className="dot" />
    <span className="lbl">{label}</span>
    {clock != null ? <span className="tb-clock">{clock}</span> : null}
  </div>
);

/* ---------- Notification bell ---------- */

export interface TopbarBellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unread red dot. */
  badge?: boolean;
}

export const TopbarBell: React.FC<TopbarBellProps> = ({ badge = false, className, ...rest }) => (
  <button
    type="button"
    className={['tb-control', 'icon', 'tb-bell', className || ''].filter(Boolean).join(' ')}
    aria-label="Notifications"
    {...rest}
  >
    <span className="badge-anchor">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 14, height: 14 }}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      {badge ? <span className="badge" /> : null}
    </span>
  </button>
);

/* ---------- Account menu (identity + dropdown) ---------- */

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

export const TopbarAccount: React.FC<TopbarAccountProps> = ({
  initials,
  name,
  company,
  detail,
  items = [],
  onSelect,
  compact = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="tb-account-wrap" ref={wrapRef}>
      <button
        type="button"
        className={['tb-account', open ? 'is-open' : ''].filter(Boolean).join(' ')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="tb-avatar">{initials}</span>
        {!compact ? (
          <span className="tb-account-id">
            <span className="nm">{name}</span>
            <span className="co">{company}</span>
          </span>
        ) : null}
        {!compact ? <ChevDown /> : null}
      </button>
      {open ? (
        <div className="tb-account-menu" role="menu">
          <div className="tb-account-menu-head">
            <span className="tb-avatar lg">{initials}</span>
            <div className="tb-account-menu-id">
              <span className="nm">{name}</span>
              <span className="co">{detail != null ? detail : company}</span>
            </div>
          </div>
          <div className="tb-account-menu-sep" />
          {items.map((it) => (
            <React.Fragment key={it.key}>
              {it.sep ? <div className="tb-account-menu-sep" /> : null}
              <button
                type="button"
                className={['tb-account-menu-item', it.danger ? 'is-danger' : ''].filter(Boolean).join(' ')}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  if (onSelect) onSelect(it.key);
                }}
              >
                {it.icon}
                {it.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default AppTopbar;
