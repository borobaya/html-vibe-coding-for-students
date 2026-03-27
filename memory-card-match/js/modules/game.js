/**
 * File: game.js
 * Description: Game state, timer, move counter, match logic
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const state = {
  status: 'idle',
  difficulty: 'easy',
  moves: 0,
  matches: 0,
  totalPairs: 0,
  flippedCards: [],
  matchedIds: new Set(),
  timerInterval: null,
  elapsedSeconds: 0,
  locked: false,
};

export function getState() { return { ...state }; }

export function reset(difficulty) {
  clearInterval(state.timerInterval);
  state.status = 'idle';
  state.difficulty = difficulty || state.difficulty;
  state.moves = 0;
  state.matches = 0;
  state.totalPairs = 0;
  state.flippedCards = [];
  state.matchedIds = new Set();
  state.timerInterval = null;
  state.elapsedSeconds = 0;
  state.locked = false;
}

export function setTotalPairs(n) { state.totalPairs = n; }

/**
 * Starts the timer on first flip
 * @param {function} onTick
 */
export function startTimerIfNeeded(onTick) {
  if (state.timerInterval) return;
  state.status = 'playing';
  state.timerInterval = setInterval(() => {
    state.elapsedSeconds++;
    onTick(state.elapsedSeconds);
  }, 1000);
}

/**
 * Handles a card flip attempt
 * @param {number} cardId
 * @param {string} symbol
 * @returns {{ action: string, ids?: number[] }}
 */
export function flipCard(cardId, symbol) {
  if (state.locked) return { action: 'locked' };
  if (state.matchedIds.has(cardId)) return { action: 'already-matched' };
  if (state.flippedCards.some(c => c.id === cardId)) return { action: 'already-flipped' };

  state.flippedCards.push({ id: cardId, symbol });

  if (state.flippedCards.length === 2) {
    state.moves++;
    const [first, second] = state.flippedCards;

    if (first.symbol === second.symbol) {
      state.matches++;
      state.matchedIds.add(first.id);
      state.matchedIds.add(second.id);
      state.flippedCards = [];

      if (state.matches === state.totalPairs) {
        clearInterval(state.timerInterval);
        state.status = 'won';
        return { action: 'win', ids: [first.id, second.id] };
      }
      return { action: 'match', ids: [first.id, second.id] };
    }

    state.locked = true;
    return { action: 'mismatch', ids: [first.id, second.id] };
  }

  return { action: 'flip' };
}

export function unlockAfterMismatch() {
  state.flippedCards = [];
  state.locked = false;
}

/**
 * Formats seconds as MM:SS
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
