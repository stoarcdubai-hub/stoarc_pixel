/* ============ E. CONTEXT BUILDINGS (80 random blocks around the tower) ============ */
import * as THREE from 'three';
import { scene } from './scene.js';
import { dark, lineCtx } from './materials.js';
import { R } from './state.js';

export const ctx=[], ctxGeo=new THREE.BoxGeometry(1,1,1); ctxGeo.translate(0,.5,0);
const ctxEdges=new THREE.EdgesGeometry(ctxGeo);
for(let i=0;i<80;i++){                                              // change 80 for more / fewer buildings
  const a=R()*Math.PI*2, r=12+R()*26, w=1+R()*2.4, h=.8+Math.pow(R(),2)*10;
  const g=new THREE.Group(); g.position.set(Math.cos(a)*r,0,Math.sin(a)*r); g.rotation.y=R()*3;
  g.add(new THREE.Mesh(ctxGeo,dark)); g.add(new THREE.LineSegments(ctxEdges,lineCtx));
  g.scale.set(w,h,w*(.7+R()*.8)); g.userData.h=h; scene.add(g); ctx.push(g);
}