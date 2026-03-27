/**
 * File: combat.js
 * Description: Turn-based combat engine — actions, damage calculation, resolution
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { getState, addMessage } from './state.js';
import { getEffectiveStats, gainXP } from './player.js';
import { rollLoot } from './items.js';
import { addItem } from './inventory.js';

/**
 * Starts combat with an enemy
 * @param {Object} enemy
 */
export function startCombat(enemy) {
  const state = getState();
  state.combatState = {
    enemy,
    playerTurn: true,
    defending: false,
    messages: [],
    finished: false,
    result: null,
  };
  state.gameMode = 'combat';
  addCombatMessage(`A ${enemy.name} appears! (HP: ${enemy.hp}/${enemy.maxHp})`);
}

/**
 * Processes a player action
 * @param {'attack'|'defend'|'flee'} action
 */
export function playerAction(action) {
  const state = getState();
  const combat = state.combatState;
  if (!combat || combat.finished) return;

  const stats = getEffectiveStats();
  const enemy = combat.enemy;

  combat.defending = false;

  switch (action) {
    case 'attack': {
      const baseDmg = Math.max(1, stats.atk - Math.floor(enemy.def * 0.5));
      const variance = Math.floor(Math.random() * 4) - 1;
      const damage = Math.max(1, baseDmg + variance);
      enemy.hp -= damage;
      addCombatMessage(`You attack the ${enemy.name} for ${damage} damage!`);
      addMessage(`You attacked ${enemy.name} for ${damage} damage!`, 'damage');

      if (enemy.hp <= 0) {
        enemy.hp = 0;
        enemy.alive = false;
        combat.finished = true;
        combat.result = 'victory';
        state.enemiesDefeated++;
        state.score += enemy.xp * 10;
        gainXP(enemy.xp);
        addCombatMessage(`The ${enemy.name} is defeated! (+${enemy.xp} XP)`);
        addMessage(`${enemy.name} defeated! (+${enemy.xp} XP)`, 'loot');

        // Roll loot
        const loot = rollLoot(state.floor);
        if (loot) {
          const added = addItem(loot);
          if (added) {
            addCombatMessage(`Loot: ${loot.name}!`);
            addMessage(`You found ${loot.name}!`, 'loot');
            state.itemsCollected++;
          }
        }
        return;
      }
      break;
    }

    case 'defend':
      combat.defending = true;
      addCombatMessage('You brace for impact! (DEF doubled this turn)');
      break;

    case 'flee': {
      const fleeChance = 0.4 + (stats.spd * 0.05);
      if (Math.random() < fleeChance) {
        combat.finished = true;
        combat.result = 'fled';
        addCombatMessage('You escaped!');
        addMessage('You fled from combat.', 'normal');
        return;
      }
      addCombatMessage('Failed to flee!');
      break;
    }
  }

  // Enemy turn
  enemyTurn();
}

function enemyTurn() {
  const state = getState();
  const combat = state.combatState;
  const enemy = combat.enemy;
  const { player } = state;
  const stats = getEffectiveStats();

  const playerDef = combat.defending ? stats.def * 2 : stats.def;
  const baseDmg = Math.max(1, enemy.atk - Math.floor(playerDef * 0.5));
  const variance = Math.floor(Math.random() * 3) - 1;
  const damage = Math.max(1, baseDmg + variance);

  player.hp -= damage;
  addCombatMessage(`The ${enemy.name} strikes for ${damage} damage!`);
  addMessage(`${enemy.name} hit you for ${damage} damage.`, 'damage');

  if (player.hp <= 0) {
    player.hp = 0;
    combat.finished = true;
    combat.result = 'death';
    addCombatMessage('You have been slain...');
  }
}

function addCombatMessage(text) {
  const state = getState();
  if (state.combatState) {
    state.combatState.messages.push(text);
  }
}

export function getCombatState() {
  return getState().combatState;
}

export function endCombat() {
  const state = getState();
  state.combatState = null;
  state.gameMode = 'explore';
}
