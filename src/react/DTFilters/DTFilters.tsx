import * as React from 'react';
import { DateRangePicker } from '../DateRangePicker/DateRangePicker';

/**
 * ATTRUS DTFilters — the search + period bar of a data table, for DTToolbar's
 * filters zone. One component, two commit models:
 *
 *   mode="apply" (default) — the controls edit a DRAFT; nothing reaches the
 *     table until "Apply filters" or Enter. A second row under a hairline opens
 *     while anything is pending or applied: Apply (with a hint balloon while
 *     dirty), Clear filters (once something is applied), a rule, then the
 *     applied filters as pills. A ✕ on a pill clears the control and leaves the
 *     pill dashed and struck through with an undo, until the next Apply.
 *     Use for large or server-side lists, where each change costs a request.
 *
 *   mode="live" — no second row; the period and the scope apply at once and the
 *     text after a short debounce. Pills are optional and their ✕ removes now.
 *     Use for small local lists, where filtering is free.
 *
 * Status tabs are NOT part of this bar: they sit above the table and always
 * apply immediately, in both modes.
 */
export interface DTFilterScope {
  value: string;
  label: string;
  placeholder?: string;
  /** "decimal" for an amount scope — see matchesDigits. */
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

export interface DTFilterValue { scope: string | null; query: string; from: string; to: string; }

export interface DTFiltersLabels {
  searchBy: string; period: string; apply: string; clear: string; search: string;
  pendingHint: string; remove: string; undo: string;
}

export interface DTFiltersProps {
  mode?: 'apply' | 'live';
  scopes: DTFilterScope[];
  /** The APPLIED filters. */
  value: DTFilterValue;
  /** apply: on Apply / Enter / Clear. live: on every change (text debounced). */
  onChange: (next: DTFilterValue) => void;
  /** live mode only — show the applied filters as removable pills. */
  showPills?: boolean;
  /** Debounce for the text in live mode, ms. */
  debounce?: number;
  labels?: Partial<DTFiltersLabels>;
  locale?: string;
  className?: string;
}

export const EMPTY_FILTERS: DTFilterValue = { scope: null, query: '', from: '', to: '' };

const LABELS: DTFiltersLabels = {
  searchBy: 'Search by', period: 'Period', apply: 'Apply filters', clear: 'Clear filters', search: 'Search',
  pendingHint: 'You have changes that are not applied yet.', remove: 'Remove filter', undo: 'Undo removal',
};

/** Value search that ignores formatting: "40095", "40,095.00" and "40.095,00"
    all find 40,095.00 — only the digits of both sides are compared. */
export function matchesDigits(haystack: string | number, needle: string): boolean {
  const n = String(needle).replace(/\D/g, '');
  if (!n) return true;
  return String(haystack).replace(/\D/g, '').indexOf(n) > -1;
}

function fmtDate(s: string, locale: string) {
  if (!s) return '…';
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

const Ico = {
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>,
  undo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>,
  filter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>,
};

/** Keeps a removed item mounted for its exit transition (180ms). */
function usePresence<T extends { key: string }>(items: T[], ms = 180) {
  const [shown, setShown] = React.useState<(T & { phase: 'in' | 'entering' | 'leaving' })[]>(
    () => items.map((i) => Object.assign({}, i, { phase: 'in' as const })));
  React.useEffect(() => {
    const keys = new Set(items.map((i) => i.key));
    setShown((prev) => {
      const prevKeys = new Set(prev.map((p) => p.key));
      const next = prev.map((p) => keys.has(p.key)
        ? Object.assign({}, items.find((i) => i.key === p.key)!, { phase: p.phase === 'leaving' ? 'entering' as const : p.phase })
        : Object.assign({}, p, { phase: 'leaving' as const }));
      items.forEach((i) => { if (!prevKeys.has(i.key)) next.push(Object.assign({}, i, { phase: 'entering' as const })); });
      return next;
    });
    const enter = setTimeout(() => setShown((p) => p.map((x) => x.phase === 'entering' ? Object.assign({}, x, { phase: 'in' as const }) : x)), 20);
    const leave = setTimeout(() => setShown((p) => p.filter((x) => x.phase !== 'leaving')), ms);
    return () => { clearTimeout(enter); clearTimeout(leave); };
  }, [items.map((i) => i.key + (i as any).pending).join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  return shown;
}

export const DTFilters: React.FC<DTFiltersProps> = ({
  mode = 'apply', scopes, value, onChange, showPills = false, debounce = 250, labels, locale = 'en-US', className,
}) => {
  const L = Object.assign({}, LABELS, labels);
  const live = mode === 'live';
  const [draft, setDraft] = React.useState<DTFilterValue>(value);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // An outside change to the applied value (e.g. a Clear from elsewhere) resets the draft.
  const appliedKey = JSON.stringify(value);
  React.useEffect(() => { setDraft(value); }, [appliedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const edit = (patch: Partial<DTFilterValue>, textOnly = false) => {
    const next = Object.assign({}, draft, patch);
    setDraft(next);
    if (!live) return;
    if (timer.current) clearTimeout(timer.current);
    if (textOnly) timer.current = setTimeout(() => onChange(next), debounce);
    else onChange(next);
  };

  const dirty = !live && JSON.stringify(draft) !== appliedKey;
  const hasApplied = !!(value.query || value.from || value.to);
  const apply = () => { if (dirty) onChange(draft); };

  const pickScope = (s: string) => {
    if (draft.scope === s) { edit({ scope: null, query: '' }); return; }   // picked again: close + clear
    edit({ scope: s });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Enter applies — from the search, the date trigger, or with nothing focused.
  // Buttons and pills keep their own Enter.
  React.useEffect(() => {
    if (live) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || !dirty) return;
      const t = e.target as HTMLElement;
      const inBar = rootRef.current?.contains(t);
      const nothing = t === document.body;
      const isField = t.matches('.dt-filters-field input, .date-trigger');
      if (nothing || (inBar && isField)) { e.preventDefault(); e.stopPropagation(); apply(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  });

  const scope = scopes.find((s) => s.value === draft.scope) || null;
  const appliedScope = scopes.find((s) => s.value === value.scope);

  // Pills come from what is APPLIED (live: from the draft, which is the applied state).
  const src = live ? draft : value;
  const pillScope = scopes.find((s) => s.value === src.scope);
  const pills: { key: string; label: string; pending: boolean }[] = [];
  if (src.query) pills.push({ key: 'query', label: (pillScope ? pillScope.label : '') + ': "' + src.query + '"', pending: !live && (draft.query !== value.query || draft.scope !== value.scope) });
  if (src.from || src.to) pills.push({ key: 'period', label: L.period + ': ' + fmtDate(src.from, locale) + ' – ' + fmtDate(src.to, locale), pending: !live && (draft.from !== value.from || draft.to !== value.to) });
  const shownPills = usePresence(pills);

  const clearPill = (k: string) => k === 'query' ? edit({ query: '', scope: null }) : edit({ from: '', to: '' });
  const restorePill = (k: string) => k === 'query'
    ? setDraft(Object.assign({}, draft, { query: value.query, scope: value.scope }))
    : setDraft(Object.assign({}, draft, { from: value.from, to: value.to }));

  const pillEls = shownPills.map((p) => (
    <span key={p.key} className={['dt-filter-pill', 'dt-filters-item', p.pending ? 'is-pending' : '', p.phase !== 'in' ? 'is-' + p.phase : ''].filter(Boolean).join(' ')}>
      <span className="dt-filter-pill-label">{p.label}</span>
      {p.pending
        ? <button type="button" className="dt-filter-pill-action" aria-label={L.undo + ': ' + p.label} onClick={() => restorePill(p.key)}>{Ico.undo}</button>
        : <button type="button" className="dt-filter-pill-action" aria-label={L.remove + ': ' + p.label} onClick={() => clearPill(p.key)}>{Ico.x}</button>}
    </span>
  ));

  return (
    <div ref={rootRef} className={['dt-filters', live ? 'is-live' : 'is-apply', className || ''].filter(Boolean).join(' ')}>
      <div className="dt-filters-row">
        <div className="dt-filters-scope">
          <span className="dt-filters-scope-label" id={'dtf-by-' + (scopes[0] && scopes[0].value)}>{L.searchBy}</span>
          <div className="btn-group" role="group" aria-labelledby={'dtf-by-' + (scopes[0] && scopes[0].value)}>
            {scopes.map((s) => (
              <button key={s.value} type="button" className="btn btn-secondary btn-sm" aria-pressed={draft.scope === s.value} onClick={() => pickScope(s.value)}>{s.label}</button>
            ))}
          </div>
          <div className={['dt-filters-field', scope ? 'is-open' : ''].filter(Boolean).join(' ')} aria-hidden={!scope}>
            {live ? (
              /* live: the text already applies after a debounce; the inset Search
                 button (tertiary — a search is not the screen's CTA) commits it now,
                 for a user who would rather not wait. */
              <div className="group group-sm">
                <input ref={inputRef} tabIndex={scope ? 0 : -1}
                  inputMode={scope ? scope.inputMode : undefined}
                  placeholder={scope ? scope.placeholder || scope.label : ''} aria-label={scope ? scope.placeholder || scope.label : undefined}
                  value={draft.query} onChange={(e) => edit({ query: e.target.value }, true)} />
                <button type="button" className="fix-btn r is-tertiary" tabIndex={scope ? 0 : -1}
                  disabled={!draft.query.trim()}
                  onClick={() => edit({ query: draft.query })}>{L.search}</button>
              </div>
            ) : (
              <input ref={inputRef} className="input input-sm" tabIndex={scope ? 0 : -1}
                inputMode={scope ? scope.inputMode : undefined}
                placeholder={scope ? scope.placeholder || scope.label : ''} aria-label={scope ? scope.placeholder || scope.label : undefined}
                value={draft.query} onChange={(e) => edit({ query: e.target.value }, true)} />
            )}
          </div>
        </div>
        <DateRangePicker size="sm" portal from={draft.from} to={draft.to} placeholder={L.period} locale={locale}
          aria-label={L.period} onChange={(f, t) => edit({ from: f, to: t })} />
      </div>

      {!live ? (
        <div className={['dt-filters-apply', dirty || hasApplied ? 'is-open' : ''].filter(Boolean).join(' ')} aria-hidden={!(dirty || hasApplied)}>
          <div className="dt-filters-apply-inner">
            <span className="dt-filters-applywrap">
              <button type="button" className="btn btn-primary btn-sm" disabled={!dirty} onClick={apply}>{Ico.filter}<span>{L.apply}</span></button>
              <span className={['dt-filters-hint', dirty ? 'is-visible' : ''].filter(Boolean).join(' ')} role="status">{dirty ? L.pendingHint : ''}</span>
            </span>
            {hasApplied ? (
              <button type="button" className="btn btn-ghost btn-sm dt-filters-item" onClick={() => { setDraft(EMPTY_FILTERS); onChange(EMPTY_FILTERS); }}>{L.clear}</button>
            ) : null}
            {pillEls.length ? <span className="dt-filters-vsep" aria-hidden="true" /> : null}
            {pillEls}
          </div>
        </div>
      ) : live && showPills ? (
        /* live: the same second row under the same hairline, holding only the
           pills — there is nothing to apply, so no Apply / Clear / rule. */
        <div className={['dt-filters-apply', 'is-live', pills.length ? 'is-open' : ''].filter(Boolean).join(' ')} aria-hidden={!pills.length}>
          <div className="dt-filters-apply-inner">{pillEls}</div>
        </div>
      ) : null}
    </div>
  );
};

export default DTFilters;
