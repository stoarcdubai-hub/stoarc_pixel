/* ============ K. SCROLL REVEALS ============ */
import { gsap } from './gsap-setup.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  gsap.utils.toArray('.about>div,.div1,.contact>div,.block h2:not(.pj h2):not(.svc-sec h2)').forEach(el =>
    gsap.from(el, { y: 40, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
  );
}