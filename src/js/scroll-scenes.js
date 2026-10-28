/* ============ J. 3-SCENE SCROLL (hero is pinned for 300% = 3 screens) ============ */
import { gsap } from './gsap-setup.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { S } from './state.js';

const small = matchMedia('(max-width: 860px), (pointer: coarse)').matches;

// Phones: don't recalculate the pin when only the address bar changes the height
ScrollTrigger.config({ ignoreMobileResize: true });

const scEl = document.getElementById('sc');
let lastScene = '';

S.lab = 0;   // floor-label capsules: 0 = hidden, 1 = shown (scene 2 only)

gsap.timeline({
  defaults:{ease:'none',immediateRender:false},
  scrollTrigger:{
    trigger:'#top', start:'top top',
    end: small ? '+=220%' : '+=300%',                               // shorter scroll on phones
    scrub: small ? .6 : 1,
    pin:true, anticipatePin:1, invalidateOnRefresh:true,
    onUpdate:s=>{
      const p=s.progress;
      S.hero=1-Math.min(1,Math.max(0,(p-.62)/.2));                  // fades floor labels out near scene 3
      const sc='0'+(p<.34?1:p<.67?2:3);
      if (scEl && sc!==lastScene) { scEl.textContent=sc; lastScene=sc; }
    }}})
  // Continuous orbit through all 3 scenes
  .to(S,{ang:'+=2.2',duration:3},0)
  // SCENE 1 (0 -> 1): camera eases out, hero text leaves
  .fromTo(S,{rad:24,h:8,lookY:6},{rad:26,h:9,lookY:6,duration:1},0)
  .to('.hero .big,.hero .kick',{opacity:0,yPercent:-12,duration:.35},.65)
  // SCENE 2 (1 -> 2): tower explodes into separate floors
  .fromTo(S,{ex:0,rad:26,h:9,lookY:6},{ex:1,rad:34,h:15,lookY:13,duration:1},1)
  .to('.c2',{opacity:1,duration:.25},1.15)
  .to('.c2',{opacity:0,duration:.2},1.8)
  // Floor-label capsules pop in from the side during scene 2, then leave
  .fromTo(S,{lab:0},{lab:1,duration:.3},1.1)
  .to(S,{lab:0,duration:.2},1.85)
  // The 7 service capsules: 3 from the left, 3 from the right, 1 from the top
  .fromTo('.svc .l',{opacity:0,xPercent:-40},{opacity:1,xPercent:0,duration:.25,stagger:.07},1.12)
  .fromTo('.svc .r',{opacity:0,xPercent:40},{opacity:1,xPercent:0,duration:.25,stagger:.07},1.12)
  .fromTo('.svc .c',{opacity:0,yPercent:-60},{opacity:1,yPercent:0,duration:.25},1.4)
  .to('.svc li',{opacity:0,duration:.2},1.85)
  // SCENE 3 (2 -> 3): floors collapse back, camera flies to a top-down plan view
  .fromTo(S,{ex:1,rad:34,h:15,lookY:13},{ex:.25,rad:14,h:48,lookY:2,duration:1},2)
  .to('.c3',{opacity:1,duration:.25},2.15);