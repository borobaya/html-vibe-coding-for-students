/**
 * File: main.js
 * Description: Entry point — initialises app, coordinates all modules
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { fetchCurrentWeather, fetchForecast, fetchWeatherByCoords, fetchForecastByCoords } from './modules/api.js';
import {
  renderCurrentWeather,
  renderForecast,
  renderDetails,
  renderRecentSearches,
  renderError,
  clearError,
  showLoading,
  hideLoading,
  showDashboard,
} from './modules/dom.js';
import { initSearch } from './modules/search.js';
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  getLastCity,
  setLastCity,
  getUnit,
  setUnit,
} from './modules/storage.js';
import { applyWeatherTheme } from './modules/theme.js';

/** Currently displayed city name (used for unit re-fetch). */
let currentCity = null;

/**
 * Fetches and renders weather for a city name.
 * @param {string} city - City name to look up
 */
async function handleSearch(city) {
  clearError();
  showLoading();

  const unit = getUnit();

  try {
    const [currentData, forecastData] = await Promise.all([
      fetchCurrentWeather(city, unit),
      fetchForecast(city, unit),
    ]);

    renderCurrentWeather(currentData, unit);
    renderDetails(currentData, unit);
    renderForecast(forecastData, unit);
    applyWeatherTheme(
      currentData.weather[0].id,
      currentData.sys.sunrise,
      currentData.sys.sunset
    );

    currentCity = currentData.name;
    addRecentSearch(currentData.name);
    renderRecentSearches(getRecentSearches());
    setLastCity(currentData.name);

    hideLoading();
    showDashboard();
  } catch (errorMsg) {
    hideLoading();
    renderError(typeof errorMsg === 'string' ? errorMsg : 'Something went wrong. Please try again later.');
  }
}

/**
 * Fetches and renders weather by geographic coordinates.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
async function handleCoordsSearch(lat, lon) {
  clearError();
  showLoading();

  const unit = getUnit();

  try {
    const [currentData, forecastData] = await Promise.all([
      fetchWeatherByCoords(lat, lon, unit),
      fetchForecastByCoords(lat, lon, unit),
    ]);

    renderCurrentWeather(currentData, unit);
    renderDetails(currentData, unit);
    renderForecast(forecastData, unit);
    applyWeatherTheme(
      currentData.weather[0].id,
      currentData.sys.sunrise,
      currentData.sys.sunset
    );

    currentCity = currentData.name;
    addRecentSearch(currentData.name);
    renderRecentSearches(getRecentSearches());
    setLastCity(currentData.name);

    hideLoading();
    showDashboard();
  } catch (errorMsg) {
    hideLoading();
    // Fallback to London on geolocation fetch failure
    handleSearch('London');
  }
}

/**
 * Removes a city from recent searches and re-renders chips.
 * @param {string} city - City to remove
 */
function handleRemoveRecent(city) {
  removeRecentSearch(city);
  renderRecentSearches(getRecentSearches());
}

/**
 * Gets user's geolocation as a Promise.
 * @returns {Promise<{lat: number, lon: number}>}
 */
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      (error) => reject(error),
      { timeout: 5000 }
    );
  });
}

/** Sets up the unit toggle buttons. */
function initUnitToggle() {
  const buttons = document.querySelectorAll('.unit-toggle__btn');
  const currentUnit = getUnit();

  // Set initial active state
  buttons.forEach((btn) => {
    const isActive = btn.dataset.unit === currentUnit;
    btn.classList.toggle('unit-toggle__btn--active', isActive);
    btn.setAttribute('aria-pressed', isActive.toString());
  });

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const newUnit = btn.dataset.unit;
      if (newUnit === getUnit()) return;

      setUnit(newUnit);

      buttons.forEach((b) => {
        const active = b.dataset.unit === newUnit;
        b.classList.toggle('unit-toggle__btn--active', active);
        b.setAttribute('aria-pressed', active.toString());
      });

      // Re-fetch with new units
      if (currentCity) {
        handleSearch(currentCity);
      }
    });
  });
}

/** App initialisation on DOM ready. */
document.addEventListener('DOMContentLoaded', () => {
  // Render any saved recent searches
  renderRecentSearches(getRecentSearches());

  // Set up unit toggle
  initUnitToggle();

  // Set up search form
  initSearch(handleSearch, handleRemoveRecent);

  // Determine initial city
  const lastCity = getLastCity();
  if (lastCity) {
    handleSearch(lastCity);
  } else {
    getUserLocation()
      .then(({ lat, lon }) => handleCoordsSearch(lat, lon))
      .catch(() => handleSearch('London'));
  }
});
