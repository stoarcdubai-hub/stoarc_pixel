/* ---- M3. AUDIO STATE ---- */
import { MUSIC, BEAT } from './settings.js';

/* One shared object holds everything the music files need to share.
   (In the original single file these were separate variables: ac, master, filt, ...)
   ac = audio context, master/filt/verbIn/delayIn = main mixing nodes,
   on = music playing, started = visitor has interacted once,
   nextT = time of next chord, chordIdx = which chord, timer = scheduler interval handle */
export const audio = {
  ac:null, master:null, filt:null, verbIn:null, delayIn:null,
  on:false, started:false,
  nextT:0, chordIdx:0, timer:null
};

/* ---- M4. BUILD THE AUDIO GRAPH (runs once, on first click) ----
   Signal flow:  sounds -> filt (tone) -> master -> compressor -> speakers
                 sounds -> verbIn (reverb) -> master
                 sounds -> delayIn (echo)  -> filt + reverb                   */
export function buildAudio(){
  const AC = window.AudioContext||window.webkitAudioContext;
  if(!AC){ console.warn('Web Audio is not supported in this browser'); return false; }
  const ac = audio.ac = new AC();

  // Master volume (starts silent, fades in) + compressor so loud moments never distort
  const master = audio.master = ac.createGain(); master.gain.value = 0;
  const comp = ac.createDynamicsCompressor();
  master.connect(comp); comp.connect(ac.destination);

  // Tone filter: cuts the harsh highs. The scroll opens this up (see M11 in controls.js)
  const filt = audio.filt = ac.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=900; filt.Q.value=.5;
  filt.connect(master);

  // Reverb: a generated burst of fading noise = the sound of a big empty hall
  const len = ac.sampleRate*3.2, imp = ac.createBuffer(2,len,ac.sampleRate);
  for(let ch=0;ch<2;ch++){ const d=imp.getChannelData(ch); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5); }
  const conv = ac.createConvolver(); conv.buffer = imp;
  const wet = ac.createGain(); wet.gain.value = MUSIC.reverb;
  const verbIn = audio.verbIn = ac.createGain();
  verbIn.connect(conv); conv.connect(wet); wet.connect(master);

  // Echo: repeats notes 3/4 of a beat later, fading out (gives the arpeggio its shimmer)
  const delayIn = audio.delayIn = ac.createGain();
  const del = ac.createDelay(2); del.delayTime.value = BEAT*.75;
  const fb = ac.createGain(); fb.gain.value = .38;           // feedback = how many repeats
  const dOut = ac.createGain(); dOut.gain.value = .45;       // echo loudness
  delayIn.connect(del); del.connect(fb); fb.connect(del);
  del.connect(dOut); dOut.connect(filt); dOut.connect(verbIn);

  // Wind: looping noise through a slowly moving band-pass filter
  if(MUSIC.wind){
    const nb = ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate), nd = nb.getChannelData(0);
    for(let i=0;i<nd.length;i++) nd[i]=Math.random()*2-1;
    const src = ac.createBufferSource(); src.buffer=nb; src.loop=true;
    const bp = ac.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=650; bp.Q.value=.9;
    const wg = ac.createGain(); wg.gain.value=.035;           // wind loudness
    const lfo = ac.createOscillator(), lg = ac.createGain();   // slow sweep of the wind pitch
    lfo.frequency.value=.07; lg.gain.value=320; lfo.connect(lg); lg.connect(bp.frequency); lfo.start();
    src.connect(bp); bp.connect(wg); wg.connect(filt); src.start();
  }
  return true;
}

/* ---- M5. ONE NOTE (the building block for every instrument) ----
   f = frequency, type = wave shape, t = start time, dur = total length,
   vol = loudness, att = fade-in time, rel = fade-out time,
   outs = where to send it, det = slight detune (makes pads wider)       */
export function tone(f,type,t,dur,vol,att,rel,outs,det){
  const ac = audio.ac;
  const o=ac.createOscillator(), g=ac.createGain();
  o.type=type; o.frequency.value=f; o.detune.value=det||0;
  g.gain.setValueAtTime(.0001,t);
  g.gain.linearRampToValueAtTime(vol,t+att);                         // fade in
  const hold=Math.max(att,dur-rel);                                  // stay at full volume until the fade-out starts
  g.gain.setValueAtTime(vol,t+hold);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);                  // fade out
  o.connect(g); outs.forEach(n=>g.connect(n));
  o.start(t); o.stop(t+dur+.1);
}