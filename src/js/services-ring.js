/* ============ SERVICES INDEX (drawing-index list) ============ */
import { gsap } from './gsap-setup.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const head = document.getElementById('si-head');
const list = document.getElementById('si-list');
const rows = gsap.utils.toArray('#si-list .si-row');

if (head && list && rows.length) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide   = matchMedia('(min-width: 900px) and (hover: hover)');

  const dNum  = head.querySelector('.sd-num');
  const dName = head.querySelector('.sd-name');
  const dDesc = head.querySelector('.sd-desc');

  const setOpen = (row, open) => {
    row.classList.toggle('open', open);
    row.querySelector('.si-btn').setAttribute('aria-expanded', String(open));
  };
  const closeAll = () => rows.forEach(r => setOpen(r, false));

  /* desktop: hovering a row shows its description in the left column */
  const showDetail = row => {
    dNum.textContent  = row.querySelector('.si-num').textContent;
    dName.textContent = row.querySelector('.si-name').textContent;
    dDesc.textContent = row.querySelector('.si-more p').textContent;
    head.classList.add('has-detail');
    rows.forEach(r => r.classList.toggle('on', r === row));
  };
  const clearDetail = () => {
    head.classList.remove('has-detail');
    rows.forEach(r => r.classList.remove('on'));
  };

  rows.forEach(row => {
    const btn = row.querySelector('.si-btn');
    row.addEventListener('pointerenter', e => { if (wide.matches && e.pointerType === 'mouse') showDetail(row); });
    btn.addEventListener('focus', () => { if (wide.matches) showDetail(row); });
    btn.addEventListener('click', () => {
      if (wide.matches) { showDetail(row); return; }
      const was = row.classList.contains('open');   // phones and tablets: tap to open under the row
      closeAll();
      setOpen(row, !was);
    });
  });
  list.addEventListener('pointerleave', e => { if (wide.matches && e.pointerType === 'mouse') clearDetail(); });
  wide.addEventListener('change', () => { closeAll(); clearDetail(); });

  /* scroll animation: each line draws itself, each name slides up from behind it */
  if (!reduce) {
    rows.forEach(row => {
      const st = { trigger: row, start: 'top 90%', once: true };
      gsap.fromTo(row, { '--p': 0 }, { '--p': 1, duration: 1.1, ease: 'power3.out', scrollTrigger: st });
      gsap.from(row.querySelector('.si-name > span'), { yPercent: 105, duration: .9, ease: 'power3.out', scrollTrigger: st });
    });
  }
}