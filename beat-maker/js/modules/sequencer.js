/**
 * File: sequencer.js
 * Description: Grid state management for the step sequencer
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { getInstruments } from './instruments.js';

const STEPS = 16;
let grid = [];
let currentStep = 0;

export function initSequencer() {
  const instruments = getInstruments();
  grid = instruments.map(() => Array(STEPS).fill(false));
  currentStep = 0;
}

export function togglePad(instrumentIndex, step) {
  grid[instrumentIndex][step] = !grid[instrumentIndex][step];
  return grid[instrumentIndex][step];
}

/**
 * Returns active instrument IDs at a given step
 * @param {number} step
 * @returns {string[]}
 */
export function getActiveInstrumentsAtStep(step) {
  const instruments = getInstruments();
  const active = [];
  for (let i = 0; i < instruments.length; i++) {
    if (grid[i][step]) active.push(instruments[i].id);
  }
  return active;
}

export function advanceStep() {
  currentStep = (currentStep + 1) % STEPS;
  return currentStep;
}

export function getCurrentStep() { return currentStep; }
export function resetStep() { currentStep = 0; }

export function clearGrid() {
  grid = grid.map(row => row.map(() => false));
  currentStep = 0;
}

export function getStepCount() { return STEPS; }
