/**
 * File: game.js
 * Description: Game state, timer, WPM & accuracy calculations
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { generateWordList } from './words.js';

const DIFFICULTY_CONFIG = {
  easy:   { time: 90, wordDifficulty: 'easy' },
  medium: { time: 60, wordDifficulty: 'medium' },
  hard:   { time: 45, wordDifficulty: 'hard' },
};

const state = {
  status: 'idle',
  timeRemaining: 60,
  totalTime: 60,
  timerInterval: null,
  wordsTyped: 0,
  correctWords: 0,
  incorrectWords: 0,
  totalCharsTyped: 0,
  correctChars: 0,
  startTimestamp: null,
  currentWordIndex: 0,
  wordList: [],
  difficulty: 'medium',
};

/** @returns {Object} shallow copy of state */
export function getState() { return { ...state }; }

/**
 * Starts the 3-2-1 countdown
 * @param {Object} callbacks - { onTick, onGo }
 */
export function startCountdown(callbacks) {
  state.status = 'countdown';
  let count = 3;
  callbacks.onTick(count);

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      callbacks.onTick(count);
    } else {
      clearInterval(interval);
      callbacks.onGo();
      startRace(callbacks.onTimerTick, callbacks.onRaceEnd);
    }
  }, 1000);
}

/**
 * Begins the race
 * @param {function} onTimerTick
 * @param {function} onRaceEnd
 */
function startRace(onTimerTick, onRaceEnd) {
  const config = DIFFICULTY_CONFIG[state.difficulty];
  state.status = 'running';
  state.timeRemaining = config.time;
  state.totalTime = config.time;
  state.wordList = generateWordList(config.wordDifficulty, 80);
  state.startTimestamp = Date.now();
  state.currentWordIndex = 0;
  state.wordsTyped = 0;
  state.correctWords = 0;
  state.incorrectWords = 0;
  state.totalCharsTyped = 0;
  state.correctChars = 0;

  state.timerInterval = setInterval(() => {
    state.timeRemaining--;
    onTimerTick(state.timeRemaining);
    if (state.timeRemaining <= 0) {
      endRace(onRaceEnd);
    }
  }, 1000);
}

/**
 * Submits the typed word and checks correctness
 * @param {string} typed
 * @returns {{ correct: boolean, target: string }}
 */
export function submitWord(typed) {
  const target = state.wordList[state.currentWordIndex];
  const trimmed = typed.trim();
  const correct = trimmed === target;

  state.wordsTyped++;
  state.totalCharsTyped += trimmed.length;

  if (correct) {
    state.correctWords++;
    state.correctChars += target.length;
  } else {
    state.incorrectWords++;
  }

  state.currentWordIndex++;
  return { correct, target };
}

/** @returns {number} net WPM */
export function calculateWPM() {
  if (!state.startTimestamp) return 0;
  const elapsed = (Date.now() - state.startTimestamp) / 60000;
  if (elapsed <= 0) return 0;
  return Math.round((state.correctChars / 5) / elapsed);
}

/** @returns {number} accuracy 0-100 */
export function calculateAccuracy() {
  if (state.wordsTyped === 0) return 100;
  return Math.round((state.correctWords / state.wordsTyped) * 100);
}

/** @returns {number} progress 0-100 */
export function calculateProgress() {
  if (state.wordList.length === 0) return 0;
  return Math.round((state.currentWordIndex / state.wordList.length) * 100);
}

function endRace(callback) {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  state.status = 'finished';
  if (callback) {
    callback({
      wpm: calculateWPM(),
      accuracy: calculateAccuracy(),
      wordsTyped: state.wordsTyped,
      correctWords: state.correctWords,
    });
  }
}

export function reset() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  state.status = 'idle';
  state.timeRemaining = DIFFICULTY_CONFIG[state.difficulty].time;
  state.totalTime = state.timeRemaining;
  state.wordsTyped = 0;
  state.correctWords = 0;
  state.incorrectWords = 0;
  state.totalCharsTyped = 0;
  state.correctChars = 0;
  state.startTimestamp = null;
  state.currentWordIndex = 0;
  state.wordList = [];
}

export function setDifficulty(level) {
  if (DIFFICULTY_CONFIG[level]) {
    state.difficulty = level;
  }
}
