import * as React from 'react';

export type AnimatedBackdropVariant =
  | 'aurora' | 'mesh' | 'grid' | 'ripple' | 'beams' | 'orbits' | 'apex' | 'triangles';

export interface AnimatedBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Which background to render. */
  variant?: AnimatedBackdropVariant;
  /** Layer opacity preset. */
  intensity?: 'subtle' | 'default' | 'strong';
  /** Dark hero: ink base + ink scrim. */
  onInverse?: boolean;
  /** Drop the readability veil. Only for decorative strips with no text. */
  noScrim?: boolean;
  /** Veil direction — 'diagonal' anchors copy left, 'vertical' suits centred copy. */
  scrim?: 'diagonal' | 'vertical';
}

export declare const AnimatedBackdrop: React.FC<AnimatedBackdropProps>;

export default AnimatedBackdrop;
