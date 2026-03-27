/**
 * File: config.js
 * Description: Constants and configuration for Space Tracker
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export const ISS_POSITION_URL = 'http://api.open-notify.org/iss-now.json';
export const ASTROS_URL = 'http://api.open-notify.org/astros.json';
export const POLL_INTERVAL_MS = 5000;
export const STALE_THRESHOLD_S = 15;
export const MAX_TRAIL_POINTS = 200;
export const DEFAULT_ZOOM = 3;
export const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';
export const TOAST_DURATION_MS = 4000;
