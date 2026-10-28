/* ============ D. THE TOWER (twisted + tapered, diagrid skin) ============ */
import * as THREE from 'three';
import { scene } from './scene.js';
import { dark, glass, lineW, lineSoft } from './materials.js';
import { N, PITCH } from './state.js';

export const levels=[], tower=new THREE.Group(); scene.add(tower);

const TWIST = .12;                                   // rotation per floor (0 = straight tower)
const BASE  = 3.8, TAPER = .3, BULGE = .45;          // base width, how much it narrows at the top, mid-height swell
const widthAt = i => { const t=i/(N-1); return BASE*(1-TAPER*t) + Math.sin(t*Math.PI)*BULGE; };
const CORNERS = [[-1,-1],[1,-1],[1,1],[-1,1]];

for(let i=0;i<N;i++){
  const lv=new THREE.Group(), w=widthAt(i);
  const sg=new THREE.BoxGeometry(w,.2,w);
  lv.add(new THREE.Mesh(sg,dark)); lv.add(new THREE.LineSegments(new THREE.EdgesGeometry(sg),lineW));

  if(i<N-1){
    // glass volume above each plate (not on the roof)
    const gg=new THREE.BoxGeometry(w*.94,PITCH-.2,w*.94), gm=new THREE.Mesh(gg,glass);
    gm.position.y=PITCH/2; lv.add(gm);
    const ge=new THREE.LineSegments(new THREE.EdgesGeometry(gg),lineSoft); ge.position.y=PITCH/2; lv.add(ge);

    // diagrid: from this plate's corners up to the next plate's corners (in this plate's local frame)
    const w2=widthAt(i+1), c=Math.cos(TWIST), s=Math.sin(TWIST), y0=.1, y1=PITCH-.1, pts=[];
    const low =k=>[CORNERS[k][0]*w/2*.97, y0, CORNERS[k][1]*w/2*.97];
    const high=k=>{ const x=CORNERS[k][0]*w2/2*.97, z=CORNERS[k][1]*w2/2*.97;
                    return [x*c+z*s, y1, -x*s+z*c]; };   // next plate is rotated by TWIST relative to this one
    for(let k=0;k<4;k++){
      const a=low(k), b=high(k), d=high((k+1)%4);
      pts.push(...a,...d);                           // diagonal one way
      pts.push(...low((k+1)%4),...b);                // diagonal the other way -> diamond lattice
    }
    const dg=new THREE.BufferGeometry();
    dg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
    lv.add(new THREE.LineSegments(dg,lineSoft));
  }

  lv.rotation.y=i*TWIST;
  lv.userData={i,drop:16};                           // drop = start height for the intro fall-in
  tower.add(lv); levels.push(lv);
}

// Thin core line running through the tower
export const core=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1,N*PITCH,1)),lineSoft); tower.add(core);