/* ---- M6 + M7. THE COMPOSER: plays each chord and schedules the next ---- */
import { R } from '../state.js';
import { MUSIC, BEAT, CHORD_BEATS, CHORD_LEN, CHORDS, ARP_PATTERN, mtof } from './settings.js';
import { audio, tone } from './engine.js';

/* ---- M6. PLAY ONE CHORD (schedules every layer for the next ~7 seconds) ---- */
function playChord(ch,t){
  const { ac, filt, verbIn, delayIn } = audio;
  // 1) PAD: each chord note twice, slightly detuned. Slow 2.4s fade in/out so chords melt into each other
  ch.pad.forEach((n,i)=>{
    [-6,6].forEach(det=>tone(mtof(n),i<3?'triangle':'sine',t,CHORD_LEN+2.4,.035,2.4,2.4,[filt,verbIn],det));
  });
  // 2) BASS: deep root note plus a quiet octave above it
  tone(mtof(ch.bass),'sine',t,CHORD_LEN+1.5,.22,1.2,1.5,[filt]);
  tone(mtof(ch.bass+12),'triangle',t,CHORD_LEN+1.5,.04,1.2,1.5,[filt]);

  // 3) PULSE: soft heartbeat thump every 2 beats (a falling sine = a kick drum)
  if(MUSIC.pulse) for(let b=0;b<CHORD_BEATS;b+=2){
    const tt=t+b*BEAT, o=ac.createOscillator(), g=ac.createGain();
    o.type='sine'; o.frequency.setValueAtTime(110,tt); o.frequency.exponentialRampToValueAtTime(42,tt+.35);
    g.gain.setValueAtTime(.0001,tt); g.gain.linearRampToValueAtTime(.2,tt+.01); g.gain.exponentialRampToValueAtTime(.0001,tt+.6);
    o.connect(g); g.connect(filt); o.start(tt); o.stop(tt+.7);
  }

  // 4) ARPEGGIO: an up-and-down pattern of plucked notes every half beat (30% are skipped so it feels human)
  if(MUSIC.arp) for(let s=0;s<CHORD_BEATS*2;s++){
    if(R()<.3) continue;
    const n=ch.pad[ARP_PATTERN[s%ARP_PATTERN.length]%ch.pad.length]+(s%8===7?24:12);   // an octave (or two) above the pad
    tone(mtof(n),'triangle',t+s*BEAT/2,1.8,.05,.01,1.7,[filt,verbIn,delayIn]);
  }

  // 5) BELLS: 1-2 soft bells at random moments, with a higher "ring" partial for a metallic tone
  if(MUSIC.bells) for(let k=0;k<1+Math.floor(R()*2);k++){
    const bt=t+R()*(CHORD_LEN-1), n=ch.pad[Math.floor(R()*ch.pad.length)]+24;
    tone(mtof(n),'sine',bt,5,.05,.01,4.9,[filt,verbIn]);
    tone(mtof(n)*2.76,'sine',bt,2.5,.012,.01,2.4,[filt,verbIn]);
  }
}

/* ---- M7. SCHEDULER: queues the next chord a few seconds before it is needed ---- */
export function schedule(){
  while(audio.nextT < audio.ac.currentTime+2.5){
    playChord(CHORDS[audio.chordIdx%CHORDS.length], audio.nextT);
    audio.chordIdx++; audio.nextT += CHORD_LEN;
  }
}