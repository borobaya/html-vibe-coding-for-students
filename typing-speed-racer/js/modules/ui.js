/**
 * File: ui.js
 * Description: All DOM manipulation – dashboard, words, car, overlays
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const dom = {};

/** Cache all DOM references */
export function init() {
  dom.timer = document.getElementById('timer');
  dom.wpm = document.getElementById('wpm');
  dom.accuracy = document.getElementById('accuracy');
  dom.wordCount = document.getElementById('word-count');
  dom.car = document.getElementById('car');
  dom.progressBar = document.getElementById('progress-bar');
  dom.wordQueue = document.getElementById('word-queue');
  dom.typingInput = document.getElementById('typing-input');
  dom.charFeedback = document.getElementById('char-feedback');
  dom.startBtn = document.getElementById('start-btn');
  dom.restartBtn = document.getElementById('restart-btn');
  dom.raceAgainBtn = document.getElementById('race-again-btn');
  dom.countdownOverlay = document.getElementById('countdown-overlay');
  dom.countdownNumber = document.getElementById('countdown-number');
  dom.resultsModal = document.getElementById('results-modal');
  dom.resultWpm = document.getElementById('result-wpm');
  dom.resultAccuracy = document.getElementById('result-accuracy');
  dom.resultWords = document.getElementById('result-words');
  dom.resultCorrect = document.getElementById('result-correct');
}

export function updateTimer(seconds) {
  dom.timer.textContent = seconds;
  if (seconds <= 10) {
    dom.timer.classList.add('dashboard__value--warning');
  } else {
    dom.timer.classList.remove('dashboard__value--warning');
  }
}

export function updateDashboard(stats) {
  dom.wpm.textContent = stats.wpm;
  dom.accuracy.textContent = `${stats.accuracy}%`;
  dom.wordCount.textContent = stats.wordsTyped;
}

/**
 * Renders the word queue display
 * @param {{ past: string[], current: string, upcoming: string[] }} slice
 */
export function renderWords(slice) {
  dom.wordQueue.innerHTML = '';

  for (const word of slice.past) {
    const span = document.createElement('span');
    span.className = 'words__word words__word--correct';
    span.textContent = word;
    dom.wordQueue.appendChild(span);
  }

  if (slice.current) {
    const span = document.createElement('span');
    span.className = 'words__word words__word--current';
    span.textContent = slice.current;
    dom.wordQueue.appendChild(span);
  }

  for (const word of slice.upcoming) {
    const span = document.createElement('span');
    span.className = 'words__word words__word--upcoming';
    span.textContent = word;
    dom.wordQueue.appendChild(span);
  }
}

/**
 * Renders character-by-character feedback
 * @param {Array<{ char: string, status: string }>} charArray
 */
export function renderCharFeedback(charArray) {
  dom.charFeedback.innerHTML = '';
  for (const { char, status } of charArray) {
    const span = document.createElement('span');
    span.className = `char--${status}`;
    span.textContent = char;
    dom.charFeedback.appendChild(span);
  }
}

export function moveCar(leftPercent) {
  dom.car.style.left = `${leftPercent}%`;
}

export function updateProgressBar(percent) {
  dom.progressBar.style.width = `${percent}%`;
  dom.progressBar.setAttribute('aria-valuenow', percent);
}

export function showCountdown(value) {
  dom.countdownOverlay.hidden = false;
  dom.countdownNumber.textContent = value;
  dom.countdownNumber.style.animation = 'none';
  // Force reflow to restart animation
  void dom.countdownNumber.offsetWidth;
  dom.countdownNumber.style.animation = 'countdown-pulse 0.8s ease-out';
}

export function hideCountdown() {
  dom.countdownOverlay.hidden = true;
}

export function showResults(stats) {
  dom.resultWpm.textContent = stats.wpm;
  dom.resultAccuracy.textContent = `${stats.accuracy}%`;
  dom.resultWords.textContent = stats.wordsTyped;
  dom.resultCorrect.textContent = stats.correctWords;
  dom.resultsModal.hidden = false;
}

export function hideResults() {
  dom.resultsModal.hidden = true;
}

export function enableInput() {
  dom.typingInput.disabled = false;
  dom.typingInput.value = '';
  dom.typingInput.focus();
}

export function disableInput() {
  dom.typingInput.disabled = true;
  dom.typingInput.blur();
}

export function clearInput() {
  dom.typingInput.value = '';
  dom.charFeedback.innerHTML = '';
}

export function resetUI() {
  dom.timer.textContent = '60';
  dom.timer.classList.remove('dashboard__value--warning');
  dom.wpm.textContent = '0';
  dom.accuracy.textContent = '100%';
  dom.wordCount.textContent = '0';
  dom.wordQueue.innerHTML = '';
  dom.charFeedback.innerHTML = '';
  dom.progressBar.style.width = '0%';
  dom.car.style.left = '2%';
  hideResults();
  hideCountdown();
  disableInput();
  dom.startBtn.disabled = false;
  dom.restartBtn.disabled = true;
}

export function setButtonState(button, enabled) {
  if (button === 'start') dom.startBtn.disabled = !enabled;
  if (button === 'restart') dom.restartBtn.disabled = !enabled;
}
