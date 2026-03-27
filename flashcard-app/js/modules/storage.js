/**
 * File: storage.js
 * Description: localStorage persistence for flashcard decks and cards
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const STORAGE_KEY = 'flashcard-app-data';

/**
 * Generates a unique ID with optional prefix
 * @param {string} prefix
 * @returns {string}
 */
export function generateId(prefix = '') {
  const uuid = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  return prefix ? `${prefix}_${uuid}` : uuid;
}

/**
 * Loads all data from localStorage
 * @returns {{ decks: Array }}
 */
export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { decks: [] };
  } catch {
    return { decks: [] };
  }
}

/**
 * Saves data to localStorage
 * @param {{ decks: Array }} data
 */
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // silent
  }
}

/**
 * Returns all decks
 * @returns {Array}
 */
export function getDecks() {
  return loadData().decks;
}

/**
 * Returns a single deck by ID
 * @param {string} id
 * @returns {object|undefined}
 */
export function getDeck(id) {
  return getDecks().find((d) => d.id === id);
}

/**
 * Saves (creates or updates) a deck
 * @param {object} deck
 */
export function saveDeck(deck) {
  const data = loadData();
  const idx = data.decks.findIndex((d) => d.id === deck.id);
  if (idx >= 0) {
    data.decks[idx] = deck;
  } else {
    data.decks.push(deck);
  }
  saveData(data);
}

/**
 * Deletes a deck by ID
 * @param {string} id
 */
export function deleteDeck(id) {
  const data = loadData();
  data.decks = data.decks.filter((d) => d.id !== id);
  saveData(data);
}

/**
 * Returns all cards in a deck
 * @param {string} deckId
 * @returns {Array}
 */
export function getCards(deckId) {
  const deck = getDeck(deckId);
  return deck ? deck.cards || [] : [];
}

/**
 * Returns a single card
 * @param {string} deckId
 * @param {string} cardId
 * @returns {object|undefined}
 */
export function getCard(deckId, cardId) {
  return getCards(deckId).find((c) => c.id === cardId);
}

/**
 * Saves (creates or updates) a card within a deck
 * @param {string} deckId
 * @param {object} card
 */
export function saveCard(deckId, card) {
  const deck = getDeck(deckId);
  if (!deck) return;
  if (!deck.cards) deck.cards = [];

  const idx = deck.cards.findIndex((c) => c.id === card.id);
  if (idx >= 0) {
    deck.cards[idx] = card;
  } else {
    deck.cards.push(card);
  }
  deck.updatedAt = new Date().toISOString();
  saveDeck(deck);
}

/**
 * Deletes a card from a deck
 * @param {string} deckId
 * @param {string} cardId
 */
export function deleteCard(deckId, cardId) {
  const deck = getDeck(deckId);
  if (!deck) return;
  deck.cards = (deck.cards || []).filter((c) => c.id !== cardId);
  deck.updatedAt = new Date().toISOString();
  saveDeck(deck);
}
