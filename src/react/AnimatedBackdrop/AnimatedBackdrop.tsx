import * as React from 'react';

/**
 * ATTRUS AnimatedBackdrop — typed wrapper over the canonical `.abg`
 * (preview/components/animated-bg.css): eight full-bleed animated backgrounds
 * for hero, onboarding and marketing surfaces.
 *
 * Companion to `AmbientBackdrop` (plain drifting blobs). Reach for this one
 * when the surface needs motion vocabulary — aurora, cursor mesh, scanning
 * grid, ripples, beams, orbits, apex bloom, drifting triangles.
 *
 * Every tint derives from the product's brand/accent tokens, so a backdrop
 * reskins with the active product. The readability scrim is on by default —
 * copy drops below AA over a bare layer.
 */
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

const RIPPLE_DELAYS = [0, -1.8, -3.6, -5.4, -7.2, -9, -10.8, -12.6, -14.4, -16.2];
const BEAM_WEIGHTS = [1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2];
const ORBIT_SIZES = [130, 200, 280, 380, 490, 610, 740, 880, 1030, 1190];
const GLINT_ROWS = [25, 43.75, 62.5, 81.25];
const GLINT_COLS = [11.54, 23.08, 34.62, 50, 61.54, 73.08, 84.62];
/* The ATTRUS apex, as a single path — traced by the light beam. */
const APEX_PATH = 'M108.233 6.74605C105.184 2.677 100.34 0 94.8819 0C89.4234 0 84.4464 2.73056 81.3961 6.8799L80.6203 8.03098L0 129.352H27.1854L90.0923 32.6594L94.9622 25.1637L99.7248 32.6325L161.615 129.352H189.176L109.304 8.37901L108.233 6.74605Z';

export const AnimatedBackdrop: React.FC<AnimatedBackdropProps> = ({
  children,
  variant = 'aurora',
  intensity = 'default',
  onInverse = false,
  noScrim = false,
  scrim = 'diagonal',
  className,
  ...rest
}) => {
  const hostRef = React.useRef<HTMLDivElement>(null);

  /* Mesh only: feed the cursor position to the mask that reveals the bright dots. */
  React.useEffect(() => {
    if (variant !== 'mesh') return undefined;
    const el = hostRef.current;
    if (!el) return undefined;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', e.clientX - r.left + 'px');
      el.style.setProperty('--my', e.clientY - r.top + 'px');
    };
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, [variant]);

  const cls = [
    'abg',
    'abg-' + variant,
    intensity === 'subtle' ? 'is-subtle' : '',
    intensity === 'strong' ? 'is-strong' : '',
    onInverse ? 'on-inverse' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={hostRef} className={cls} {...rest}>
      {renderLayers(variant)}
      {noScrim ? null : <div className={'abg-scrim' + (scrim === 'vertical' ? ' is-vertical' : '')} aria-hidden="true" />}
      <div className="abg-content">{children}</div>
    </div>
  );
};

