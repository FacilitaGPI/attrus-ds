import * as React from 'react';

/**
 * ATTRUS Toast — typed wrapper over the canonical `.toast` system
 * (preview/components/toast.css). Ephemeral feedback: glassy surface,
 * tone accent rule, optional action link, close button and auto-dismiss
 * progress hairline. Compose inside a <ToastStack/> for positioning.
 */

export type ToastTone = 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'inverse';
export type ToastStackPosition = 'tr' | 'tl' | 'tc' | 'br' | 'bl' | 'bc';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: ToastTone;
  /** Leading icon slot (.toast-icon). */
  icon?: React.ReactNode;
  /** Bold first line. */
  title?: React.ReactNode;
  /** Inline action link (.toast-action). */
  action?: React.ReactNode;
  onActionClick?: () => void;
  /** Renders the × and calls back. */
  onClose?: () => void;
  /** Auto-dismiss countdown hairline (.toast-progress). */
  progress?: boolean;
  /** Exit animation hook (.is-leaving) — set just before removal. */
  leaving?: boolean;
}

const XGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Toast: React.FC<ToastProps> = ({
  tone,
  icon,
  title,
  action,
  onActionClick,
  onClose,
  progress = false,
  leaving = false,
  className,
  children,
  ...rest
}) => {
  const cls = ['toast', tone ? `toast-${tone}` : '', leaving ? 'is-leaving' : '', className || '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} role={tone === 'danger' ? 'alert' : 'status'} {...rest}>
      {icon != null ? <span className="toast-icon">{icon}</span> : <span />}
      <div className="toast-body">
        {title != null ? <div className="toast-title">{title}</div> : null}
        {children != null ? <div className="toast-desc">{children}</div> : null}
        {action != null ? (
          <a
            className="toast-action"
            role="button"
            tabIndex={0}
            onClick={onActionClick}
            style={{ cursor: 'pointer' }}
          >
            {action}
          </a>
        ) : null}
      </div>
      {onClose ? (
        <button type="button" className="toast-close" aria-label="Dismiss" onClick={onClose}>
          <XGlyph />
        </button>
      ) : (
        <span />
      )}
      {progress ? <span className="toast-progress" /> : null}
    </div>
  );
};

export interface ToastStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Corner: tr (default) · tl · tc · br · bl · bc. */
  position?: ToastStackPosition;
}

export const ToastStack: React.FC<ToastStackProps> = ({ position = 'tr', className, children, ...rest }) => (
  <div className={['toast-stack', `toast-stack-${position}`, className || ''].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);

export default Toast;
