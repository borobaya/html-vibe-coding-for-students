/**
 * File: main.js
 * Description: Memory Card Match entry point – DOM wiring
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { generateDeck } from './modules/cards.js';
import * as game from './modules/game.js';

const MISMATCH_DELAY = 1000;

const dom = {};

document.addEventListener('DOMContentLoaded', () => {
  dom.grid = document.getElementById('card-grid');
  dom.timer = document.getElementById('timer-display');
  dom.moves = document.getElementById('moves-display');
  dom.matches = document.getElementById('matches-display');
  dom.startBtn = document.getElementById('start-btn');
  dom.helpBtn = document.getElementById('help-btn');
  dom.helpPanel = document.getElementById('help-panel');
  dom.winOverlay = document.getElementById('win-overlay');
  dom.winTime = document.getElementById('win-time');
  dom.winMoves = document.getElementById('win-moves');
  dom.playAgainBtn = document.getElementById('play-again-btn');

  dom.startBtn.addEventListener('click', startGame);
  dom.playAgainBtn.addEventListener('click', startGame);
  dom.helpBtn.addEventListener('click', toggleHelp);
});

function getSelectedDifficulty() {
  const radio = document.querySelector('input[name="difficulty"]:checked');
  return radio ? radio.value : 'easy';
}

function toggleHelp() {
  const expanded = dom.helpBtn.getAttribute('aria-expanded') === 'true';
  dom.helpBtn.setAttribute('aria-expanded', String(!expanded));
  dom.helpPanel.hidden = expanded;
}

function startGame() {
  const difficulty = getSelectedDifficulty();
  game.reset(difficulty);
  dom.winOverlay.hidden = true;

  const { cards, cols, pairs } = generateDeck(difficulty);
  game.setTotalPairs(pairs);

  // Set grid class
  dom.grid.className = `board__grid board__grid--${difficulty}`;

  // Build card DOM
  dom.grid.innerHTML = '';
  for (const card of cards) {
    const el = document.createElement('div');
    el.className = 'card';
    el.setAttribute('role', 'listitem');
    el.setAttribute('tabindex', '0');
    el.dataset.id = card.id;
    el.dataset.symbol = card.symbol;
    el.setAttribute('aria-label', `Card – face down`);

    el.innerHTML = `
      <div class="card__inner">
        <div class="card__front" aria-hidden="true">
          <span class="card__symbol">${card.symbol}</span>
        </div>
        <div class="card__back" aria-hidden="false">
          <span class="card__back-icon">?</span>
        </div>
      </div>
    `;

    el.addEventListener('click', () => handleCardClick(el, card));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick(el, card);
      }
    });

    dom.grid.appendChild(el);
  }

  updateStats();
}

function handleCardClick(el, card) {
  game.startTimerIfNeeded((seconds) => {
    dom.timer.textContent = game.formatTime(seconds);
  });

  el.classList.add('card--flipped');
  el.setAttribute('aria-label', `Card – ${card.symbol}`);

  const result = game.flipCard(card.id, card.symbol);

  switch (result.action) {
    case 'already-matched':
    case 'already-flipped':
    case 'locked':
      if (result.action !== 'already-matched') {
        el.classList.remove('card--flipped');
      }
      return;

    case 'flip':
      break;

    case 'match':
      for (const id of result.ids) {
        const matchEl = dom.grid.querySelector(`[data-id="${id}"]`);
        if (matchEl) matchEl.classList.add('card--matched');
      }
      updateStats();
      break;

    case 'mismatch':
      for (const id of result.ids) {
        const shakeEl = dom.grid.querySelector(`[data-id="${id}"]`);
        if (shakeEl) shakeEl.classList.add('card--shake');
      }
      setTimeout(() => {
        for (const id of result.ids) {
          const flipEl = dom.grid.querySelector(`[data-id="${id}"]`);
          if (flipEl) {
            flipEl.classList.remove('card--flipped', 'card--shake');
            flipEl.setAttribute('aria-label', 'Card – face down');
          }
        }
        game.unlockAfterMismatch();
      }, MISMATCH_DELAY);
      updateStats();
      break;

    case 'win':
      for (const id of result.ids) {
        const matchEl = dom.grid.querySelector(`[data-id="${id}"]`);
        if (matchEl) matchEl.classList.add('card--matched');
      }
      updateStats();
      showWin();
      break;
  }
}

function updateStats() {
  const s = game.getState();
  dom.moves.textContent = s.moves;
  dom.matches.textContent = `${s.matches} / ${s.totalPairs}`;
}

function showWin() {
  const s = game.getState();
  dom.winTime.textContent = game.formatTime(s.elapsedSeconds);
  dom.winMoves.textContent = s.moves;
  dom.winOverlay.hidden = false;
}
