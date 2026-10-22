(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('#main-nav');
  function closeMenu(restoreFocus = false) {
    const wasOpen = menu?.getAttribute('aria-expanded') === 'true';
    menu?.setAttribute('aria-expanded', 'false');
    header?.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    if (restoreFocus && wasOpen) menu.focus();
  }
  menu?.addEventListener('click', () => {
    const opening = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(opening));
    header.classList.toggle('menu-open', opening);
    document.body.classList.toggle('menu-open', opening);
    if (opening) nav.querySelector('a')?.focus();
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
  document.addEventListener('click', event => { if (!header?.contains(event.target)) closeMenu(); });
  matchMedia('(min-width: 761px)').addEventListener('change', () => closeMenu());
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionToggle = document.querySelector('#motion-toggle');
  let effectsEnabled = !reduced.matches;
  function setEffects(enabled) {
    effectsEnabled = enabled && !reduced.matches;
    document.documentElement.classList.toggle('fx-off', !effectsEnabled);
    motionToggle?.setAttribute('aria-pressed', String(effectsEnabled));
    const label = motionToggle?.querySelector('[data-motion-label]');
    if (label) label.textContent = effectsEnabled ? 'ON' : 'OFF';
    if (motionToggle) motionToggle.title = reduced.matches ? 'Your system’s reduced motion preference is active.' : 'Toggle ambient animation';
  }
  motionToggle?.addEventListener('click', () => setEffects(!effectsEnabled));
  reduced.addEventListener('change', () => setEffects(!reduced.matches));
  setEffects(effectsEnabled);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav?.querySelectorAll('a').forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-18% 0px -50% 0px', threshold: 0});
    document.querySelectorAll('main>section[id]').forEach(section => observer.observe(section));
  }
  document.querySelectorAll('.tool-rows details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) document.querySelectorAll('.tool-rows details').forEach(other => { if (other !== detail) other.open = false; });
    });
  });
  const copy = document.querySelector('#copy-email');
  const status = document.querySelector('#copy-status');
  let copyTimer;
  copy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('davidkhaliqi05@gmail.com');
      copy.querySelector('[data-copy-label]').textContent = 'COPIED';
      status.textContent = 'Email address copied. Ready when you are.';
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { copy.querySelector('[data-copy-label]').textContent = 'COPY EMAIL'; }, 2500);
    } catch {
      status.textContent = 'Copy davidkhaliqi05@gmail.com, or select the email link to open your mail app.';
    }
  });
})();
