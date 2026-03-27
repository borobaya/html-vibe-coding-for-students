/**
 * File: physics.js
 * Description: Gravity computation, velocity Verlet integration, collision detection
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { CelestialBody, getColourForMass } from './body.js';

/** N-body Newtonian gravity engine. */
export class PhysicsEngine {
  /**
   * @param {number} [G=500] - Gravitational constant
   * @param {number} [softening=10] - Softening length to prevent singularity
   */
  constructor(G = 500, softening = 10) {
    this.G = G;
    this.softening = softening;
  }

  /**
   * Computes gravitational accelerations for every body.
   * @param {CelestialBody[]} bodies
   */
  computeAccelerations(bodies) {
    for (const body of bodies) {
      body.ax = 0;
      body.ay = 0;
    }

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distSq = dx * dx + dy * dy + this.softening * this.softening;
        const dist = Math.sqrt(distSq);
        const force = this.G / distSq;

        const fx = force * (dx / dist);
        const fy = force * (dy / dist);

        a.ax += fx * b.mass;
        a.ay += fy * b.mass;
        b.ax -= fx * a.mass;
        b.ay -= fy * a.mass;
      }
    }
  }

  /**
   * Velocity Verlet integration step.
   * @param {CelestialBody[]} bodies
   * @param {number} dt - Delta time in seconds
   */
  integrate(bodies, dt) {
    // Half-kick
    for (const b of bodies) {
      b.vx += 0.5 * b.ax * dt;
      b.vy += 0.5 * b.ay * dt;
    }

    // Drift
    for (const b of bodies) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
    }

    // Recompute accelerations at new positions
    this.computeAccelerations(bodies);

    // Second half-kick
    for (const b of bodies) {
      b.vx += 0.5 * b.ax * dt;
      b.vy += 0.5 * b.ay * dt;
    }

    // Record trail
    for (const b of bodies) {
      b.addTrailPoint();
    }
  }

  /**
   * Detects and resolves collisions by merging overlapping bodies.
   * @param {CelestialBody[]} bodies
   * @returns {CelestialBody[]} Updated array after merges
   */
  detectCollisions(bodies) {
    const consumed = new Set();
    const merged = [];

    for (let i = 0; i < bodies.length; i++) {
      if (consumed.has(i)) continue;
      for (let j = i + 1; j < bodies.length; j++) {
        if (consumed.has(j)) continue;

        const a = bodies[i];
        const b = bodies[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < a.radius + b.radius) {
          merged.push(this.mergeBodies(a, b));
          consumed.add(i);
          consumed.add(j);
          break;
        }
      }
    }

    const survivors = bodies.filter((_, idx) => !consumed.has(idx));
    return survivors.concat(merged);
  }

  /**
   * Merges two bodies, conserving mass and momentum.
   * @param {CelestialBody} a
   * @param {CelestialBody} b
   * @returns {CelestialBody}
   */
  mergeBodies(a, b) {
    const newMass = a.mass + b.mass;
    return new CelestialBody({
      x: (a.mass * a.x + b.mass * b.x) / newMass,
      y: (a.mass * a.y + b.mass * b.y) / newMass,
      vx: (a.mass * a.vx + b.mass * b.vx) / newMass,
      vy: (a.mass * a.vy + b.mass * b.vy) / newMass,
      mass: Math.min(newMass, 200),
    });
  }

  /**
   * Runs one full physics step.
   * @param {CelestialBody[]} bodies
   * @param {number} dt
   * @returns {CelestialBody[]} Bodies array after potential merges
   */
  update(bodies, dt) {
    if (bodies.length === 0) return bodies;
    this.computeAccelerations(bodies);
    this.integrate(bodies, dt);
    return this.detectCollisions(bodies);
  }
}
