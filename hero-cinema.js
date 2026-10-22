/* Pointer-responsive light on a stationary sculpture; no scroll hold or background loop. */
(() => {
  const hero = document.querySelector('.code-hero');
  const art = hero?.querySelector('.hero-art');
  if (!hero || !art) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let visible = true;
  let frame = 0;
  let pointer = null;

  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    pointer = null;
    art.style.removeProperty('--crystal-light-x');
    art.style.removeProperty('--crystal-light-y');
  }

  function render() {
    frame = 0;
    if (!pointer || !visible || document.hidden || reduced.matches || !fine.matches) return;
    const rect = hero.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (pointer.x - rect.left) / Math.max(1, rect.width)));
    const y = Math.max(0, Math.min(1, (pointer.y - rect.top) / Math.max(1, rect.height)));
    art.style.setProperty('--crystal-light-x', `${(49 + x * 14).toFixed(2)}%`);
    art.style.setProperty('--crystal-light-y', `${(35 + y * 18).toFixed(2)}%`);
  }

  hero.addEventListener('pointermove', event => {
    if (!visible || document.hidden || reduced.matches || !fine.matches || event.isPrimary === false) return;
    pointer = {x: event.clientX, y: event.clientY};
    if (!frame) frame = requestAnimationFrame(render);
  }, {passive: true});
  hero.addEventListener('pointerleave', reset);
  reduced.addEventListener('change', reset);
  fine.addEventListener('change', reset);
  document.addEventListener('visibilitychange', reset);
  addEventListener('pagehide', reset);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) reset();
    }).observe(hero);
  }
})();
