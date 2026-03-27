/**
 * File: body.js
 * Description: CelestialBody class — position, velocity, mass, colour, trail
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const MAX_TRAIL_LENGTH = 150;

const BODY_COLOURS = [
  '#ff8c42', '#ff4060', '#b040ff',
  '#40ff90', '#ffe040', '#40e0ff', '#e0e0ff',
];

let nextId = 0;

/**
 * Returns a colour based on mass bracket.
 * @param {number} mass - Body mass (1–100)
 * @returns {string} Hex colour
 */
export function getColourForMass(mass) {
  const index = Math.min(
    BODY_COLOURS.length - 1,
    Math.floor(((mass - 1) / 99) * BODY_COLOURS.length),
  );
  return BODY_COLOURS[index];
}

/** Represents a single celestial body in the simulation. */
export class CelestialBody {
  /**
   * @param {object} opts
   * @param {number} opts.x - X position (px)
   * @param {number} opts.y - Y position (px)
   * @param {number} [opts.vx=0] - X velocity
   * @param {number} [opts.vy=0] - Y velocity
   * @param {number} [opts.mass=10] - Mass (1–100)
   */
  constructor({ x, y, vx = 0, vy = 0, mass = 10 }) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ax = 0;
    this.ay = 0;
    this.mass = mass;
    this.radius = Math.max(3, Math.sqrt(mass) * 2);
    this.colour = getColourForMass(mass);
    this.trail = [];
    this.id = nextId++;
  }

  /** Pushes current position onto the trail, evicting oldest if full. */
  addTrailPoint() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > MAX_TRAIL_LENGTH) {
      this.trail.shift();
    }
  }

  /** Empties the trail array. */
  clearTrail() {
    this.trail = [];
  }
}
