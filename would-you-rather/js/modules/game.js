/**
 * File: game.js
 * Description: Game flow — shuffle, navigate, vote, complete
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { questions } from './questions.js';
import {
  getVotes, recordVote, hasVoted, getUserChoice,
  calculatePercentages, resetAllVotes, getAnsweredCount, getAnsweredIds
} from './voting.js';
import {
  cacheElements, renderQuestion, showResults, updateCounter,
  renderDots, showDoneScreen, hideDoneScreen, updateFooter,
  animateCardTransition, setNextButtonState
} from './ui.js';

/** @type {Array} Shuffled question order for this session */
let orderedQuestions = [];

/** @type {number} Current index in orderedQuestions */
let currentIndex = 0;

/**
 * Fisher-Yates shuffle — returns a new shuffled copy
 * @param {Array} arr
 * @returns {Array}
 */
function shuffleQuestions(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Loads a question by index */
function loadQuestion(index) {
  const question = orderedQuestions[index];
  const voted = hasVoted(question.id);
  const votes = voted ? getVotes(question.id) : null;

  renderQuestion(question, voted, votes);
  updateCounter(index + 1, orderedQuestions.length);

  const answeredIds = getAnsweredIds();
  renderDots(orderedQuestions.length, index, answeredIds, orderedQuestions);
  updateFooter(getAnsweredCount());

  if (voted) {
    // Show existing results
    const existingVotes = getVotes(question.id);
    const percentages = calculatePercentages(existingVotes);
    const choice = getUserChoice(question.id);
    showResults(existingVotes, percentages, choice);
    setNextButtonState(true);
  } else {
    setNextButtonState(false);
  }
}

/**
 * Handles a user vote
 * @param {'a'|'b'} choice
 */
export function handleVote(choice) {
  const question = orderedQuestions[currentIndex];
  if (hasVoted(question.id)) return;

  const votes = recordVote(question.id, choice);
  const percentages = calculatePercentages(votes);
  showResults(votes, percentages, choice);

  const answeredIds = getAnsweredIds();
  renderDots(orderedQuestions.length, currentIndex, answeredIds, orderedQuestions);
  updateFooter(getAnsweredCount());

  setNextButtonState(true);
}

/** Advances to the next question or shows done screen */
export async function nextQuestion() {
  if (currentIndex >= orderedQuestions.length - 1) {
    showDoneScreen();
    return;
  }

  await animateCardTransition('out');
  currentIndex += 1;
  loadQuestion(currentIndex);
  await animateCardTransition('in');
}

/** Resets all votes and restarts the game */
export function resetGame() {
  resetAllVotes();
  hideDoneScreen();
  initGame();
}

/** Returns the current question */
export function getCurrentQuestion() {
  return orderedQuestions[currentIndex];
}

/** Initialises or restarts the game */
export function initGame() {
  cacheElements();
  orderedQuestions = shuffleQuestions(questions);
  currentIndex = 0;
  hideDoneScreen();
  loadQuestion(currentIndex);
}
