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
