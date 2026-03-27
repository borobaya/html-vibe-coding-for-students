/**
 * File: main.js
 * Description: Personality Quiz entry point — wires modules and events
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { questions } from './modules/questions.js';
import { Quiz } from './modules/quiz.js';
import { getResult } from './modules/results.js';
import { UI } from './modules/ui.js';
import { Router } from './modules/router.js';

const ANSWER_DELAY = 600;
const RESULT_DELAY = 800;

/** @type {Quiz} */
let quiz;
/** @type {UI} */
let ui;
/** @type {Router} */
let router;

/**
 * Loads and displays the current question
 */
function showCurrentQuestion() {
  const question = quiz.getCurrentQuestion();
  ui.renderQuestion(question, quiz.currentIndex, quiz.totalQuestions);
  ui.updateProgress(quiz.getProgress());
}

/**
 * Handles an answer selection
 * @param {number} answerIndex
 */
function handleAnswer(answerIndex) {
  quiz.submitAnswer(answerIndex);

  setTimeout(() => {
    if (quiz.isComplete()) {
      // Show the result
      ui.updateProgress(100);
      setTimeout(() => {
        const result = getResult(quiz.getScores());
        ui.showResult(result);
        router.showView('result');
      }, RESULT_DELAY);
    } else {
      quiz.advance();
      showCurrentQuestion();
    }
  }, ANSWER_DELAY);
}

/**
 * Starts the quiz
 */
function startQuiz() {
  quiz.reset();
  router.showView('quiz');
  showCurrentQuestion();
}

/**
 * Retakes the quiz from the beginning
 */
function retakeQuiz() {
  quiz.reset();
  router.showView('quiz');
  showCurrentQuestion();
}

/**
 * Sets up keyboard shortcuts (1-4 keys for answers)
 */
function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (router.currentView !== 'quiz') return;

    const key = parseInt(e.key, 10);
    if (key >= 1 && key <= 4) {
      e.preventDefault();
      ui.selectAnswer(key - 1);
    }
  });
}

/** Initialises the app */
function init() {
  quiz = new Quiz(questions);
  ui = new UI();
  router = new Router();

  ui.onStart(startQuiz);
  ui.onRetake(retakeQuiz);
  ui.onAnswer(handleAnswer);
  setupKeyboard();
}

document.addEventListener('DOMContentLoaded', init);
