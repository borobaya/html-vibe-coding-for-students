/**
 * File: controls.js
 * Description: Control panel bindings — message input, contact settings, char counter
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

let textareaEl, timeInputEl, charCountEl, directionRadios;

/**
 * Initialises the message input controls and binds listeners
 * @param {Function} onAddMessage - Callback when add button clicked
 * @param {Function} onClear - Callback when clear button clicked
 */
export function initControls(onAddMessage, onClear) {
  textareaEl = document.getElementById('messageText');
  timeInputEl = document.getElementById('messageTime');
  charCountEl = document.getElementById('charCount');
  directionRadios = document.querySelectorAll('input[name="direction"]');
  const addBtn = document.getElementById('addMessageBtn');
  const clearBtn = document.getElementById('clearBtn');

  addBtn.addEventListener('click', onAddMessage);
  clearBtn.addEventListener('click', onClear);

  // Char counter
  initCharCounter(textareaEl, charCountEl, 500);

  // Enter to add (Shift+Enter for newline)
  textareaEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAddMessage();
    }
  });
}

/**
 * Gets current message input values
 * @returns {{ text: string, direction: string, timestamp: string }}
 */
export function getMessageInput() {
  const text = textareaEl.value.trim();
  const direction = [...directionRadios].find(r => r.checked)?.value || 'sent';
  const timestamp = timeInputEl.value;
  return { text, direction, timestamp };
}

/** Clears the message input fields */
export function clearMessageInput() {
  textareaEl.value = '';
  timeInputEl.value = '';
  charCountEl.textContent = '0/500';
}

/**
 * Initialises contact detail listeners
 * @param {Function} onNameChange - receives (name: string)
 * @param {Function} onAvatarChange - receives (src: string)
 */
export function initContactListeners(onNameChange, onAvatarChange) {
  const nameInput = document.getElementById('contactName');
  const avatarUpload = document.getElementById('avatarUpload');
  const defaultAvatars = document.getElementById('defaultAvatars');

  nameInput.addEventListener('input', () => {
    onNameChange(nameInput.value || 'Contact');
  });

  avatarUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const src = await handleAvatarUpload(file);
      onAvatarChange(src);
    }
  });

  defaultAvatars.addEventListener('click', (e) => {
    const btn = e.target.closest('.avatar-option');
    if (!btn) return;

    // Set active state
    defaultAvatars.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('avatar-option--active'));
    btn.classList.add('avatar-option--active');

    // Use the emoji as an SVG-based data URL for the avatar
    const emoji = btn.textContent.trim();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" x="15" font-size="70">${emoji}</text></svg>`;
    const src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    onAvatarChange(src);
  });
}

/**
 * Initialises a character counter on a textarea
 * @param {HTMLTextAreaElement} textarea
 * @param {HTMLElement} counterEl
 * @param {number} maxLen
 */
function initCharCounter(textarea, counterEl, maxLen) {
  textarea.addEventListener('input', () => {
    counterEl.textContent = `${textarea.value.length}/${maxLen}`;
  });
}

/**
 * Reads a file as a data URL
 * @param {File} file
 * @returns {Promise<string>}
 */
function handleAvatarUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
