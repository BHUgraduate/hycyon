(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // Theme: follow the system until the visitor chooses.
  const themeBtn = $('.theme-btn');
  const setTheme = (t, save) => {
    root.dataset.theme = t;
    if (save) try { localStorage.setItem('hycyon-theme', t); } catch {}
    themeBtn?.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };
  setTheme(root.dataset.theme || 'light', false);
  themeBtn?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    try { if (localStorage.getItem('hycyon-theme')) return; } catch {}
    setTheme(e.matches ? 'dark' : 'light', false);
  });

  // Mobile menu
  const menuBtn = $('.menu-btn');
  const nav = $('#site-nav');
  const toggleMenu = (open) => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn?.addEventListener('click', () => toggleMenu(!nav.classList.contains('open')));
  nav?.addEventListener('click', (e) => { if (e.target.closest('a')) toggleMenu(false); });

  // Ecosystem menu
  const trigger = $('.nav-trigger');
  const panel = $('#eco-panel');
  const isMobile = () => matchMedia('(max-width: 767px)').matches;
  const togglePanel = (open) => {
    trigger.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };
  trigger?.addEventListener('click', () => togglePanel(panel.hidden));
  document.addEventListener('click', (e) => { if (!e.target.closest('.eco') && !isMobile()) togglePanel(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!panel.hidden) { togglePanel(false); trigger.focus(); }
    else if (nav.classList.contains('open')) { toggleMenu(false); menuBtn.focus(); }
  });

  // Section reveals
  const items = document.querySelectorAll('.reveal');
  if (reduce.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
  }

  // Ecosystem diagram: highlight the connection of the focused / hovered node; honour reduced motion.
  const svg = $('.ecosystem svg');
  if (svg) {
    const spokes = svg.querySelectorAll('.eco-spoke');
    const mark = (id, on) => spokes.forEach((s) => s.classList.toggle('active', on && s.dataset.spoke === id));
    svg.querySelectorAll('.eco-node').forEach((n) => {
      const id = n.dataset.node;
      n.addEventListener('pointerenter', () => mark(id, true));
      n.addEventListener('pointerleave', () => mark(id, false));
      n.addEventListener('focusin', () => mark(id, true));
      n.addEventListener('focusout', () => mark(id, false));
    });
    const sync = () => (reduce.matches ? svg.pauseAnimations() : svg.unpauseAnimations());
    sync();
    reduce.addEventListener('change', sync);
  }
})();
