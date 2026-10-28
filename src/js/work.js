/* ============ WORK PAGE ENTRY ============
   This is the only script work.html loads. It just imports the other files.
   ORDER MATTERS (same order as the original single script):
   objects must exist before the theme, the theme before the loop, and the
   render loop is registered before the music's scroll filter.                */
import './mobile-nav.js';
import './gsap-setup.js';        // GSAP + ScrollTrigger (registered once)

/* 3D scene */
import './scene.js';             // A. renderer, scene, camera
import './materials.js';         // B. materials
import './drafting.js';          // C. ground rings + tick marks
import './tower.js';             // D. the 16-floor tower
import './context.js';           // E. surrounding buildings
import './dust.js';              // F. floating dust

/* Behaviour */
import './theme.js';             // G. black / white theme
import './input.js';            // H. resize + mouse
import './render-loop.js';       // I. per-frame render loop
import './scroll-scenes.js';     // J. 3-scene pinned scroll (hero pin must come first)
import './services-ring.js';     // J1. services ring (pinned)
import './scroll-scenes.js';     // J. 3-scene pinned scroll (hero pin must come first)
import './projects-scroll.js';   // J2. projects slider (pinned, right to left)
import './marquee-reveals.js';   // K. marquee + scroll reveals
import './intro.js';             // L. loader + intro animation

/* Sound */
import './music/controls.js';    // M. background music (pulls in settings, engine, composer)