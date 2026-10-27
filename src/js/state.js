/* SHARED STATE + CONSTANTS used by many files */

export const R = Math.random;   // short name for random numbers

/* S = shared animation state. GSAP animates these values; the render loop reads them.
   ex = explode amount (0-1), ang = camera orbit angle, rad = camera distance,
   h = camera height, lookY = height the camera looks at */
export const S = {ex:0, ang:.75, rad:24, h:8, lookY:6, intro:0, hero:1};

// N = tower levels, PITCH = floor height, GAP = extra gap when exploded
export const N = 16, PITCH = .8, GAP = 1.1;