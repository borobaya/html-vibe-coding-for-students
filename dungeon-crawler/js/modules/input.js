/**
 * File: input.js
 * Description: Keyboard input handler — mode-aware key dispatch
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

let handlers = {};

/**
 * Initialises input listening
 * @param {Object} callbacks - Object keyed by game mode with action handlers
 */
export function initInput(callbacks) {
  handlers = callbacks;

  document.addEventListener('keydown', (e) => {
    const mode = handlers.getMode();
    const modeHandlers = handlers[mode];
    if (!modeHandlers) return;

    const key = e.key;
    if (modeHandlers[key]) {
      e.preventDefault();
      modeHandlers[key]();
    }
  });
}
