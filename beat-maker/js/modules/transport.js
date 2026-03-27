/**
 * File: transport.js
 * Description: Playback control – play, stop, BPM, lookahead scheduler
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { getAudioContext, playSample } from './audio.js';
import { getActiveInstrumentsAtStep, advanceStep, resetStep, getCurrentStep } from './sequencer.js';

const LOOKAHEAD = 25;        // ms
const SCHEDULE_AHEAD = 0.1;  // seconds

let bpm = 120;
let isPlaying = false;
let intervalId = null;
let nextStepTime = 0;
let onStepCallback = null;

export function setBPM(value) { bpm = value; }
export function getBPM() { return bpm; }
export function getIsPlaying() { return isPlaying; }

/**
 * Start playback
 * @param {function} onStep - called with step number for UI highlight
 */
export function play(onStep) {
  if (isPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  isPlaying = true;
  onStepCallback = onStep;
  nextStepTime = ctx.currentTime;
  intervalId = setInterval(scheduler, LOOKAHEAD);
}

export function stop() {
  isPlaying = false;
  clearInterval(intervalId);
  intervalId = null;
  resetStep();
  if (onStepCallback) onStepCallback(-1); // clear playhead
}

function scheduler() {
  const ctx = getAudioContext();
  while (nextStepTime < ctx.currentTime + SCHEDULE_AHEAD) {
    const step = getCurrentStep();

    // Schedule audio
    const active = getActiveInstrumentsAtStep(step);
    for (const id of active) {
      playSample(id, nextStepTime);
    }

    // Schedule UI update
    if (onStepCallback) {
      requestAnimationFrame(() => onStepCallback(step));
    }

    advanceStep();
    const stepInterval = 60 / bpm / 4; // 16th note
    nextStepTime += stepInterval;
  }
}
