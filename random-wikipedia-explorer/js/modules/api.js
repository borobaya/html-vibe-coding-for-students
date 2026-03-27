/**
 * File: api.js
 * Description: Fetches random Wikipedia articles via the REST API
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const API_URL = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
const MAX_RETRIES = 3;
const MIN_EXTRACT_LENGTH = 50;

/**
 * Fetches a random Wikipedia article summary.
 * Auto-retries on disambiguation pages or very short stubs.
 * @returns {Promise<object>} Raw API response data
 * @throws {Error} If all retries fail or network error occurs
 */
export async function fetchRandomArticle() {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    attempts++;

    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Skip disambiguation pages and very short stubs
    if (data.type === 'disambiguation') continue;
    if (data.extract && data.extract.length < MIN_EXTRACT_LENGTH) continue;

    return data;
  }

  // If all retries exhausted, fetch one more time without filtering
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Wikipedia API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
