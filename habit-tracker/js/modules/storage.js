/**
 * File: storage.js
 * Description: localStorage persistence for habit tracker data
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export const STORAGE_KEY = 'habit-tracker-data';

const DEFAULT_DATA = {
  habits: [],
  completions: [],
};

/**
 * Loads data from localStorage
 * @returns {{ habits: Array, completions: Array }}
 */
export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { ...DEFAULT_DATA };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

/**
 * Saves data to localStorage
 * @param {{ habits: Array, completions: Array }} data
 */
export function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full — silent fail
  }
}

/**
 * Clears all habit tracker data
 */
export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}
