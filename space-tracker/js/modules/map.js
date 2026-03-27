/**
 * File: map.js
 * Description: Leaflet map initialisation, ISS marker, and orbit trail
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION, MAX_TRAIL_POINTS } from './config.js';

/* global L */

let map = null;
let issMarker = null;
let trailLine = null;
let trailCoords = [];
let trailVisible = true;

/**
 * Creates and initialises the Leaflet map.
 * @param {string} containerId - DOM element ID for the map
 * @param {number} lat - Initial latitude
 * @param {number} lng - Initial longitude
 */
export function initMap(containerId, lat, lng) {
  map = L.map(containerId, {
    center: [lat, lng],
    zoom: DEFAULT_ZOOM,
    zoomControl: true,
    worldCopyJump: true,
  });

  L.tileLayer(TILE_URL, {
    attribution: TILE_ATTRIBUTION,
    maxZoom: 18,
  }).addTo(map);

  const issIcon = L.divIcon({
    className: 'iss-icon',
    html: '🛰️',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  issMarker = L.marker([lat, lng], { icon: issIcon }).addTo(map);

  trailLine = L.polyline([], {
    color: '#4da6ff',
    weight: 2,
    opacity: 0.6,
    dashArray: '8 4',
  }).addTo(map);
}

/**
 * Moves the ISS marker and extends the orbit trail.
 * @param {number} lat - New latitude
 * @param {number} lng - New longitude
 */
export function updateMarker(lat, lng) {
  if (!issMarker) return;

  issMarker.setLatLng([lat, lng]);
  trailCoords.push([lat, lng]);

  if (trailCoords.length > MAX_TRAIL_POINTS) {
    trailCoords.shift();
  }

  if (trailVisible && trailLine) {
    trailLine.setLatLngs(trailCoords);
  }
}

/** Re-centres the map on the current ISS position. */
export function recentreMap() {
  if (!map || !issMarker) return;
  map.setView(issMarker.getLatLng(), DEFAULT_ZOOM);
}

/**
 * Toggles the orbit trail visibility.
 * @returns {boolean} New visibility state
 */
export function toggleTrail() {
  if (!trailLine || !map) return trailVisible;

  if (trailVisible) {
    map.removeLayer(trailLine);
    trailVisible = false;
  } else {
    trailLine.setLatLngs(trailCoords);
    trailLine.addTo(map);
    trailVisible = true;
  }

  return trailVisible;
}

/**
 * Returns the Leaflet map instance.
 * @returns {object|null} L.Map instance
 */
export function getMap() {
  return map;
}
