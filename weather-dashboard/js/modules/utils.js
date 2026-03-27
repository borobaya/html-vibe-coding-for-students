/**
 * File: utils.js
 * Description: Helper functions — date formatting, wind direction, temp conversion, icon mapping
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Maps OpenWeatherMap condition ID to an emoji icon.
 * @param {number} weatherId - OWM condition code
 * @param {boolean} [isNight=false] - Whether it is currently night
 * @returns {string} Emoji representing the weather
 */
export function getWeatherEmoji(weatherId, isNight = false) {
  if (weatherId >= 200 && weatherId <= 232) return '⛈️';
  if (weatherId >= 300 && weatherId <= 321) return '🌦️';
  if (weatherId >= 500 && weatherId <= 504) return '🌧️';
  if (weatherId === 511) return '🌨️';
  if (weatherId >= 520 && weatherId <= 531) return '🌧️';
  if (weatherId >= 600 && weatherId <= 622) return '❄️';
  if (weatherId === 751) return '🏜️';
  if (weatherId === 762) return '🌋';
  if (weatherId === 771) return '💨';
  if (weatherId === 781) return '🌪️';
  if (weatherId >= 700 && weatherId <= 799) return '🌫️';
  if (weatherId === 800) return isNight ? '🌙' : '☀️';
  if (weatherId === 801) return '🌤️';
  if (weatherId === 802) return '⛅';
  if (weatherId === 803) return '🌥️';
  if (weatherId === 804) return '☁️';
  return '🌡️';
}

/**
 * Formats temperature with unit symbol.
 * @param {number} temp - Temperature value
 * @param {string} unit - 'metric' or 'imperial'
 * @returns {string} Formatted temperature string
 */
export function formatTemp(temp, unit) {
  const rounded = Math.round(temp);
  const symbol = unit === 'imperial' ? '°F' : '°C';
  return `${rounded}${symbol}`;
}

/**
 * Formats temperature without unit for compact display.
 * @param {number} temp - Temperature value
 * @returns {string} Rounded temperature with degree sign
 */
export function formatTempShort(temp) {
  return `${Math.round(temp)}°`;
}

/**
 * Converts Unix timestamp to HH:MM format adjusted for timezone.
 * @param {number} unixTimestamp - Unix timestamp in seconds
 * @param {number} timezoneOffset - Timezone offset in seconds from UTC
 * @returns {string} Formatted time string
 */
export function formatTime(unixTimestamp, timezoneOffset) {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Returns the day name from a Unix timestamp.
 * @param {number} unixTimestamp - Unix timestamp in seconds
 * @returns {string} Short day name (Mon, Tue, etc.)
 */
export function formatDate(unixTimestamp) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(unixTimestamp * 1000);
  return days[date.getDay()];
}

/**
 * Returns a "Updated: HH:MM" string for current local time.
 * @returns {string} Last-updated display string
 */
export function formatFullDate() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `Updated: ${hours}:${minutes}`;
}

/**
 * Converts wind bearing degrees to compass direction.
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} Compass direction label
 */
export function getWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Capitalises first letter of each word.
 * @param {string} str - Input string
 * @returns {string} Capitalised string
 */
export function capitalise(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Creates a debounced version of a function.
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}
