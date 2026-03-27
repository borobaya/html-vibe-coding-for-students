/**
 * File: main.js
 * Description: Would You Rather entry point — event binding and initialisation
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { initGame, handleVote, nextQuestion, resetGame } from './modules/game.js';

/**
 * Binds all UI event listeners
 */
function setupEventListeners() {
  const cardA = document.getElementById('card-a');
  const cardB = document.getElementById('card-b');
  const btnNext = document.getElementById('btn-next');
  const btnReset = document.getElementById('btn-reset');
  const btnReplay = document.getElementById('btn-replay');

  // Card clicks
  cardA.addEventListener('click', () => handleVote('a'));
  cardB.addEventListener('click', () => handleVote('b'));

  // Card keyboard support
  cardA.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleVote('a');
    }
  });

  cardB.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleVote('b');
    }
  });

  // Next button
  btnNext.addEventListener('click', nextQuestion);

  // Reset button with confirmation
  btnReset.addEventListener('click', () => {
    if (confirm('Reset all votes and start over? This cannot be undone.')) {
      resetGame();
    }
  });

  // Replay button on done screen
  btnReplay.addEventListener('click', resetGame);
}

document.addEventListener('DOMContentLoaded', () => {
  initGame();
  setupEventListeners();
});
