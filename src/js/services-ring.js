/* ============ SERVICES RING (scroll-driven, starts as the section enters) ============ */
import { gsap } from './gsap-setup.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const sec   = document.querySelector('.svc-sec');
const ring  = document.getElementById('ring');
const items = gsap.utils.toArray('#ring .orbit li');

if (sec && ring && items.length) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small  = matchMedia('(max-width: 760px), (pointer: coarse)').matches;
  const line = ring.querySelector('.ring-line');
  const core = ring.querySelector('.ring-core');
  const N = items.length;

  // position of item i on the circle (starts at the top, goes clockwise)
  const pos = i => {
    const a = (-90 + i * 360 / N) * Math.PI / 180, R = ring.offsetWidth / 2;
    return { x: Math.cos(a) * R, y: Math.sin(a) * R };
  };

  // which side the name is written on: r = right, l = left, t = above, b = below
  items.forEach((li, i) => {
    const a = (-90 + i * 360 / N) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    li.dataset.side = Math.abs(c) < .2 ? (s < 0 ? 't' : 'b') : (c > 0 ? 'r' : 'l');
  });

  if (reduce) {
    // no movement: just place everything on the circle
    const place = () => gsap.set(items, { x: i => pos(i).x, y: i => pos(i).y });
    place();
    addEventListener('resize', place);
  } else {
    // The ring forms while the section scrolls into view:
    // it starts when the section peeks in at the bottom and is complete when it reaches the top.
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sec,
        start: small ? 'top 52%' : 'top 52%',
        end:   small ? 'top 12%' : 'top 8%',
        scrub: small ? .5 : .8,
        invalidateOnRefresh: true
      }
    });
    tl.fromTo(line,  { scale: .12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 0)
      .fromTo(items, { x: 0, y: 0, scale: .2, opacity: 0 },
                     { x: i => pos(i).x, y: i => pos(i).y, scale: 1, opacity: 1, duration: 1, stagger: { each: .035 } }, 0)
      .fromTo(core,  { scale: .88, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 0);
  }
}