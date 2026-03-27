/**
 * File: decks.js
 * Description: Deck CRUD operations with computed mastery stats
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getDecks, getDeck, saveDeck, deleteDeck as removeDeckFromStorage, generateId } from './storage.js';

/**
 * Creates a new deck
 * @param {string} name
 * @returns {object} The created deck
 */
export function createDeck(name) {
  const deck = {
    id: generateId('dk'),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cards: [],
  };
  saveDeck(deck);
  return deck;
}

/**
 * Renames a deck
 * @param {string} id
 * @param {string} name
 */
export function renameDeck(id, name) {
  const deck = getDeck(id);
  if (!deck) return;
  deck.name = name.trim();
  deck.updatedAt = new Date().toISOString();
  saveDeck(deck);
}

/**
 * Removes a deck
 * @param {string} id
 */
export function removeDeck(id) {
  removeDeckFromStorage(id);
}

/**
 * Returns all decks with computed stats
 * @returns {Array<{ id: string, name: string, totalCards: number, masteredCards: number, masteryPercent: number }>}
 */
export function getAllDecks() {
  return getDecks().map(addStats);
}

/**
 * Returns a single deck with computed stats
 * @param {string} id
 * @returns {object|undefined}
 */
export function getDeckById(id) {
  const deck = getDeck(id);
  return deck ? addStats(deck) : undefined;
}

/**
 * Adds computed stats to a deck object
 * @param {object} deck
 * @returns {object}
 */
function addStats(deck) {
  const cards = deck.cards || [];
  const totalCards = cards.length;
  const masteredCards = cards.filter((c) => c.mastered).length;
  const masteryPercent = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
  return { ...deck, totalCards, masteredCards, masteryPercent };
}
