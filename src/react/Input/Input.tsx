import * as React from 'react';

/**
 * ATTRUS Input — typed wrapper over the canonical input system
 * (preview/components/inputs.css). CSS stays the visual source of truth.
 *
 * Composes the canonical anatomy automatically:
 *   .field > label + control + .help        (when label/help given)
 *   .affix.lead-pad/.trail-pad              (when leadIcon/trailIcon given)
 *   .group > .fix.l + input + .fix.r        (when prefix/suffix given)
 *
 * Note: prefix/suffix (.group) and leadIcon/trailIcon (.affix) are
 * mutually exclusive — group wins if both are passed. Sizes apply to
 * the plain/affix input; the group row is md-only by design.
 */

export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success' | 'warning';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Field label (renders the .field wrapper). */
  label?: React.ReactNode;
  /** Helper line under the control; takes the status tone. */
  help?: React.ReactNode;
  /** Validation state: error/success border + focus ring + help tone. */
  status?: InputStatus;
  /** sm=32px, md=40px (default), lg=48px. */
  size?: InputSize;
  /** Leading icon (decorative) — .affix.lead-pad. */
  leadIcon?: React.ReactNode;
  /** Trailing icon (decorative) — .affix.trail-pad. */
  trailIcon?: React.ReactNode;
  /** Makes the trailing slot a clickable .trail-btn (clear, reveal…). */
  onTrailClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Trailing button accessible label (required with onTrailClick). */
  trailLabel?: string;
  /** Attached prefix cell — .group .fix.l (e.g. "USD"). */
  prefix?: React.ReactNode;
  /** Attached suffix cell — .group .fix.r (e.g. ".00"). */
  suffix?: React.ReactNode;
  /** Dark-surface treatment (.on-inverse). */
  onInverse?: boolean;
  /** Quiet read-only: value only, no border (.is-readonly). */
  readOnlyQuiet?: boolean;
  /** Quiet / ghost input — bottom hairline only (`.input.underline`). */
  underline?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  help,
  status = 'default',
  size = 'md',
  leadIcon,
  trailIcon,
  onTrailClick,
  trailLabel,
  prefix,
  suffix,
  onInverse = false,
  readOnlyQuiet = false,
  underline = false,
  className,
  id,
  ...rest
}) => {
  const autoId = React.useId();
  const inputId = id || (label ? autoId : undefined);

  const inputCls = [
    'input',
    size !== 'md' ? `input-${size}` : '',
    status === 'error' ? 'is-error' : '',
    status === 'success' ? 'is-success' : '',
    onInverse ? 'on-inverse' : '',
    readOnlyQuiet ? 'is-readonly' : '',
    underline ? 'underline' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  let control: React.ReactNode;

  if (prefix != null || suffix != null) {
    // Attached group — the inner input is styled by `.group > input`.
    control = (
      <div className={['group', status === 'error' ? 'is-error' : ''].filter(Boolean).join(' ')}>
        {prefix != null ? <span className="fix l">{prefix}</span> : null}
        <input id={inputId} readOnly={readOnlyQuiet || rest.readOnly} {...rest} />
        {suffix != null ? <span className="fix r">{suffix}</span> : null}
      </div>
    );
  } else if (leadIcon != null || trailIcon != null || onTrailClick) {
    const affixCls = [
      'affix',
      leadIcon != null ? 'lead-pad' : '',
      trailIcon != null || onTrailClick ? 'trail-pad' : '',
    ]
      .filter(Boolean)
      .join(' ');
    control = (
      <div className={affixCls}>
        {leadIcon != null ? <span className="lead">{leadIcon}</span> : null}
        <input id={inputId} className={inputCls} readOnly={readOnlyQuiet || rest.readOnly} {...rest} />
        {onTrailClick ? (
          <button type="button" className="trail-btn" aria-label={trailLabel || 'Action'} onClick={onTrailClick}>
            {trailIcon}
          </button>
        ) : trailIcon != null ? (
          <span className="trail">{trailIcon}</span>
        ) : null}
      </div>
    );
  } else {
    control = <input id={inputId} className={inputCls} readOnly={readOnlyQuiet || rest.readOnly} {...rest} />;
  }

  if (label == null && help == null) return <React.Fragment>{control}</React.Fragment>;

  const helpCls = [
    'help',
    status === 'error' ? 'is-error' : '',
    status === 'success' ? 'is-success' : '',
    status === 'warning' ? 'is-warning' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="field">
      {label != null ? <label htmlFor={inputId}>{label}</label> : null}
      {control}
      {help != null ? <div className={helpCls}>{help}</div> : null}
    </div>
  );
};

export default Input;

/* ----------------------------------------------------------------
   Companion form controls — same inputs.css, same .field anatomy.
   ---------------------------------------------------------------- */

const fieldWrap = (
  label: React.ReactNode,
  help: React.ReactNode,
  status: InputStatus,
  id: string | undefined,
  control: React.ReactNode,
) => {
  if (label == null && help == null) return <React.Fragment>{control}</React.Fragment>;
  const helpCls = ['help', status === 'error' ? 'is-error' : '', status === 'success' ? 'is-success' : '', status === 'warning' ? 'is-warning' : ''].filter(Boolean).join(' ');
  return (
    <div className="field">
      {label != null ? <label htmlFor={id}>{label}</label> : null}
      {control}
      {help != null ? <div className={helpCls}>{help}</div> : null}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  status?: InputStatus;
  /** sm / md (default) / lg — maps to textarea.input.input-{size}. */
  inputSize?: InputSize;
}
/** Multi-line text — `textarea.input` (auto height, min-height per size). */
export const Textarea: React.FC<TextareaProps> = ({ label, help, status = 'default', inputSize = 'md', className, id, ...rest }) => {
  const autoId = React.useId();
  const tid = id || (label ? autoId : undefined);
  const cls = ['input', inputSize !== 'md' ? `input-${inputSize}` : '', status === 'error' ? 'is-error' : '', status === 'success' ? 'is-success' : '', className || ''].filter(Boolean).join(' ');
  return fieldWrap(label, help, status, tid, <textarea id={tid} className={cls} {...rest} />);
};

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  status?: InputStatus;
  inputSize?: InputSize;
}
/** Native select — `.select` wrapper + chevron glyph. Children = <option>s. */
export const Select: React.FC<SelectProps> = ({ label, help, status = 'default', inputSize = 'md', className, id, children, ...rest }) => {
  const autoId = React.useId();
  const sid = id || (label ? autoId : undefined);
  const cls = ['input', inputSize !== 'md' ? `input-${inputSize}` : '', status === 'error' ? 'is-error' : '', className || ''].filter(Boolean).join(' ');
  const control = (
    <div className="select">
      <select id={sid} className={cls} {...rest}>{children}</select>
      <span className="chev" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </span>
    </div>
  );
  return fieldWrap(label, help, status, sid, control);
};

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Visible label to the right of the track. */
  children?: React.ReactNode;
}
/** Toggle — `.switch` (hidden input + track + thumb; royal when checked). */
export const Switch: React.FC<SwitchProps> = ({ children, className, ...rest }) => (
  <label className={['switch', className || ''].filter(Boolean).join(' ')}>
    <input type="checkbox" {...rest} />
    <span className="switch-track"><span className="switch-thumb" /></span>
    {children != null ? <span className="switch-label">{children}</span> : null}
  </label>
);

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: React.ReactNode;
  /** Mixed state — sets input.indeterminate (bar instead of check). */
  indeterminate?: boolean;
  /** Error ring on the box (`.check.is-error`). */
  error?: boolean;
}
/** Custom checkbox — `.check` (hidden input + box + check glyph). */
export const Checkbox: React.FC<CheckboxProps> = ({ children, indeterminate = false, error = false, className, ...rest }) => {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return (
    <label className={['check', error ? 'is-error' : '', className || ''].filter(Boolean).join(' ')}>
      <input ref={ref} type="checkbox" {...rest} />
      <span className="check-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      {children != null ? <span>{children}</span> : null}
    </label>
  );
};

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: React.ReactNode;
}
/** Custom radio — `.radio` (hidden input + dot). Group via shared `name`. */
export const Radio: React.FC<RadioProps> = ({ children, className, ...rest }) => (
  <label className={['radio', className || ''].filter(Boolean).join(' ')}>
    <input type="radio" {...rest} />
    <span className="radio-dot" />
    {children != null ? <span>{children}</span> : null}
  </label>
);

