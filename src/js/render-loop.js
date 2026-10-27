/* ============ I. RENDER LOOP (runs every frame) ============ */
import * as THREE from 'three';
import { gsap } from './gsap-setup.js';
import { S, N, PITCH, GAP } from './state.js';
import { renderer, scene, camera } from './scene.js';
import { levels, core } from './tower.js';
import { ringA, ringB } from './drafting.js';
import { dust } from './dust.js';
import { m } from './input.js';

const lbls=[document.getElementById('l0'),document.getElementById('l1'),document.getElementById('l2')], lbIdx=[0,7,15], v=new THREE.Vector3(); // lbIdx = which floors get a label
const exEl=document.getElementById('ex');

const clock=new THREE.Clock();
gsap.ticker.add(()=>{
  const t=clock.getElapsedTime();
  m.sx+=(m.x-m.sx)*.05; m.sy+=(m.y-m.sy)*.05;                      // smooth mouse follow
  S.ang+=.0012;                                                     // slow constant camera orbit
  // Position every floor: base height + explode gap + intro drop
  levels.forEach(lv=>{ lv.position.y=lv.userData.i*(PITCH+S.ex*GAP)+lv.userData.drop; });
  // Stretch the core line to match the exploded height
  const Hc=(N-1)*(PITCH+S.ex*GAP)+PITCH;
  core.scale.y=Hc/(N*PITCH); core.position.y=Hc/2; core.material.opacity=.3*(1-S.ex*.6);
  ringA.rotation.y=t*.05; ringB.rotation.y=-t*.03;
  dust.position.y=Math.sin(t*.3)*.3;
  // Camera orbits the tower; mouse nudges angle and height
  const a=S.ang+m.sx*.35;
  camera.position.set(Math.cos(a)*S.rad, S.h+m.sy*1.2, Math.sin(a)*S.rad);
  camera.lookAt(0,S.lookY,0);
  renderer.render(scene,camera);
  // Move the HTML labels so they stick to their floors
  lbls.forEach((el,k)=>{
    v.set(2.6,levels[lbIdx[k]].position.y,0); v.project(camera);
    const x=(v.x*.5+.5)*innerWidth, y=(-v.y*.5+.5)*innerHeight;
    el.style.transform=`translate(${x}px,${y}px)`;
    el.style.opacity=(S.intro*S.hero)*(v.z<1?1:0);                  // hidden during intro, after scene 2, or behind the camera
  });
  exEl.textContent=String(Math.round(S.ex*100)).padStart(3,'0');    // "Explode 000%" readout
});