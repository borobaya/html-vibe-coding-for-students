/**
 * File: study.js
 * Description: Study session logic — card queue, shuffle, filter, results
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getCards } from './storage.js';
import { setMastered } from './cards.js';

/** @type {Array} */
let studyQueue = [];
let currentIndex = 0;
let deckId = null;
let filterUnmastered = false;
let sessionResults = { total: 0, mastered: 0, learning: 0 };

/**
 * Fisher-Yates shuffle (in-place)
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Starts a new study session
 * @param {string} id - Deck ID
 */
export function startSession(id) {
  deckId = id;
  currentIndex = 0;
  filterUnmastered = false;
  sessionResults = { total: 0, mastered: 0, learning: 0 };

  const cards = getCards(deckId);
  studyQueue = [...cards];
  sessionResults.total = studyQueue.length;
}

/**
 * Returns the current card
 * @returns {object|null}
 */
export function getCurrentCard() {
  return studyQueue[currentIndex] || null;
}

/**
 * Returns progress info
 * @returns {{ current: number, total: number, percent: number }}
 */
export function getSessionProgress() {
  const total = studyQueue.length;
  return {
    current: currentIndex + 1,
    total,
    percent: total > 0 ? Math.round(((currentIndex) / total) * 100) : 0,
  };
}

/**
 * Marks the current card as mastered and advances
 */
export function markCurrentMastered() {
  const card = getCurrentCard();
  if (!card) return;
  setMastered(deckId, card.id, true);
  sessionResults.mastered += 1;
  advanceCard();
}

/**
 * Marks the current card as still learning and advances
 */
export function markCurrentLearning() {
  const card = getCurrentCard();
  if (!card) return;
  setMastered(deckId, card.id, false);
  sessionResults.learning += 1;
  advanceCard();
}

/**
 * Advances to the next card
 */
export function advanceCard() {
  currentIndex += 1;
}

/**
 * Shuffles remaining cards (from current index onward)
 */
export function shuffleRemaining() {
  const remaining = studyQueue.slice(currentIndex);
  shuffle(remaining);
  studyQueue = [...studyQueue.slice(0, currentIndex), ...remaining];
}

/**
 * Toggles the unmastered-only filter and rebuilds the queue
 * @returns {boolean} New filter state
 */
export function toggleFilterUnmastered() {
  filterUnmastered = !filterUnmastered;

  const cards = getCards(deckId);
  if (filterUnmastered) {
    studyQueue = cards.filter((c) => !c.mastered);
  } else {
    studyQueue = [...cards];
  }
  currentIndex = 0;
  sessionResults = { total: studyQueue.length, mastered: 0, learning: 0 };
  return filterUnmastered;
}

/**
 * Checks if the session is complete
 * @returns {boolean}
 */
export function isSessionComplete() {
  return currentIndex >= studyQueue.length;
}

/**
 * Returns session results for the completion screen
 * @returns {{ total: number, mastered: number, learning: number, percent: number }}
 */
export function getSessionResults() {
  const answered = sessionResults.mastered + sessionResults.learning;
  return {
    ...sessionResults,
    percent: answered > 0 ? Math.round((sessionResults.mastered / answered) * 100) : 0,
  };
}
