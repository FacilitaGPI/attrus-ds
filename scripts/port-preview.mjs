/**
 * Port component spec pages from cabiros-attrus-design-system/preview/
 * into attrus-ds/preview/ with paths adapted for the npm package layout.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cabirosPreview = path.resolve(root, "..", "cabiros-attrus-design-system", "preview");
const outDir = path.join(root, "preview");

const PAGES = [
  // Components
  "buttons",
  "inputs",
  "status-pills",
  "callout",
  "cards",
  "table",
  "tabs",
  "stepper",
  "number-input",
  "toast",
  "tooltip",
  "empty-states",
  "sidebar-nav",
  "topbar",
  "modal-drawer",
  "drawer",
  "combobox",
  "primitives",
  "logos",
  // Foundations
  "colors-palette",
  "colors-semantic",
  "typography",
  "spacing",
  "radii",
  "shadows",
  "motion",
  "gradients",
  "glass-tokens",
  "data-viz",
  "tokens-export",
  "naming-and-consume",
  "iconography",
];

const THEME_TOGGLE = `<button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">
  <span data-theme-icon aria-hidden="true">&#9790;</span>
  <span data-theme-label>Dark</span>
</button>
`;

function transform(html) {
  let out = html
    .replaceAll("../colors_and_type.css", "../dist/css/index.css")
    .replaceAll("../theme-toggle.js", "./theme-toggle.js")
    // Remove per-component CSS files (now bundled in dist/css/index.css).
    // Keep tokens-doc.css — it is the doc-page chrome stylesheet used by
    // foundation pages (swatches, brand grids) and is not part of the bundle.
    .replace(/<link rel="stylesheet" href="components\/(?!tokens-doc\.css)[^"]+\.css"[^>]*>\s*/g, "")
    .replaceAll("../ui_kits/dashboard/design-system.html", "components.html")
    .replaceAll("colors_and_type.css", "dist/css/tokens.css");

  if (!out.includes("components/spec-page.css")) {
    out = out.replace(
      /<script src="https:\/\/unpkg.com\/lucide@latest"><\/script>/,
      `<link rel="stylesheet" href="components/spec-page.css">\n<link rel="icon" href="../assets/icon-attrus-dark.svg">\n<script src="https://unpkg.com/lucide@latest"></script>`
    );
  }

  if (!out.includes("data-theme-toggle")) {
    out = out.replace(/<body>\s*/i, `<body>\n${THEME_TOGGLE}\n`);
  }

  out = out.replace(
    /<script>\s*lucide\.createIcons\(\);\s*<\/script>/,
    `<script>
  if (window.lucide) lucide.createIcons();
  window.addEventListener('attrus-theme', function () { if (window.lucide) lucide.createIcons(); });
</script>`
  );

  if (!out.includes("lucide.createIcons")) {
    out = out.replace(
      /<\/body>/i,
      `<script>
  if (window.lucide) lucide.createIcons();
  window.addEventListener('attrus-theme', function () { if (window.lucide) lucide.createIcons(); });
</script>\n</body>`
    );
  }

  return out;
}

let ok = 0;
let missing = 0;

for (const name of PAGES) {
  const src = path.join(cabirosPreview, `${name}.html`);
  if (!fs.existsSync(src)) {
    console.warn(`skip (missing): ${name}.html`);
    missing += 1;
    continue;
  }
  const content = transform(fs.readFileSync(src, "utf8"));
  fs.writeFileSync(path.join(outDir, `${name}.html`), content);
  console.log(`ported ${name}.html`);
  ok += 1;
}

console.log(`\nDone: ${ok} ported, ${missing} missing.`);
