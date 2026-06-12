import * as React from 'react';

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

export interface ToastStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Corner: tr (default) · tl · tc · br · bl · bc. */
  position?: ToastStackPosition;
}

export declare const Toast: React.FC<ToastProps>;
export declare const ToastStack: React.FC<ToastStackProps>;
export default Toast;
