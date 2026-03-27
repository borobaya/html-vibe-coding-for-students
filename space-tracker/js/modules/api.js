/**
 * File: api.js
 * Description: HTTP requests to Open Notify API for ISS position and crew data
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { ISS_POSITION_URL, ASTROS_URL } from './config.js';

/**
 * Fetches the current ISS position.
 * @returns {Promise<{latitude: number, longitude: number, timestamp: number}>}
 * @throws {Error} On network or API error
 */
export async function fetchISSPosition() {
  const response = await fetch(ISS_POSITION_URL);
  if (!response.ok) {
    throw new Error(`ISS API error: ${response.status}`);
  }
  const data = await response.json();
  return {
    latitude: parseFloat(data.iss_position.latitude),
    longitude: parseFloat(data.iss_position.longitude),
    timestamp: data.timestamp,
  };
}

/**
 * Fetches the list of people currently in space.
 * @returns {Promise<{number: number, people: Array<{name: string, craft: string}>}>}
 * @throws {Error} On network or API error
 */
export async function fetchAstros() {
  const response = await fetch(ASTROS_URL);
  if (!response.ok) {
    throw new Error(`Astros API error: ${response.status}`);
  }
  return response.json();
}
