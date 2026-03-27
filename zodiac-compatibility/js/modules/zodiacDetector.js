/**
 * File: zodiacDetector.js
 * Description: Detects zodiac sign from a birthday month and day
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { ZODIAC_SIGNS } from './zodiacData.js';

/**
 * Validates that month/day is a real date
 * @param {number} month - 1-based month
 * @param {number} day - Day of month
 * @returns {boolean}
 */
export function isValidDate(month, day) {
  if (month < 1 || month > 12 || day < 1) return false;
  const maxDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= maxDays[month - 1];
}

/**
 * Detects the zodiac sign for a given month and day
 * @param {number} month - 1-based month
 * @param {number} day - Day of month
 * @returns {object|null} The matching sign object, or null
 */
export function detectZodiacSign(month, day) {
  if (!isValidDate(month, day)) return null;

  for (const sign of ZODIAC_SIGNS) {
    // Handle Capricorn's year-wrapping dates (Dec 22 – Jan 19)
    if (sign.startMonth > sign.endMonth) {
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) {
        return sign;
      }
    } else {
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) {
        return sign;
      }
    }
  }

  return null;
}
