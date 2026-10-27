/* ============ A. RENDERER, SCENE, CAMERA ============ */
import * as THREE from 'three';

export const renderer = new THREE.WebGLRenderer({canvas:document.getElementById('gl'),antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));

export const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 20, 75);     // distant objects fade into the background colour

export const camera = new THREE.PerspectiveCamera(45,1,.1,150);