/* ============ L. INTRO SEQUENCE ============ */
import { gsap } from './gsap-setup.js';
import { S } from './state.js';
import { levels } from './tower.js';
import { ctx } from './context.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small  = matchMedia('(max-width: 860px)').matches;

gsap.set('.hero .ln>span',{yPercent:110});
gsap.set('.hero .kick,.hero .hud',{opacity:0});
ctx.forEach(g=>g.scale.y=.001);
S.rad=34; S.h=14;

const pct=document.getElementById('pct'),c={v:0};
const tl=gsap.timeline({paused:true});
tl.to(c,{v:100,duration:1.8,ease:'power2.inOut',onUpdate:()=>{ if(pct) pct.textContent=String(Math.round(c.v)).padStart(3,'0'); }})
  .to('#pre',{yPercent:-100,duration:1,ease:'power4.inOut'})
  .to(S,{rad:24,h:8,duration:3.2,ease:'power3.out'},'-=.7');
levels.forEach((lv,k)=>tl.to(lv.userData,{drop:0,duration:1.4,ease:'power3.out'},'-=' + (k===0?2.6:1.32)));
ctx.forEach((g,k)=>tl.to(g.scale,{y:g.userData.h,duration:1.2,ease:'power3.out'},1.6+k*.012));
tl.to('.hero .ln>span',{yPercent:0,duration:1.3,ease:'power4.out',stagger:.12},2.2)
  .to('.hero .kick,.hero .hud',{opacity:1,duration:.8},2.8)
  .to(S,{intro:1,duration:.8},3)
  .set('#pre',{display:'none'});

if (reduce) {
  tl.progress(1);                       // jump straight to the finished state
} else {
  if (small) tl.timeScale(1.6);         // faster on phones
  const fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();
  Promise.race([fontsReady, new Promise(r=>setTimeout(r,2500))]).then(()=>tl.play());
}