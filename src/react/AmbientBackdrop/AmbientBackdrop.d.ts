import * as React from 'react';

export interface AmbientBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** How many blobs to render (1–3). */
  blobs?: 1 | 2 | 3;
  /** Blob opacity preset. */
  intensity?: 'subtle' | 'default' | 'strong';
  /** Dark hero: ink background + ink scrim. */
  onInverse?: boolean;
  /** Drop the readability veil. Only for decorative strips with no text. */
  noScrim?: boolean;
}

export declare const AmbientBackdrop: React.FC<AmbientBackdropProps>;

export default AmbientBackdrop;
