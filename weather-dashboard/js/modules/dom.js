/**
 * File: dom.js
 * Description: DOM rendering — creates/updates all weather display elements
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import {
  getWeatherEmoji,
  formatTemp,
  formatTempShort,
  formatTime,
  formatDate,
  formatFullDate,
  getWindDirection,
  capitalise,
} from './utils.js';

/* ── Cached elements ──────────────────────────────────── */
const els = {
  dashboard: document.querySelector('.dashboard'),
  loading: document.querySelector('.loading'),
  error: document.querySelector('.error'),
  errorMessage: document.querySelector('.error__message'),

  cityName: document.querySelector('.current-weather__city-name'),
  country: document.querySelector('.current-weather__country'),
  weatherIcon: document.querySelector('.current-weather__icon'),
  temp: document.querySelector('.current-weather__temp'),
  description: document.querySelector('.current-weather__description'),
  updatedTime: document.querySelector('.current-weather__time'),

  detailHumidity: document.querySelector('[data-detail="humidity"]'),
  detailWind: document.querySelector('[data-detail="wind"]'),
  detailFeelsLike: document.querySelector('[data-detail="feels-like"]'),
  detailPressure: document.querySelector('[data-detail="pressure"]'),
  detailVisibility: document.querySelector('[data-detail="visibility"]'),
  detailSunrise: document.querySelector('[data-detail="sunrise"]'),
  detailSunset: document.querySelector('[data-detail="sunset"]'),
  detailWindDir: document.querySelector('[data-detail="wind-direction"]'),

  forecastCards: document.querySelector('.forecast__cards'),
  recentContainer: document.querySelector('.search__recent'),
};

/**
 * Renders current weather data into the card.
 * @param {object} data - OpenWeatherMap current weather response
 * @param {string} unit - 'metric' or 'imperial'
 */
export function renderCurrentWeather(data, unit) {
  const isNight =
    Math.floor(Date.now() / 1000) < data.sys.sunrise ||
    Math.floor(Date.now() / 1000) > data.sys.sunset;

  els.cityName.textContent = data.name;
  els.country.textContent = data.sys.country;
  els.weatherIcon.textContent = getWeatherEmoji(data.weather[0].id, isNight);
  els.temp.textContent = formatTemp(data.main.temp, unit);
  els.description.textContent = capitalise(data.weather[0].description);
  els.updatedTime.textContent = formatFullDate();
}

/**
 * Renders the weather details panel.
 * @param {object} data - OpenWeatherMap current weather response
 * @param {string} unit - 'metric' or 'imperial'
 */
export function renderDetails(data, unit) {
  els.detailHumidity.textContent = `${data.main.humidity}%`;

  // Wind: metric comes as m/s → convert to km/h; imperial stays as mph
  const windSpeed =
    unit === 'metric'
      ? `${Math.round(data.wind.speed * 3.6)} km/h`
      : `${Math.round(data.wind.speed)} mph`;
  const windDir = getWindDirection(data.wind.deg || 0);
  els.detailWind.textContent = `${windSpeed} ${windDir}`;

  els.detailFeelsLike.textContent = formatTemp(data.main.feels_like, unit);
  els.detailPressure.textContent = `${data.main.pressure} hPa`;
  els.detailVisibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  els.detailSunrise.textContent = formatTime(data.sys.sunrise, data.timezone);
  els.detailSunset.textContent = formatTime(data.sys.sunset, data.timezone);
  els.detailWindDir.textContent = `${data.wind.deg || 0}° (${windDir})`;
}

/**
 * Renders the 5-day forecast cards from API data.
 * Groups 3-hour entries by date, picks midday icon, finds min/max temp.
 * @param {object} data - OpenWeatherMap forecast response
 * @param {string} unit - 'metric' or 'imperial'
 */
