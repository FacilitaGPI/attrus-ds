# @attrus-ds/core

Visual layer of the **ATTRUS / Cabiros** design system, packaged for npm.

This package ships **only the visual foundation** — design tokens, component
styles, brand assets and self-hosted fonts. It contains **no framework
components** (no React/Vue/etc.) and no application screens.

What's inside:

- **Design tokens** — colors, typography, spacing, radii, shadows, motion, data-viz (CSS custom properties + JSON).
- **Component styles** — ready-to-use CSS for buttons, inputs, tables, pills, tabs, cards, callouts, overlays and more.
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
`number-input` · `overlays` · `primitives` · `sidebar` · `status-pills` ·
`stepper` · `table` · `tabs` · `toast` · `tooltip` · `topbar`

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
└── components/          # one stylesheet per component domain (+ index.css barrel)
```

The published artifact is assembled into `dist/` by a dependency-free Node
script (`scripts/build.mjs`). The token partials are concatenated into a single
`dist/css/tokens.css`, so consumer import paths are unchanged.

```bash
npm install
npm run build      # writes dist/
npm pack           # inspect the tarball before publishing
```

## License

See [LICENSE](LICENSE). Bundled fonts (Lato, JetBrains Mono) are distributed
under the SIL Open Font License — see `dist/fonts/LICENSE-*.txt`.
