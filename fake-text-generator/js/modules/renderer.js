/**
 * File: renderer.js
 * Description: Renders messages into the phone frame chat area
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getMessages } from './messageStore.js';
import { sanitise } from './utils.js';

/**
 * Renders all messages into the container
 * @param {HTMLElement} container - The #messagesContainer element
 */
export function renderMessages(container) {
  const placeholder = document.getElementById('emptyPlaceholder');
  const msgs = getMessages();

  // Remove all message elements but keep placeholder
  const existing = container.querySelectorAll('.message');
  existing.forEach(el => el.remove());

  if (msgs.length === 0) {
    placeholder.style.display = '';
    return;
  }

  placeholder.style.display = 'none';

  msgs.forEach(msg => {
    const el = createMessageElement(msg);
    container.appendChild(el);
  });
}

/**
 * Creates a single message DOM element
 * @param {{ id: string, text: string, direction: string, timestamp: string }} msg
 * @returns {HTMLElement}
 */
function createMessageElement(msg) {
  const wrapper = document.createElement('div');
  wrapper.className = `message message--${msg.direction}`;
  wrapper.setAttribute('data-id', msg.id);

  const bubble = document.createElement('div');
  bubble.className = 'message__bubble';
  // Use sanitised text with line breaks
  bubble.innerHTML = sanitise(msg.text).replace(/\n/g, '<br>');

  const time = document.createElement('span');
  time.className = 'message__timestamp';
  time.textContent = msg.timestamp;

  const controls = document.createElement('div');
  controls.className = 'message__controls';

  const actions = [
    { action: 'edit', label: '\u270F\uFE0F', title: 'Edit message' },
    { action: 'delete', label: '\u{1F5D1}\uFE0F', title: 'Delete message' },
    { action: 'moveUp', label: '\u2191', title: 'Move up' },
    { action: 'moveDown', label: '\u2193', title: 'Move down' }
  ];

  actions.forEach(({ action, label, title }) => {
    const btn = document.createElement('button');
    btn.className = 'message__control-btn';
    btn.setAttribute('data-action', action);
    btn.setAttribute('data-id', msg.id);
    btn.setAttribute('aria-label', title);
    btn.title = title;
    btn.textContent = label;
    controls.appendChild(btn);
  });

  wrapper.appendChild(bubble);
  wrapper.appendChild(time);
  wrapper.appendChild(controls);

  return wrapper;
}

/**
 * Updates the contact name and avatar in the phone header
 * @param {string} name
 * @param {string} avatarSrc - URL or data URL for avatar
 */
export function updateContactInfo(name, avatarSrc) {
  const nameEl = document.getElementById('chatName');
  const imgEl = document.getElementById('avatarImg');
  if (name !== undefined) nameEl.textContent = name;
  if (avatarSrc !== undefined) imgEl.src = avatarSrc;
}

/**
 * Scrolls the messages container to the bottom
 * @param {HTMLElement} container
 */
export function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}
