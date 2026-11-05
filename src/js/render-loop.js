/* ============ I. RENDER LOOP (runs every frame) ============ */
import * as THREE from 'three';
import { gsap } from './gsap-setup.js';
import { S, N, PITCH, GAP } from './state.js';
import { renderer, scene, camera } from './scene.js';
import { levels, core } from './tower.js';
import { ringA, ringB } from './drafting.js';
import { dust } from './dust.js';
import { m } from './input.js';

const exEl = document.getElementById('ex');

const small = matchMedia('(pointer: coarse)').matches;
let W = innerWidth, H = innerHeight, frame = 0, lastEx = '';
let lastDx = null, lastDy = null, lastW = 0, lastH = 0;
addEventListener('resize', () => { W = innerWidth; H = innerHeight; });

// If the graphics context is lost (phone low on memory), let it recover
renderer.domElement.addEventListener('webglcontextlost', e => e.preventDefault());

const clock = new THREE.Clock();
gsap.ticker.add(() => {
  const t = clock.getElapsedTime();
  const spin = S.spin ?? 1;                                          // 1 = orbiting, 0 = paused (scene 2)
  m.sx += (m.x - m.sx) * .05; m.sy += (m.y - m.sy) * .05;
  S.ang += .0012 * spin;
  levels.forEach(lv => { lv.position.y = lv.userData.i * (PITCH + S.ex * GAP) + lv.userData.drop; });
  const Hc = (N - 1) * (PITCH + S.ex * GAP) + PITCH;
  core.scale.y = Hc / (N * PITCH); core.position.y = Hc / 2; core.material.opacity = .3 * (1 - S.ex * .6);
  ringA.rotation.y = t * .05; ringB.rotation.y = -t * .03;
  dust.position.y = Math.sin(t * .3) * .3;
  const a = S.ang + m.sx * .35 * spin;
  camera.position.set(Math.cos(a) * S.rad, S.h + m.sy * 1.2 * spin, Math.sin(a) * S.rad);
  camera.lookAt(0, S.lookY, 0);

  // Move the whole picture aside (scene 2): left on desktop, up on phones. dx / dy are in pixels.
  const dx = Math.round((S.shift  || 0) * W);
  const dy = Math.round((S.shiftY || 0) * H);
  if (dx !== lastDx || dy !== lastDy || W !== lastW || H !== lastH) {
    if (dx === 0 && dy === 0) camera.clearViewOffset(); else camera.setViewOffset(W, H, dx, dy, W, H);
    lastDx = dx; lastDy = dy; lastW = W; lastH = H;
  }

  // Phones: draw every second frame (half the work, looks almost the same)
  frame++;
  if (small && (frame & 1)) return;

  renderer.render(scene, camera);

  const ex = String(Math.round(S.ex * 100)).padStart(3, '0');
  if (exEl && ex !== lastEx) { exEl.textContent = ex; lastEx = ex; }
});