/* ---------- Specialised inputs (inputs.html §8–13) ---------- */

const ChevronGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export interface DateTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Filled label (e.g. "April 17, 2026" or "Apr 1 – Apr 30"). Empty → placeholder. */
  value?: React.ReactNode;
  placeholder?: React.ReactNode;
  /** Leading icon (calendar / calendar-range / clock) — caller's <Icon/>. */
  icon?: React.ReactNode;
  /** Error ring (`.is-error`). */
  error?: boolean;
}
/** Trigger button for calendar/time pickers — `.date-trigger`. The picker itself is not part of the input system. */
export const DateTrigger: React.FC<DateTriggerProps> = ({ value, placeholder = 'Select a date…', icon, error = false, className, ...rest }) => (
  <button type="button" className={['date-trigger', error ? 'is-error' : '', className || ''].filter(Boolean).join(' ')} {...rest}>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      {icon}
      {value != null ? value : <span className="placeholder">{placeholder}</span>}
    </span>
    <ChevronGlyph />
  </button>
);

export interface ChipsInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current chips (controlled). */
  values: string[];
  /** Enter/comma in the embedded input adds a chip. */
  onAdd?: (value: string) => void;
  /** × on a chip removes it (also Backspace on empty input removes the last). */
  onRemove?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
/** Token input — `.chips` shell with removable `.chip`s + embedded text input. */
export const ChipsInput: React.FC<ChipsInputProps> = ({ values, onAdd, onRemove, placeholder = 'Add…', disabled = false, className, ...rest }) => {
  const [draft, setDraft] = React.useState('');
  const commit = () => {
    const v = draft.trim();
    if (v && onAdd) onAdd(v);
    setDraft('');
  };
  return (
    <div className={['chips', className || ''].filter(Boolean).join(' ')} {...rest}>
      {values.map((v) => (
        <span key={v} className="chip">
          {v}
          {onRemove ? (
            <button type="button" className="chip-x" aria-label={`Remove ${v}`} disabled={disabled} onClick={() => onRemove(v)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : null}
        </span>
      ))}
      <input
        value={draft}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(); }
          if (e.key === 'Backspace' && !draft && values.length && onRemove) onRemove(values[values.length - 1]);
        }}
        onBlur={commit}
      />
    </div>
  );
};

