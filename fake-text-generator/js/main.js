/**
 * File: main.js
 * Description: Fake Text Generator entry point — orchestration and event delegation
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { addMessage, deleteMessage, editMessage, moveMessage, clearAll, getMessages } from './modules/messageStore.js';
import { renderMessages, updateContactInfo, scrollToBottom } from './modules/renderer.js';
import { initControls, getMessageInput, clearMessageInput, initContactListeners } from './modules/controls.js';
import { downloadAsPng } from './modules/exporter.js';
import { parseTimeInput } from './modules/utils.js';

let messagesContainer, phoneFrame;

/** Handles adding a new message */
function handleAddMessage() {
  const { text, direction, timestamp } = getMessageInput();
  if (!text) return;

  const msgs = getMessages();
  const lastTimestamp = msgs.length > 0 ? msgs[msgs.length - 1].timestamp : null;
  const time = parseTimeInput(timestamp, lastTimestamp);

  addMessage(text, direction, time);
  renderMessages(messagesContainer);
  clearMessageInput();
  scrollToBottom(messagesContainer);
}

/**
 * Handles deleting a message
 * @param {string} id
 */
function handleDelete(id) {
  deleteMessage(id);
  renderMessages(messagesContainer);
}

/**
 * Handles editing a message
 * @param {string} id
 */
function handleEdit(id) {
  const msgs = getMessages();
  const msg = msgs.find(m => m.id === id);
  if (!msg) return;

  const newText = prompt('Edit message:', msg.text);
  if (newText !== null && newText.trim()) {
    editMessage(id, newText.trim());
    renderMessages(messagesContainer);
  }
}

/**
 * Handles moving a message
 * @param {string} id
 * @param {'up'|'down'} direction
 */
function handleMove(id, direction) {
  moveMessage(id, direction);
  renderMessages(messagesContainer);
}

/** Handles clearing all messages */
function handleClear() {
  if (!confirm('Clear all messages? This cannot be undone.')) return;
  clearAll();
  updateContactInfo('Contact', 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="40" r="18" fill="#8E8E93"/><ellipse cx="50" cy="85" rx="30" ry="22" fill="#8E8E93"/></svg>'));
  renderMessages(messagesContainer);
}

/** Handles PNG download */
function handleDownload() {
  downloadAsPng(phoneFrame, 'fake-text-conversation.png');
}

/** Toggles dark/light theme */
function handleThemeToggle() {
  const btn = document.getElementById('themeToggle');
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  btn.textContent = isDark ? '\u2600\uFE0F' : '\u{1F319}';
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  } catch {
    // Ignore storage errors
  }
}

/** Restores saved theme preference */
function restoreTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.body.classList.add('dark-mode');
      document.getElementById('themeToggle').textContent = '\u2600\uFE0F';
    }
  } catch {
    // Ignore
  }
}

/** Initialises the app */
function init() {
  messagesContainer = document.getElementById('messagesContainer');
  phoneFrame = document.getElementById('phoneFrame');

  initControls(handleAddMessage, handleClear);
  initContactListeners(
    (name) => updateContactInfo(name, undefined),
    (src) => updateContactInfo(undefined, src)
  );

  // Download button
  document.getElementById('downloadBtn').addEventListener('click', handleDownload);

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', handleThemeToggle);
  restoreTheme();

  // Event delegation for message controls
  messagesContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.message__control-btn');
    if (!btn) return;

    const { action, id } = btn.dataset;
    switch (action) {
      case 'edit': handleEdit(id); break;
      case 'delete': handleDelete(id); break;
      case 'moveUp': handleMove(id, 'up'); break;
      case 'moveDown': handleMove(id, 'down'); break;
    }
  });

  renderMessages(messagesContainer);
}

document.addEventListener('DOMContentLoaded', init);
