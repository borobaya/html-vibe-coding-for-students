/**
 * File: main.js
 * Description: Entry point — orchestrates timer, settings, stats, audio, and UI
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { createTimer } from './modules/timer.js';
import { initSettings, getSettings } from './modules/settings.js';
import { initStats, recordSession } from './modules/stats.js';
import { initAudio, playNotification } from './modules/audio.js';
import {
  initUI, updateDisplay, updateButtonStates, setMode,
  renderSessionDots, announceToScreenReader, showCompletion
} from './modules/ui.js';

/* ── State ──────────────────────────────────────────── */
let currentMode = 'work'; // 'work' | 'short-break' | 'long-break'
let completedSessions = 0;
let settings = getSettings();
let timer = null;

/* ── Helpers ────────────────────────────────────────── */

/**
 * Returns the duration in seconds for the current mode
 * @returns {number}
 */
function getDuration() {
  if (currentMode === 'work') return settings.workMinutes * 60;
  if (currentMode === 'short-break') return settings.shortBreakMinutes * 60;
  return settings.longBreakMinutes * 60;
}

/** Determines the next mode after a completion */
function nextMode() {
  if (currentMode === 'work') {
    completedSessions += 1;
    recordSession(settings.workMinutes);
    renderSessionDots(settings.sessionsBeforeLongBreak, completedSessions % settings.sessionsBeforeLongBreak || settings.sessionsBeforeLongBreak);

    if (completedSessions % settings.sessionsBeforeLongBreak === 0) {
      return 'long-break';
    }
    return 'short-break';
  }
  // After any break, go back to work
  return 'work';
}

/** Switches to a new mode and resets the timer */
function switchMode(mode) {
  currentMode = mode;
  setMode(mode);
  timer.setDuration(getDuration());
  updateDisplay(timer.getState());
  updateButtonStates(timer.getState().state);
}

/* ── Timer Callbacks ────────────────────────────────── */

function onTick(state) {
  updateDisplay(state);
  updateButtonStates(state.state);

  // Announce at key intervals
  const remaining = state.remainingSeconds;
  if (remaining > 0 && remaining % 300 === 0) {
    announceToScreenReader(`${remaining / 60} minutes remaining`);
  } else if (remaining === 60) {
    announceToScreenReader('1 minute remaining');
  }
}

function onComplete() {
  playNotification();
  showCompletion();
  announceToScreenReader(`${currentMode === 'work' ? 'Work' : 'Break'} session complete!`);

  const next = nextMode();

  // Auto-advance after 2 seconds
  setTimeout(() => {
    switchMode(next);
    announceToScreenReader(`Starting ${next === 'work' ? 'work' : 'break'} session`);
  }, 2000);
}

/* ── Initialisation ─────────────────────────────────── */

function init() {
  initUI();
  initStats();

  timer = createTimer({
    durationSeconds: getDuration(),
    onTick,
    onComplete,
  });

  setMode(currentMode);
  updateDisplay(timer.getState());
  updateButtonStates(timer.getState().state);
  renderSessionDots(settings.sessionsBeforeLongBreak, 0);

  // Button listeners
  const startBtn = document.getElementById('btn-start');
  const resetBtn = document.getElementById('btn-reset');
  const skipBtn = document.getElementById('btn-skip');

  startBtn.addEventListener('click', () => {
    initAudio();
    const state = timer.getState();
    if (state.state === 'running') {
      timer.pause();
    } else {
      timer.start();
      announceToScreenReader('Timer started');
    }
  });

  resetBtn.addEventListener('click', () => {
    timer.reset();
    announceToScreenReader('Timer reset');
  });

  skipBtn.addEventListener('click', () => {
    timer.skip();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      startBtn.click();
    } else if (e.key.toLowerCase() === 'r') {
      resetBtn.click();
    } else if (e.key.toLowerCase() === 's') {
      skipBtn.click();
    }
  });

  // Settings
  initSettings((newSettings) => {
    settings = newSettings;
    completedSessions = 0;
    switchMode('work');
    renderSessionDots(settings.sessionsBeforeLongBreak, 0);
  });
}

document.addEventListener('DOMContentLoaded', init);
