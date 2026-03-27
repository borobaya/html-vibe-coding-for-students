/**
 * File: main.js
 * Description: Entry point – bootstraps game, wires events
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import * as game from './modules/game.js';
import * as ui from './modules/ui.js';
import { getWordSlice } from './modules/words.js';

const CAR_START = 2;
const CAR_END = 92;

document.addEventListener('DOMContentLoaded', init);

function init() {
  ui.init();

  document.getElementById('start-btn').addEventListener('click', onStartClick);
  document.getElementById('restart-btn').addEventListener('click', onRestartClick);
  document.getElementById('race-again-btn').addEventListener('click', onRestartClick);

  const input = document.getElementById('typing-input');
  input.addEventListener('keydown', onInputKeydown);
  input.addEventListener('input', onInputChange);
}

function onStartClick() {
  ui.setButtonState('start', false);
  ui.setButtonState('restart', true);

  game.startCountdown({
    onTick(n) { ui.showCountdown(n); },
    onGo() {
      ui.showCountdown('GO!');
      setTimeout(() => {
        ui.hideCountdown();
        ui.enableInput();
        refreshWordDisplay();
      }, 600);
    },
    onTimerTick(seconds) {
      ui.updateTimer(seconds);
    },
    onRaceEnd(stats) {
      ui.disableInput();
      ui.showResults(stats);
    },
  });
}

function onRestartClick() {
  game.reset();
  ui.resetUI();
}

function onInputKeydown(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    const state = game.getState();
    if (state.status !== 'running') return;

    const typed = e.target.value;
    const result = game.submitWord(typed);

    const wpm = game.calculateWPM();
    const accuracy = game.calculateAccuracy();
    const progress = game.calculateProgress();
    const s = game.getState();

    ui.updateDashboard({ wpm, accuracy, wordsTyped: s.wordsTyped });
    ui.updateProgressBar(progress);

    const carPos = CAR_START + (progress / 100) * (CAR_END - CAR_START);
    ui.moveCar(carPos);

    ui.clearInput();
    refreshWordDisplay();
  }
}

function onInputChange(e) {
  const state = game.getState();
  if (state.status !== 'running') return;

  const typed = e.target.value;
  const target = state.wordList[state.currentWordIndex] || '';
  const feedback = compareChars(typed, target);
  ui.renderCharFeedback(feedback);
}

/**
 * Compares typed characters against target word
 * @param {string} typed
 * @param {string} target
 * @returns {Array<{ char: string, status: string }>}
 */
function compareChars(typed, target) {
  const result = [];
  for (let i = 0; i < target.length; i++) {
    if (i < typed.length) {
      result.push({
        char: target[i],
        status: typed[i] === target[i] ? 'correct' : 'wrong',
      });
    } else {
      result.push({ char: target[i], status: 'pending' });
    }
  }
  return result;
}

function refreshWordDisplay() {
  const state = game.getState();
  const slice = getWordSlice(state.wordList, state.currentWordIndex);
  ui.renderWords(slice);
}
