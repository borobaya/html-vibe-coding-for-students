/**
 * File: article.js
 * Description: Normalises raw Wikipedia API data into a clean article object
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const MAX_EXTRACT_LENGTH = 1000;

/**
 * Trims extract text to the last complete sentence within the limit.
 * @param {string} text - Raw extract
 * @returns {string} Trimmed extract
 */
function formatExtract(text) {
  if (!text || text.length <= MAX_EXTRACT_LENGTH) return text || '';
  const trimmed = text.slice(0, MAX_EXTRACT_LENGTH);
  const lastPeriod = trimmed.lastIndexOf('.');
  return lastPeriod > 0 ? trimmed.slice(0, lastPeriod + 1) : trimmed + '…';
}

/**
 * Extracts the best thumbnail URL from the API response.
 * @param {object} data - Wikipedia API response
 * @returns {string|null} Thumbnail URL or null
 */
function getThumbnailUrl(data) {
  if (data.thumbnail && data.thumbnail.source) return data.thumbnail.source;
  if (data.originalimage && data.originalimage.source) return data.originalimage.source;
  return null;
}

/**
 * Creates a normalised article object from raw API data.
 * @param {object} rawData - Wikipedia random summary API response
 * @returns {object} Normalised article object
 */
export function createArticle(rawData) {
  return {
    id: rawData.pageid,
    title: rawData.title,
    extract: formatExtract(rawData.extract),
    extractHtml: rawData.extract_html || '',
    thumbnail: getThumbnailUrl(rawData),
    pageUrl: rawData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(rawData.title)}`,
    description: rawData.description || '',
    timestamp: Date.now(),
  };
}
