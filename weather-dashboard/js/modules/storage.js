/**
 * File: storage.js
 * Description: localStorage helpers — recent searches, last city, unit preference
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { MAX_RECENT_SEARCHES } from './config.js';

const KEYS = {
  recent: 'weather_recent',
  lastCity: 'weather_last_city',
  unit: 'weather_unit',
};

/**
 * Safely reads and parses a JSON value from localStorage.
 * @param {string} key - Storage key
 * @param {*} fallback - Default value if key missing or invalid
 * @returns {*} Parsed value or fallback
 */
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safely writes a JSON value to localStorage.
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or disabled — silently ignore
  }
}

/**
 * Returns the list of recently searched cities.
 * @returns {string[]} Array of city names (max 6)
 */
export function getRecentSearches() {
  return safeGet(KEYS.recent, []);
}

/**
 * Adds a city to the front of recent searches. Removes duplicates.
 * @param {string} city - City name to add
 */
export function addRecentSearch(city) {
  const searches = getRecentSearches();
  const filtered = searches.filter(
    s => s.toLowerCase() !== city.toLowerCase()
  );
  filtered.unshift(city);
  if (filtered.length > MAX_RECENT_SEARCHES) {
    filtered.length = MAX_RECENT_SEARCHES;
  }
  safeSet(KEYS.recent, filtered);
}

/**
 * Removes a city from recent searches.
 * @param {string} city - City name to remove
 */
export function removeRecentSearch(city) {
  const searches = getRecentSearches();
  const filtered = searches.filter(
    s => s.toLowerCase() !== city.toLowerCase()
  );
  safeSet(KEYS.recent, filtered);
}

/**
 * Returns the last viewed city, or null.
 * @returns {string|null}
 */
export function getLastCity() {
  try {
    return localStorage.getItem(KEYS.lastCity);
  } catch {
    return null;
  }
}

/**
 * Saves the last viewed city.
 * @param {string} city - City name
 */
export function setLastCity(city) {
  try {
    localStorage.setItem(KEYS.lastCity, city);
  } catch {
    // silently ignore
  }
}

/**
 * Returns the saved unit preference.
 * @returns {string} 'metric' or 'imperial'
 */
export function getUnit() {
  try {
    const unit = localStorage.getItem(KEYS.unit);
    return unit === 'imperial' ? 'imperial' : 'metric';
  } catch {
    return 'metric';
  }
}

/**
 * Saves the unit preference.
 * @param {string} unit - 'metric' or 'imperial'
 */
export function setUnit(unit) {
  try {
    localStorage.setItem(KEYS.unit, unit);
  } catch {
    // silently ignore
  }
}
