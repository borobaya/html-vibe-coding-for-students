/**
 * File: words.js
 * Description: Word bank, selection, and difficulty management
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const WORD_BANK = {
  easy: [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'boy',
    'did', 'cat', 'dog', 'run', 'big', 'red', 'sun', 'top', 'hat', 'cup',
    'let', 'say', 'she', 'too', 'use', 'sit', 'set', 'try', 'ask', 'own',
    'put', 'go', 'do', 'up', 'no', 'so', 'us', 'if', 'me', 'my',
    'an', 'it', 'is', 'on', 'at', 'to', 'be', 'or', 'by', 'we',
    'fan', 'map', 'box', 'pen', 'bag', 'key', 'jar', 'log', 'net', 'rug',
    'fix', 'mix', 'six', 'ten', 'win', 'hop', 'pop', 'tip', 'dig', 'bug',
    'arm', 'bed', 'cut', 'end', 'fly', 'ice', 'job', 'kit', 'lip', 'mud',
  ],
  medium: [
    'about', 'would', 'there', 'their', 'which', 'could', 'other', 'after',
    'first', 'never', 'place', 'think', 'water', 'house', 'world', 'light',
    'three', 'right', 'story', 'point', 'found', 'great', 'under', 'along',
    'while', 'every', 'night', 'heart', 'bring', 'large', 'start', 'small',
    'river', 'plant', 'earth', 'paper', 'group', 'music', 'learn', 'table',
    'young', 'sound', 'power', 'money', 'voice', 'class', 'field', 'watch',
    'color', 'horse', 'quick', 'green', 'dream', 'south', 'north', 'eight',
    'above', 'close', 'clear', 'state', 'space', 'image', 'sense', 'below',
    'carry', 'happy', 'build', 'short', 'stand', 'board', 'study', 'party',
    'cover', 'drive', 'cross', 'force', 'given', 'order', 'spend', 'focus',
    'touch', 'reach', 'stone', 'peace', 'ocean', 'quiet', 'break', 'shape',
    'trade', 'paint', 'glass', 'smile', 'floor', 'mouth', 'blood', 'brain',
  ],
  hard: [
    'because', 'through', 'between', 'another', 'thought', 'country',
    'example', 'without', 'company', 'problem', 'different', 'important',
    'children', 'question', 'national', 'possible', 'sentence', 'together',
    'business', 'mountain', 'remember', 'anything', 'consider', 'continue',
    'keyboard', 'algorithm', 'paragraph', 'challenge', 'development',
    'experience', 'knowledge', 'beautiful', 'community', 'education',
    'sometimes', 'treatment', 'represent', 'wonderful', 'establish',
    'following', 'operation', 'condition', 'structure', 'character',
    'politics', 'personal', 'material', 'industry', 'practice',
    'language', 'military', 'standard', 'complete', 'position',
    'building', 'pressure', 'familiar', 'document', 'exchange',
    'movement', 'physical', 'research', 'security', 'software',
    'decision', 'relation', 'shoulder', 'increase', 'property',
    'original', 'electric', 'schedule', 'discover', 'evidence',
    'function', 'surprise', 'magazine', 'indicate', 'exercise',
    'whatever', 'absolute', 'strategy', 'creative', 'previous',
  ],
};

/**
 * Generates a randomised word list for a race
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @param {number} count - number of words
 * @returns {string[]}
 */
export function generateWordList(difficulty = 'medium', count = 50) {
  const bank = WORD_BANK[difficulty] || WORD_BANK.medium;
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push(bank[Math.floor(Math.random() * bank.length)]);
  }
  return list;
}

/**
 * Returns a window of words around the current index
 * @param {string[]} wordList
 * @param {number} currentIndex
 * @param {number} before
 * @param {number} after
 * @returns {{ past: string[], current: string, upcoming: string[] }}
 */
export function getWordSlice(wordList, currentIndex, before = 2, after = 5) {
  const past = wordList.slice(Math.max(0, currentIndex - before), currentIndex);
  const current = wordList[currentIndex] || '';
  const upcoming = wordList.slice(currentIndex + 1, currentIndex + 1 + after);
  return { past, current, upcoming };
}
