/**
 * File: ui.js
 * Description: DOM rendering — questions, answers, progress, and results
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const ANSWER_KEYS = ['A', 'B', 'C', 'D'];

export class UI {
  constructor() {
    this.els = {
      questionCurrent: document.getElementById('question-current'),
      questionTotal: document.getElementById('question-total'),
      questionText: document.getElementById('question-text'),
      answersGrid: document.getElementById('answers-grid'),
      progressFill: document.getElementById('progress-fill'),
      progressText: document.getElementById('progress-text'),
      progressBar: document.querySelector('.progress'),
      resultContainer: document.getElementById('result-container'),
      resultEmoji: document.getElementById('result-emoji'),
      resultTitle: document.getElementById('result-title'),
      resultDescription: document.getElementById('result-description'),
      resultTraitsList: document.getElementById('result-traits-list'),
      btnStart: document.getElementById('btn-start'),
      btnRetake: document.getElementById('btn-retake')
    };

    /** @type {Function|null} */
    this._answerCallback = null;

    /** @type {boolean} */
    this._locked = false;
  }

  /**
   * Binds the start button click handler
   * @param {Function} callback
   */
  onStart(callback) {
    this.els.btnStart.addEventListener('click', callback);
  }

  /**
   * Binds the retake button click handler
   * @param {Function} callback
   */
  onRetake(callback) {
    this.els.btnRetake.addEventListener('click', callback);
  }

  /**
   * Stores the answer selection callback
   * @param {Function} callback - receives (answerIndex: number)
   */
  onAnswer(callback) {
    this._answerCallback = callback;
  }

  /**
   * Renders a question and its answer cards
   * @param {object} question
   * @param {number} index - 0-based
   * @param {number} total
   */
  renderQuestion(question, index, total) {
    this._locked = false;
    this.els.questionCurrent.textContent = index + 1;
    this.els.questionTotal.textContent = total;
    this.els.questionText.textContent = question.question;
    this.els.questionText.classList.add('entering');

    // Remove entering class after animation
    setTimeout(() => {
      this.els.questionText.classList.remove('entering');
    }, 400);

    // Clear and rebuild answer cards
    this.els.answersGrid.innerHTML = '';
    this.els.answersGrid.classList.remove('answers--locked');

    question.answers.forEach((answer, i) => {
      const card = document.createElement('button');
      card.className = 'answer-card';
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', 'false');
      card.setAttribute('data-index', i);
      card.tabIndex = i === 0 ? 0 : -1;

      const key = document.createElement('span');
      key.className = 'answer-card__key';
      key.textContent = ANSWER_KEYS[i];

      const text = document.createElement('span');
      text.className = 'answer-card__text';
      text.textContent = answer.text;

      card.appendChild(key);
      card.appendChild(text);

      card.addEventListener('click', () => this.selectAnswer(i));

      this.els.answersGrid.appendChild(card);
    });

    // Focus first answer card
    const firstCard = this.els.answersGrid.querySelector('.answer-card');
    if (firstCard) firstCard.focus();
  }

  /**
   * Selects an answer by index
   * @param {number} index
   */
  selectAnswer(index) {
    if (this._locked) return;
    this._locked = true;

    const cards = this.els.answersGrid.querySelectorAll('.answer-card');
    cards[index].classList.add('selected');
    cards[index].setAttribute('aria-checked', 'true');
    this.els.answersGrid.classList.add('answers--locked');

    if (this._answerCallback) {
      this._answerCallback(index);
    }
  }

  /**
   * Updates the progress bar
   * @param {number} percent - 0-100
   */
  updateProgress(percent) {
    this.els.progressFill.style.width = `${percent}%`;
    this.els.progressText.textContent = percent;
    this.els.progressBar.setAttribute('aria-valuenow', percent);
  }

  /**
   * Populates the result view with personality data
   * @param {object} result - PersonalityResult object
   */
  showResult(result) {
    this.els.resultContainer.setAttribute('data-personality', result.key);
    this.els.resultEmoji.textContent = result.emoji;
    this.els.resultTitle.textContent = result.title;
    this.els.resultDescription.textContent = result.description;

    this.els.resultTraitsList.innerHTML = '';
    result.traits.forEach(trait => {
      const li = document.createElement('li');
      li.textContent = `\u2726 ${trait}`;
      this.els.resultTraitsList.appendChild(li);
    });

    // Focus the result title for accessibility
    this.els.resultTitle.focus();
  }
}
