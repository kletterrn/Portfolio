/* Compatibility for older cached pages: settle the former typewriter immediately. */
(() => {
  const title = document.querySelector('[data-timed-hero]');
  if (!title) return;
  const first = title.querySelector('[data-type-first]');
  const prefix = title.querySelector('[data-type-prefix]');
  const second = title.querySelector('[data-type-second]');
  if (first) first.textContent = 'A designer’s eye.';
  if (prefix) prefix.textContent = 'A developer’s ';
  if (second) second.textContent = 'curiosity.';
  title.querySelector('[data-type-caret]')?.remove();
  title.classList.remove('is-editing', 'is-name');
  title.dataset.heroPhase = 'static';
})();
