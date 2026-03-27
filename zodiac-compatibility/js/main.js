/**
 * File: main.js
 * Description: Zodiac Compatibility entry point — event binding and orchestration
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { detectZodiacSign } from './modules/zodiacDetector.js';
import { calculateCompatibility } from './modules/compatibility.js';
import { cacheElements, updateZodiacCard, hideZodiacCard, showResults, resetUI } from './modules/ui.js';
import { initStarfield } from './modules/starfield.js';

/** Detected sign objects for each person */
let sign1 = null;
let sign2 = null;

/** DOM references for date inputs and cards */
let birthday1, birthday2, signCard1, signCard2, checkBtn;

/**
 * Handles date input changes — detects sign and updates card
 * @param {Event} event
 */
function handleDateChange(event) {
  const input = event.target;
  const dateValue = input.value;
  if (!dateValue) return;

  const date = new Date(dateValue);
  const month = date.getMonth() + 1; // 1-based
  const day = date.getDate();

  const isPerson1 = input.id === 'birthday-1';
  const card = isPerson1 ? signCard1 : signCard2;
  const detected = detectZodiacSign(month, day);

  if (detected) {
    if (isPerson1) { sign1 = detected; } else { sign2 = detected; }
    updateZodiacCard(card, detected);
  } else {
    if (isPerson1) { sign1 = null; } else { sign2 = null; }
    hideZodiacCard(card);
  }

  updateCheckButton();
}

/** Enables the Check button only when both signs are detected */
function updateCheckButton() {
  checkBtn.disabled = !(sign1 && sign2);
}

/** Calculates and displays compatibility results */
function handleCheckCompatibility() {
  if (!sign1 || !sign2) return;

  const result = calculateCompatibility(sign1, sign2);
  showResults(sign1, sign2, result);
}

/** Resets everything back to initial state */
function handleReset() {
  sign1 = null;
  sign2 = null;
  resetUI();
}

/** Initialises the app */
function init() {
  cacheElements();
  initStarfield('starfield');

  birthday1 = document.getElementById('birthday-1');
  birthday2 = document.getElementById('birthday-2');
  signCard1 = document.getElementById('sign-card-1');
  signCard2 = document.getElementById('sign-card-2');
  checkBtn = document.getElementById('check-btn');
  const resetBtn = document.getElementById('reset-btn');

  birthday1.addEventListener('input', handleDateChange);
  birthday2.addEventListener('input', handleDateChange);
  checkBtn.addEventListener('click', handleCheckCompatibility);
  resetBtn.addEventListener('click', handleReset);
}

document.addEventListener('DOMContentLoaded', init);
