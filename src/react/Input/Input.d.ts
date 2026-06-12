import * as React from 'react';

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

export declare const Input: React.FC<InputProps>;

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  status?: InputStatus;
  /** sm / md (default) / lg — maps to textarea.input.input-{size}. */
  inputSize?: InputSize;
}
export declare const Textarea: React.FC<TextareaProps>;

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  status?: InputStatus;
  inputSize?: InputSize;
}
export declare const Select: React.FC<SelectProps>;

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: React.ReactNode;
}
export declare const Switch: React.FC<SwitchProps>;

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: React.ReactNode;
  /** Mixed state — sets input.indeterminate. */
  indeterminate?: boolean;
  /** Error ring on the box (`.check.is-error`). */
  error?: boolean;
}
export declare const Checkbox: React.FC<CheckboxProps>;

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: React.ReactNode;
}
export declare const Radio: React.FC<RadioProps>;

/* ---------- Specialised inputs (inputs.html §8–13) ---------- */

export interface DateTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Filled label (e.g. "April 17, 2026" or a range). Empty → placeholder. */
  value?: React.ReactNode;
  placeholder?: React.ReactNode;
  /** Leading icon (calendar / calendar-range / clock). */
  icon?: React.ReactNode;
  /** Error ring (`.is-error`). */
  error?: boolean;
}
export declare const DateTrigger: React.FC<DateTriggerProps>;

export interface ChipsInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current chips (controlled). */
  values: string[];
  /** Enter/comma in the embedded input adds a chip. */
  onAdd?: (value: string) => void;
  /** × on a chip (or Backspace on empty input) removes. */
  onRemove?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
export declare const ChipsInput: React.FC<ChipsInputProps>;

export interface OtpProps {
  /** Number of digit cells. Default 6. */
  length?: number;
  /** Current code (controlled). */
  value: string;
  onChange?: (code: string) => void;
  /** Error ring on every cell. */
  error?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare const Otp: React.FC<OtpProps>;

export interface FileDropProps extends React.HTMLAttributes<HTMLDivElement> {
  onFiles?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  title?: React.ReactNode;
  /** Sub line — `.anchor` span = click-to-browse affordance. */
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}
export declare const FileDrop: React.FC<FileDropProps>;

export type FileRowStatus = 'ok' | 'pending' | 'err';
export interface FileRowProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Icon tile tint via `data-kind` (img / sheet / doc / pdf…). */
  kind?: string;
  icon?: React.ReactNode;
  /** Corner tag text on the tile (e.g. "PDF"). */
  tag?: React.ReactNode;
  name: React.ReactNode;
  /** Mono sub line (size · date); err status tints it. */
  sub?: React.ReactNode;
  /** ok · pending · err. */
  status?: FileRowStatus;
  statusLabel?: React.ReactNode;
  /** 0–100 — uploading hairline. */
  progress?: number;
  onRemove?: () => void;
}
export declare const FileRow: React.FC<FileRowProps>;

export interface FileListBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  head?: React.ReactNode;
  /** Head-right action (e.g. "Clear all"). */
  action?: React.ReactNode;
  onActionClick?: () => void;
}
export declare const FileListBox: React.FC<FileListBoxProps>;

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {}
export declare const Slider: React.FC<SliderProps>;

export default Input;
