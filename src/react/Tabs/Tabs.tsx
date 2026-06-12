import * as React from 'react';

/**
 * ATTRUS Tabs — typed wrapper over the canonical `.tabs` system
 * (preview/components/tabs.css). CSS stays the visual source of truth.
 *
 * Variants: underline (default) | pill (segmented control).
 * Sizes: sm | md (default) | lg (lg steps down to md on mobile via CSS).
 * Layout: auto (content-sized) | block (full-width, equal columns) |
 *         equal (equal columns, content width) | scroll (force h-scroll).
 * Animated BY DEFAULT: sliding indicator (underline → bar, pill → lifted
 * surface) wired via `.is-animated` + `--ind-x/--ind-w`; pass
 * animated={false} to opt out (static per-tab indicator).
 * Mobile: underline rows scroll horizontally by default; the pill shell
 * fills the row and scrolls internally — both handled by the CSS.
 */

export interface TabItem {
  /** Stable identity — also what onChange receives. */
  key: string;
  /** Label. Strings get the bold-width reservation (no reflow on select). */
  label: React.ReactNode;
  /** Optional count badge (.tab-count). */
  count?: number | string;
  /** Icon-only segment (`.tab.is-icon`, pill variant) — label becomes aria-label; pass the glyph here. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export type TabsVariant = 'underline' | 'pill';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsLayout = 'auto' | 'block' | 'equal' | 'scroll';

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  /** Key of the selected tab (controlled). */
  value: string;
  onChange?: (key: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  layout?: TabsLayout;
  /** Sliding indicator (`.is-animated` + `.tab-indicator`): underline → sliding bar,
   *  pill → sliding lifted surface. ON by default; pass false for the static indicator.
   *  Positioning JS (--ind-x/--ind-w + resize) is wired here. */
  animated?: boolean;
}

const LAYOUT_CLASS: Record<TabsLayout, string> = {
  auto: '',
  block: 'is-block',
  equal: 'is-equal',
  scroll: 'is-scroll',
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  value,
  onChange,
  variant = 'underline',
  size = 'md',
  layout = 'auto',
  animated = true,
  className,
  ...rest
}) => {
  const listRef = React.useRef<HTMLDivElement>(null);

  // .is-animated contract: set --ind-x/--ind-w from the active tab; recompute on resize.
  React.useLayoutEffect(() => {
    if (!animated) return;
    const list = listRef.current;
    if (!list) return;
    const position = () => {
      const active = list.querySelector<HTMLElement>('.tab[aria-selected="true"]');
      if (!active) return;
      list.style.setProperty('--ind-x', active.offsetLeft + 'px');
      list.style.setProperty('--ind-w', active.offsetWidth + 'px');
    };
    position();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(position) : null;
    ro?.observe(list);
    // Late font load changes tab widths without resizing a fixed-width list —
    // reposition once webfonts settle so the indicator never sits misaligned.
    if (typeof document !== 'undefined' && (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts) {
      (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready.then(position).catch(() => undefined);
    }
    return () => ro?.disconnect();
  }, [animated, value, items]);

  const cls = [
    'tabs',
    variant === 'pill' ? 'tabs-pill' : '',
    size !== 'md' ? `tabs-${size}` : '',
    LAYOUT_CLASS[layout],
    animated ? 'is-animated' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={listRef} className={cls} role="tablist" {...rest}>
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          role="tab"
          className={it.icon != null ? 'tab is-icon' : 'tab'}
          aria-selected={value === it.key}
          aria-label={it.icon != null && typeof it.label === 'string' ? it.label : undefined}
          tabIndex={value === it.key ? 0 : -1}
          disabled={it.disabled}
          onClick={() => {
            if (!it.disabled && onChange) onChange(it.key);
          }}
          onKeyDown={(e) => {
            // Roving focus — ←/→ move between tabs, wrapping; Home/End jump.
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
            e.preventDefault();
            const enabled = items.filter((x) => !x.disabled);
            if (!enabled.length) return;
            const idx = enabled.findIndex((x) => x.key === it.key);
            let next = idx;
            if (e.key === 'ArrowRight') next = (idx + 1) % enabled.length;
            else if (e.key === 'ArrowLeft') next = (idx - 1 + enabled.length) % enabled.length;
            else if (e.key === 'Home') next = 0;
            else next = enabled.length - 1;
            const btns = listRef.current?.querySelectorAll<HTMLButtonElement>('.tab:not([disabled])');
            btns?.[next]?.focus();
          }}
        >
          {it.icon != null ? (
            it.icon
          ) : (
            <span className="tab-label" data-label={typeof it.label === 'string' ? it.label : undefined}>
              {it.label}
            </span>
          )}
          {it.icon == null && it.count != null ? <span className="tab-count">{it.count}</span> : null}
        </button>
      ))}
      {animated ? <span className="tab-indicator" aria-hidden="true" /> : null}
    </div>
  );
};

export default Tabs;
