/* ============ J. 3-SCENE SCROLL (hero is pinned for 300% = 3 screens) ============ */
import { gsap } from './gsap-setup.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { S } from './state.js';

const small = matchMedia('(max-width: 860px), (pointer: coarse)').matches;

// Phones: don't recalculate the pin when only the address bar changes the height
ScrollTrigger.config({ ignoreMobileResize: true });

const scEl = document.getElementById('sc');
const box  = document.getElementById('services');                 // the services box (shown in scene 2)
let lastScene = '';

S.shift  = 0;   // 3D picture moved to the left (fraction of the screen width)
S.shiftY = 0;   // 3D picture moved up (fraction of the screen height)
S.spin   = 1;   // 1 = the camera orbits, 0 = paused

const isNarrow  = () => innerWidth < 520;                          // real phones: box at the bottom, building moves UP
const sideShift = () => .5 - box.offsetLeft / (2 * innerWidth);    // puts the building in the middle of the free space left of the box

const tl = gsap.timeline({
  defaults:{ease:'none',immediateRender:false},
  scrollTrigger:{
    trigger:'#top', start:'top top',
    end: small ? '+=220%' : '+=300%',                               // shorter scroll on phones
    scrub: small ? .6 : 1,
    pin:true, anticipatePin:1, invalidateOnRefresh:true,
    onUpdate:s=>{
      const p=s.progress;
      S.hero=1-Math.min(1,Math.max(0,(p-.62)/.2));
      const sc='0'+(p<.34?1:p<.67?2:3);
      if (scEl && sc!==lastScene) { scEl.textContent=sc; lastScene=sc; }
    }}})
  // Orbit: turns in scene 1, holds still in scene 2, turns again in scene 3
  .to(S,{ang:'+=.8',duration:1},0)
  .to(S,{ang:'+=1.4',duration:1},2)
  // SCENE 1 (0 -> 1): camera eases out, hero text leaves
  .fromTo(S,{rad:24,h:8,lookY:6},{rad:26,h:9,lookY:6,duration:1},0)
  .to('.hero .big,.hero .kick',{opacity:0,yPercent:-12,duration:.35},.65)
  // SCENE 2 (1 -> 2): tower explodes into separate floors
  .fromTo(S,{ex:0,rad:26,h:9,lookY:6},{ex:1,rad:34,h:15,lookY:13,duration:1},1)
  .to('.c2',{opacity:1,duration:.25},1.15)
  .to('.c2',{opacity:0,duration:.2},1.8)
  // ...the building moves aside and stops turning, the services box slides in
  .fromTo(S,{shift:0,shiftY:0,spin:1},
            {shift:()=>isNarrow()?0:sideShift(),shiftY:()=>isNarrow()?.24:0,spin:0,duration:.35,ease:'power2.out'},1)
  .fromTo(box,{autoAlpha:0,x:()=>isNarrow()?0:60,y:()=>isNarrow()?40:0},{autoAlpha:1,x:0,y:0,duration:.3,ease:'power2.out'},1.15)
  // ...and both go back before scene 3
  .to(box,{autoAlpha:0,x:()=>isNarrow()?0:-30,duration:.2},1.85)
  .to(S,{shift:0,shiftY:0,spin:1,duration:.3},1.8)
  // SCENE 3 (2 -> 3): floors collapse back, camera flies to a top-down plan view
  .fromTo(S,{ex:1,rad:34,h:15,lookY:13},{ex:.25,rad:14,h:48,lookY:2,duration:1},2)
  .to('.c3',{opacity:1,duration:.25},2.15);

export const heroST = tl.scrollTrigger;                             // other files use it to jump to scene 2