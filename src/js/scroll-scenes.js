/* ============ J. 3-SCENE SCROLL (hero is pinned for 300% = 3 screens) ============ */
import { gsap } from './gsap-setup.js';
import { S } from './state.js';

const scEl=document.getElementById('sc');
gsap.timeline({
  defaults:{ease:'none',immediateRender:false},
  scrollTrigger:{trigger:'#top',start:'top top',end:'+=300%',scrub:1,pin:true,   // change '+=300%' for a longer / shorter scroll
    onUpdate:s=>{
      const p=s.progress;                                           // 0 -> 1 across the whole pinned scroll
      S.hero=1-Math.min(1,Math.max(0,(p-.62)/.2));                  // fades floor labels out near scene 3
      scEl.textContent='0'+(p<.34?1:p<.67?2:3);                     // updates "SCENE 01 / 03"
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
  // SCENE 3 (2 -> 3): floors collapse back, camera flies to a top-down plan view
  .fromTo(S,{ex:1,rad:34,h:15,lookY:13},{ex:.25,rad:14,h:48,lookY:2,duration:1},2)
  .to('.c3',{opacity:1,duration:.25},2.15);