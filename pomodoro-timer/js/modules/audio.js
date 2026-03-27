/**
 * File: audio.js
 * Description: Web Audio API notification sounds for the Pomodoro timer
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/** @type {AudioContext|null} */
let audioCtx = null;

/**
 * Lazily creates the AudioContext on first user gesture
 */
export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/**
 * Plays a short notification tone sequence: 880Hz → pause → 880Hz → pause → 1046Hz
 */
export function playNotification() {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;

  const playTone = (freq, start, duration) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.3, start + 0.01);
    gain.gain.linearRampToValueAtTime(0, start + duration - 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + duration);
  };

  playTone(880, now, 0.15);
  playTone(880, now + 0.25, 0.15);
  playTone(1046, now + 0.5, 0.3);
}
