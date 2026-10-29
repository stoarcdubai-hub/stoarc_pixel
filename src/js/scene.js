/* ============ A. RENDERER, SCENE, CAMERA ============ */
import * as THREE from 'three';

// Quality depends on the DEVICE, not on the window width
export const isTouch = matchMedia('(pointer: coarse)').matches;
export const PR_CAP = 2;            // max pixel ratio: 2 = sharp on Retina screens and modern phones

export const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('gl'),
  antialias: true,                   // smooth edges everywhere
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(devicePixelRatio, PR_CAP));

export const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 20, 75);     // distant objects fade into the background colour

export const camera = new THREE.PerspectiveCamera(45,1,.1,150);