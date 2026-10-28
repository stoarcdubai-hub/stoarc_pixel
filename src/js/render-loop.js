/* ============ I. RENDER LOOP (runs every frame) ============ */
import * as THREE from 'three';
import { gsap } from './gsap-setup.js';
import { S, N, PITCH, GAP } from './state.js';
import { renderer, scene, camera } from './scene.js';
import { levels, core } from './tower.js';
import { ringA, ringB } from './drafting.js';
import { dust } from './dust.js';
import { m } from './input.js';

const lbls=[document.getElementById('l0'),document.getElementById('l1'),document.getElementById('l2')], lbIdx=[0,7,15], v=new THREE.Vector3();
const exEl=document.getElementById('ex');

const small = matchMedia('(max-width: 860px), (pointer: coarse)').matches;
let W=innerWidth, H=innerHeight, frame=0, lastEx='';
const lastOp=[null,null,null];
addEventListener('resize',()=>{ W=innerWidth; H=innerHeight; });

// If the graphics context is lost (phone low on memory), let it recover
renderer.domElement.addEventListener('webglcontextlost',e=>e.preventDefault());

const clock=new THREE.Clock();
gsap.ticker.add(()=>{
  const t=clock.getElapsedTime();
  m.sx+=(m.x-m.sx)*.05; m.sy+=(m.y-m.sy)*.05;
  S.ang+=.0012;
  levels.forEach(lv=>{ lv.position.y=lv.userData.i*(PITCH+S.ex*GAP)+lv.userData.drop; });
  const Hc=(N-1)*(PITCH+S.ex*GAP)+PITCH;
  core.scale.y=Hc/(N*PITCH); core.position.y=Hc/2; core.material.opacity=.3*(1-S.ex*.6);
  ringA.rotation.y=t*.05; ringB.rotation.y=-t*.03;
  dust.position.y=Math.sin(t*.3)*.3;
  const a=S.ang+m.sx*.35;
  camera.position.set(Math.cos(a)*S.rad, S.h+m.sy*1.2, Math.sin(a)*S.rad);
  camera.lookAt(0,S.lookY,0);

  // Phones: draw every second frame (half the work, looks almost the same)
  frame++;
  if (small && (frame & 1)) return;

  renderer.render(scene,camera);

  // Floor-label capsules: pop in one after another from the side (scene 2)
  const lab=S.lab||0;
  lbls.forEach((el,k)=>{
    v.set(2.6,levels[lbIdx[k]].position.y,0); v.project(camera);
    const x=(v.x*.5+.5)*W, y=(-v.y*.5+.5)*H;
    el.style.transform=`translate(${x}px,${y}px)`;
    const p=Math.min(1,Math.max(0,lab*1.7-k*.35));          // each capsule starts a little after the one before
    const e=1-(1-p)*(1-p)*(1-p);                            // ease-out
    el.style.translate=`${(1-e)*70}px 0`;                   // slides in from the right side
    const op=String((S.intro*S.hero*e)*(v.z<1?1:0));
    if (op!==lastOp[k]) { el.style.opacity=op; lastOp[k]=op; }
  });

  const ex=String(Math.round(S.ex*100)).padStart(3,'0');
  if (ex!==lastEx) { exEl.textContent=ex; lastEx=ex; }
});