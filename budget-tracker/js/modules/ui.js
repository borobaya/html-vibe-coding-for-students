/**
 * File: ui.js
 * Description: DOM management — form handling, filters, rendering, summary cards
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { createTransaction, deleteTransaction, filterTransactions, sortByDateDesc } from './transactions.js';
import { computeTotals, expensesByCategory, monthlyBreakdown } from './summary.js';
import { getCategoriesByType, getCategoryLabel, getCategoryColour } from './categories.js';
import { saveTransactions } from './storage.js';
import { drawPieChart, drawBarChart, renderPieLegend, renderBarLegend } from './charts.js';

/** @type {Array} */
let transactions = [];

const currentFilters = { type: 'all', category: 'all', from: '', to: '' };

/**
 * Formats a number as GBP currency
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
  return '£' + Math.abs(value).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Populates category dropdown based on selected type
 */
function populateCategoryDropdown() {
  const typeSelect = document.getElementById('tx-type');
  const catSelect = document.getElementById('tx-category');
  if (!typeSelect || !catSelect) return;

  const type = typeSelect.value;
  const categories = getCategoriesByType(type);
  catSelect.innerHTML = '<option value="" disabled selected>Select category</option>';

  for (const cat of categories) {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.label;
    catSelect.appendChild(opt);
  }
}

/**
 * Renders summary cards with totals
 */
function renderSummaryCards() {
  const { totalIncome, totalExpenses, balance } = computeTotals(transactions);

  const incomeEl = document.getElementById('total-income');
  const expenseEl = document.getElementById('total-expenses');
  const balanceEl = document.getElementById('balance');

  if (incomeEl) incomeEl.textContent = formatCurrency(totalIncome);
  if (expenseEl) expenseEl.textContent = formatCurrency(totalExpenses);
  if (balanceEl) {
    balanceEl.textContent = (balance < 0 ? '-' : '') + formatCurrency(balance);
  }
}

/**
 * Renders the filtered transaction list
 */
function renderTransactionList() {
  const tbody = document.getElementById('transaction-tbody');
  const emptyMsg = document.getElementById('empty-msg');
  if (!tbody) return;

  const filtered = sortByDateDesc(filterTransactions(transactions, currentFilters));
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    if (emptyMsg) emptyMsg.hidden = false;
    return;
  }
  if (emptyMsg) emptyMsg.hidden = true;

  for (const t of filtered) {
    const tr = document.createElement('tr');
    const amountClass = t.type === 'income' ? 'amount--income' : 'amount--expense';
    const sign = t.type === 'income' ? '+' : '-';

    const descCell = document.createElement('td');
    descCell.textContent = t.description || '—';
    const catCell = document.createElement('td');
    catCell.textContent = getCategoryLabel(t.category);
    const dateCell = document.createElement('td');
    dateCell.textContent = t.date;
    const amtCell = document.createElement('td');
    amtCell.className = amountClass;
    amtCell.textContent = `${sign}${formatCurrency(t.amount)}`;
    const actCell = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn--danger-sm';
    delBtn.textContent = '✕';
    delBtn.type = 'button';
    delBtn.setAttribute('aria-label', `Delete transaction: ${t.description || getCategoryLabel(t.category)}`);
    delBtn.addEventListener('click', () => handleDelete(t.id));
    actCell.appendChild(delBtn);

    tr.append(dateCell, descCell, catCell, amtCell, actCell);
    tbody.appendChild(tr);
  }
}

/**
 * Renders charts (always uses full unfiltered data)
 */
function renderCharts() {
  const catData = expensesByCategory(transactions);
  const monthData = monthlyBreakdown(transactions);

  drawPieChart('pie-chart', catData);
  renderPieLegend('pie-legend', catData);
  drawBarChart('bar-chart', monthData);
  renderBarLegend('bar-legend');
}

/** Full re-render */
function renderAll() {
  renderSummaryCards();
  renderTransactionList();
  renderCharts();
}

/**
 * Handles form submission
 * @param {Event} e
 */
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) return;

  const type = document.getElementById('tx-type').value;
  const amount = parseFloat(document.getElementById('tx-amount').value);
  const category = document.getElementById('tx-category').value;
  const date = document.getElementById('tx-date').value;
  const description = document.getElementById('tx-description').value;

  if (amount <= 0 || !category) return;

  const tx = createTransaction({ type, amount, category, date, description });
  transactions.push(tx);
  saveTransactions(transactions);
  form.reset();
  // Reset date to today
  document.getElementById('tx-date').value = new Date().toISOString().slice(0, 10);
  populateCategoryDropdown();
  renderAll();
}

/**
 * Handles transaction deletion
 * @param {string} id
 */
function handleDelete(id) {
  transactions = deleteTransaction(transactions, id);
  saveTransactions(transactions);
  renderAll();
}

/**
 * Handles filter changes
 */
function handleFilterChange() {
  const filterCat = document.getElementById('filter-category');
  const filterFrom = document.getElementById('filter-from');
  const filterTo = document.getElementById('filter-to');

  if (filterCat) currentFilters.category = filterCat.value;
  if (filterFrom) currentFilters.from = filterFrom.value;
  if (filterTo) currentFilters.to = filterTo.value;

  renderTransactionList();
}

/**
 * Initialises the UI with loaded transactions
 * @param {Array} loadedTransactions
 */
export function initUI(loadedTransactions) {
  transactions = loadedTransactions;

  // Set default date
  const dateInput = document.getElementById('tx-date');
  if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);

  // Type change → repopulate categories
  const typeSelect = document.getElementById('tx-type');
  typeSelect?.addEventListener('change', populateCategoryDropdown);
  populateCategoryDropdown();

  // Form submit
  document.getElementById('transaction-form')?.addEventListener('submit', handleFormSubmit);

  // Filter buttons (type)
  document.querySelectorAll('.filters__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filters__btn').forEach((b) => {
        b.classList.remove('filters__btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filters__btn--active');
      btn.setAttribute('aria-pressed', 'true');
      currentFilters.type = btn.dataset.filterType;
      renderTransactionList();
    });
  });

  // Other filters
  document.getElementById('filter-category')?.addEventListener('change', handleFilterChange);
  document.getElementById('filter-from')?.addEventListener('change', handleFilterChange);
  document.getElementById('filter-to')?.addEventListener('change', handleFilterChange);

  // Populate filter category dropdown
  const filterCat = document.getElementById('filter-category');
  if (filterCat) {
    filterCat.innerHTML = '<option value="all">All Categories</option>';
    const all = [...getCategoriesByType('income'), ...getCategoriesByType('expense')];
    for (const c of all) {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.label;
      filterCat.appendChild(opt);
    }
  }

  renderAll();
}
