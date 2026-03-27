/**
 * File: main.js
 * Description: Beat Maker entry point – wires audio, sequencer, transport, UI
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { getInstruments } from './modules/instruments.js';
import { initAudio, createInstrumentGain, setMasterVolume, setInstrumentVolume, resumeContext } from './modules/audio.js';
import { initSequencer, togglePad, clearGrid } from './modules/sequencer.js';
import { play, stop, setBPM, getIsPlaying } from './modules/transport.js';
import { renderGrid, highlightStep, clearAllPads, setPlayingState } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
  // Init audio
  initAudio();
  const instruments = getInstruments();
  instruments.forEach(inst => createInstrumentGain(inst.id, inst.defaultVolume));

  // Init sequencer
  initSequencer();

  // Render grid
  const gridContainer = document.getElementById('sequencer-grid');
  renderGrid(gridContainer, onPadClick, onVolumeChange);

  // Transport buttons
  document.getElementById('btn-play').addEventListener('click', onPlay);
  document.getElementById('btn-stop').addEventListener('click', onStop);
  document.getElementById('btn-clear').addEventListener('click', onClear);

  // BPM slider
  const bpmSlider = document.getElementById('bpm-slider');
  const bpmDisplay = document.getElementById('bpm-display');
  bpmSlider.addEventListener('input', () => {
    setBPM(Number(bpmSlider.value));
    bpmDisplay.textContent = bpmSlider.value;
  });

  // Master volume
  const volSlider = document.getElementById('master-volume');
  const volDisplay = document.getElementById('volume-display');
  volSlider.addEventListener('input', () => {
    setMasterVolume(Number(volSlider.value) / 100);
    volDisplay.textContent = `${volSlider.value}%`;
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); getIsPlaying() ? onStop() : onPlay(); }
    if (e.key === 'c' || e.key === 'C') onClear();
  });

  // Resume audio on first interaction
  document.body.addEventListener('click', resumeContext, { once: true });
}

function onPadClick(instrumentIndex, step) {
  resumeContext();
  return togglePad(instrumentIndex, step);
}

function onVolumeChange(instrumentId, value) {
  setInstrumentVolume(instrumentId, value);
}

function onPlay() {
  resumeContext();
  setPlayingState(true);
  play((step) => highlightStep(step));
}

function onStop() {
  stop();
  setPlayingState(false);
  highlightStep(-1);
}

function onClear() {
  clearGrid();
  clearAllPads();
}
