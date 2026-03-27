/**
 * File: ui.js
 * Description: DOM rendering — zodiac cards, results, meter animation, reset
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/** Cached DOM references */
let els = {};

/**
 * Caches all DOM elements
 */
export function cacheElements() {
  els = {
    inputSection: document.getElementById('input-section'),
    resultsSection: document.getElementById('results-section'),
    signCard1: document.getElementById('sign-card-1'),
    signCard2: document.getElementById('sign-card-2'),
    checkBtn: document.getElementById('check-btn'),
    resetBtn: document.getElementById('reset-btn'),
    birthday1: document.getElementById('birthday-1'),
    birthday2: document.getElementById('birthday-2'),
    pairingSymbol1: document.getElementById('pairing-symbol-1'),
    pairingName1: document.getElementById('pairing-name-1'),
    pairingSymbol2: document.getElementById('pairing-symbol-2'),
    pairingName2: document.getElementById('pairing-name-2'),
    percentageNumber: document.getElementById('percentage-number'),
    meterFill: document.querySelector('.compat-meter__fill'),
    meterBar: document.querySelector('.compat-meter'),
    ratingLabel: document.getElementById('rating-label'),
    readingText: document.getElementById('reading-text')
  };
}

/**
 * Populates a zodiac card with sign data
 * @param {HTMLElement} cardElement
 * @param {object} signData
 */
export function updateZodiacCard(cardElement, signData) {
  const symbol = cardElement.querySelector('.zodiac-card__symbol');
  const name = cardElement.querySelector('.zodiac-card__name');
  const element = cardElement.querySelector('.zodiac-card__element');
  const dates = cardElement.querySelector('.zodiac-card__dates');
  const traits = cardElement.querySelector('.zodiac-card__traits');

  symbol.textContent = signData.symbol;
  name.textContent = signData.name;
  element.textContent = signData.element;
  dates.textContent = signData.dateRange;
  traits.textContent = signData.traits;

  setElementColor(element, signData.element);

  cardElement.classList.remove('hidden');
  cardElement.classList.add('fade-in');
}

/**
 * Hides a zodiac card
 * @param {HTMLElement} cardElement
 */
export function hideZodiacCard(cardElement) {
  cardElement.classList.add('hidden');
  cardElement.classList.remove('fade-in');
}

/**
 * Applies element-specific colour class
 * @param {HTMLElement} element - The DOM element
 * @param {string} elementName - Fire/Earth/Air/Water
 */
function setElementColor(element, elementName) {
  element.classList.remove(
    'zodiac-card__element--fire',
    'zodiac-card__element--earth',
    'zodiac-card__element--air',
    'zodiac-card__element--water'
  );
  element.classList.add(`zodiac-card__element--${elementName.toLowerCase()}`);
}

/**
 * Shows the full results section with animation
 * @param {object} sign1
 * @param {object} sign2
 * @param {{ score: number, ratingLabel: string, reading: string }} result
 */
export function showResults(sign1, sign2, result) {
  // Hide input section
  els.inputSection.classList.add('fade-out');

  // Populate pairing
  els.pairingSymbol1.textContent = sign1.symbol;
  els.pairingName1.textContent = sign1.name;
  els.pairingSymbol2.textContent = sign2.symbol;
  els.pairingName2.textContent = sign2.name;

  // Set reading and rating
  els.ratingLabel.textContent = result.ratingLabel;
  els.readingText.textContent = result.reading;

  // Show results
  els.resultsSection.classList.remove('hidden');
  els.resultsSection.classList.add('fade-in');

  // Animate percentage counter and meter
  animatePercentage(result.score, 2000);
  setTimeout(() => fillCompatMeter(result.score), 50);
}

/**
 * Animates percentage from 0 to target
 * @param {number} targetValue
 * @param {number} duration - ms
 */
function animatePercentage(targetValue, duration) {
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const progress = 1 - Math.pow(1 - t, 3); // ease-out cubic
    const current = Math.round(targetValue * progress);
    els.percentageNumber.textContent = current;

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      els.percentageNumber.textContent = targetValue;
    }
  }

  requestAnimationFrame(tick);
}

/**
 * Fills the compatibility meter bar
 * @param {number} percentage
 */
function fillCompatMeter(percentage) {
  els.meterFill.classList.remove('compat-meter__fill--high', 'compat-meter__fill--mid', 'compat-meter__fill--low');

  if (percentage >= 80) {
    els.meterFill.classList.add('compat-meter__fill--high');
  } else if (percentage >= 50) {
    els.meterFill.classList.add('compat-meter__fill--mid');
  } else {
    els.meterFill.classList.add('compat-meter__fill--low');
  }

  els.meterFill.style.width = `${percentage}%`;
  els.meterBar.setAttribute('aria-valuenow', percentage);
}

/** Resets the UI to initial state */
export function resetUI() {
  els.resultsSection.classList.add('hidden');
  els.resultsSection.classList.remove('fade-in');
  els.inputSection.classList.remove('fade-out');

  els.birthday1.value = '';
  els.birthday2.value = '';

  hideZodiacCard(els.signCard1);
  hideZodiacCard(els.signCard2);

  els.meterFill.style.width = '0%';
  els.meterBar.setAttribute('aria-valuenow', '0');
  els.percentageNumber.textContent = '0';
  els.checkBtn.disabled = true;
}
