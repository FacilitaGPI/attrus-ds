# @attrus-ds/core

The **ATTRUS / Cabiros** design system, packaged for npm.

The CSS is the single visual source of truth — design tokens, component styles,
brand assets and self-hosted fonts. On top of that, an **optional typed React
layer** ships as source (TSX + `.d.ts`) under `@attrus-ds/core/react`; it only
composes the canonical class names, so the CSS-only / markup path stays fully
valid. No application screens are included.

What's inside:

- **Design tokens** — colors, typography, spacing, radii, shadows, motion, data-viz (CSS custom properties + JSON).
- **Component styles** — ready-to-use CSS for buttons, inputs, tables, pills, tabs, cards, callouts, overlays, smart-search and more.
- **React components** — 20 typed wrappers (Button, Pill, Card, DataTable, Combobox, SmartSearch, Modal, Drawer, AppSidebar…), shipped as source under `@attrus-ds/core/react`. `react` is an optional peer dependency.
- **Brand assets** — logos, icons and country flags (SVG).
- **Fonts** — Lato and JetBrains Mono, self-hosted (`.woff2`, no CDN).

## Install

```bash
npm install @attrus-ds/core
```



## Usage

### Import everything

Pulls fonts, tokens and every component style in the correct order:

```js
import "@attrus-ds/core/css";
```

```css
/* or from CSS */
@import "@attrus-ds/core/css";
```

### Import tokens only

Just the CSS custom properties (no fonts, no component styles):

```js
import "@attrus-ds/core/tokens.css";
```

Then consume the tokens anywhere:

```css
.my-card {
  background: var(--color-background-surface);
  color: var(--color-foreground-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

Need the tokens as data (Style Dictionary, native apps, codegen)?

```js
import tokens from "@attrus-ds/core/tokens.json" with { type: "json" };
import flatTokens from "@attrus-ds/core/tokens.flat.json" with { type: "json" };
```

### Import selected components

Each component style is importable on its own. Component styles rely on the
tokens, so import `tokens.css` (or the full `css`) first.

```js
import "@attrus-ds/core/tokens.css";
import "@attrus-ds/core/components/buttons.css";
import "@attrus-ds/core/components/table.css";
```

Available component stylesheets:

`buttons` · `callout` · `cards` · `combobox` · `empty-states` · `inputs` ·
`number-input` · `overlays` · `primitives` · `sidebar` · `smart-search` ·
`status-pills` · `stepper` · `table` · `tabs` · `toast` · `tooltip` · `topbar`

### React components

The typed React layer is shipped as TSX source under `@attrus-ds/core/react`.
Your bundler/toolchain compiles it; `react` (>= 18) is an optional peer
dependency. Import the styles once at your app root, then the components:

```js
import "@attrus-ds/core/css";              // styles (once, at the root)
import { Button, Pill, DataTable } from "@attrus-ds/core/react";

export function Example() {
  return <Button variant="primary" size="sm">New transaction</Button>;
}
```

Each component is also importable on its own path:

```js
import { Button } from "@attrus-ds/core/react/Button/Button";
```

The CSS stays the single visual source of truth — these wrappers add a typed API
and compose the same canonical classes (`.btn btn-primary`, `.pill success`, …),
so plain HTML consumers and React consumers render identically.

Component roster: `Button` · `Pill` · `Callout` · `Tabs` · `Input` ·
`SearchPill` · `Card` · `DataTable` · `Atoms` (Money/Metric/Avatar/Eyebrow/Flag/
Divider…) · `Stepper` · `NumberInput` · `Combobox` · `SmartSearch` · `Toast` ·
`Tooltip` · `ZeroState` · `Modal` · `Drawer` · `AppSidebar` · `AppTopbar`.

### Fonts

The full `@attrus-ds/core/css` entry already declares the `@font-face` rules and
references the bundled `.woff2`. To wire fonts up on their own:

```css
@import "@attrus-ds/core/fonts.css";
```

### Brand assets

```js
import logo from "@attrus-ds/core/assets/logo-attrus-dark.svg";
import brazilFlag from "@attrus-ds/core/assets/flags/Brazil-rounded.svg";
```

## Dark mode

Tokens remap automatically when you set `data-theme="dark"` on a root element:

```html
<html data-theme="dark">
```

## Versioning

This package follows [semver](https://semver.org): `patch` for fixes, `minor`
for additive changes, `major` for breaking token/API changes.

## Local development

Source lives under `src/`, organized by concern:

```
src/
├── index.css            # dev entry — fonts + tokens + typography + components
├── tokens/              # design tokens, split by concern (3-layer architecture)
│   ├── index.css        #   barrel (cascade order)
│   ├── palette.css      #   layer 1 — raw, theme-agnostic primitives
│   ├── color-semantic.css #  layer 2 — semantic color roles (components consume these)
│   ├── gradients.css · data-viz.css · glass.css
│   ├── radius.css · elevation.css · spacing.css · iconography.css · motion.css
│   ├── typography.css   #   type scale / weights / line-height / tracking tokens
│   └── theme-dark.css   #   [data-theme="dark"] semantic overrides
├── typography/index.css # ready-to-use type classes + text utilities
├── components/          # one stylesheet per component domain (+ index.css barrel)
└── react/               # typed React layer — one folder per component
    ├── index.ts         #   barrel re-exporting every component
    └── <Name>/<Name>.tsx + <Name>.d.ts
```

The published artifact is assembled into `dist/` by a dependency-free Node
script (`scripts/build.mjs`). The token partials are concatenated into a single
`dist/css/tokens.css`, the component CSS is copied per-file, and the React
sources are copied verbatim to `dist/react/` (no compilation — consumers build
them), so consumer import paths are unchanged.

```bash
npm install
npm run build      # writes dist/
npm pack           # inspect the tarball before publishing
```

### Components showcase

`preview/components.html` is the design-system home — a navigable index of foundations, components, brand assets and package entry points (same structure as the Cabiros `design-system.html`).

Each component has a dedicated spec page under `preview/` (e.g. `buttons.html`, `inputs.html`) with anatomy, variants, states, composition, don'ts, accessibility and token tables.

`preview/gallery.html` is a compact live-specimen reference — useful for quick visual checks, but not the full documentation.

Build first, then open the home page in a browser:

```bash
npm run build
node scripts/port-preview.mjs   # re-sync spec pages from cabiros when upstream changes
# then open preview/components.html
```

## License

See [LICENSE](LICENSE). Bundled fonts (Lato, JetBrains Mono) are distributed
under the SIL Open Font License — see `dist/fonts/LICENSE-*.txt`.
