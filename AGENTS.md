# AGENTS.md — @attrus-ds/core

This repo is the **ATTRUS / Cabiros design system** as a single npm package (`@attrus-ds/core`). It is **not** an application, not Phoenix/Elixir, and not a bundler project.

CSS is the visual source of truth. The optional React layer only composes canonical class names and ships as **TSX source** (the consumer compiles it). No screens, no app router, no tests.

Package name on npm: `@attrus-ds/core`. Legacy names (`@attrus/cabiros`, Cabiros) appear in comments and older docs — do not revive them as the published name.

## Commands

```bash
npm install
npm run build      # scripts/build.mjs → dist/ (gitignored)
npm pack           # inspect the published tarball
```

There is no `test`, `lint`, `format`, or `dev` server. Verify visually:

1. `npm run build`
2. Open `preview/components.html` (home) and the relevant spec under `preview/`

Dev preview pages typically load `../src/index.css` + `../src/themes/index.css`, not `dist/`. After changing tokens or build output, still run `npm run build` so `dist/` (and `npm pack`) match what consumers get.

Re-sync spec HTML from the sibling Cabiros repo (only when upstream docs changed):

```bash
node scripts/port-preview.mjs   # expects ../cabiros-attrus-design-system/preview/
```

## Layout

```
src/index.css              # local/dev entry (Google Fonts CDN + tokens + type + components)
src/tokens/                # 3-layer tokens; barrel = src/tokens/index.css
src/typography/            # type classes
src/components/            # one CSS file per domain + index.css barrel
src/react/                 # TSX + .d.ts; barrel = src/react/index.ts
src/themes/                # product axis (enterprise | business); orthogonal to light/dark
assets/                    # SVG logos, icons, flags
export/*.json              # generated token JSON — copy into dist/; do not hand-edit
preview/                   # HTML specs (not published)
scripts/build.mjs          # only build tool — no Vite/webpack/esbuild
dist/                      # published artifact (files: ["dist"])
```

Consumer import paths are defined in `package.json` `exports` and must stay stable.

## Tokens (doctrine)

Three layers — components never skip a layer:

1. **Raw** (`palette.css`, scales) — hex, px, font names. Defined once. Components never read these.
2. **Semantic** (`color-semantic.css` and siblings) — roles like `--color-foreground-accent`. This is what components consume. Dark remaps here.
3. **Component CSS / React** — `var(--semantic-token)` only. No hex, no magic px for spacing/radius, no font stacks.

Every new or changed component: check `preview/naming-and-consume.html` and `preview/for-ai.html`. Prefer an existing canonical component over a new one.

### Two axes (do not mix)

| Attribute | Meaning | Default |
|---|---|---|
| `data-theme="light" \| "dark"` | surface + intensity | light (`theme-toggle.js`, `attrus_theme`) |
| `data-product="enterprise" \| "business"` | brand hue / shape | enterprise = omit attribute (`:root`) |

Both live on `<html>`. Product themes must **not** redefine surface/feedback ramps — only brand, accent, gradient, shape.

Dark overrides belong in `src/tokens/theme-dark.css` (`[data-theme="dark"]`). Every light foreground role has an inverse twin; do not improvise dark values in component CSS.

## CSS components

Edit `src/components/<domain>.css`. Keep anatomy, variants, and states aligned with the matching `preview/<name>.html` page. That page's `#ds-api` JSON (from the `.d.ts`) is the contract for names — match it exactly.

Do not import CSS from React files. Apps load styles once:

```js
import "@attrus-ds/core/css";
```

## React layer

- One folder per component: `src/react/<Name>/<Name>.tsx` + `<Name>.d.ts`
- Wrappers compose canonical classes (e.g. `.btn.btn-primary`). Markup-only consumers must still work.
- Public surface is `src/react/index.ts`. Folders that exist but are not re-exported (`ActionBar`, `AmbientBackdrop`, `AnimatedBackdrop`, `SelectableCard`, `ToggleChip`) are **not** part of `@attrus-ds/core/react` until added to the barrel **and** documented.
- `react` is an optional peer (`>=18`). Do not add a runtime React dependency.
- Do not compile TSX in this package.

## Build invariants (`scripts/build.mjs`)

Keep these in lockstep when you add files:

- `TOKEN_PARTIALS` must match the cascade in `src/tokens/index.css` (today `shape.css` is in the barrel and missing from `TOKEN_PARTIALS` — fix that if you touch tokens/build, do not widen the drift).
- Component CSS: every `src/components/*.css` except `index.css` is copied to `dist/css/components/`.
- React: copied verbatim to `dist/react/`.
- Token JSON: copied from `export/`, not regenerated here. If tokens change, update `export/` in the same change (or the published JSON will lie).
- `package.json` exports `./themes` → `dist/css/themes/`. If you ship product themes on npm, the build must copy `src/themes/` there. Preview already uses `src/themes/` directly.
- Fonts in `dist/` come from `@fontsource/*` after `npm install`. Dev CSS may use Google Fonts CDN; published CSS must self-host woff2.
- Published tarball contains **only** `dist/`. `preview/`, `src/`, and scripts are not on npm.

## Docs for agents / humans

Read before inventing UI or tokens:

| File | Use |
|---|---|
| `preview/for-ai.html` | reuse-before-recreate; component precedence |
| `preview/naming-and-consume.html` | token layers |
| `preview/typescript.html` | TSX contract |
| `preview/doc-guidelines.html` | spec page shape, `#ds-api` |
| `README.md` | consumer install / import paths |

Lucide in preview is CDN-only. Icons are **not** a package dependency.

## Release

Semver: patch = fix, minor = additive, major = breaking token/API.

Do not bump `package.json` as the publish source of truth. Create a GitHub release tagged `vX.Y.Z`; `.github/workflows/publish.yml` syncs the tag into `package.json` and publishes. See `.cursor/rules/package-version-release.mdc`.

Never put `NODE_AUTH_TOKEN` in `.npmrc` (breaks OIDC).

## Out of scope

- New npm dependencies unless the user asks (build is dependency-free Node).
- Application screens, Tailwind re-implementation of this CSS, or hex copied from marketing brand decks into component CSS.
- Elixir Gold Standard, Mix, Ecto — they do not apply here.
- Regenerating tokens via `tools/sync-to-ds.cjs` — that tool lives in Cabiros, not this repo.
