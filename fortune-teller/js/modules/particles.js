/**
 * File: particles.js
 * Description: Canvas particle burst effect for the Magic 8-Ball
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const PARTICLE_COLOURS = ['#c084fc', '#818cf8', '#f5c542', '#f472b6'];
const BURST_COUNT = 40;

/** @type {HTMLCanvasElement|null} */
let canvas = null;

/** @type {CanvasRenderingContext2D|null} */
let ctx = null;

/** @type {{ x: number, y: number, vx: number, vy: number, radius: number, color: string, alpha: number, decay: number, life: number }[]} */
let particles = [];

let animationId = null;

/**
 * Initialises the particle canvas to fill the viewport
 * @param {HTMLCanvasElement} canvasEl
 */
export function initParticleCanvas(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  loop();
}

/** Resizes canvas to match viewport */
function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

/**
 * Spawns a burst of particles at the given position
 * @param {number} x - Centre X (viewport coords)
 * @param {number} y - Centre Y (viewport coords)
 */
export function emitBurst(x, y) {
  const angleStep = (Math.PI * 2) / BURST_COUNT;

  for (let i = 0; i < BURST_COUNT; i++) {
    const angle = angleStep * i + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 4;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 2 + Math.random() * 4,
      color: PARTICLE_COLOURS[Math.floor(Math.random() * PARTICLE_COLOURS.length)],
      alpha: 1.0,
      decay: 0.01 + Math.random() * 0.02,
      life: 60 + Math.floor(Math.random() * 40)
    });
  }
}

/** Main animation loop */
function loop() {
  animationId = requestAnimationFrame(loop);
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Iterate backwards for safe splicing
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Update physics
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.99;
    p.vy += 0.02;
    p.alpha -= p.decay;
    p.life -= 1;

    // Remove dead particles
    if (p.alpha <= 0 || p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    // Draw
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
