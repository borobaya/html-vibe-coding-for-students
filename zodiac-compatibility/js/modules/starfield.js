/**
 * File: starfield.js
 * Description: Animated twinkling starfield canvas background
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/** @type {HTMLCanvasElement|null} */
let canvas = null;

/** @type {CanvasRenderingContext2D|null} */
let ctx = null;

/** @type {Array} */
let stars = [];

let resizeTimer = null;

/**
 * Creates an array of star objects
 * @param {number} count
 * @returns {Array}
 */
function createStars(count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 0.3 + Math.random() * 1.2,
      opacity: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.5 + Math.random() * 2,
      offset: Math.random() * Math.PI * 2
    });
  }
  return result;
}

/** Animation loop */
function animateStarfield() {
  requestAnimationFrame(animateStarfield);
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const time = performance.now() / 1000;

  for (const star of stars) {
    const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.offset);
    const alpha = star.opacity * twinkle;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 251, 230, ${alpha})`;
    ctx.fill();
  }
}

/** Handles window resize with debounce */
function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 5000);
    stars = createStars(Math.min(count, 400));
  }, 150);
}

/**
 * Initialises the starfield on a canvas element
 * @param {string} canvasId - ID of the canvas element
 */
export function initStarfield(canvasId) {
  canvas = document.getElementById(canvasId);
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const count = Math.floor((canvas.width * canvas.height) / 5000);
  stars = createStars(Math.min(count, 400));

  window.addEventListener('resize', handleResize);
  animateStarfield();
}
