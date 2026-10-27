/* ============ H. RESIZE + MOUSE ============ */
import { renderer, camera } from './scene.js';

// Keeps the canvas and camera matched to the window size
function resize(){
  const w=innerWidth,h=innerHeight; renderer.setSize(w,h,false); camera.aspect=w/h;
  camera.fov=w/h<1?70:45; camera.updateProjectionMatrix();          // wider field of view on portrait phones
}
addEventListener('resize',resize); resize();

// Mouse position (x,y) and smoothed copy (sx,sy). The render loop smooths sx/sy.
export const m={x:0,y:0,sx:0,sy:0};
addEventListener('pointermove',e=>{m.x=e.clientX/innerWidth*2-1;m.y=-(e.clientY/innerHeight*2-1)});