/**
 * File: theme.js
 * Description: Dynamic weather-based theming — applies CSS classes to body
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const THEME_CLASSES = [
  'theme-sunny',
  'theme-night',
  'theme-cloudy',
  'theme-rainy',
  'theme-storm',
  'theme-snow',
  'theme-mist',
];

/**
 * Determines the correct theme class and applies it to <body>.
 * @param {number} weatherId - OpenWeatherMap condition ID
 * @param {number} sunriseTimestamp - Sunrise Unix timestamp
 * @param {number} sunsetTimestamp - Sunset Unix timestamp
 */
export function applyWeatherTheme(weatherId, sunriseTimestamp, sunsetTimestamp) {
  const now = Math.floor(Date.now() / 1000);
  const isNight = now < sunriseTimestamp || now > sunsetTimestamp;

  let theme;

  if (weatherId >= 200 && weatherId <= 232) {
    theme = 'theme-storm';
  } else if (weatherId >= 300 && weatherId <= 399) {
    theme = 'theme-rainy';
  } else if (weatherId >= 500 && weatherId <= 599) {
    theme = 'theme-rainy';
  } else if (weatherId >= 600 && weatherId <= 699) {
    theme = 'theme-snow';
  } else if (weatherId >= 700 && weatherId <= 799) {
    theme = 'theme-mist';
  } else if (weatherId === 800) {
    theme = isNight ? 'theme-night' : 'theme-sunny';
  } else if (weatherId >= 801 && weatherId <= 804) {
    theme = 'theme-cloudy';
  } else {
    theme = 'theme-cloudy';
  }

  // Remove all existing theme classes
  THEME_CLASSES.forEach(cls => document.body.classList.remove(cls));

  // Apply new theme
  document.body.classList.add(theme);
}
