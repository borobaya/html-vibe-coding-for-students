/**
 * File: ui.js
 * Description: DOM rendering for sequencer grid, playhead, controls
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { getInstruments } from './instruments.js';
import { getStepCount } from './sequencer.js';

let gridEl = null;
let prevPlayheadStep = -1;

/**
 * Renders the sequencer grid into the DOM
 * @param {HTMLElement} container
 * @param {function} onPadClick - (instrumentIndex, step)
 * @param {function} onVolumeChange - (instrumentId, value)
 */
export function renderGrid(container, onPadClick, onVolumeChange) {
  gridEl = container;
  container.innerHTML = '';

  const instruments = getInstruments();
  const steps = getStepCount();

  // Header row: corner + step numbers + vol header
  const corner = document.createElement('div');
  corner.className = 'sequencer__corner';
  container.appendChild(corner);

  for (let s = 0; s < steps; s++) {
    const num = document.createElement('div');
    num.className = 'sequencer__step-number';
    num.textContent = s + 1;
    container.appendChild(num);
  }

  const volHeader = document.createElement('div');
  volHeader.className = 'sequencer__vol-header';
  volHeader.textContent = 'Vol';
  container.appendChild(volHeader);

  // Instrument rows
  instruments.forEach((inst, i) => {
    const label = document.createElement('div');
    label.className = 'sequencer__label';
    label.textContent = inst.name;
    label.dataset.short = inst.shortName;
    container.appendChild(label);

    for (let s = 0; s < steps; s++) {
      const pad = document.createElement('button');
      pad.className = 'sequencer__pad';
      pad.dataset.instrument = String(i);
      pad.dataset.step = String(s);
      pad.dataset.colour = inst.colour;
      pad.setAttribute('aria-pressed', 'false');
      pad.setAttribute('aria-label', `${inst.name} step ${s + 1}`);
      pad.addEventListener('click', () => {
        const active = onPadClick(i, s);
        pad.setAttribute('aria-pressed', String(active));
        pad.classList.toggle('sequencer__pad--active', active);
        if (active) pad.style.backgroundColor = inst.colour;
        else pad.style.backgroundColor = '';
      });
      container.appendChild(pad);
    }

    const vol = document.createElement('input');
    vol.type = 'range';
    vol.className = 'sequencer__vol-slider';
    vol.min = '0';
    vol.max = '100';
    vol.value = String(Math.round(inst.defaultVolume * 100));
    vol.dataset.instrument = inst.id;
    vol.setAttribute('aria-label', `${inst.name} volume`);
    vol.addEventListener('input', () => onVolumeChange(inst.id, Number(vol.value) / 100));
    container.appendChild(vol);
  });
}

/**
 * Highlights the current step column
 * @param {number} step - -1 to clear
 */
export function highlightStep(step) {
  if (!gridEl) return;
  const pads = gridEl.querySelectorAll('.sequencer__pad');
  const steps = getStepCount();

  // Remove previous playhead
  if (prevPlayheadStep >= 0) {
    pads.forEach(p => {
      if (Number(p.dataset.step) === prevPlayheadStep) {
        p.classList.remove('playhead');
      }
    });
  }

  if (step >= 0) {
    pads.forEach(p => {
      if (Number(p.dataset.step) === step) {
        p.classList.add('playhead');
      }
    });
  }

  prevPlayheadStep = step;
}

export function clearAllPads() {
  if (!gridEl) return;
  gridEl.querySelectorAll('.sequencer__pad').forEach(p => {
    p.classList.remove('sequencer__pad--active', 'playhead');
    p.setAttribute('aria-pressed', 'false');
    p.style.backgroundColor = '';
  });
}

export function setPlayingState(playing) {
  const playBtn = document.getElementById('btn-play');
  const stopBtn = document.getElementById('btn-stop');
  if (playBtn) playBtn.disabled = playing;
  if (stopBtn) stopBtn.disabled = !playing;
}
