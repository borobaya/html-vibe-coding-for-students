/**
 * File: traffic-light.js
 * Description: Traffic light state machine — phase timing and coordination
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { CONFIG } from './config.js';

const PHASES = {
  NS_GREEN: 'NS_GREEN',
  NS_AMBER: 'NS_AMBER',
  ALL_RED_1: 'ALL_RED_1',
  EW_GREEN: 'EW_GREEN',
  EW_AMBER: 'EW_AMBER',
  ALL_RED_2: 'ALL_RED_2',
  PED_PHASE: 'PED_PHASE',
};

export class TrafficLightController {
  constructor() {
    this.reset();
  }

  /** Resets to initial state. */
  reset() {
    this.currentPhase = PHASES.NS_GREEN;
    this.phaseTimer = CONFIG.timing.greenDuration;
    this.pedRequested = false;
    this.nsState = 'green';
    this.ewState = 'red';
    this.pedState = 'stop';
    this.updateStates();
  }

  /** Requests a pedestrian crossing phase. */
  requestPedestrian() {
    this.pedRequested = true;
  }

  /**
   * Updates the state machine by dt milliseconds.
   * @param {number} dt - Delta time in ms (already speed-adjusted)
   */
  update(dt) {
    this.phaseTimer -= dt;

    if (this.phaseTimer <= 0) {
      this.transition();
    }

    // Flashing ped signal in last 3s of PED_PHASE
    if (this.currentPhase === PHASES.PED_PHASE) {
      if (this.phaseTimer < CONFIG.timing.pedestrianFlash) {
        this.pedState = Math.floor(Date.now() / 500) % 2 === 0 ? 'walk' : 'stop';
      }
    }
  }

  /** Transitions to the next phase. */
  transition() {
    switch (this.currentPhase) {
      case PHASES.NS_GREEN:
        this.currentPhase = PHASES.NS_AMBER;
        this.phaseTimer = CONFIG.timing.amberDuration;
        break;
      case PHASES.NS_AMBER:
        this.currentPhase = PHASES.ALL_RED_1;
        this.phaseTimer = CONFIG.timing.allRedClearance;
        break;
      case PHASES.ALL_RED_1:
        this.currentPhase = PHASES.EW_GREEN;
        this.phaseTimer = CONFIG.timing.greenDuration;
        break;
      case PHASES.EW_GREEN:
        this.currentPhase = PHASES.EW_AMBER;
        this.phaseTimer = CONFIG.timing.amberDuration;
        break;
      case PHASES.EW_AMBER:
        this.currentPhase = PHASES.ALL_RED_2;
        this.phaseTimer = CONFIG.timing.allRedClearance;
        break;
      case PHASES.ALL_RED_2:
        if (this.pedRequested) {
          this.pedRequested = false;
          this.currentPhase = PHASES.PED_PHASE;
          this.phaseTimer = CONFIG.timing.pedestrianDuration;
        } else {
          this.currentPhase = PHASES.NS_GREEN;
          this.phaseTimer = CONFIG.timing.greenDuration;
        }
        break;
      case PHASES.PED_PHASE:
        this.currentPhase = PHASES.NS_GREEN;
        this.phaseTimer = CONFIG.timing.greenDuration;
        break;
    }
    this.updateStates();
  }

  /** Updates convenience state properties from the current phase. */
  updateStates() {
    switch (this.currentPhase) {
      case PHASES.NS_GREEN:
        this.nsState = 'green';
        this.ewState = 'red';
        this.pedState = 'stop';
        break;
      case PHASES.NS_AMBER:
        this.nsState = 'amber';
        this.ewState = 'red';
        this.pedState = 'stop';
        break;
      case PHASES.ALL_RED_1:
      case PHASES.ALL_RED_2:
        this.nsState = 'red';
        this.ewState = 'red';
        this.pedState = 'stop';
        break;
      case PHASES.EW_GREEN:
        this.nsState = 'red';
        this.ewState = 'green';
        this.pedState = 'stop';
        break;
      case PHASES.EW_AMBER:
        this.nsState = 'red';
        this.ewState = 'amber';
        this.pedState = 'stop';
        break;
      case PHASES.PED_PHASE:
        this.nsState = 'red';
        this.ewState = 'red';
        this.pedState = 'walk';
        break;
    }
  }

  /**
   * Returns the light state for a given direction.
   * @param {'north'|'south'|'east'|'west'} direction
   * @returns {'red'|'amber'|'green'}
   */
  getLightState(direction) {
    if (direction === 'north' || direction === 'south') {
      return this.nsState;
    }
    return this.ewState;
  }

  /**
   * Returns remaining seconds in current phase.
   * @returns {number}
   */
  getPhaseTimeRemaining() {
    return Math.max(0, Math.ceil(this.phaseTimer / 1000));
  }

  /**
   * Draws the four traffic light housings on the canvas.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawLights(ctx) {
    const positions = [
      { x: 231, y: 231, state: this.nsState },  // NW corner → SB
      { x: 453, y: 231, state: this.ewState },  // NE corner → WB
      { x: 231, y: 453, state: this.ewState },  // SW corner → EB
      { x: 453, y: 453, state: this.nsState },  // SE corner → NB
    ];

    for (const light of positions) {
      this.drawLightHousing(ctx, light.x, light.y, light.state);
    }
  }

  /**
   * Draws a single light housing at position.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {'red'|'amber'|'green'} activeState
   */
  drawLightHousing(ctx, x, y, activeState) {
    const hw = CONFIG.trafficLight.housingWidth;
    const hh = CONFIG.trafficLight.housingHeight;
    const r = CONFIG.trafficLight.bulbRadius;

    // Housing
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x, y, hw, hh);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, hw, hh);

    const cx = x + hw / 2;
    const bulbs = [
      { cy: y + 9, state: 'red', on: '#e53935', off: '#5c1a1a' },
      { cy: y + 21, state: 'amber', on: '#ffb300', off: '#5c4a00' },
      { cy: y + 33, state: 'green', on: '#43a047', off: '#1a3d1a' },
    ];

    for (const bulb of bulbs) {
      const isOn = activeState === bulb.state;
      ctx.fillStyle = isOn ? bulb.on : bulb.off;
      ctx.beginPath();
      ctx.arc(cx, bulb.cy, r, 0, Math.PI * 2);
      ctx.fill();

      if (isOn) {
        ctx.shadowColor = bulb.on;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  /**
   * Draws pedestrian walk/don't-walk signals.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawPedSignals(ctx) {
    const isWalk = this.pedState === 'walk';
    const colour = isWalk ? '#43a047' : '#e53935';
    const label = isWalk ? '🚶' : '✋';

    const positions = [
      { x: 350, y: 225 },
      { x: 350, y: 475 },
      { x: 225, y: 350 },
      { x: 475, y: 350 },
    ];

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const pos of positions) {
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText(label, pos.x, pos.y);
    }
  }
}
