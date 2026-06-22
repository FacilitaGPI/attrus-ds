/* DS version — consumed by preview pages to populate [data-ds-version] */
(function () {
  const v = '1.0.4';
  document.querySelectorAll('[data-ds-version]').forEach(el => { el.textContent = 'v' + v; });
})();
