import * as React from 'react';
export interface SegmentedOption { value: string; label: React.ReactNode; count?: React.ReactNode; /** Chevron; calls onMenu instead of selecting. */ menu?: boolean; }
export interface SegmentedControlProps { options: SegmentedOption[]; value: string; onChange: (v: string) => void; onMenu?: (v: string, el: HTMLButtonElement) => void; 'aria-label': string; className?: string; }
/** One choice among a few, in a row; count and menu segments. */
export declare const SegmentedControl: React.FC<SegmentedControlProps>;
export default SegmentedControl;
