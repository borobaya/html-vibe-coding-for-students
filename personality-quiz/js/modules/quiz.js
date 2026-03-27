/**
 * File: quiz.js
 * Description: Quiz state management — progress, scoring, navigation
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export class Quiz {
  /**
   * @param {Array} questions - The questions array
   */
  constructor(questions) {
    this.questions = questions;
    this.reset();
  }

  /** Resets the quiz state to the beginning */
  reset() {
    this.currentIndex = 0;
    this.scores = {
      architect: 0,
      creative: 0,
      debugger: 0,
      fullstack: 0,
      hacker: 0
    };
  }

  /** @returns {number} Total number of questions */
  get totalQuestions() {
    return this.questions.length;
  }

  /** @returns {object} The current question */
  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  /**
   * Adds the selected answer's weights to accumulated scores
   * @param {number} answerIndex - Index of the selected answer (0-3)
   */
  submitAnswer(answerIndex) {
    const answer = this.questions[this.currentIndex].answers[answerIndex];
    for (const [type, weight] of Object.entries(answer.weights)) {
      this.scores[type] += weight;
    }
  }

  /** Advances to the next question */
  advance() {
    this.currentIndex += 1;
  }

  /**
   * Checks if the user is on the last question (answer submitted)
   * @returns {boolean}
   */
  isComplete() {
    return this.currentIndex >= this.questions.length - 1;
  }

  /**
   * Returns progress as a percentage
   * @returns {number} 0-100
   */
  getProgress() {
    return Math.round((this.currentIndex / this.totalQuestions) * 100);
  }

  /**
   * Returns a shallow copy of the current scores
   * @returns {object}
   */
  getScores() {
    return { ...this.scores };
  }
}
