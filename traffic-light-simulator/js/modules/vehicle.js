/**
 * File: vehicle.js
 * Description: Vehicle class and VehicleManager for spawning, movement, and queuing
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { CONFIG } from './config.js';

const DIRECTIONS = {
  south: { dx: 0, dy: 1, angle: Math.PI },
  north: { dx: 0, dy: -1, angle: 0 },
  east: { dx: 1, dy: 0, angle: Math.PI / 2 },
  west: { dx: -1, dy: 0, angle: -Math.PI / 2 },
};

class Vehicle {
  /**
   * @param {number} x
   * @param {number} y
   * @param {'north'|'south'|'east'|'west'} direction
   */
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = CONFIG.vehicles.speed;
    this.colour = CONFIG.vehicles.colours[
      Math.floor(Math.random() * CONFIG.vehicles.colours.length)
    ];
    this.stopped = false;
    this.width = CONFIG.vehicles.width;
    this.length = CONFIG.vehicles.length;
  }

  /**
   * Updates position based on traffic light state and vehicles ahead.
   * @param {number} dt
   * @param {string} lightState - 'red'|'amber'|'green'
   * @param {Vehicle|null} vehicleAhead
   * @param {number} speedMultiplier
   */
  update(dt, lightState, vehicleAhead, speedMultiplier) {
    const dir = DIRECTIONS[this.direction];
    const stopLine = this.getStopLine();
    const distToStop = this.distanceToStopLine(stopLine);

    let targetSpeed = this.speed;
    this.stopped = false;

    // Check if should stop for red/amber light
    if (lightState !== 'green' && distToStop > 0 && distToStop < 120) {
      if (distToStop < 5) {
        targetSpeed = 0;
        this.stopped = true;
      } else {
        targetSpeed = this.speed * (distToStop / 120);
      }
    }

    // Queue following — keep distance from vehicle ahead
    if (vehicleAhead) {
      const dist = this.distanceToVehicle(vehicleAhead);
      if (dist < CONFIG.vehicles.minFollowDistance + this.length) {
        targetSpeed = 0;
        this.stopped = true;
      } else if (dist < CONFIG.vehicles.minFollowDistance + this.length + 30) {
        const ratio = (dist - CONFIG.vehicles.minFollowDistance - this.length) / 30;
        targetSpeed = Math.min(targetSpeed, this.speed * ratio);
      }
    }

    const adjustedSpeed = targetSpeed * speedMultiplier * (dt / 16);
    this.x += dir.dx * adjustedSpeed;
    this.y += dir.dy * adjustedSpeed;
  }

  /**
   * Returns the stop line position for this vehicle's direction.
   * @returns {number}
   */
  getStopLine() {
    switch (this.direction) {
      case 'south': return CONFIG.stopLines.north;
      case 'north': return CONFIG.stopLines.south;
      case 'east': return CONFIG.stopLines.west;
      case 'west': return CONFIG.stopLines.east;
      default: return 0;
    }
  }

  /**
   * Computes signed distance to the stop line.
   * @param {number} stopLine
   * @returns {number} - Positive when approaching, negative when past
   */
  distanceToStopLine(stopLine) {
    switch (this.direction) {
      case 'south': return stopLine - this.y;
      case 'north': return this.y - stopLine;
      case 'east': return stopLine - this.x;
      case 'west': return this.x - stopLine;
      default: return 0;
    }
  }

  /**
   * Computes distance to the vehicle ahead.
   * @param {Vehicle} other
   * @returns {number}
   */
  distanceToVehicle(other) {
    switch (this.direction) {
      case 'south': return other.y - this.y;
      case 'north': return this.y - other.y;
      case 'east': return other.x - this.x;
      case 'west': return this.x - other.x;
      default: return Infinity;
    }
  }

  /**
   * Checks if the vehicle is off canvas.
   * @returns {boolean}
   */
  isOffCanvas() {
    return (
      this.x < -60 || this.x > CONFIG.canvas.width + 60 ||
      this.y < -60 || this.y > CONFIG.canvas.height + 60
    );
  }

  /**
   * Draws the vehicle on the canvas.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    const dir = DIRECTIONS[this.direction];
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(dir.angle);

    // Body
    ctx.fillStyle = this.colour;
    const hw = this.width / 2;
    const hl = this.length / 2;
    ctx.beginPath();
    ctx.roundRect(-hw, -hl, this.width, this.length, 4);
    ctx.fill();

    // Windshield (top area in local coords)
    ctx.fillStyle = 'rgba(135, 206, 250, 0.6)';
    ctx.fillRect(-hw + 3, -hl + 4, this.width - 6, 10);

    // Tail lights
    ctx.fillStyle = '#e53935';
    ctx.fillRect(-hw + 2, hl - 5, 4, 3);
    ctx.fillRect(hw - 6, hl - 5, 4, 3);

    ctx.restore();
  }
}

export class VehicleManager {
  constructor() {
    this.vehicles = [];
    this.spawnTimers = { north: 0, south: 0, east: 0, west: 0 };
  }

  /** Resets all vehicles and timers. */
  reset() {
    this.vehicles = [];
    this.spawnTimers = { north: 0, south: 0, east: 0, west: 0 };
  }

  /**
   * Updates spawning and all vehicle positions.
   * @param {number} dt
   * @param {Function} getLightState - direction => 'red'|'amber'|'green'
   * @param {number} speedMultiplier
   */
  update(dt, getLightState, speedMultiplier) {
    // Spawn vehicles
    const spawnPositions = {
      south: { x: CONFIG.lanes.southbound, y: -40 },
      north: { x: CONFIG.lanes.northbound, y: CONFIG.canvas.height + 40 },
      east: { x: -40, y: CONFIG.lanes.eastbound },
      west: { x: CONFIG.canvas.width + 40, y: CONFIG.lanes.westbound },
    };

    for (const dir of Object.keys(this.spawnTimers)) {
      this.spawnTimers[dir] -= dt * speedMultiplier;
      if (this.spawnTimers[dir] <= 0) {
        const sp = spawnPositions[dir];
        this.vehicles.push(new Vehicle(sp.x, sp.y, dir));
        this.spawnTimers[dir] = CONFIG.vehicles.spawnInterval;
      }
    }

    // Group by direction for queue management
    const groups = { north: [], south: [], east: [], west: [] };
    for (const v of this.vehicles) {
      groups[v.direction].push(v);
    }

    // Sort each direction group by proximity to stop line
    groups.south.sort((a, b) => b.y - a.y); // furthest along first
    groups.north.sort((a, b) => a.y - b.y);
    groups.east.sort((a, b) => b.x - a.x);
    groups.west.sort((a, b) => a.x - b.x);

    // Update each vehicle with its queue context
    for (const dir of Object.keys(groups)) {
      const lightState = getLightState(dir);
      const queue = groups[dir];
      for (let i = 0; i < queue.length; i++) {
        const ahead = i > 0 ? queue[i - 1] : null;
        queue[i].update(dt, lightState, ahead, speedMultiplier);
      }
    }

    // Remove off-canvas vehicles
    this.vehicles = this.vehicles.filter((v) => !v.isOffCanvas());
  }

  /**
   * Draws all vehicles.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    for (const v of this.vehicles) {
      v.draw(ctx);
    }
  }

  /** @returns {number} Current vehicle count */
  getCount() {
    return this.vehicles.length;
  }
}
