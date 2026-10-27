/* =====================================================================
   M. BACKGROUND MUSIC  (generated live in the browser, no audio file)
   ---------------------------------------------------------------------
   A calm cinematic track in D minor that loops forever on a 4-chord
   progression:  Dm9  ->  Bbmaj7  ->  Fmaj7  ->  Gm9
   Layers:  1) warm PAD chords   2) deep BASS   3) soft heartbeat PULSE
            4) plucked ARPEGGIO with echo   5) random BELLS   6) WIND
   The sound gets brighter as the tower explodes while you scroll.
   Browsers block autoplay, so it starts on the visitor's FIRST click,
   tap or key press. The SOUND button turns it off / on.

   The music is split into 4 files in src/js/music/:
     settings.js  - M1 + M2: all the numbers you can edit (this file)
     engine.js    - M3 + M4 + M5: audio state, mixer, single note
     composer.js  - M6 + M7: the chords, layers and scheduler
     controls.js  - M8 to M11: button, auto-start, pause, scroll filter
   ===================================================================== */

/* ---- M1. SETTINGS (edit these to change the music) ---- */
export const MUSIC = {
  volume:  0.9,    // overall loudness (0 to 1)
  bpm:     70,     // tempo: lower = slower and calmer
  pulse:   true,   // soft heartbeat thump  (false = off)
  arp:     true,   // plucked arpeggio notes (false = off)
  bells:   true,   // random high bells      (false = off)
  wind:    true,   // faint wind texture     (false = off)
  reverb:  0.55    // hall echo amount (0 to 1)
};
export const BEAT = 60/MUSIC.bpm;          // length of one beat in seconds
export const CHORD_BEATS = 8;              // each chord lasts 8 beats
export const CHORD_LEN = BEAT*CHORD_BEATS; // chord length in seconds (about 6.9s at 70 bpm)

/* ---- M2. CHORDS ----
   Notes are MIDI numbers (60 = middle C). bass = deep root note, pad = chord notes.
   Change these numbers to change the mood. */
export const CHORDS = [
  {bass:38, pad:[50,53,57,60,64]},  // Dm9      (D F A C E)
  {bass:34, pad:[46,50,53,57,62]},  // Bbmaj7   (Bb D F A)
  {bass:41, pad:[53,57,60,64,69]},  // Fmaj7    (F A C E)
  {bass:43, pad:[55,58,62,65,69]}   // Gm9      (G Bb D F A)
];
export const ARP_PATTERN = [0,2,3,4,3,2,1,2];   // which chord note each arp step plays (0 = lowest)
export const mtof = n => 440*Math.pow(2,(n-69)/12);   // converts a MIDI note number to a frequency in Hz