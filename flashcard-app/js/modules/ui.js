/**
 * File: ui.js
 * Description: DOM rendering — decks, cards, study view, modals, completion
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getAllDecks, getDeckById } from './decks.js';
import { getCardsForDeck } from './cards.js';
import { getCurrentCard, getSessionProgress, isSessionComplete, getSessionResults } from './study.js';

/**
 * Escapes HTML to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const views = ['view-deck-list', 'view-deck-detail', 'view-study', 'view-complete'];

/**
 * Shows a single view, hides others
 * @param {string} viewId
 */
export function showView(viewId) {
  for (const id of views) {
    const el = document.getElementById(id);
    if (el) el.hidden = id !== viewId;
  }
}

/**
 * Shows a modal
 * @param {string} modalId
 */
export function showModal(modalId) {
  document.getElementById(modalId)?.showModal();
}

/**
 * Hides a modal
 * @param {string} modalId
 */
export function hideModal(modalId) {
  document.getElementById(modalId)?.close();
}

/**
 * Renders the deck list grid
 */
export function renderDeckList() {
  const grid = document.getElementById('deck-grid');
  const empty = document.getElementById('empty-state-decks');
  if (!grid) return;

  const decks = getAllDecks();
  grid.innerHTML = '';

  if (decks.length === 0) {
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  for (const deck of decks) {
    const card = document.createElement('article');
    card.className = 'deck-card';
    card.dataset.id = deck.id;

    card.innerHTML = `
      <h3 class="deck-card__name">${escapeHTML(deck.name)}</h3>
      <div class="deck-card__stats">
        <span>${deck.totalCards} cards</span>
        <span>${deck.masteryPercent}% mastered</span>
      </div>
      <div class="progress-bar progress-bar--sm">
        <div class="progress-bar__fill" style="width: ${deck.masteryPercent}%"></div>
      </div>
    `;

    grid.appendChild(card);
  }
}

/**
 * Renders the deck detail view (card list + stats)
 * @param {string} deckId
 */
export function renderDeckDetail(deckId) {
  const deck = getDeckById(deckId);
  if (!deck) return;

  const titleEl = document.querySelector('#view-deck-detail .deck-detail__title');
  if (titleEl) titleEl.textContent = deck.name;

  // Stats
  const statTotal = document.getElementById('stat-total');
  const statMastered = document.getElementById('stat-mastered');
  const statPercent = document.getElementById('stat-percent');
  const progressFill = document.getElementById('deck-progress-fill');

  if (statTotal) statTotal.textContent = deck.totalCards;
  if (statMastered) statMastered.textContent = deck.masteredCards;
  if (statPercent) statPercent.textContent = `${deck.masteryPercent}%`;
  if (progressFill) progressFill.style.width = `${deck.masteryPercent}%`;

  // Card list
  const list = document.getElementById('card-list');
  const empty = document.getElementById('empty-state-cards');
  const studyBtn = document.getElementById('btn-study-deck');

  if (!list) return;
  list.innerHTML = '';

  const cards = getCardsForDeck(deckId);

  if (cards.length === 0) {
    if (empty) empty.hidden = false;
    if (studyBtn) studyBtn.disabled = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (studyBtn) studyBtn.disabled = false;

  for (const card of cards) {
    const li = document.createElement('li');
    li.className = `card-item${card.mastered ? ' card-item--mastered' : ''}`;
    li.dataset.cardId = card.id;

    li.innerHTML = `
      <div class="card-item__content">
        <strong class="card-item__question">${escapeHTML(card.question)}</strong>
        <span class="card-item__answer">${escapeHTML(card.answer)}</span>
      </div>
      <span class="card-item__badge">${card.mastered ? '✓ Mastered' : 'Learning'}</span>
      <div class="card-item__actions">
        <button class="btn btn--ghost btn--icon card-item__edit" type="button" aria-label="Edit card">✏️</button>
        <button class="btn btn--danger-ghost btn--icon card-item__delete" type="button" aria-label="Delete card">🗑️</button>
      </div>
    `;

    list.appendChild(li);
  }
}

/**
 * Renders the current study card
 */
export function renderStudyCard() {
  const card = getCurrentCard();
  const questionEl = document.getElementById('flashcard-question');
  const answerEl = document.getElementById('flashcard-answer');
  const flashcard = document.getElementById('flashcard');
  const counterEl = document.getElementById('study-counter');
  const progressFill = document.getElementById('study-progress-fill');

  // Remove flip
  if (flashcard) flashcard.classList.remove('is-flipped');

  if (!card) return;

  if (questionEl) questionEl.textContent = card.question;
  if (answerEl) answerEl.textContent = card.answer;

  const progress = getSessionProgress();
  if (counterEl) counterEl.textContent = `${progress.current} / ${progress.total}`;
  if (progressFill) progressFill.style.width = `${progress.percent}%`;
}

/**
 * Flips the flashcard
 */
export function flipCard() {
  const flashcard = document.getElementById('flashcard');
  if (flashcard) flashcard.classList.toggle('is-flipped');
}

/**
 * Renders the completion screen
 */
export function renderComplete() {
  const results = getSessionResults();
  const totalEl = document.getElementById('complete-total');
  const masteredEl = document.getElementById('complete-mastered');
  const learningEl = document.getElementById('complete-learning');
  const percentEl = document.getElementById('complete-percent');

  if (totalEl) totalEl.textContent = results.total;
  if (masteredEl) masteredEl.textContent = results.mastered;
  if (learningEl) learningEl.textContent = results.learning;
  if (percentEl) percentEl.textContent = `${results.percent}%`;
}

/**
 * Caches references and sets up base listeners
 */
export function initUI() {
  // Keyboard flip
  document.addEventListener('keydown', (e) => {
    const studyView = document.getElementById('view-study');
    if (studyView && !studyView.hidden) {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (e.target.tagName !== 'BUTTON') {
          e.preventDefault();
          flipCard();
        }
      }
    }
  });
}
