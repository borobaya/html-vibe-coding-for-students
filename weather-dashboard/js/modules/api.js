/**
 * File: api.js
 * Description: API calls to OpenWeatherMap — fetches weather and forecast data
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { ENDPOINTS } from './config.js';

/**
 * Returns a user-friendly error message based on HTTP status.
 * @param {object} error - Error object with status property
 * @returns {string} Human-readable error message
 */
function getErrorMessage(error) {
  if (error && error.status === 404) {
    return 'City not found. Please check the spelling and try again.';
  }
  if (error && error.status === 401) {
    return 'Invalid API key. Please check your config.js file.';
  }
  if (error && error.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (error instanceof TypeError) {
    return 'Unable to connect. Please check your internet connection.';
  }
  return 'Something went wrong. Please try again later.';
}

/**
 * Fetches current weather data for a city.
 * @param {string} city - City name to search
 * @param {string} [units='metric'] - Unit system
 * @returns {Promise<object>} Parsed weather data
 * @throws {string} User-friendly error message
 */
export async function fetchCurrentWeather(city, units = 'metric') {
  const url = ENDPOINTS.currentWeather(city, units);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw { status: response.status, statusText: response.statusText };
    }
    return await response.json();
  } catch (error) {
    throw getErrorMessage(error);
  }
}

/**
 * Fetches 5-day / 3-hour forecast data for a city.
 * @param {string} city - City name to search
 * @param {string} [units='metric'] - Unit system
 * @returns {Promise<object>} Parsed forecast data
 * @throws {string} User-friendly error message
 */
export async function fetchForecast(city, units = 'metric') {
  const url = ENDPOINTS.forecast(city, units);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw { status: response.status, statusText: response.statusText };
    }
    return await response.json();
  } catch (error) {
    throw getErrorMessage(error);
  }
}

/**
 * Fetches current weather by geographic coordinates.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} [units='metric'] - Unit system
 * @returns {Promise<object>} Parsed weather data
 * @throws {string} User-friendly error message
 */
export async function fetchWeatherByCoords(lat, lon, units = 'metric') {
  const url = ENDPOINTS.currentWeatherByCoords(lat, lon, units);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw { status: response.status, statusText: response.statusText };
    }
    return await response.json();
  } catch (error) {
    throw getErrorMessage(error);
  }
}

/**
 * Fetches 5-day forecast by geographic coordinates.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} [units='metric'] - Unit system
 * @returns {Promise<object>} Parsed forecast data
 * @throws {string} User-friendly error message
 */
export async function fetchForecastByCoords(lat, lon, units = 'metric') {
  const url = ENDPOINTS.forecastByCoords(lat, lon, units);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw { status: response.status, statusText: response.statusText };
    }
    return await response.json();
  } catch (error) {
    throw getErrorMessage(error);
  }
}
