/* ATTRUS theme toggle — vanilla, dependency-free.
   - Seeds <html data-theme> synchronously (no FOUC) from:
       1) localStorage 'attrus_theme'  →  2) prefers-color-scheme  →  3) light
   - Persists the user's manual choice.
   - Auto-wires any element with [data-theme-toggle]; updates its icon/label.
   - Programmatic API: window.ATTRUSTheme.{get,set,toggle}.
   Load in <head> AFTER colors_and_type.css and BEFORE body so the attribute
   is set before first paint. */
(function () {
  var KEY = 'attrus_theme';
  var root = document.documentElement;

  function apply(t) { root.setAttribute('data-theme', t); }
  function get() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function store(t) { try { localStorage.setItem(KEY, t); } catch (e) {} }

  function seed() {
    var s = null;
    try { s = localStorage.getItem(KEY); } catch (e) {}
    if (s === 'dark' || s === 'light') return s;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch (e) {}
    return 'light';
  }

  function sync() {
    var dark = get() === 'dark';
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      b.setAttribute('aria-pressed', String(dark));
      b.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
      var icon = b.querySelector('[data-theme-icon]');
      if (icon) icon.textContent = dark ? '\u2600' : '\u263E'; /* ☀ / ☾ */
      var label = b.querySelector('[data-theme-label]');
      if (label) label.textContent = dark ? 'Light' : 'Dark';
    }
  }

  function set(t) {
    apply(t); store(t); sync();
    try { window.dispatchEvent(new CustomEvent('attrus-theme', { detail: t })); } catch (e) {}
  }
  function toggle() { set(get() === 'dark' ? 'light' : 'dark'); return get(); }

  /* seed immediately — before paint */
  apply(seed());

  window.ATTRUSTheme = { get: get, set: set, toggle: toggle };

  function wire() {
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (b.__attrusWired) continue;
      b.__attrusWired = true;
      b.addEventListener('click', function (e) { e.preventDefault(); toggle(); });
    }
    sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();


/* ATTRUS product axis — orthogonal to theme. Switches the brand matiz
   (`<html data-product>`) across the whole catalog/app. Same seeding +
   persistence pattern as theme. Default 'cabiros' = no attribute (:root).
   API: window.ATTRUSProduct.{get,set,list,cycle}; event 'attrus-product'.
   Register products here; each needs a matching themes/<id>.css (except
   the default). Auto-wires <select data-product-select> and
   [data-product-toggle] (cycle) controls. */
(function () {
  var KEY = 'attrus_product';
  var root = document.documentElement;
  /* Display NAME lives ONLY here (single variable). Change a label → updates the
     selector everywhere (options are generated from this list). `id` is the stable
     technical key (data-product value + themes/<id>.css + [data-product="<id>"]).
     The first entry is the DEFAULT (no attribute → :root). */
  var PRODUCTS = [
    { id: 'enterprise', label: 'Enterprise' },
    { id: 'business',   label: 'Business' }
  ];
  var DEFAULT = PRODUCTS[0].id;

  function apply(p) {
    if (p && p !== DEFAULT) root.setAttribute('data-product', p);
    else root.removeAttribute('data-product');
  }
  function get() { return root.getAttribute('data-product') || DEFAULT; }
  function store(p) { try { localStorage.setItem(KEY, p); } catch (e) {} }
  function valid(p) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === p) return true; return false; }

  function seed() {
    var s = null;
    try { s = localStorage.getItem(KEY); } catch (e) {}
    return valid(s) ? s : DEFAULT;
  }

  /* Generate <option>s from PRODUCTS so the label has a single source. */
  function buildSelects() {
    var sels = document.querySelectorAll('[data-product-select]');
    for (var i = 0; i < sels.length; i++) {
      var sel = sels[i];
      if (sel.__attrusBuilt) continue;
      sel.__attrusBuilt = true;
      sel.innerHTML = '';
      for (var k = 0; k < PRODUCTS.length; k++) {
        var o = document.createElement('option');
        o.value = PRODUCTS[k].id; o.textContent = PRODUCTS[k].label;
        sel.appendChild(o);
      }
    }
  }

  function sync() {
    var cur = get();
    var sels = document.querySelectorAll('[data-product-select]');
    for (var i = 0; i < sels.length; i++) if (sels[i].value !== cur) sels[i].value = cur;
    var toggles = document.querySelectorAll('[data-product-toggle] [data-product-label]');
    for (var j = 0; j < toggles.length; j++) {
      for (var k = 0; k < PRODUCTS.length; k++) if (PRODUCTS[k].id === cur) toggles[j].textContent = PRODUCTS[k].label;
    }
  }

  function set(p) {
    if (!valid(p)) p = DEFAULT;
    apply(p); store(p); sync();
    try { window.dispatchEvent(new CustomEvent('attrus-product', { detail: p })); } catch (e) {}
  }
  function cycle() {
    var cur = get(), idx = 0;
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === cur) idx = i;
    set(PRODUCTS[(idx + 1) % PRODUCTS.length].id);
    return get();
  }

  apply(seed());
  window.ATTRUSProduct = { get: get, set: set, list: function () { return PRODUCTS.slice(); }, cycle: cycle };

  function wire() {
    buildSelects();
    var sels = document.querySelectorAll('[data-product-select]');
    for (var i = 0; i < sels.length; i++) {
      var s = sels[i];
      if (s.__attrusWired) continue;
      s.__attrusWired = true;
      s.addEventListener('change', function (e) { set(e.target.value); });
    }
    var toggles = document.querySelectorAll('[data-product-toggle]');
    for (var j = 0; j < toggles.length; j++) {
      var t = toggles[j];
      if (t.__attrusWired) continue;
      t.__attrusWired = true;
      t.addEventListener('click', function (e) { e.preventDefault(); cycle(); });
    }
    sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