export interface OtpProps {
  /** Number of digit cells. Default 6. */
  length?: number;
  /** Current code (controlled) — up to `length` chars. */
  value: string;
  onChange?: (code: string) => void;
  /** Error ring on every cell (`.is-error`). */
  error?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
/** One-time-password cells — `.otp`. Auto-advances focus; paste fills all cells. */
export const Otp: React.FC<OtpProps> = ({ length = 6, value, onChange, error = false, disabled = false, className, style, ...rest }) => {
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  const set = (code: string) => { if (onChange) onChange(code.slice(0, length)); };
  return (
    <div className={['otp', className || ''].filter(Boolean).join(' ')} style={style} role="group" aria-label={rest['aria-label'] || 'Verification code'}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          maxLength={1}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          className={error ? 'is-error' : undefined}
          value={value[i] || ''}
          disabled={disabled}
          onChange={(e) => {
            const ch = e.target.value.replace(/\D/g, '').slice(-1);
            const next = value.slice(0, i) + (ch || '') + value.slice(i + 1);
            set(next);
            if (ch && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            const digits = e.clipboardData.getData('text').replace(/\D/g, '');
            if (digits) { e.preventDefault(); set(digits); refs.current[Math.min(digits.length, length) - 1]?.focus(); }
          }}
        />
      ))}
    </div>
  );
};

