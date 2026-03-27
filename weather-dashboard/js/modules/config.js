/**
 * File: config.js
 * Description: API key and endpoint constants for OpenWeatherMap
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

// Students: replace this with your own API key from https://openweathermap.org/api
export const API_KEY = 'YOUR_API_KEY_HERE';

export const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const ENDPOINTS = {
  currentWeather: (city, units = 'metric') =>
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`,
  forecast: (city, units = 'metric') =>
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`,
  currentWeatherByCoords: (lat, lon, units = 'metric') =>
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`,
  forecastByCoords: (lat, lon, units = 'metric') =>
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`,
};

export const MAX_RECENT_SEARCHES = 6;
export const DEBOUNCE_DELAY = 400;
