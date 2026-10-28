/* ============ G. BLACK / WHITE THEME ============ */
import * as THREE from 'three';
import { renderer, scene } from './scene.js';
import { dark, glass, lineW, lineSoft, lineCtx } from './materials.js';
import { ringB } from './drafting.js';
import { dust } from './dust.js';

const root=document.documentElement;
const metaTheme=document.querySelector('meta[name="theme-color"]');
const themeBtn=document.getElementById('theme');
let grid;                                                           // ground grid is rebuilt on every theme change
function setGrid(d){
  if(grid){scene.remove(grid);grid.geometry.dispose();grid.material.dispose();}
  grid=new THREE.GridHelper(120,120,d?0x666666:0x999999,d?0x2a2a2a:0xd8d8d8); // (centre line, other lines) greys
  grid.material.transparent=true; grid.material.opacity=.55; scene.add(grid);
}
function applyTheme(mode){
  const d=mode==='dark', ink=d?0xffffff:0x000000, bg=d?0x000000:0xffffff;
  root.dataset.theme=mode;                                          // switches the CSS colours
  renderer.setClearColor(bg,1);                                     // scene background
  scene.fog.color.setHex(bg);
  dark.color.setHex(d?0x050505:0xffffff);                           // solid fill matches background
  glass.color.setHex(ink); glass.opacity=d?.05:.07;
  [lineW,lineSoft,lineCtx,ringB.material,dust.material].forEach(m=>m.color.setHex(ink)); // all lines + dust
  setGrid(d);
  if(metaTheme) metaTheme.setAttribute('content',d?'#000000':'#ffffff'); // phone browser bar follows the theme
  if(themeBtn) themeBtn.setAttribute('aria-label',d?'Switch to white theme':'Switch to black theme');
  try{localStorage.setItem('stoarc-theme',mode)}catch(e){}          // remember the visitor's choice
}
applyTheme(root.dataset.theme==='light'?'light':'dark');            // apply saved / default theme on load
if(themeBtn) themeBtn.onclick=()=>applyTheme(root.dataset.theme==='dark'?'light':'dark');