/**
 * File: api.js
 * Description: API calls to OpenWeatherMap — fetches weather and forecast data
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { API_KEY, ENDPOINTS } from './config.js';
import { DEMO_CURRENT, DEMO_FORECAST } from './demo-data.js';

const isDemoMode = API_KEY === 'YOUR_API_KEY_HERE';

const cToF = (c) => c * 9 / 5 + 32;

function getDemoData(units) {
  if (units === 'imperial') {
    const current = JSON.parse(JSON.stringify(DEMO_CURRENT));
    current.main.temp = Math.round(cToF(current.main.temp));
    current.main.feels_like = Math.round(cToF(current.main.feels_like));
    current.wind.speed = Math.round(current.wind.speed * 2.237 * 10) / 10;

    const forecast = JSON.parse(JSON.stringify(DEMO_FORECAST));
    for (const entry of forecast.list) {
      entry.main.temp = Math.round(cToF(entry.main.temp));
      entry.main.temp_min = Math.round(cToF(entry.main.temp_min));
      entry.main.temp_max = Math.round(cToF(entry.main.temp_max));
    }
    return { current, forecast };
  }
  return { current: DEMO_CURRENT, forecast: DEMO_FORECAST };
}

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
  if (isDemoMode) return getDemoData(units).current;
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
  if (isDemoMode) return getDemoData(units).forecast;
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
  if (isDemoMode) return getDemoData(units).current;
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
  if (isDemoMode) return getDemoData(units).forecast;
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
