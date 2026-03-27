/**
 * File: ui.js
 * Description: DOM-based UI for build menu, upgrade panel, HUD, and wave info
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { TURRET_TYPES } from './turrets.js';

/**
 * Populates the build menu with turret buttons
 * @param {HTMLElement} container
 * @param {function} onSelect - callback(type)
 */
export function initBuildMenu(container, onSelect) {
  container.innerHTML = '';
  for (const [key, t] of Object.entries(TURRET_TYPES)) {
    const btn = document.createElement('button');
    btn.className = 'build-btn';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.dataset.type = key;
    btn.innerHTML = `
      <span class="build-btn__swatch" style="background:${t.colour}"></span>
      <span class="build-btn__name">${t.name}</span>
      <span class="build-btn__cost">${t.cost}g</span>
    `;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.build-btn').forEach(b => {
        b.classList.remove('build-btn--active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('build-btn--active');
      btn.setAttribute('aria-checked', 'true');
      onSelect(key);
    });
    container.appendChild(btn);
  }
}

/**
 * Updates HUD elements
 * @param {Object} state
 */
export function updateHUD(state) {
  setText('hud-lives', state.lives);
  setText('hud-gold', state.gold);
  setText('hud-wave', state.wave);
  setText('hud-score', state.score);
}

/**
 * Shows upgrade panel for a turret
 * @param {Object} turret
 * @param {function} onUpgrade
 * @param {function} onSell
 */
export function showUpgradePanel(turret, onUpgrade, onSell) {
  const panel = document.getElementById('upgrade-panel');
  if (!panel) return;
  panel.hidden = false;

  setText('upgrade-name', `${turret.name} (L${turret.level})`);
  setText('upgrade-damage', turret.damage);
  setText('upgrade-range', turret.range);
  setText('upgrade-cost', turret.upgradeCost);
  setText('sell-value', turret.sellValue);

  const upgradeBtn = document.getElementById('btn-upgrade');
  const sellBtn = document.getElementById('btn-sell');

  const newUpgrade = upgradeBtn.cloneNode(true);
  upgradeBtn.replaceWith(newUpgrade);
  newUpgrade.addEventListener('click', onUpgrade);

  const newSell = sellBtn.cloneNode(true);
  sellBtn.replaceWith(newSell);
  newSell.addEventListener('click', onSell);
}

export function hideUpgradePanel() {
  const panel = document.getElementById('upgrade-panel');
  if (panel) panel.hidden = true;
}

/**
 * Shows the wave announcement overlay
 * @param {number} waveNum
 */
export function showWaveAnnouncement(waveNum) {
  const el = document.getElementById('wave-announce');
  if (!el) return;
  el.textContent = `Wave ${waveNum}`;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 1500);
}

export function showGameOver(score) {
  const overlay = document.getElementById('gameover-overlay');
  if (overlay) {
    setText('final-score', score);
    overlay.hidden = false;
  }
}

export function hideGameOver() {
  const overlay = document.getElementById('gameover-overlay');
  if (overlay) overlay.hidden = true;
}

/**
 * Deselects all build buttons
 */
export function clearBuildSelection() {
  document.querySelectorAll('.build-btn').forEach(b => {
    b.classList.remove('build-btn--active');
    b.setAttribute('aria-checked', 'false');
  });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
