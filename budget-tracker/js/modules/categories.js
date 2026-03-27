/**
 * File: categories.js
 * Description: Income and expense category definitions with colours
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export const CATEGORIES = {
  income: [
    { id: 'salary', label: 'Salary', colour: '#10b981' },
    { id: 'freelance', label: 'Freelance', colour: '#06b6d4' },
    { id: 'investments', label: 'Investments', colour: '#8b5cf6' },
    { id: 'gifts', label: 'Gifts', colour: '#f59e0b' },
    { id: 'other-income', label: 'Other', colour: '#6b7280' },
  ],
  expense: [
    { id: 'food', label: 'Food & Drink', colour: '#ef4444' },
    { id: 'transport', label: 'Transport', colour: '#f97316' },
    { id: 'entertainment', label: 'Entertainment', colour: '#a855f7' },
    { id: 'shopping', label: 'Shopping', colour: '#ec4899' },
    { id: 'bills', label: 'Bills', colour: '#3b82f6' },
    { id: 'health', label: 'Health', colour: '#14b8a6' },
    { id: 'education', label: 'Education', colour: '#6366f1' },
    { id: 'other-expense', label: 'Other', colour: '#9ca3af' },
  ],
};

const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];

/**
 * Returns the colour for a category ID
 * @param {string} id
 * @returns {string}
 */
export function getCategoryColour(id) {
  const cat = allCategories.find((c) => c.id === id);
  return cat ? cat.colour : '#6b7280';
}

/**
 * Returns the label for a category ID
 * @param {string} id
 * @returns {string}
 */
export function getCategoryLabel(id) {
  const cat = allCategories.find((c) => c.id === id);
  return cat ? cat.label : id;
}

/**
 * Returns categories for a given type
 * @param {'income'|'expense'} type
 * @returns {Array<{ id: string, label: string, colour: string }>}
 */
export function getCategoriesByType(type) {
  return CATEGORIES[type] || [];
}
