/* ============ F. FLOATING DUST ============ */
import * as THREE from 'three';
import { scene } from './scene.js';
import { R } from './state.js';

const dp=new Float32Array(500*3); for(let i=0;i<500;i++){dp[i*3]=(R()-.5)*60;dp[i*3+1]=R()*24;dp[i*3+2]=(R()-.5)*60;}
const dg=new THREE.BufferGeometry(); dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
export const dust=new THREE.Points(dg,new THREE.PointsMaterial({size:.07,color:0xffffff,transparent:true,opacity:.7,depthWrite:false})); scene.add(dust);