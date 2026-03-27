/**
 * File: main.js
 * Description: Fortune Teller entry point — event binding, cooldown, device motion
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getRandomResponse } from './modules/responses.js';
import { triggerShake, resetBall, SHAKE_DURATION, COOLDOWN_DURATION } from './modules/animation.js';
import { initParticleCanvas, emitBurst } from './modules/particles.js';

const SHAKE_THRESHOLD = 25;

/** @type {boolean} */
let isCooldown = false;

/** DOM references cached at init */
let ballEl, ballBody, glowEl, answerEl, shakeBtn, questionInput, particleCanvas;

/**
 * Handles a shake trigger from any source
 */
function handleShake() {
  if (isCooldown) return;
  isCooldown = true;
  shakeBtn.disabled = true;

  resetBall(answerEl);

  // Get ball centre for particle burst
  const rect = ballEl.getBoundingClientRect();
  const centreX = rect.left + rect.width / 2;
  const centreY = rect.top + rect.height / 2;

  triggerShake(ballBody, glowEl, answerEl, () => {
    answerEl.textContent = getRandomResponse();
  });

  // Fire particles after shake animation
  setTimeout(() => {
    emitBurst(centreX, centreY);
  }, SHAKE_DURATION);

  // Reset cooldown
  setTimeout(() => {
    isCooldown = false;
    shakeBtn.disabled = false;
  }, COOLDOWN_DURATION);
}

/**
 * Handles device motion events for physical shake
 * @param {DeviceMotionEvent} event
 */
function onDeviceMotion(event) {
  const acc = event.accelerationIncludingGravity;
  if (!acc) return;

  const total = Math.sqrt(
    (acc.x || 0) ** 2 +
    (acc.y || 0) ** 2 +
    (acc.z || 0) ** 2
  );

  if (total > SHAKE_THRESHOLD) {
    handleShake();
  }
}

/** Sets up device motion detection with iOS permission handling */
function initDeviceMotion() {
  if (!('DeviceMotionEvent' in window)) return;

  // iOS 13+ requires explicit permission
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // Add one-time user-interaction trigger
    const requestOnInteract = () => {
      DeviceMotionEvent.requestPermission()
        .then(state => {
          if (state === 'granted') {
            window.addEventListener('devicemotion', onDeviceMotion);
          }
        })
        .catch(() => { /* Permission denied */ });
      document.removeEventListener('click', requestOnInteract);
    };
    document.addEventListener('click', requestOnInteract);
  } else {
    window.addEventListener('devicemotion', onDeviceMotion);
  }
}

/** Initialises the app */
function init() {
  // Cache DOM references
  ballEl = document.getElementById('magic-ball');
  ballBody = ballEl.querySelector('.ball__body');
  glowEl = document.getElementById('ball-glow');
  answerEl = document.getElementById('answer-text');
  shakeBtn = document.getElementById('shake-btn');
  questionInput = document.getElementById('question-input');
  particleCanvas = document.getElementById('particle-canvas');

  // Particle system
  initParticleCanvas(particleCanvas);

  // Device motion
  initDeviceMotion();

  // Click the ball or button
  ballEl.addEventListener('click', handleShake);
  shakeBtn.addEventListener('click', handleShake);

  // Keyboard — Enter or Space on ball
  ballEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleShake();
    }
  });

  // Enter on question input
  questionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleShake();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
