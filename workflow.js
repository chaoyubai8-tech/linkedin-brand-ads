// Progressive enhancement only: the complete workflow is readable without JavaScript.
(() => {
  const links = [...document.querySelectorAll('.sidebar nav a')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  let queued = false;
  function highlight() {
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 160) active = section;
    }
    for (const link of links) {
      if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    queued = false;
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(highlight); }
  }, { passive: true });
  window.addEventListener('resize', highlight);
  window.addEventListener('hashchange', highlight);
  highlight();
})();