export function renderForecast(data, unit) {
  // Clear existing cards
  while (els.forecastCards.firstChild) {
    els.forecastCards.removeChild(els.forecastCards.firstChild);
  }

  // Group entries by date
  const dailyMap = new Map();
  for (const entry of data.list) {
    const dateStr = entry.dt_txt.split(' ')[0];
    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, []);
    }
    dailyMap.get(dateStr).push(entry);
  }

  // Skip today, take next 5 days
  const today = new Date().toISOString().split('T')[0];
  const days = [...dailyMap.entries()]
    .filter(([date]) => date !== today)
    .slice(0, 5);

  for (const [, entries] of days) {
    const temps = entries.map(e => e.main.temp);
    const high = Math.max(...temps);
    const low = Math.min(...temps);

    // Pick midday entry (closest to 12:00) for icon
    const middayEntry =
      entries.find(e => e.dt_txt.includes('12:00:00')) || entries[0];
    const weatherId = middayEntry.weather[0].id;

    const card = document.createElement('article');
    card.className = 'forecast__card';
    card.setAttribute('role', 'listitem');

    const dayName = document.createElement('h3');
    dayName.className = 'forecast__day';
    dayName.textContent = formatDate(entries[0].dt);

    const icon = document.createElement('div');
    icon.className = 'forecast__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = getWeatherEmoji(weatherId);

    const tempP = document.createElement('p');
    tempP.className = 'forecast__temp';

    const highSpan = document.createElement('span');
    highSpan.className = 'forecast__high';
    highSpan.textContent = formatTempShort(high);

    const lowSpan = document.createElement('span');
    lowSpan.className = 'forecast__low';
    lowSpan.textContent = formatTempShort(low);

    tempP.appendChild(highSpan);
    tempP.appendChild(document.createTextNode(' '));
    tempP.appendChild(lowSpan);

    card.appendChild(dayName);
    card.appendChild(icon);
    card.appendChild(tempP);
    els.forecastCards.appendChild(card);
  }
}

/**
 * Renders recent search chips.
 * @param {string[]} searches - Array of city names
 */
export function renderRecentSearches(searches) {
  while (els.recentContainer.firstChild) {
    els.recentContainer.removeChild(els.recentContainer.firstChild);
  }

  for (const city of searches) {
    const chip = document.createElement('button');
    chip.className = 'search__chip';
    chip.setAttribute('role', 'listitem');
    chip.dataset.city = city;

    const nameSpan = document.createTextNode(`${city} `);
    const removeSpan = document.createElement('span');
    removeSpan.className = 'search__chip-remove';
    removeSpan.setAttribute('aria-label', `Remove ${city}`);
    removeSpan.textContent = '✕';

    chip.appendChild(nameSpan);
    chip.appendChild(removeSpan);
    els.recentContainer.appendChild(chip);
  }
}

/**
 * Shows an inline error message.
 * @param {string} message - Error text to display
 */
export function renderError(message) {
  els.errorMessage.textContent = message;
  els.error.hidden = false;
}

/** Hides the error container. */
export function clearError() {
  els.error.hidden = true;
  els.errorMessage.textContent = '';
}

/** Shows the loading spinner. */
export function showLoading() {
  els.loading.hidden = false;
  els.dashboard.hidden = true;
  els.dashboard.classList.remove('is-visible');
}

/** Hides loading, shows dashboard with animation. */
export function hideLoading() {
  els.loading.hidden = true;
}

/** Reveals the dashboard with a fade-in effect. */
export function showDashboard() {
  els.dashboard.hidden = false;
  // Force reflow before adding animation class
  void els.dashboard.offsetHeight;
  els.dashboard.classList.add('is-visible');

  // Move focus to city heading for screen readers
  const cityHeading = document.querySelector('.current-weather__city');
  if (cityHeading) {
    cityHeading.setAttribute('tabindex', '-1');
    cityHeading.focus();
    cityHeading.addEventListener(
      'blur',
      () => cityHeading.removeAttribute('tabindex'),
      { once: true }
    );
  }
}
