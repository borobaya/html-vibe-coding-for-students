/**
 * File: animation.js
 * Description: Shake animation, glow effects, and answer reveal timing
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/** Duration of the ball-shake CSS keyframe (ms) */
export const SHAKE_DURATION = 800;

/** Delay between shake end and answer reveal (ms) */
export const REVEAL_DELAY = 300;

/** Minimum cooldown between shakes (ms) */
export const COOLDOWN_DURATION = 2000;

/**
 * Triggers the full shake-to-reveal animation sequence
 * @param {HTMLElement} ballBody - The .ball__body element
 * @param {HTMLElement} glowEl - The .ball__glow element
 * @param {HTMLElement} answerEl - The .ball__answer element
 * @param {Function} callback - Called when answer should be set (receives no args)
 */
export function triggerShake(ballBody, glowEl, answerEl, callback) {
  // Start shake + intense glow
  ballBody.classList.add('ball__body--shaking');
  glowEl.classList.add('ball__glow--intense');

  // Show consulting text
  answerEl.textContent = 'Consulting the spirits\u2026';
  answerEl.classList.add('ball__answer--consulting');

  // After shake completes, remove shake classes
  setTimeout(() => {
    ballBody.classList.remove('ball__body--shaking');
    glowEl.classList.remove('ball__glow--intense');
  }, SHAKE_DURATION);

  // After shake + reveal delay, show the answer
  setTimeout(() => {
    answerEl.classList.remove('ball__answer--consulting');
    callback();
    answerEl.classList.add('ball__answer--reveal');
    answerEl.classList.add('ball__answer--visible');
  }, SHAKE_DURATION + REVEAL_DELAY);
}

/**
 * Resets the ball to idle state before a new shake
 * @param {HTMLElement} answerEl - The .ball__answer element
 */
export function resetBall(answerEl) {
  answerEl.classList.remove('ball__answer--visible');
  answerEl.classList.remove('ball__answer--reveal');
  answerEl.classList.remove('ball__answer--consulting');
  answerEl.textContent = '';
}
