/* ============ C. DRAFTING RINGS (circles on the ground) ============ */
import * as THREE from 'three';
import { scene } from './scene.js';
import { lineW } from './materials.js';

// Draws one circle of radius r on the ground. dashed = true gives a dashed line.
function ring(r,dashed){
  const pts=[]; for(let i=0;i<=160;i++){const a=i/160*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*r,.02,Math.sin(a)*r));}
  const g=new THREE.BufferGeometry().setFromPoints(pts);
  const l=new THREE.Line(g,dashed?new THREE.LineDashedMaterial({color:0xffffff,dashSize:.35,gapSize:.25,transparent:true,opacity:.6}):lineW);
  if(dashed) l.computeLineDistances(); scene.add(l); return l;
}
export const ringA=ring(7,false), ringB=ring(10,true);   // inner solid ring + outer dashed ring

// Compass-style tick marks around the inner ring
const ticks=[]; for(let i=0;i<36;i++){const a=i/36*Math.PI*2,r0=7,r1=i%9===0?7.9:7.4;
  ticks.push(new THREE.Vector3(Math.cos(a)*r0,.02,Math.sin(a)*r0),new THREE.Vector3(Math.cos(a)*r1,.02,Math.sin(a)*r1));}
scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ticks),lineW));