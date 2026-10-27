/* ============ K. MARQUEE + SCROLL REVEALS ============ */
import { gsap } from './gsap-setup.js';

const mq=document.getElementById('mq'), line='ARCHITECTURE ■ INTERIOR DESIGN ■ MASTER PLANNING ■ MEP DESIGN ■ BIM ■ LANDSCAPE ■ GREEN BUILDING ■ '; // edit marquee words here
mq.textContent=line.repeat(4);
gsap.to(mq,{xPercent:-50,ease:'none',duration:40,repeat:-1});       // duration = speed (bigger = slower)
// Fade + slide up each list row, column and heading as it enters the screen
gsap.utils.toArray('.list>li,.about>div,.div1,.contact>div,.block h2').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%'}}));