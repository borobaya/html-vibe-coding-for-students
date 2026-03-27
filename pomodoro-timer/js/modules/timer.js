/**
 * File: timer.js
 * Description: Countdown timer factory with start/pause/reset/skip controls
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Creates a countdown timer
 * @param {{ durationSeconds: number, onTick: function, onComplete: function }} config
 * @returns {{ start: function, pause: function, reset: function, skip: function, getState: function, setDuration: function }}
 */
export function createTimer({ durationSeconds, onTick, onComplete }) {
  let totalSeconds = durationSeconds;
  let remainingSeconds = durationSeconds;
  let intervalId = null;
  let state = 'idle'; // idle | running | paused | complete

  function tick() {
    remainingSeconds -= 1;

    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      clearInterval(intervalId);
      intervalId = null;
      state = 'complete';
      onTick(getState());
      onComplete();
      return;
    }

    onTick(getState());
  }

  function start() {
    if (state === 'running') return;
    if (state === 'complete') return;

    state = 'running';
    intervalId = setInterval(tick, 1000);
    onTick(getState());
  }

  function pause() {
    if (state !== 'running') return;
    clearInterval(intervalId);
    intervalId = null;
    state = 'paused';
    onTick(getState());
  }

  function reset() {
    clearInterval(intervalId);
    intervalId = null;
    remainingSeconds = totalSeconds;
    state = 'idle';
    onTick(getState());
  }

  function skip() {
    clearInterval(intervalId);
    intervalId = null;
    remainingSeconds = 0;
    state = 'complete';
    onTick(getState());
    onComplete();
  }

  /**
   * Updates the timer duration (resets to idle)
   * @param {number} newDuration
   */
  function setDuration(newDuration) {
    clearInterval(intervalId);
    intervalId = null;
    totalSeconds = newDuration;
    remainingSeconds = newDuration;
    state = 'idle';
    onTick(getState());
  }

  function getState() {
    return {
      remainingSeconds,
      totalSeconds,
      progress: totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0,
      state,
    };
  }

  return { start, pause, reset, skip, getState, setDuration };
}
