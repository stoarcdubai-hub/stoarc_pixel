/* PROJECT PAGES SCRIPT: the only JavaScript project pages need.
   Black / white switch. Uses the same saved key ('stoarc-theme') as the home page,
   so the visitor's choice carries over between pages. */
import '../css/style.css';
import '../css/project.css';
import './mobile-nav.js';

const root = document.documentElement;
document.getElementById('theme').onclick = () => {
  const mode = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = mode;                                    // switches the CSS colours
  try { localStorage.setItem('stoarc-theme', mode); } catch (e) {}
};

// Gallery arrows
(function () {
  const gallery = document.querySelector('.pp .gallery');
  if (!gallery) return;

  const wrap = document.createElement('div');
  wrap.className = 'gal-wrap';
  gallery.parentNode.insertBefore(wrap, gallery);
  wrap.appendChild(gallery);

  const mk = (cls, label, txt) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'gal-btn ' + cls;
    b.setAttribute('aria-label', label);
    b.textContent = txt;
    wrap.appendChild(b);
    return b;
  };
  const prev = mk('gal-prev', 'Previous image', '←');
  const next = mk('gal-next', 'Next image', '→');

  const step = dir => gallery.scrollBy({ left: dir * gallery.clientWidth, behavior: 'smooth' });
  const update = () => {
    const many = gallery.scrollWidth > gallery.clientWidth + 2;
    prev.hidden = next.hidden = !many;
    prev.disabled = gallery.scrollLeft < 2;
    next.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
  };

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  gallery.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  update();
})();