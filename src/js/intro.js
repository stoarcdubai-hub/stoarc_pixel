/* ============ L. INTRO SEQUENCE ============ */
import { gsap } from './gsap-setup.js';
import { S } from './state.js';
import { levels } from './tower.js';
import { ctx } from './context.js';

gsap.set('.hero .ln>span',{yPercent:110});                          // headline starts hidden below its mask
gsap.set('.hero .kick,.hero .hud',{opacity:0});
ctx.forEach(g=>g.scale.y=.001);                                     // context buildings start flat, then grow
S.rad=34; S.h=14;                                                   // camera starts far away
const pct=document.getElementById('pct'),c={v:0};
const tl=gsap.timeline();
tl.to(c,{v:100,duration:1.8,ease:'power2.inOut',onUpdate:()=>pct.textContent=String(Math.round(c.v)).padStart(3,'0')}) // loader counter
  .to('#pre',{yPercent:-100,duration:1,ease:'power4.inOut'})                                                           // loader slides up
  .to(S,{rad:24,h:8,duration:3.2,ease:'power3.out'},'-=.7');                                                           // camera glides in
levels.forEach((lv,k)=>tl.to(lv.userData,{drop:0,duration:1.4,ease:'power3.out'},'-=' + (k===0?2.6:1.32)));            // floors drop in one by one
ctx.forEach((g,k)=>tl.to(g.scale,{y:g.userData.h,duration:1.2,ease:'power3.out'},1.6+k*.012));                         // surrounding buildings rise
tl.to('.hero .ln>span',{yPercent:0,duration:1.3,ease:'power4.out',stagger:.12},2.2)                                   // headline reveals
  .to('.hero .kick,.hero .hud',{opacity:1,duration:.8},2.8)
  .to(S,{intro:1,duration:.8},3)                                                                                       // floor labels appear
  .set('#pre',{display:'none'});