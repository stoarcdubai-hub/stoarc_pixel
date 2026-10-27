/* ---- M8 to M11. CONTROLS: Sound button, auto-start, tab pause, scroll filter ---- */
import { gsap } from '../gsap-setup.js';
import { S } from '../state.js';
import { MUSIC } from './settings.js';
import { audio, buildAudio } from './engine.js';
import { schedule } from './composer.js';

const sndBtn = document.getElementById('sound'), sndTxt = sndBtn.querySelector('span');

/* ---- M8. ON / OFF ---- */
function setMusic(next){
  if(!audio.ac && !buildAudio()) return;
  const ac = audio.ac, master = audio.master;
  audio.on=next; audio.started=true;
  const on = audio.on;
  ac.resume();                                                       // browsers start audio "suspended" until a click
  const t=ac.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(master.gain.value,t);
  master.gain.linearRampToValueAtTime(on?MUSIC.volume:0,t+(on?2.5:.8)); // fade in 2.5s / fade out 0.8s
  if(on){
    if(!audio.timer){ audio.nextT=ac.currentTime+.1; schedule(); audio.timer=setInterval(schedule,500); }
  }else{
    setTimeout(()=>{ if(!audio.on) ac.suspend(); },1000);            // pause the engine once the fade-out is done
  }
  sndBtn.classList.toggle('on',on);                                  // makes the bars dance
  sndBtn.setAttribute('aria-pressed',on);
  sndTxt.textContent = on ? 'SOUND ON' : 'SOUND OFF';
}
sndBtn.onclick = ()=>setMusic(!audio.on);

/* ---- M9. AUTO-START on the first click / tap / key press anywhere on the page ---- */
function firstTouch(e){
  if(audio.started) return;
  if(e.target.closest && e.target.closest('#sound')) return;        // the Sound button handles its own click
  setMusic(true);
}
['pointerdown','touchend','keydown'].forEach(ev=>addEventListener(ev,firstTouch,{passive:true}));

/* ---- M10. PAUSE when the browser tab is hidden, resume when it comes back ---- */
document.addEventListener('visibilitychange',()=>{
  const ac = audio.ac;
  if(!ac) return;
  if(document.hidden) ac.suspend(); else if(audio.on) ac.resume();
});

/* ---- M11. SCROLL CONTROLS THE SOUND: filter opens as the tower explodes (muffled -> bright) ---- */
gsap.ticker.add(()=>{ if(audio.filt) audio.filt.frequency.setTargetAtTime(900+S.ex*2200,audio.ac.currentTime,.3); });