function renderLayers(variant: AnimatedBackdropVariant): React.ReactNode {
  const svgBase: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

  if (variant === 'aurora') {
    return (
      <div className="abg-layer is-tinted" aria-hidden="true">
        <div className="abg-blob is-1" />
        <div className="abg-blob is-2" />
        <div className="abg-blob is-3" />
        <div className="abg-blob is-4" />
      </div>
    );
  }

  if (variant === 'mesh') {
    return (
      <React.Fragment>
        <div className="abg-layer is-tinted" aria-hidden="true">
          <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" style={svgBase}>
            <defs>
              <pattern id="abg-dots" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r=".62" fill="var(--color-brand-accent-500)" opacity=".22" />
              </pattern>
              <radialGradient id="abg-fade" cx="62%" cy="70%" r="72%">
                <stop offset="30%" stopColor="#fff" stopOpacity="1" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <mask id="abg-mask"><rect width="640" height="400" fill="url(#abg-fade)" /></mask>
            </defs>
            <rect width="640" height="400" fill="url(#abg-dots)" mask="url(#abg-mask)" />
          </svg>
        </div>
        <div className="abg-dotglow" aria-hidden="true">
          <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" style={svgBase}>
            <defs>
              <pattern id="abg-dots-hi" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r=".85" fill="var(--color-brand-accent-300)" />
              </pattern>
            </defs>
            <rect width="640" height="400" fill="url(#abg-dots-hi)" />
          </svg>
        </div>
        <div className="abg-layer is-tinted" aria-hidden="true" style={{ background: 'radial-gradient(90% 80% at 72% 74%, color-mix(in srgb, var(--color-brand-secondary-500) 26%, transparent), transparent 62%)' }} />
      </React.Fragment>
    );
  }

  if (variant === 'grid') {
    return (
      <React.Fragment>
        <div className="abg-layer" aria-hidden="true" style={{ background: 'linear-gradient(155deg, var(--abg-ink) 10%, color-mix(in srgb, var(--abg-base) 78%, var(--abg-ink)) 100%)' }} />
        <div className="abg-layer abg-gridlines is-tinted" aria-hidden="true" />
        <div className="abg-layer" aria-hidden="true" style={{ overflow: 'hidden' }}>
          {GLINT_ROWS.map((pct, i) => (
            <div key={'r' + i} className="abg-glint-x" style={{
              top: pct + '%',
              width: 14 + (i % 3) * 6 + '%',
              opacity: 0.34 + (i % 3) * 0.04,
              animationDuration: 11 + (i % 4) * 3 + 's',
              animationDelay: i * 2.4 + 's',
            }} />
          ))}
          {GLINT_COLS.map((pct, i) => (
            <div key={'c' + i} className="abg-glint-y" style={{
              left: pct + '%',
              height: 14 + (i % 3) * 6 + '%',
              opacity: 0.3 + (i % 3) * 0.04,
              animationDuration: 13 + (i % 4) * 3 + 's',
              animationDelay: i * 1.7 + 0.7 + 's',
            }} />
          ))}
        </div>
        <div className="abg-layer abg-vignette" aria-hidden="true" />
      </React.Fragment>
    );
  }

  if (variant === 'ripple') {
    return (
      <React.Fragment>
        <div className="abg-layer" aria-hidden="true" style={{ background: 'radial-gradient(125% 105% at 62% 46%, color-mix(in srgb, var(--abg-base) 42%, var(--abg-ink)), var(--abg-ink) 76%)' }} />
        <div className="abg-layer is-tinted" aria-hidden="true">
          <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" style={svgBase}>
            <g fill="none" stroke="var(--color-brand-accent-500)" strokeWidth="1.2">
              {RIPPLE_DELAYS.map((d, i) => {
                const soft = i % 2 === 1;
                return (
                  <ellipse key={i} cx="420" cy="200" rx="380" ry="262"
                    stroke={soft ? 'var(--color-brand-accent-300)' : undefined}
                    strokeWidth={soft ? '.8' : undefined}
                    opacity={soft ? '.4' : undefined}
                    style={{
                      transformOrigin: '420px 200px',
                      animation: (soft ? 'abg-ripple-soft' : 'abg-ripple') + ' 18s var(--ease-standard) ' + d + 's infinite',
                    }} />
                );
              })}
            </g>
            <circle cx="420" cy="200" r="5.5" fill="var(--color-brand-accent-300)" opacity=".28" />
          </svg>
        </div>
      </React.Fragment>
    );
  }

  if (variant === 'beams') {
    return (
      <React.Fragment>
        <div className="abg-layer" aria-hidden="true" style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--abg-base) 62%, var(--abg-ink)) 0%, var(--abg-ink) 78%)' }} />
        <div className="abg-layer abg-tracks is-tinted" aria-hidden="true">
          {BEAM_WEIGHTS.map((w, i) => {
            const strong = w >= 3;
            return (
              <div key={i} className="abg-track" style={{
                background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-brand-accent-500) ' + (3 + w * 2) + '%, transparent) 45%, color-mix(in srgb, var(--color-brand-accent-500) ' + (2 + w) + '%, transparent))',
              }}>
                <div className={'abg-beam' + (strong ? ' is-strong' : '')} style={{
                  width: 22 + w * 5 + '%',
                  opacity: 0.16 + w * 0.06,
                  animationDuration: 6 + (i % 5) * 1.8 + w * 0.5 + 's',
                  animationDelay: i * 0.74 + 's',
                }} />
              </div>
            );
          })}
        </div>
        <div className="abg-layer is-tinted" aria-hidden="true" style={{ inset: 'auto 0 auto auto', top: '20%', bottom: '20%', right: 0, width: '24%', filter: 'blur(30px)', background: 'radial-gradient(ellipse at 100% 50%, color-mix(in srgb, var(--color-brand-accent-500) 26%, transparent), transparent 74%)' }} />
        <div className="abg-layer abg-vignette" aria-hidden="true" />
      </React.Fragment>
    );
  }

  if (variant === 'orbits') {
    return (
      <React.Fragment>
        <div className="abg-layer" aria-hidden="true" style={{ background: 'radial-gradient(120% 100% at 62% 50%, color-mix(in srgb, var(--abg-base) 38%, var(--abg-ink)), var(--abg-ink) 76%)' }} />
        <div className="abg-layer is-tinted" aria-hidden="true">
          <div className="abg-hub">
            {ORBIT_SIZES.map((d, i) => (
              <div key={i} className="abg-ring" style={{
                left: -d / 2 + 'px', top: -d / 2 + 'px', width: d + 'px', height: d + 'px',
                borderColor: 'color-mix(in srgb, var(--color-brand-accent-500) ' + Math.max(4, 24 - i * 2.4).toFixed(1) + '%, transparent)',
                animationDuration: 18 + i * 7 + 's',
                animationDirection: i % 2 ? 'reverse' : 'normal',
              }}>
                <span className="abg-sat" style={{ opacity: Math.max(0.25, 0.9 - i * 0.07) }} />
              </div>
            ))}
            <span className="abg-core" />
          </div>
        </div>
      </React.Fragment>
    );
  }

  if (variant === 'apex') {
    /* Layered strokes of growing width and shifting dash offset read as one
       beam with a bloom, without a filter per stroke. */
    const beams = Array.from({ length: 12 }, (_, i) => ({
      w: (0.45 + i * 0.035).toFixed(2),
      dash: (480 - i * 21) + ' ' + (148 + i * 21),
      delay: (-1.548 - i * 0.19).toFixed(3),
      opacity: (0.012 + i * 0.0022).toFixed(4),
    }));
    return (
      <React.Fragment>
        <div className="abg-layer" aria-hidden="true" style={{ background: 'radial-gradient(125% 105% at 66% 44%, color-mix(in srgb, var(--abg-base) 52%, var(--abg-ink)), var(--abg-ink) 78%)' }} />
        <div className="abg-layer is-tinted" aria-hidden="true">
          <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" style={svgBase}>
            <defs>
              <path id="abg-apex-src" d={APEX_PATH} />
              <filter id="abg-apex-bloom" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4.5" result="b1" />
                <feMerge><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <g transform="translate(352 118) scale(1.05)">
              <use href="#abg-apex-src" fill="var(--color-brand-accent-500)" opacity=".012" />
              <use href="#abg-apex-src" fill="none" stroke="var(--color-brand-accent-500)" strokeWidth=".7" strokeLinejoin="round" opacity=".07" />
              <g filter="url(#abg-apex-bloom)">
                {beams.map((b, i) => (
                  <use key={i} href="#abg-apex-src" fill="none"
                    stroke="var(--color-brand-accent-400)"
                    strokeWidth={b.w} strokeLinecap="round" strokeLinejoin="round"
                    opacity={b.opacity} strokeDasharray={b.dash}
                    style={{ animation: 'abg-apex-glint 6s linear ' + b.delay + 's infinite' }} />
                ))}
                <use href="#abg-apex-src" fill="none" stroke="var(--color-brand-accent-200)"
                  strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"
                  opacity=".5" strokeDasharray="18 610"
                  style={{ animation: 'abg-apex-glint 6s linear infinite' }} />
              </g>
            </g>
          </svg>
        </div>
      </React.Fragment>
    );
  }

  /* triangles */
  return (
    <React.Fragment>
      <div className="abg-layer" aria-hidden="true" style={{ background: 'radial-gradient(120% 100% at 60% 46%, color-mix(in srgb, var(--abg-base) 34%, var(--abg-ink)), var(--abg-ink) 78%)' }} />
      <div className="abg-layer is-tinted" aria-hidden="true">
        <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" style={svgBase}>
          <defs>
            <filter id="abg-tri-soft" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          <g style={{ transformOrigin: '120px 300px', animation: 'abg-tri-a 34s linear infinite alternate' }}>
            <polygon points="120,-60 460,320 -220,320" fill="color-mix(in srgb, var(--color-brand-secondary-500) 9%, transparent)" filter="url(#abg-tri-soft)" />
          </g>
          <g style={{ transformOrigin: '520px 90px', animation: 'abg-tri-b 30s linear infinite alternate' }}>
            <polygon points="520,-120 880,300 160,300" fill="none" stroke="var(--color-brand-accent-500)" strokeWidth="1" opacity=".14" />
          </g>
          <g style={{ transformOrigin: '380px 340px', animation: 'abg-tri-c 38s linear infinite alternate' }}>
            <polygon points="380,120 700,560 60,560" fill="color-mix(in srgb, var(--color-brand-accent-500) 6%, transparent)" filter="url(#abg-tri-soft)" />
          </g>
          <g style={{ transformOrigin: '80px 120px', animation: 'abg-tri-d 26s linear infinite alternate' }}>
            <polygon points="80,-40 300,300 -140,300" fill="none" stroke="var(--color-brand-accent-300)" strokeWidth=".8" opacity=".1" />
          </g>
          <g style={{ transformOrigin: '600px 260px', animation: 'abg-tri-a 44s linear -20s infinite alternate' }}>
            <polygon points="600,60 900,520 300,520" fill="color-mix(in srgb, var(--dataviz-cat-3) 5%, transparent)" filter="url(#abg-tri-soft)" />
          </g>
        </svg>
      </div>
      <div className="abg-layer abg-vignette" aria-hidden="true" />
    </React.Fragment>
  );
}

export default AnimatedBackdrop;
