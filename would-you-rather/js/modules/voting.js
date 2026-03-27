/**
 * File: voting.js
 * Description: Vote recording, tallying, and percentage calculation with localStorage
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const VOTES_PREFIX = 'wyr_votes_';
const USER_VOTES_KEY = 'wyr_user_votes';

/**
 * Safely reads JSON from localStorage
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safely writes JSON to localStorage
 * @param {string} key
 * @param {*} value
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing or quota exceeded — silently ignore
  }
}

/**
 * Gets current vote tallies for a question
 * @param {string} questionId
 * @returns {{ a: number, b: number }}
 */
export function getVotes(questionId) {
  return safeGet(`${VOTES_PREFIX}${questionId}`, { a: 0, b: 0 });
}

/**
 * Records a vote and returns updated tallies
 * @param {string} questionId
 * @param {'a'|'b'} choice
 * @returns {{ a: number, b: number }}
 */
export function recordVote(questionId, choice) {
  const votes = getVotes(questionId);
  votes[choice] += 1;
  safeSet(`${VOTES_PREFIX}${questionId}`, votes);

  // Track user's personal choice
  const userVotes = safeGet(USER_VOTES_KEY, {});
  userVotes[questionId] = choice;
  safeSet(USER_VOTES_KEY, userVotes);

  return votes;
}

/**
 * Checks if the current user has voted on a question
 * @param {string} questionId
 * @returns {boolean}
 */
export function hasVoted(questionId) {
  const userVotes = safeGet(USER_VOTES_KEY, {});
  return questionId in userVotes;
}

/**
 * Gets the user's choice for a question
 * @param {string} questionId
 * @returns {'a'|'b'|null}
 */
export function getUserChoice(questionId) {
  const userVotes = safeGet(USER_VOTES_KEY, {});
  return userVotes[questionId] || null;
}

/**
 * Calculates display percentages that always sum to 100
 * @param {{ a: number, b: number }} votes
 * @returns {{ a: number, b: number }}
 */
export function calculatePercentages(votes) {
  const total = votes.a + votes.b;
  if (total === 0) return { a: 50, b: 50 };

  const rawA = Math.round((votes.a / total) * 100);
  const rawB = 100 - rawA;

  return { a: rawA, b: rawB };
}

/**
 * Clears all WYR data from localStorage
 */
export function resetAllVotes() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wyr_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {
    // Ignore errors
  }
}

/**
 * Returns how many questions the user has answered
 * @returns {number}
 */
export function getAnsweredCount() {
  const userVotes = safeGet(USER_VOTES_KEY, {});
  return Object.keys(userVotes).length;
}

/**
 * Returns a Set of answered question IDs
 * @returns {Set<string>}
 */
export function getAnsweredIds() {
  const userVotes = safeGet(USER_VOTES_KEY, {});
  return new Set(Object.keys(userVotes));
}
