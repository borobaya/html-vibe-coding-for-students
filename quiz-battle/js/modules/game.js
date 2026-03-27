/**
 * File: game.js
 * Description: Quiz Battle game state, scoring, turn management
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const TIMER_SECONDS = 15;
const BASE_POINTS = 10;
const STREAK_BONUS = 2;
const SPEED_BONUS_MAX = 5;

/**
 * Creates initial game state
 * @param {Object} config
 * @returns {Object}
 */
export function createGameState(config) {
  return {
    players: [
      { name: config.p1Name, score: 0, correct: 0, streak: 0, bestStreak: 0, totalTime: 0, answers: 0 },
      { name: config.p2Name, score: 0, correct: 0, streak: 0, bestStreak: 0, totalTime: 0, answers: 0 },
    ],
    category: config.category,
    totalRounds: config.rounds,
    currentRound: 0,
    currentPlayer: 0,
    questions: config.questions,
    timerSeconds: TIMER_SECONDS,
    timerInterval: null,
    timeLeft: TIMER_SECONDS,
    status: 'playing',
  };
}

/**
 * Gets the current question
 * @param {Object} state
 * @returns {Object|null}
 */
export function getCurrentQuestion(state) {
  return state.questions[state.currentRound] || null;
}

/**
 * Process an answer
 * @param {Object} state
 * @param {number} answerIndex
 * @returns {{ correct: boolean, points: number, correctIndex: number }}
 */
export function submitAnswer(state, answerIndex) {
  const question = getCurrentQuestion(state);
  const player = state.players[state.currentPlayer];
  const timeTaken = TIMER_SECONDS - state.timeLeft;

  player.answers++;
  player.totalTime += timeTaken;

  const correct = answerIndex === question.correct;

  let points = 0;
  if (correct) {
    player.correct++;
    player.streak++;
    if (player.streak > player.bestStreak) player.bestStreak = player.streak;

    // Speed bonus: more points for faster answers
    const speedBonus = Math.max(0, Math.round((state.timeLeft / TIMER_SECONDS) * SPEED_BONUS_MAX));
    const streakBonus = Math.min(player.streak - 1, 3) * STREAK_BONUS;
    points = BASE_POINTS + speedBonus + streakBonus;
    player.score += points;
  } else {
    player.streak = 0;
  }

  return { correct, points, correctIndex: question.correct };
}

/**
 * Handle timeout (no answer given)
 * @param {Object} state
 */
export function handleTimeout(state) {
  const player = state.players[state.currentPlayer];
  player.answers++;
  player.totalTime += TIMER_SECONDS;
  player.streak = 0;
}

/**
 * Advance to next turn
 * @param {Object} state
 * @returns {string} 'continue' | 'next-round' | 'game-over'
 */
export function nextTurn(state) {
  if (state.currentPlayer === 0) {
    state.currentPlayer = 1;
    return 'continue';
  }

  state.currentPlayer = 0;
  state.currentRound++;

  if (state.currentRound >= state.totalRounds) {
    state.status = 'finished';
    return 'game-over';
  }

  return 'next-round';
}

/**
 * Get results summary
 * @param {Object} state
 * @returns {Object}
 */
export function getResults(state) {
  const [p1, p2] = state.players;
  let winner;
  if (p1.score > p2.score) winner = p1.name;
  else if (p2.score > p1.score) winner = p2.name;
  else winner = null; // tie

  return {
    winner,
    players: state.players.map(p => ({
      name: p.name,
      score: p.score,
      correct: p.correct,
      total: p.answers,
      bestStreak: p.bestStreak,
      avgTime: p.answers > 0 ? (p.totalTime / p.answers).toFixed(1) : '0',
    })),
  };
}

export { TIMER_SECONDS };
