/**
 * File: main.js
 * Description: Quiz Battle entry point – screen management, event wiring
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { getQuestions } from './modules/questions.js';
import { createGameState, getCurrentQuestion, submitAnswer, handleTimeout, nextTurn, getResults, TIMER_SECONDS } from './modules/game.js';

let state = null;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('setup-form').addEventListener('submit', onStartBattle);
  document.getElementById('play-again-btn').addEventListener('click', () => showScreen('start-screen'));
  document.getElementById('change-category-btn').addEventListener('click', () => showScreen('start-screen'));

  const answerBtns = document.querySelectorAll('.answer-btn');
  answerBtns.forEach(btn => {
    btn.addEventListener('click', () => onAnswer(Number(btn.dataset.index)));
  });
});

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.hidden = s.id !== id;
    s.classList.toggle('screen--active', s.id === id);
  });
}

function onStartBattle(e) {
  e.preventDefault();

  const p1Name = document.getElementById('player1-name').value.trim() || 'Player 1';
  const p2Name = document.getElementById('player2-name').value.trim() || 'Player 2';
  const category = document.querySelector('input[name="category"]:checked')?.value || 'random';
  const rounds = Number(document.querySelector('input[name="rounds"]:checked')?.value || 5);

  const questions = getQuestions(category, rounds);

  state = createGameState({ p1Name, p2Name, category, rounds, questions });

  document.getElementById('game-p1-name').textContent = p1Name;
  document.getElementById('game-p2-name').textContent = p2Name;

  showScreen('game-screen');
  startTurn();
}

function startTurn() {
  clearInterval(state.timerInterval);
  state.timeLeft = TIMER_SECONDS;

  const question = getCurrentQuestion(state);
  if (!question) return endGame();

  const player = state.players[state.currentPlayer];

  // Update UI
  document.getElementById('round-display').textContent = `Round ${state.currentRound + 1} / ${state.totalRounds}`;
  document.getElementById('turn-text').textContent = `${player.name}, it's your turn!`;
  document.getElementById('question-text').textContent = question.q;
  document.getElementById('question-category').textContent = state.category;

  // Highlight active player
  document.querySelector('.game-header__player--p1').classList.toggle('game-header__player--active', state.currentPlayer === 0);
  document.querySelector('.game-header__player--p2').classList.toggle('game-header__player--active', state.currentPlayer === 1);

  // Set answer buttons
  const labels = ['A', 'B', 'C', 'D'];
  question.answers.forEach((ans, i) => {
    const btn = document.getElementById(`answer-${i}`);
    btn.textContent = `${labels[i]}) ${ans}`;
    btn.className = 'answer-btn';
    btn.disabled = false;
  });

  // Hide feedback
  document.getElementById('feedback-overlay').hidden = true;

  // Update scores
  updateScoreboard();

  // Start timer
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      handleTimeout(state);
      showFeedback(false, 0, getCurrentQuestion(state).correct);
    }
  }, 1000);
}

function onAnswer(index) {
  clearInterval(state.timerInterval);

  // Disable all buttons
  document.querySelectorAll('.answer-btn').forEach(b => { b.disabled = true; });

  const result = submitAnswer(state, index);

  // Highlight correct/wrong
  document.getElementById(`answer-${result.correctIndex}`).classList.add('answer-btn--correct');
  if (!result.correct) {
    document.getElementById(`answer-${index}`).classList.add('answer-btn--wrong');
  }

  showFeedback(result.correct, result.points, result.correctIndex);
}

function showFeedback(correct, points, correctIndex) {
  const overlay = document.getElementById('feedback-overlay');
  const text = document.getElementById('feedback-text');
  const pts = document.getElementById('feedback-points');

  text.textContent = correct ? '✅ Correct!' : '❌ Wrong!';
  pts.textContent = correct ? `+${points} pts` : `Answer: ${getCurrentQuestion(state).answers[correctIndex]}`;
  overlay.hidden = false;

  updateScoreboard();

  setTimeout(() => {
    overlay.hidden = true;
    const turnResult = nextTurn(state);
    if (turnResult === 'game-over') {
      endGame();
    } else {
      startTurn();
    }
  }, 2000);
}

function updateScoreboard() {
  const [p1, p2] = state.players;
  document.getElementById('game-p1-score').textContent = p1.score;
  document.getElementById('game-p2-score').textContent = p2.score;
  document.getElementById('game-p1-streak').textContent = p1.streak > 1 ? `🔥${p1.streak}` : '';
  document.getElementById('game-p2-streak').textContent = p2.streak > 1 ? `🔥${p2.streak}` : '';
}

function updateTimerDisplay() {
  document.getElementById('timer-text').textContent = state.timeLeft;
  const pct = (state.timeLeft / TIMER_SECONDS) * 100;
  document.getElementById('timer-bar-fill').style.width = `${pct}%`;

  const bar = document.getElementById('timer-bar-fill');
  bar.classList.toggle('timer-bar__fill--warning', state.timeLeft <= 5);
}

function endGame() {
  clearInterval(state.timerInterval);
  const results = getResults(state);

  document.getElementById('winner-text').textContent = results.winner
    ? `${results.winner} wins!`
    : "It's a tie!";

  results.players.forEach((p, i) => {
    const n = i + 1;
    document.getElementById(`results-p${n}-name`).textContent = p.name;
    document.getElementById(`results-p${n}-score`).textContent = p.score;
    document.getElementById(`results-p${n}-correct`).textContent = `${p.correct} / ${p.total}`;
    document.getElementById(`results-p${n}-streak`).textContent = p.bestStreak;
    document.getElementById(`results-p${n}-time`).textContent = `${p.avgTime}s`;
  });

  showScreen('results-screen');
}
