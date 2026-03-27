/**
 * File: date-utils.js
 * Description: Date helper functions — formatting, parsing, ranges
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Returns today's date as YYYY-MM-DD string
 * @returns {string}
 */
export function today() {
  return formatDate(new Date());
}

/**
 * Formats a Date object to YYYY-MM-DD
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parses a YYYY-MM-DD string into a Date at midnight local time
 * @param {string} dateStr
 * @returns {Date}
 */
export function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Returns the number of days between two date strings
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function daysBetween(a, b) {
  const msPerDay = 86400000;
  const da = parseDate(a);
  const db = parseDate(b);
  return Math.round(Math.abs(da - db) / msPerDay);
}

/**
 * Gets Monday-based day of week (0=Mon, 6=Sun)
 * @param {Date} date
 * @returns {number}
 */
export function getDayOfWeek(date) {
  return (date.getDay() + 6) % 7;
}

/**
 * Gets the Monday on or before a given date
 * @param {Date} date
 * @returns {Date}
 */
export function getWeekStart(date) {
  const d = new Date(date);
  const dow = getDayOfWeek(d);
  d.setDate(d.getDate() - dow);
  return d;
}

/**
 * Returns a shortened month name
 * @param {number} idx - 0-11
 * @returns {string}
 */
export function getMonthName(idx) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[idx];
}

/**
 * Adds n days to a date string
 * @param {string} dateStr
 * @param {number} n
 * @returns {string}
 */
export function addDays(dateStr, n) {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + n);
  return formatDate(d);
}

/**
 * Generates an array of YYYY-MM-DD strings from start to end inclusive
 * @param {string} start
 * @param {string} end
 * @returns {string[]}
 */
export function dateRange(start, end) {
  const dates = [];
  let current = start;
  while (current <= end) {
    dates.push(current);
    current = addDays(current, 1);
  }
  return dates;
}
