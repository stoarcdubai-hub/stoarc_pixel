/* ============ SERVICES BOX: hover / tap shows the description ============ */
import { heroST } from './scroll-scenes.js';

const box   = document.getElementById('services');
const panel = document.getElementById('sx-panel');
const list  = document.getElementById('si-list');
const rows  = [...document.querySelectorAll('#si-list .si-row')];

if (box && panel && list && rows.length) {
  const dNum  = panel.querySelector('.sd-num');   // optional: may no longer exist
  const dName = panel.querySelector('.sd-name');
  const dDesc = panel.querySelector('.sd-desc');

  const showDetail = row => {
    if (dNum) dNum.textContent = row.querySelector('.si-num')?.textContent ?? '';
    dName.textContent = row.querySelector('.si-name').textContent;
    dDesc.textContent = row.querySelector('.si-desc').textContent;
    panel.classList.add('has-detail');
    rows.forEach(r => r.classList.toggle('on', r === row));
  };
  const clearDetail = () => {
    panel.classList.remove('has-detail');
    rows.forEach(r => r.classList.remove('on'));
  };

  rows.forEach(row => {
    const btn = row.querySelector('.si-btn');
    row.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') showDetail(row); });   // mouse: pointer on the cell
    btn.addEventListener('focus', () => showDetail(row));                                              // keyboard
    btn.addEventListener('click', () => showDetail(row));                                              // touch: tap
  });
  list.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') clearDetail(); });
  document.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' && !box.contains(e.target)) clearDetail(); });

  // "SERVICES" links (header, mobile menu, skip link) jump to scene 2, where the box is fully shown
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#services"]');
    if (!a || !heroST) return;
    e.preventDefault();
    window.scrollTo({ top: heroST.start + (heroST.end - heroST.start) * .5, behavior: 'smooth' });
  });
}