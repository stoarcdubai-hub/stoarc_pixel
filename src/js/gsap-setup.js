/* GSAP SETUP: loads GSAP + ScrollTrigger from npm and registers the plugin ONCE.
   Every other file imports `gsap` from here, so the plugin is always ready. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };