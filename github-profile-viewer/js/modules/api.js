/**
 * File: api.js
 * Description: GitHub API fetch functions with custom error types
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const BASE_URL = 'https://api.github.com';

/** Custom error for user-not-found (404). */
export class UserNotFoundError extends Error {
  constructor(message = 'User not found.') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

/** Custom error for API rate limiting (403). */
export class RateLimitError extends Error {
  /**
   * @param {string} message
   * @param {Date|null} resetTime - When the rate limit resets
   */
  constructor(message = 'Rate limit exceeded.', resetTime = null) {
    super(message);
    this.name = 'RateLimitError';
    this.resetTime = resetTime;
  }
}

/** Generic API error. */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status - HTTP status code
   */
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Shared response handler — checks status and throws typed errors.
 * @param {Response} response - Fetch Response object
 * @returns {Promise<object|Array>} Parsed JSON
 * @throws {UserNotFoundError|RateLimitError|ApiError}
 */
async function handleApiResponse(response) {
  if (response.ok) {
    return response.json();
  }

  if (response.status === 404) {
    throw new UserNotFoundError('User not found. Check the username and try again.');
  }

  if (response.status === 403) {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const resetHeader = response.headers.get('X-RateLimit-Reset');
    let resetTime = null;

    if (remaining === '0' && resetHeader) {
      resetTime = new Date(Number(resetHeader) * 1000);
    }

    throw new RateLimitError('API rate limit reached.', resetTime);
  }

  throw new ApiError(
    `GitHub API error: ${response.statusText}`,
    response.status
  );
}

/**
 * Fetches a GitHub user's public profile.
 * @param {string} username - GitHub username
 * @returns {Promise<object>} User data object
 * @throws {UserNotFoundError|RateLimitError|ApiError}
 */
export async function fetchUser(username) {
  const url = `${BASE_URL}/users/${encodeURIComponent(username)}`;
  const response = await fetch(url);
  return handleApiResponse(response);
}

/**
 * Fetches a GitHub user's public repositories sorted by stars.
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} Array of repo objects
 * @throws {UserNotFoundError|RateLimitError|ApiError}
 */
export async function fetchRepos(username) {
  const url = `${BASE_URL}/users/${encodeURIComponent(username)}/repos?per_page=30&sort=stars&direction=desc`;
  const response = await fetch(url);
  return handleApiResponse(response);
}
