/* DS version — consumed by preview pages to populate
     [data-ds-version]      "v<VERSION>"
     [data-ds-version-raw]  bare number, no "v"
     [data-ds-date]         release month, e.g. "August 2026"
     [data-ds-date-iso]     ISO date, e.g. "2026-08-18"
   Kept in sync with Cabiros' version.js. */
(function () {
  var VERSION = '1.0.10';
  var RELEASE_DATE = '2026-08-18';   /* ISO — the display month is derived */

  window.ATTRUS_DS_VERSION = VERSION;
  window.ATTRUS_DS_DATE = RELEASE_DATE;

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
  function displayMonth(iso) {
    var p = iso.split('-');
    return MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }

  function fill() {
    var v = document.querySelectorAll('[data-ds-version]');
    for (var i = 0; i < v.length; i++) v[i].textContent = 'v' + VERSION;
    var r = document.querySelectorAll('[data-ds-version-raw]');
    for (var j = 0; j < r.length; j++) r[j].textContent = VERSION;
    var d = document.querySelectorAll('[data-ds-date]');
    for (var k = 0; k < d.length; k++) d[k].textContent = displayMonth(RELEASE_DATE);
    var iso = document.querySelectorAll('[data-ds-date-iso]');
    for (var m = 0; m < iso.length; m++) iso[m].textContent = RELEASE_DATE;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
  else fill();
})();
