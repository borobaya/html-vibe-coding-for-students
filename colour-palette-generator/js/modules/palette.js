/**
 * File: palette.js
 * Description: Palette state management — colours and lock states
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * @typedef {{ h: number, s: number, l: number }} HSL
 * @typedef {{ colours: HSL[], locked: boolean[] }} PaletteState
 */

/** @type {PaletteState} */
const state = {
  colours: [],
  locked: [false, false, false, false, false],
};

/**
 * Returns the full state object
 * @returns {PaletteState}
 */
export function getState() {
  return state;
}

/**
 * Updates the stored colours
 * @param {HSL[]} newColours
 */
export function setColours(newColours) {
  state.colours = newColours;
}

/**
 * Toggles the lock on a swatch at the given index
 * @param {number} index
 * @returns {boolean} New lock state
 */
export function toggleLock(index) {
  state.locked[index] = !state.locked[index];
  return state.locked[index];
}

/**
 * Checks if a swatch is locked
 * @param {number} index
 * @returns {boolean}
 */
export function isLocked(index) {
  return state.locked[index];
}

/**
 * Returns indices of all locked swatches
 * @returns {number[]}
 */
export function getLockedIndices() {
  return state.locked.reduce((acc, locked, i) => {
    if (locked) acc.push(i);
    return acc;
  }, []);
}

/**
 * Returns the current colours array
 * @returns {HSL[]}
 */
export function getCurrentColours() {
  return state.colours;
}
