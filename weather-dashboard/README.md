[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Weather Dashboard

A dynamic weather dashboard that fetches real-time weather data from the OpenWeatherMap API. Search for any city worldwide to view current conditions, a 5-day forecast, and detailed weather stats — all presented in a clean, responsive interface.

## Features

- **City Search** — Look up weather for any city by name with instant results
- **Current Conditions** — Displays temperature, weather description, humidity, and wind speed for the selected city
- **5-Day Forecast** — Shows upcoming daily forecasts with high/low temperatures and weather icons
- **Weather Icons** — Dynamic icons that reflect current and forecasted weather conditions (sunny, cloudy, rain, snow, etc.)
- **Temperature Display** — View temperatures in a clear, readable format
- **Humidity & Wind Speed** — Detailed atmospheric data alongside the main forecast
- **Responsive Layout** — Works across desktop and mobile screen sizes
- **Error Handling** — Displays user-friendly messages for invalid cities or network issues

## How to Use

1. Open the app in your browser.
2. Type a city name into the search bar and press Enter or click the search button.
3. View the current weather conditions displayed at the top of the dashboard.
4. Scroll down to see the 5-day forecast with daily temperatures and weather icons.
5. Search for a different city at any time to update the dashboard.

## Project Structure

```text
weather-dashboard/
├── index.html
├── js/
│   └── main.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — Semantic page structure
- **CSS3** — Styling, layout, and responsive design
- **JavaScript (ES2022+)** — API calls, DOM updates, and application logic
- **OpenWeatherMap API** — Free-tier weather data provider

## Getting Started

1. Clone or download this repository.
2. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api).
3. Open `js/main.js` and add your API key where indicated.
4. Open `index.html` directly in your browser, or start a local server:

```bash
python3 server.py
```

Then visit `http://localhost:5500/weather-dashboard` in your browser.
