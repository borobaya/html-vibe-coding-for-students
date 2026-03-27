/**
 * File: ui.js
 * Description: DOM updates — timer display, progress ring, modes, session dots
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const CIRCUMFERENCE = 2 * Math.PI * 126; // ~791.68

/** @type {HTMLElement} */
let timerDigits, modeLabel, progressRing, startBtn, resetBtn, skipBtn,
    sessionsLabel, sessionsDots, srAnnouncement;

/**
 * Caches DOM references
 */
export function initUI() {
  timerDigits = document.getElementById('timer-digits');
  modeLabel = document.getElementById('mode-label');
  progressRing = document.getElementById('progress-ring');
  startBtn = document.getElementById('btn-start');
  resetBtn = document.getElementById('btn-reset');
  skipBtn = document.getElementById('btn-skip');
  sessionsLabel = document.getElementById('sessions-label');
  sessionsDots = document.getElementById('sessions-dots');
  srAnnouncement = document.getElementById('sr-announcement');

  // Set initial ring
  if (progressRing) {
    progressRing.style.strokeDasharray = CIRCUMFERENCE;
    progressRing.style.strokeDashoffset = 0;
  }
}

/**
 * Formats seconds into MM:SS
 * @param {number} seconds
 * @returns {string}
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Updates the timer display and progress ring
 * @param {{ remainingSeconds: number, totalSeconds: number, progress: number, state: string }} timerState
 */
export function updateDisplay(timerState) {
  if (timerDigits) {
    timerDigits.textContent = formatTime(timerState.remainingSeconds);
  }

  if (progressRing) {
    const offset = CIRCUMFERENCE * (1 - timerState.progress);
    progressRing.style.strokeDashoffset = offset;
  }
}

/**
 * Updates button states based on timer state
 * @param {string} timerState - 'idle' | 'running' | 'paused' | 'complete'
 */
export function updateButtonStates(timerState) {
  if (startBtn) {
    if (timerState === 'running') {
      startBtn.textContent = '⏸ Pause';
      startBtn.setAttribute('aria-label', 'Pause timer');
    } else {
      startBtn.textContent = '▶ Start';
      startBtn.setAttribute('aria-label', 'Start timer');
    }
  }

  if (resetBtn) {
    resetBtn.disabled = timerState === 'idle';
  }

  if (skipBtn) {
    skipBtn.disabled = timerState === 'idle';
  }
}

/**
 * Sets the current mode label and CSS class
 * @param {'work'|'short-break'|'long-break'} mode
 */
export function setMode(mode) {
  const labels = {
    'work': 'Work',
    'short-break': 'Short Break',
    'long-break': 'Long Break',
  };

  if (modeLabel) {
    modeLabel.textContent = labels[mode] || 'Work';
  }

  // Update CSS custom property for accent colour
  const root = document.documentElement;
  root.style.setProperty('--clr-active', `var(--clr-${mode})`);
  root.style.setProperty('--clr-active-glow', `var(--clr-${mode}-glow)`);
}

/**
 * Renders session progress dots
 * @param {number} total
 * @param {number} completed
 */
export function renderSessionDots(total, completed) {
  if (!sessionsDots) return;
  sessionsDots.innerHTML = '';

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'sessions__dot';
    if (i < completed) {
      dot.classList.add('sessions__dot--complete');
    }
    dot.setAttribute('aria-hidden', 'true');
    sessionsDots.appendChild(dot);
  }

  if (sessionsLabel) {
    sessionsLabel.textContent = `Session ${completed} of ${total}`;
  }
}

/**
 * Announces a message to screen readers
 * @param {string} msg
 */
export function announceToScreenReader(msg) {
  if (srAnnouncement) {
    srAnnouncement.textContent = msg;
  }
}

/**
 * Adds the completion flash class briefly
 */
export function showCompletion() {
  const timerEl = document.querySelector('.timer');
  if (!timerEl) return;
  timerEl.classList.add('timer--complete');
  setTimeout(() => timerEl.classList.remove('timer--complete'), 1500);
}
