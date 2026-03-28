/**
 * File: demo-data.js
 * Description: Mock weather data for demo mode (when no API key is set)
 * Author: AI4Students
 * Created: 2026-03-28
 */

const now = Math.floor(Date.now() / 1000);
const todaySunrise = now - (now % 86400) + 6 * 3600;
const todaySunset = now - (now % 86400) + 18 * 3600;

export const DEMO_CURRENT = {
  name: 'London',
  sys: { country: 'GB', sunrise: todaySunrise, sunset: todaySunset },
  timezone: 0,
  weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds' }],
  main: {
    temp: 14,
    feels_like: 12,
    humidity: 68,
    pressure: 1018,
  },
  wind: { speed: 4.5, deg: 230 },
  visibility: 10000,
};

function buildForecastList() {
  const conditions = [
    { id: 802, description: 'scattered clouds' },
    { id: 500, description: 'light rain' },
    { id: 800, description: 'clear sky' },
    { id: 801, description: 'few clouds' },
    { id: 500, description: 'light rain' },
  ];

  const temps = [
    { day: [11, 14, 13, 10], min: 9, max: 15 },
    { day: [9, 11, 10, 8], min: 7, max: 12 },
    { day: [13, 17, 16, 12], min: 11, max: 18 },
    { day: [12, 15, 14, 11], min: 10, max: 16 },
    { day: [10, 12, 11, 9], min: 8, max: 13 },
  ];

  const list = [];
  const startOfDay = now - (now % 86400) + 86400;

  for (let d = 0; d < 5; d++) {
    const hours = [6, 9, 12, 15, 18, 21];
    for (let h = 0; h < hours.length; h++) {
      const dt = startOfDay + d * 86400 + hours[h] * 3600;
      const tempIdx = Math.min(h, temps[d].day.length - 1);
      list.push({
        dt,
        dt_txt: new Date(dt * 1000).toISOString().replace('T', ' ').slice(0, 19),
        main: {
          temp: temps[d].day[tempIdx],
          temp_min: temps[d].min,
          temp_max: temps[d].max,
        },
        weather: [{ id: conditions[d].id, description: conditions[d].description }],
      });
    }
  }
  return list;
}

export const DEMO_FORECAST = {
  city: { name: 'London', country: 'GB', timezone: 0 },
  list: buildForecastList(),
};