export interface FileDropProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Called with the dropped/browsed files. */
  onFiles?: (files: File[]) => void;
  multiple?: boolean;
  /** input[type=file] accept. */
  accept?: string;
  title?: React.ReactNode;
  /** Sub line — the `.anchor` span is the click-to-browse affordance. */
  sub?: React.ReactNode;
  /** Leading glyph (e.g. upload-cloud icon). */
  icon?: React.ReactNode;
  disabled?: boolean;
}
/** Dashed dropzone — `.file-drop` with drag (`.is-dragging`) + click-to-browse. */
export const FileDrop: React.FC<FileDropProps> = ({ onFiles, multiple = true, accept, title = 'Drop files here', sub, icon, disabled = false, className, ...rest }) => {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const emit = (list: FileList | null) => { if (list && list.length && onFiles) onFiles(Array.from(list)); };
  return (
    <div
      className={['file-drop', dragging ? 'is-dragging' : '', className || ''].filter(Boolean).join(' ')}
      role="button"
      tabIndex={disabled ? undefined : 0}
      aria-disabled={disabled || undefined}
      onClick={() => { if (!disabled) inputRef.current?.click(); }}
      onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); inputRef.current?.click(); } }}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled) emit(e.dataTransfer.files); }}
      {...rest}
    >
      {icon}
      <span className="ttl">{dragging ? 'Release to upload' : title}</span>
      <span className="sub">{sub != null ? sub : <React.Fragment>or <span className="anchor">browse files</span></React.Fragment>}</span>
      <input ref={inputRef} type="file" hidden multiple={multiple} accept={accept} disabled={disabled} onChange={(e) => { emit(e.target.files); e.target.value = ''; }} />
    </div>
  );
};

export type FileRowStatus = 'ok' | 'pending' | 'err';

export interface FileRowProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Icon tile kind — tints via `data-kind` (img / sheet / doc / pdf…). */
  kind?: string;
  /** Tile glyph (caller's <Icon/>) + optional corner tag text (e.g. "PDF"). */
  icon?: React.ReactNode;
  tag?: React.ReactNode;
  name: React.ReactNode;
  /** Mono sub line (size · date). Status err tints it. */
  sub?: React.ReactNode;
  /** ok (done) · pending (uploading) · err (failed — clickable to retry). */
  status?: FileRowStatus;
  statusLabel?: React.ReactNode;
  /** 0–100 — renders the `.file-progress` hairline while uploading. */
  progress?: number;
  onRemove?: () => void;
}
/** Uploaded-file row — `.file-row` (icon tile · meta · status · remove). Wrap rows in <FileListBox>. */
export const FileRow: React.FC<FileRowProps> = ({ kind, icon, tag, name, sub, status, statusLabel, progress, onRemove, className, ...rest }) => (
  <li className={['file-row', className || ''].filter(Boolean).join(' ')} {...rest}>
    <span className="file-icon" data-kind={kind}>
      {icon}
      {tag != null ? <span className="file-icon-tag">{tag}</span> : null}
    </span>
    <span className="file-meta">
      <span className="file-name">{name}</span>
      {sub != null ? <span className={['file-sub', status === 'err' ? 'err' : ''].filter(Boolean).join(' ')}>{sub}</span> : null}
      {progress != null ? (
        <span className="file-progress"><span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} /></span>
      ) : null}
    </span>
    {status != null ? <span className={`file-status ${status}`}>{statusLabel != null ? statusLabel : status === 'ok' ? 'Uploaded' : status === 'pending' ? 'Uploading…' : 'Retry'}</span> : null}
    {onRemove ? (
      <button type="button" className="file-remove" aria-label="Remove file" onClick={onRemove}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    ) : null}
  </li>
);

export interface FileListBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase head label (e.g. "3 files · 4.2 MB"). */
  head?: React.ReactNode;
  /** Head-right action (e.g. "Clear all") — `.file-list-action`. */
  action?: React.ReactNode;
  onActionClick?: () => void;
}
/** Post-upload list shell — `.file-list` with head + `.file-rows`. Children: <FileRow/>s. */
export const FileListBox: React.FC<FileListBoxProps> = ({ head, action, onActionClick, className, children, ...rest }) => (
  <div className={['file-list', className || ''].filter(Boolean).join(' ')} {...rest}>
    {head != null || action != null ? (
      <div className="file-list-head">
        <span>{head}</span>
        {action != null ? (
          <button type="button" className="file-list-action" onClick={onActionClick}>{action}</button>
        ) : null}
      </div>
    ) : null}
    <ul className="file-rows">{children}</ul>
  </div>
);

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {}
/** Range input — `.slider` (canonical track + thumb). Pair with a label that reflects the value. */
export const Slider: React.FC<SliderProps> = ({ className, ...rest }) => (
  <input type="range" className={['slider', className || ''].filter(Boolean).join(' ')} {...rest} />
);
