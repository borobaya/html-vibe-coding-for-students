/**
 * File: main.js
 * Description: Entry point — loads transactions and initialises the UI
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { loadTransactions } from './modules/storage.js';
import { initUI } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const transactions = loadTransactions();
  initUI(transactions);
});
