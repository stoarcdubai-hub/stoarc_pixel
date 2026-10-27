/* ============ D. THE TOWER (16 floor plates + glass, slightly twisted) ============ */
import * as THREE from 'three';
import { scene } from './scene.js';
import { dark, glass, lineW, lineSoft } from './materials.js';
import { N, PITCH } from './state.js';

export const levels=[], tower=new THREE.Group(); scene.add(tower);
for(let i=0;i<N;i++){
  const lv=new THREE.Group(), w=3.4+Math.sin(i*.55)*.55;           // plate width varies along the height
  const sg=new THREE.BoxGeometry(w,.2,w);
  lv.add(new THREE.Mesh(sg,dark)); lv.add(new THREE.LineSegments(new THREE.EdgesGeometry(sg),lineW));
  if(i<N-1){                                                        // glass volume above each plate (not on the roof)
    const gg=new THREE.BoxGeometry(w*.94,PITCH-.2,w*.94), gm=new THREE.Mesh(gg,glass);
    gm.position.y=PITCH/2; lv.add(gm);
    const ge=new THREE.LineSegments(new THREE.EdgesGeometry(gg),lineSoft); ge.position.y=PITCH/2; lv.add(ge);
  }
  lv.rotation.y=i*.09;                                              // twist per floor (set 0 for a straight tower)
  lv.userData={i,drop:16};                                          // drop = start height for the intro fall-in
  tower.add(lv); levels.push(lv);
}
// Thin core line running through the tower
export const core=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1,N*PITCH,1)),lineSoft); tower.add(core);