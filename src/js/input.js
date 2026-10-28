/* ============ H. RESIZE + MOUSE ============ */
import { renderer, camera } from './scene.js';

let lastW = 0, lastH = 0, timer;

// Keeps the canvas and camera matched to the window size
function resize(force){
  const w = innerWidth, h = innerHeight;
  // Ignore small height changes (phone address bar sliding in/out while scrolling)
  if (!force && w === lastW && Math.abs(h - lastH) < 150) return;
  lastW = w; lastH = h;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w / h < 1 ? 70 : 45;                                  // wider field of view on portrait phones
  camera.updateProjectionMatrix();
}
// Wait until resizing pauses (100 ms) instead of rebuilding on every pixel
addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(resize, 100); });
addEventListener('orientationchange', () => setTimeout(() => resize(true), 250));
resize(true);

// Mouse position (x,y) and smoothed copy (sx,sy). The render loop smooths sx/sy.
export const m = { x: 0, y: 0, sx: 0, sy: 0 };
addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;                              // no camera follow on touch screens
  m.x = e.clientX / innerWidth * 2 - 1;
  m.y = -(e.clientY / innerHeight * 2 - 1);
}, { passive: true });