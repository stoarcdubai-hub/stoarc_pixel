// Mobile menu: builds a full-screen menu from the existing header nav.
const header = document.querySelector('header');
const nav = header && header.querySelector('nav');
const hr = header && header.querySelector('.hr');

if (nav && hr) {
  const menu = document.createElement('div');
  menu.className = 'm-menu';
  menu.id = 'm-menu';
  nav.querySelectorAll('a').forEach(a => menu.appendChild(a.cloneNode(true)));
  const pill = hr.querySelector('.pill');
  if (pill) {
    const cta = pill.cloneNode(true);
    cta.className = 'm-cta';
    menu.appendChild(cta);
  }
  document.body.appendChild(menu);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tbtn menu-btn';
  btn.setAttribute('aria-label', 'Menu');
  btn.setAttribute('aria-controls', 'm-menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<u></u><u></u>';
  hr.appendChild(btn);

  const set = open => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => set(!menu.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  window.addEventListener('resize', () => { if (innerWidth > 900) set(false); });
}