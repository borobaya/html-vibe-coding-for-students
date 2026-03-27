/**
 * File: search.js
 * Description: Search input handling and recent search chip interactions
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Initialises the search form and recent search chip listeners.
 * @param {Function} onSearch - Callback receiving city name string
 * @param {Function} onRemoveRecent - Callback receiving city name to remove
 */
export function initSearch(onSearch, onRemoveRecent) {
  const form = document.querySelector('.search__form');
  const input = document.getElementById('search-input');
  const recentContainer = document.querySelector('.search__recent');

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (city) {
      onSearch(city);
      input.value = '';
    }
  });

  // Delegated click on recent search chips
  recentContainer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.search__chip-remove');
    if (removeBtn) {
      const chip = removeBtn.closest('.search__chip');
      if (chip) {
        onRemoveRecent(chip.dataset.city);
      }
      return;
    }

    const chip = e.target.closest('.search__chip');
    if (chip) {
      onSearch(chip.dataset.city);
    }
  });
}
