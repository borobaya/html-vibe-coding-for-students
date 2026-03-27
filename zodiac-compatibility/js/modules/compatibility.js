/**
 * File: compatibility.js
 * Description: Compatibility score lookup, rating labels, and reading retrieval
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { COMPATIBILITY_MATRIX, COMPATIBILITY_READINGS, RATING_LABELS } from './zodiacData.js';

/**
 * Maps a score to its rating label
 * @param {number} score - 0-100
 * @returns {string}
 */
export function getRatingLabel(score) {
  for (const tier of RATING_LABELS) {
    if (score >= tier.min && score <= tier.max) {
      return tier.label;
    }
  }
  return '';
}

/**
 * Gets the compatibility reading for a pair of signs
 * @param {string} sign1Name
 * @param {string} sign2Name
 * @returns {string}
 */
export function getReading(sign1Name, sign2Name) {
  // Alphabetically sort for consistent key
  const sorted = [sign1Name, sign2Name].sort();
  const key = `${sorted[0]}-${sorted[1]}`;
  return COMPATIBILITY_READINGS[key] || `${sign1Name} and ${sign2Name} share a unique cosmic connection. Every pairing has its own rhythm \u2014 embrace your differences and celebrate what you share.`;
}

/**
 * Calculates full compatibility result from two sign objects
 * @param {object} sign1 - First zodiac sign object
 * @param {object} sign2 - Second zodiac sign object
 * @returns {{ score: number, ratingLabel: string, reading: string }}
 */
export function calculateCompatibility(sign1, sign2) {
  const score = COMPATIBILITY_MATRIX[sign1.name][sign2.name];
  const ratingLabel = getRatingLabel(score);
  const reading = getReading(sign1.name, sign2.name);

  return { score, ratingLabel, reading };
}
