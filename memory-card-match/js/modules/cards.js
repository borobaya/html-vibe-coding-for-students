/**
 * File: cards.js
 * Description: Card symbols, deck generation, and shuffle
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const SYMBOLS = [
  '🍎', '🍊', '🍋', '🍇', '🍓', '🍒',
  '🌸', '🌻', '🌙', '⭐', '🔥', '💎',
  '🎵', '🎮', '🚀', '🦋', '🐱', '🐶',
  '🍕', '🎯', '💡', '🌍', '🦊', '🐼',
];

const DIFFICULTY_CONFIG = {
  easy:   { pairs: 6,  cols: 4 },
  medium: { pairs: 8,  cols: 4 },
  hard:   { pairs: 12, cols: 6 },
};

/**
 * Generates a shuffled deck of card pairs
 * @param {string} difficulty
 * @returns {{ cards: Array<{id: number, symbol: string}>, cols: number, pairs: number }}
 */
export function generateDeck(difficulty = 'easy') {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy;
  const selected = SYMBOLS.slice(0, config.pairs);
  const deck = [];

  let id = 0;
  for (const symbol of selected) {
    deck.push({ id: id++, symbol });
    deck.push({ id: id++, symbol });
  }

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return { cards: deck, cols: config.cols, pairs: config.pairs };
}

export function getDifficultyConfig(difficulty) {
  return DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy;
}
