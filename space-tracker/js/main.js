/**
 * File: main.js
 * Description: Application entry point — polling, crew loading, event bindings
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { POLL_INTERVAL_MS, STALE_THRESHOLD_S } from './modules/config.js';
import { fetchISSPosition, fetchAstros } from './modules/api.js';
import { initMap, updateMarker, recentreMap, toggleTrail } from './modules/map.js';
import { renderCrew, showCrewSkeleton } from './modules/crew.js';
import { updateCoordinates, setStatus, showToast } from './modules/ui.js';

let pollTimer = null;
let lastSuccessTimestamp = 0;

/** Fetches the ISS position once and updates the UI. */
async function pollPosition() {
  try {
    const { latitude, longitude, timestamp } = await fetchISSPosition();

    updateMarker(latitude, longitude);
    updateCoordinates(latitude, longitude);
    lastSuccessTimestamp = timestamp;
    setStatus('live');
  } catch (err) {
    const elapsed = Date.now() / 1000 - lastSuccessTimestamp;

    if (elapsed > STALE_THRESHOLD_S) {
      setStatus('error');
    } else {
      setStatus('stale');
    }

    showToast('Failed to fetch ISS position', 'error');
  }
}

/**
 * Starts the position-polling interval.
 */
function startPolling() {
  pollPosition();
  pollTimer = setInterval(pollPosition, POLL_INTERVAL_MS);
}

/** Fetches and renders the crew list. */
async function loadCrew() {
  const crewContainer = document.getElementById('crew-list');
  if (!crewContainer) return;

  showCrewSkeleton(crewContainer);

  try {
    const { people } = await fetchAstros();
    renderCrew(people, crewContainer);
  } catch {
    crewContainer.innerHTML = '';
    const msg = document.createElement('p');
    msg.className = 'crew-panel__empty';
    msg.textContent = 'Unable to load crew data.';
    crewContainer.appendChild(msg);
    showToast('Could not load crew information', 'error');
  }
}

/** Binds header control buttons. */
function bindControls() {
  const recentreBtn = document.getElementById('btn-recentre');
  const trailBtn = document.getElementById('btn-trail');

  if (recentreBtn) {
    recentreBtn.addEventListener('click', () => {
      recentreMap();
      showToast('Map re-centred on ISS');
    });
  }

  if (trailBtn) {
    trailBtn.addEventListener('click', () => {
      const visible = toggleTrail();
      trailBtn.textContent = visible ? '🛤️ Trail' : '🛤️ Trail Off';
      trailBtn.setAttribute('aria-pressed', String(visible));
      showToast(visible ? 'Orbit trail visible' : 'Orbit trail hidden');
    });
  }
}

/** Initialises the application. */
async function init() {
  try {
    const { latitude, longitude, timestamp } = await fetchISSPosition();

    initMap('map', latitude, longitude);
    updateCoordinates(latitude, longitude);
    lastSuccessTimestamp = timestamp;
    setStatus('live');

    startPolling();
  } catch {
    initMap('map', 0, 0);
    setStatus('error');
    showToast('Could not connect — retrying…', 'error');
    startPolling();
  }

  loadCrew();
  bindControls();
}

document.addEventListener('DOMContentLoaded', init);
