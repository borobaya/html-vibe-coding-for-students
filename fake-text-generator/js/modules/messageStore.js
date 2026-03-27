/**
 * File: messageStore.js
 * Description: In-memory message storage with CRUD and reordering
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { generateId } from './utils.js';

/**
 * @typedef {{ id: string, text: string, direction: 'sent'|'received', timestamp: string, order: number }} Message
 */

/** @type {Message[]} */
let messages = [];

/**
 * Returns a sorted shallow copy of all messages
 * @returns {Message[]}
 */
export function getMessages() {
  return [...messages].sort((a, b) => a.order - b.order);
}

/**
 * Adds a new message
 * @param {string} text
 * @param {'sent'|'received'} direction
 * @param {string} timestamp - HH:MM
 * @returns {Message}
 */
export function addMessage(text, direction, timestamp) {
  const msg = {
    id: generateId(),
    text,
    direction,
    timestamp,
    order: messages.length
  };
  messages.push(msg);
  return msg;
}

/**
 * Deletes a message by ID
 * @param {string} id
 * @returns {boolean}
 */
export function deleteMessage(id) {
  const idx = messages.findIndex(m => m.id === id);
  if (idx === -1) return false;
  messages.splice(idx, 1);
  // Re-index order values
  getMessages().forEach((m, i) => { m.order = i; });
  return true;
}

/**
 * Edits a message's text
 * @param {string} id
 * @param {string} newText
 * @returns {Message|null}
 */
export function editMessage(id, newText) {
  const msg = messages.find(m => m.id === id);
  if (!msg) return null;
  msg.text = newText;
  return msg;
}

/**
 * Moves a message up or down in order
 * @param {string} id
 * @param {'up'|'down'} direction
 * @returns {boolean}
 */
export function moveMessage(id, direction) {
  const sorted = getMessages();
  const idx = sorted.findIndex(m => m.id === id);
  if (idx === -1) return false;

  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= sorted.length) return false;

  // Swap order values
  const temp = sorted[idx].order;
  sorted[idx].order = sorted[swapIdx].order;
  sorted[swapIdx].order = temp;

  return true;
}

/** Clears all messages */
export function clearAll() {
  messages = [];
}

/**
 * Returns message count
 * @returns {number}
 */
export function getMessageCount() {
  return messages.length;
}
