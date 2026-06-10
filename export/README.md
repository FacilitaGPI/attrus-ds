# ATTRUS Design Tokens — Export

Machine-readable export of the **Cabiros · ATTRUS Design System** tokens.
**Source of truth:** the token partials in `src/tokens/` (`:root` declarations across `palette.css`, `color-semantic.css`, etc. for light; `theme-dark.css` for `[data-theme="dark"]` overrides). These JSON files are *generated* from them — do not hand-edit; re-run the export when tokens change.

- **334** tokens · **43** dark-theme overrides · **18** categories
- Generated 2026-06-03 · v1.0.0

## Files

| File | Shape | Use it for |
|---|---|---|
| `attrus-tokens.flat.json` | Flat `name → { value, resolved?, dark?, darkResolved? }` | Quick lookups, scripts, diffing. `resolved` is the concrete value after following `var()` chains (color-mix/gradients stay symbolic). |
| `attrus-tokens.json` | Nested by category (`color`, `space`, `radius`, …), each leaf `{ value, darkValue? }` | Style-Dictionary-style pipelines, codegen. |

## Token shape

```jsonc
"--color-background-canvas": {
  "value": "var(--color-neutral-25)",   // authored value (may reference another token)
  "resolved": "#FAFBFD",                  // concrete value after resolving var() chains
  "dark": "var(--color-ink-deep)",        // dark-theme override (only when present)
  "darkResolved": "#0A1128"
}
```

## Categories

`color` (168) · `shadow` (26) · `dataviz` (29) · `space` (17) · `fs` (14) · `glass` (12) · `radius` (11) · `grad` (10) · `icon` (8) · `w` (7) · `ls` (6) · `duration` (6) · `brand` (5) · `lh` (4) · `font` (3) · `ease` (3) · `transition` (3) · `scrim` (1)

## Consuming

**CSS / web** — the canonical token partials in `src/tokens/` already ship the custom properties (bundled into `dist/css/tokens.css`); import those directly. The JSON is for *other* targets.

**Style Dictionary** — point a source at `attrus-tokens.json`; leaves already use the `{ value }` contract. Map `darkValue` to a `dark` theme/mode in your config.

**iOS / Android / Flutter** — feed `attrus-tokens.flat.json` to your generator; prefer `resolved`/`darkResolved` for concrete platform constants (skip tokens whose value is a `color-mix()`/gradient — those need a runtime that understands them).

## Regenerating

Re-run the export routine against the `src/tokens/` partials whenever tokens are added, removed, or re-valued. The token count in the catalog hero stat should match `tokenCount` here.
