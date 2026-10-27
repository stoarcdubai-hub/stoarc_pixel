/* ============ B. MATERIALS (colours are set by applyTheme in theme.js) ============ */
import * as THREE from 'three';

export const dark = new THREE.MeshBasicMaterial({color:0x050505,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}); // solid fill that hides lines behind it
export const glass = new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.05,depthWrite:false});               // faint glass volume
export const lineW = new THREE.LineBasicMaterial({color:0xffffff});                                                             // main linework
export const lineSoft = new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.3});                              // soft linework
export const lineCtx = new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.4});                               // surrounding buildings