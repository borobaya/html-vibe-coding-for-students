/**
 * File: validation.js
 * Description: Input validation and sanitization for GitHub usernames
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Sanitises user input by trimming and escaping HTML entities.
 * @param {string} input - Raw input string
 * @returns {string} Sanitised string
 */
export function sanitizeInput(input) {
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validates a GitHub username against GitHub's rules.
 * @param {string} username - Username to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export function validateUsername(username) {
  const trimmed = username.trim();

  if (!trimmed) {
    return { valid: false, message: 'Please enter a username.' };
  }

  if (trimmed.length > 39) {
    return { valid: false, message: 'Username must be 39 characters or fewer.' };
  }

  const pattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  if (!pattern.test(trimmed)) {
    return {
      valid: false,
      message:
        'Username can only contain letters, numbers, and hyphens, and cannot start or end with a hyphen.',
    };
  }

  return { valid: true, message: '' };
}
