/**
 * File: renderer.js
 * Description: Canvas drawing — bodies, trails, starfield, velocity arrow
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getColourForMass } from './body.js';

/**
 * Converts a hex colour to an rgba string.
 * @param {string} hex - Hex colour e.g. '#ff8c42'
 * @param {number} alpha - Opacity 0–1
 * @returns {string} rgba string
 */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Canvas renderer for the gravity sandbox. */
export class Renderer {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stars = this.generateStars(200);
  }

  /**
   * Generates random star positions.
   * @param {number} count
   * @returns {Array<{x: number, y: number, r: number, alpha: number}>}
   */
  generateStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.5 + Math.random(),
        alpha: 0.3 + Math.random() * 0.7,
      });
    }
    return stars;
  }

  /** Fills the canvas with the background colour. */
  clearCanvas() {
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Draws the static starfield background. */
  drawStarfield() {
    const { ctx, canvas, stars } = this;
    for (const star of stars) {
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x * canvas.width, star.y * canvas.height, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  /**
   * Draws a single body with glow effect.
   * @param {import('./body.js').CelestialBody} body
   */
  drawBody(body) {
    const { ctx } = this;
    const { x, y, radius, colour } = body;

    // Outer glow
    const gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2.5);
    gradient.addColorStop(0, hexToRgba(colour, 0.4));
    gradient.addColorStop(1, hexToRgba(colour, 0));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draws a body's orbital trail with fading opacity.
   * @param {import('./body.js').CelestialBody} body
   */
  drawTrail(body) {
    const { ctx } = this;
    const { trail, colour } = body;
    if (trail.length < 2) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    for (let i = 1; i < trail.length; i++) {
      ctx.globalAlpha = (i / trail.length) * 0.8;
      ctx.strokeStyle = colour;
      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x, trail[i].y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1.0;
  }

  /**
   * Draws the velocity preview arrow during drag.
   * @param {{x: number, y: number}} start
   * @param {{x: number, y: number}} end
   * @param {number} mass
   */
  drawVelocityArrow(start, end, mass) {
    const { ctx } = this;

    // Dashed line
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#80c0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrowhead
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const headLen = 10;
    ctx.fillStyle = '#80c0ff';
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLen * Math.cos(angle - Math.PI / 6),
      end.y - headLen * Math.sin(angle - Math.PI / 6),
    );
    ctx.lineTo(
      end.x - headLen * Math.cos(angle + Math.PI / 6),
      end.y - headLen * Math.sin(angle + Math.PI / 6),
    );
    ctx.closePath();
    ctx.fill();

    // Ghost body preview
    const previewRadius = Math.max(3, Math.sqrt(mass) * 2);
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = getColourForMass(mass);
    ctx.beginPath();
    ctx.arc(start.x, start.y, previewRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  /**
   * Master draw call — renders everything for one frame.
   * @param {import('./body.js').CelestialBody[]} bodies
   * @param {{x: number, y: number}|null} dragStart
   * @param {{x: number, y: number}|null} dragEnd
   * @param {number} currentMass
   */
  draw(bodies, dragStart, dragEnd, currentMass) {
    this.clearCanvas();
    this.drawStarfield();

    for (const body of bodies) {
      this.drawTrail(body);
    }

    for (const body of bodies) {
      this.drawBody(body);
    }

    if (dragStart && dragEnd) {
      this.drawVelocityArrow(dragStart, dragEnd, currentMass);
    }
  }

  /** Clears all body trails. */
  clearTrails(bodies) {
    for (const body of bodies) {
      body.clearTrail();
    }
  }
}
