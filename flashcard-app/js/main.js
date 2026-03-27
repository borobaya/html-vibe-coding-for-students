/**
 * File: main.js
 * Description: Entry point — wires router, CRUD listeners, study logic
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { initRouter, navigateTo } from './modules/router.js';
import { createDeck, renameDeck, removeDeck } from './modules/decks.js';
import { addCard, editCard, removeCard } from './modules/cards.js';
import {
  startSession, markCurrentMastered, markCurrentLearning,
  shuffleRemaining, toggleFilterUnmastered, isSessionComplete
} from './modules/study.js';
import {
  initUI, showView, renderDeckList, renderDeckDetail,
  renderStudyCard, flipCard, renderComplete, showModal, hideModal
} from './modules/ui.js';

let activeDeckId = null;
let editingCardId = null;

/* ── Route Handler ──────────────────────────────────── */
function handleRoute(view, id) {
  switch (view) {
    case 'decks':
      showView('view-deck-list');
      renderDeckList();
      break;
    case 'deck':
      activeDeckId = id;
      showView('view-deck-detail');
      renderDeckDetail(id);
      break;
    case 'study':
      activeDeckId = id;
      startSession(id);
      showView('view-study');
      renderStudyCard();
      break;
    case 'complete':
      showView('view-complete');
      renderComplete();
      break;
    default:
      showView('view-deck-list');
      renderDeckList();
  }
}

/* ── Initialisation ─────────────────────────────────── */
function init() {
  initUI();

  // Deck grid click → navigate to deck detail
  document.getElementById('deck-grid')?.addEventListener('click', (e) => {
    const card = e.target.closest('.deck-card');
    if (card) navigateTo(`deck/${card.dataset.id}`);
  });

  // New deck
  document.getElementById('btn-new-deck')?.addEventListener('click', () => {
    showModal('modal-deck');
  });

  // Deck form
  document.getElementById('form-deck')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('input-deck-name');
    const name = input?.value.trim();
    if (!name) return;
    createDeck(name);
    input.value = '';
    hideModal('modal-deck');
    renderDeckList();
  });

  document.getElementById('btn-cancel-deck')?.addEventListener('click', () => hideModal('modal-deck'));
  document.getElementById('btn-close-deck-modal')?.addEventListener('click', () => hideModal('modal-deck'));

  // Back to decks
  document.getElementById('btn-back-to-decks')?.addEventListener('click', () => navigateTo('decks'));

  // Rename deck
  document.getElementById('btn-rename-deck')?.addEventListener('click', () => {
    const name = prompt('New deck name:');
    if (name && activeDeckId) {
      renameDeck(activeDeckId, name);
      renderDeckDetail(activeDeckId);
    }
  });

  // Delete deck
  document.getElementById('btn-delete-deck')?.addEventListener('click', () => {
    showModal('modal-confirm');
    const confirmBtn = document.getElementById('btn-confirm-delete');
    const handler = () => {
      if (activeDeckId) removeDeck(activeDeckId);
      hideModal('modal-confirm');
      navigateTo('decks');
      confirmBtn.removeEventListener('click', handler);
    };
    confirmBtn?.addEventListener('click', handler);
  });

  document.getElementById('btn-confirm-cancel')?.addEventListener('click', () => hideModal('modal-confirm'));

  // Add card
  document.getElementById('btn-add-card')?.addEventListener('click', () => {
    editingCardId = null;
    const qInput = document.getElementById('input-question');
    const aInput = document.getElementById('input-answer');
    if (qInput) qInput.value = '';
    if (aInput) aInput.value = '';
    showModal('modal-card');
  });

  // Card form
  document.getElementById('form-card')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('input-question')?.value.trim();
    const a = document.getElementById('input-answer')?.value.trim();
    if (!q || !a || !activeDeckId) return;

    if (editingCardId) {
      editCard(activeDeckId, editingCardId, q, a);
    } else {
      addCard(activeDeckId, q, a);
    }
    editingCardId = null;
    hideModal('modal-card');
    renderDeckDetail(activeDeckId);
  });

  document.getElementById('btn-cancel-card')?.addEventListener('click', () => hideModal('modal-card'));
  document.getElementById('btn-close-modal')?.addEventListener('click', () => hideModal('modal-card'));

  // Card list actions (edit/delete)
  document.getElementById('card-list')?.addEventListener('click', (e) => {
    const item = e.target.closest('.card-item');
    if (!item) return;
    const cardId = item.dataset.cardId;

    if (e.target.closest('.card-item__edit')) {
      editingCardId = cardId;
      const qInput = document.getElementById('input-question');
      const aInput = document.getElementById('input-answer');
      const qEl = item.querySelector('.card-item__question');
      const aEl = item.querySelector('.card-item__answer');
      if (qInput && qEl) qInput.value = qEl.textContent;
      if (aInput && aEl) aInput.value = aEl.textContent;
      showModal('modal-card');
    }

    if (e.target.closest('.card-item__delete')) {
      if (confirm('Delete this card?')) {
        removeCard(activeDeckId, cardId);
        renderDeckDetail(activeDeckId);
      }
    }
  });

  // Study controls
  document.getElementById('btn-study-deck')?.addEventListener('click', () => {
    if (activeDeckId) navigateTo(`study/${activeDeckId}`);
  });

  document.getElementById('btn-exit-study')?.addEventListener('click', () => {
    if (activeDeckId) navigateTo(`deck/${activeDeckId}`);
  });

  document.getElementById('flashcard-container')?.addEventListener('click', flipCard);

  document.getElementById('btn-mastered')?.addEventListener('click', () => {
    markCurrentMastered();
    if (isSessionComplete()) {
      navigateTo(`complete/${activeDeckId}`);
    } else {
      renderStudyCard();
    }
  });

  document.getElementById('btn-still-learning')?.addEventListener('click', () => {
    markCurrentLearning();
    if (isSessionComplete()) {
      navigateTo(`complete/${activeDeckId}`);
    } else {
      renderStudyCard();
    }
  });

  document.getElementById('btn-shuffle')?.addEventListener('click', () => {
    shuffleRemaining();
    renderStudyCard();
  });

  document.getElementById('btn-filter-unmastered')?.addEventListener('click', () => {
    toggleFilterUnmastered();
    renderStudyCard();
  });

  // Completion
  document.getElementById('btn-study-again')?.addEventListener('click', () => {
    if (activeDeckId) navigateTo(`study/${activeDeckId}`);
  });

  document.getElementById('btn-back-to-deck')?.addEventListener('click', () => {
    if (activeDeckId) navigateTo(`deck/${activeDeckId}`);
  });

  // Start router
  initRouter(handleRoute);
}

document.addEventListener('DOMContentLoaded', init);
