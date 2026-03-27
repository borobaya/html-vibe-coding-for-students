/**
 * File: settings.js
 * Description: Settings panel management — open/close, load/save, validation
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { loadData, saveData } from './storage.js';

const SETTINGS_KEY = 'pomodoro-settings';

const DEFAULTS = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
};

/**
 * Loads settings from localStorage, merging with defaults
 * @returns {{ workMinutes: number, shortBreakMinutes: number, longBreakMinutes: number, sessionsBeforeLongBreak: number }}
 */
export function getSettings() {
  return { ...DEFAULTS, ...loadData(SETTINGS_KEY, {}) };
}

/**
 * Initialises the settings panel — open/close + form handling
 * @param {function} onSave - Called with the new settings object after save
 */
export function initSettings(onSave) {
  const toggle = document.getElementById('settings-toggle');
  const panel = document.getElementById('settings-panel');
  const overlay = document.getElementById('settings-overlay');
  const form = document.getElementById('settings-form');
  const saveBtn = document.getElementById('settings-save');

  const inputs = {
    work: document.getElementById('setting-work'),
    shortBreak: document.getElementById('setting-short-break'),
    longBreak: document.getElementById('setting-long-break'),
    sessions: document.getElementById('setting-sessions'),
  };

  function populateForm() {
    const s = getSettings();
    inputs.work.value = s.workMinutes;
    inputs.shortBreak.value = s.shortBreakMinutes;
    inputs.longBreak.value = s.longBreakMinutes;
    inputs.sessions.value = s.sessionsBeforeLongBreak;
  }

  function openPanel() {
    panel.classList.add('settings--open');
    overlay.classList.add('settings-overlay--visible');
    populateForm();
    inputs.work.focus();
  }

  function closePanel() {
    panel.classList.remove('settings--open');
    overlay.classList.remove('settings-overlay--visible');
    toggle.focus();
  }

  function handleSave(e) {
    e.preventDefault();

    const clampInt = (val, min, max) => {
      const n = parseInt(val, 10);
      if (isNaN(n)) return min;
      return Math.max(min, Math.min(max, n));
    };

    const newSettings = {
      workMinutes: clampInt(inputs.work.value, 1, 120),
      shortBreakMinutes: clampInt(inputs.shortBreak.value, 1, 60),
      longBreakMinutes: clampInt(inputs.longBreak.value, 1, 60),
      sessionsBeforeLongBreak: clampInt(inputs.sessions.value, 1, 10),
    };

    saveData(SETTINGS_KEY, newSettings);
    closePanel();
    onSave(newSettings);
  }

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.contains('settings--open');
    if (isOpen) closePanel();
    else openPanel();
  });

  overlay.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('settings--open')) {
      closePanel();
    }
  });

  saveBtn.addEventListener('click', handleSave);
  form.addEventListener('submit', handleSave);
}
