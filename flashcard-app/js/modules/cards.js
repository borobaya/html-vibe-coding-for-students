/**
 * File: cards.js
 * Description: Card CRUD and mastery toggling
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getCards, saveCard, deleteCard, generateId } from './storage.js';

/**
 * Adds a new card to a deck
 * @param {string} deckId
 * @param {string} question
 * @param {string} answer
 * @returns {object}
 */
export function addCard(deckId, question, answer) {
  const card = {
    id: generateId('cd'),
    question: question.trim(),
    answer: answer.trim(),
    mastered: false,
    createdAt: new Date().toISOString(),
    lastReviewed: null,
  };
  saveCard(deckId, card);
  return card;
}

/**
 * Edits a card's question and answer
 * @param {string} deckId
 * @param {string} cardId
 * @param {string} question
 * @param {string} answer
 */
export function editCard(deckId, cardId, question, answer) {
  const cards = getCards(deckId);
  const card = cards.find((c) => c.id === cardId);
  if (!card) return;
  card.question = question.trim();
  card.answer = answer.trim();
  saveCard(deckId, card);
}

/**
 * Removes a card from a deck
 * @param {string} deckId
 * @param {string} cardId
 */
export function removeCard(deckId, cardId) {
  deleteCard(deckId, cardId);
}

/**
 * Toggles a card's mastered state
 * @param {string} deckId
 * @param {string} cardId
 * @returns {boolean} New mastered state
 */
export function toggleMastered(deckId, cardId) {
  const cards = getCards(deckId);
  const card = cards.find((c) => c.id === cardId);
  if (!card) return false;
  card.mastered = !card.mastered;
  card.lastReviewed = new Date().toISOString();
  saveCard(deckId, card);
  return card.mastered;
}

/**
 * Sets a card's mastered state explicitly
 * @param {string} deckId
 * @param {string} cardId
 * @param {boolean} value
 */
export function setMastered(deckId, cardId, value) {
  const cards = getCards(deckId);
  const card = cards.find((c) => c.id === cardId);
  if (!card) return;
  card.mastered = value;
  card.lastReviewed = new Date().toISOString();
  saveCard(deckId, card);
}

/**
 * Returns all cards for a deck
 * @param {string} deckId
 * @returns {Array}
 */
export function getCardsForDeck(deckId) {
  return getCards(deckId);
}
