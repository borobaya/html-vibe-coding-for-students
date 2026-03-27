/**
 * File: ui.js
 * Description: DOM rendering — profile, repos, error, skeleton, and formatting
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getLanguageColor } from './language-colors.js';

/* ── Cached DOM references ────────────────────────────── */
const skeletonContainer = document.getElementById('skeleton-container');
const profileContainer = document.getElementById('profile-container');
const reposContainer = document.getElementById('repos-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const reposGrid = document.getElementById('repos-grid');

const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileUsername = document.getElementById('profile-username');
const profileBio = document.getElementById('profile-bio');
const profileMeta = document.getElementById('profile-meta');
const profileJoined = document.getElementById('profile-joined');
const statRepos = document.getElementById('stat-repos');
const statFollowers = document.getElementById('stat-followers');
const statFollowing = document.getElementById('stat-following');

/** Shows the skeleton loader and hides content sections. */
export function showSkeleton() {
  skeletonContainer.hidden = false;
  profileContainer.hidden = true;
  reposContainer.hidden = true;
  errorContainer.hidden = true;
}

/** Hides the skeleton loader. */
export function hideSkeleton() {
  skeletonContainer.hidden = true;
}

/** Hides profile, repos, and error. Clears the repo grid. */
export function clearResults() {
  profileContainer.hidden = true;
  reposContainer.hidden = true;
  errorContainer.hidden = true;
  while (reposGrid.firstChild) {
    reposGrid.removeChild(reposGrid.firstChild);
  }
}

/**
 * Shows an inline error message.
 * @param {string} message - Error text
 * @param {string} [type='error'] - 'error' or 'rate-limit'
 */
export function showError(message, type = 'error') {
  errorMessage.textContent = message;
  errorContainer.classList.toggle('error--warning', type === 'rate-limit');
  errorContainer.hidden = false;
}

/**
 * Formats a number for compact display (1.2k, 1.1M).
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
function formatNumber(num) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

/**
 * Formats an ISO date string to readable month + year.
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} e.g. "Jan 2015"
 */
function formatDate(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
  }).format(date);
}

/**
 * Renders the user profile card.
 * @param {object} user - GitHub user API response object
 */
export function renderProfile(user) {
  const displayName = user.name || user.login;
  profileAvatar.src = user.avatar_url;
  profileAvatar.alt = `${displayName}'s avatar`;
  profileName.textContent = displayName;
  profileUsername.textContent = `@${user.login}`;
  profileUsername.href = user.html_url;
  profileBio.textContent = user.bio || '';

  // Build meta items
  while (profileMeta.firstChild) {
    profileMeta.removeChild(profileMeta.firstChild);
  }

  const metaItems = [
    { icon: '📍', value: user.location },
    { icon: '🏢', value: user.company },
    { icon: '🔗', value: user.blog },
  ];

  for (const item of metaItems) {
    if (!item.value) continue;
    const span = document.createElement('span');
    span.className = 'profile__meta-item';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'profile__meta-icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.textContent = item.icon;

    span.appendChild(iconSpan);

    if (item.icon === '🔗' && item.value) {
      const link = document.createElement('a');
      const url = item.value.startsWith('http') ? item.value : `https://${item.value}`;
      link.href = url;
      link.textContent = item.value;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      span.appendChild(link);
    } else {
      span.appendChild(document.createTextNode(item.value));
    }

    profileMeta.appendChild(span);
  }

  // Stats
  statRepos.textContent = formatNumber(user.public_repos);
  statFollowers.textContent = formatNumber(user.followers);
  statFollowing.textContent = formatNumber(user.following);

  // Joined date
  profileJoined.textContent = `📅 Joined: ${formatDate(user.created_at)}`;

  profileContainer.hidden = false;
}

/**
 * Renders the repository cards grid.
 * @param {Array} repos - Array of GitHub repo objects
 */
export function renderRepos(repos) {
  while (reposGrid.firstChild) {
    reposGrid.removeChild(reposGrid.firstChild);
  }

  if (!repos.length) {
    const msg = document.createElement('p');
    msg.textContent = 'No public repositories.';
    msg.style.color = 'var(--color-text-secondary)';
    reposGrid.appendChild(msg);
    reposContainer.hidden = false;
    return;
  }

  for (const repo of repos) {
    reposGrid.appendChild(createRepoCard(repo));
  }
  reposContainer.hidden = false;
}

/**
 * Creates a single repo card element.
 * @param {object} repo - GitHub repo object
 * @returns {HTMLElement} Repo card div
 */
function createRepoCard(repo) {
  const card = document.createElement('div');
  card.className = 'repo-card';

  // Name link
  const nameLink = document.createElement('a');
  nameLink.className = 'repo-card__name';
  nameLink.textContent = repo.name;
  nameLink.href = repo.html_url;
  nameLink.target = '_blank';
  nameLink.rel = 'noopener noreferrer';
  card.appendChild(nameLink);

  // Description
  const desc = document.createElement('p');
  desc.className = 'repo-card__description';
  desc.textContent = repo.description || 'No description';
  card.appendChild(desc);

  // Footer: language, stars, forks
  const footer = document.createElement('div');
  footer.className = 'repo-card__footer';

  if (repo.language) {
    const langSpan = document.createElement('span');
    langSpan.className = 'repo-card__language';

    const dot = document.createElement('span');
    dot.className = 'repo-card__language-dot';
    dot.style.backgroundColor = getLanguageColor(repo.language);

    langSpan.appendChild(dot);
    langSpan.appendChild(document.createTextNode(` ${repo.language}`));
    footer.appendChild(langSpan);
  }

  // Stars
  const stars = document.createElement('span');
  stars.className = 'repo-card__stars';
  stars.textContent = `⭐ ${formatNumber(repo.stargazers_count)}`;
  footer.appendChild(stars);

  // Forks
  const forks = document.createElement('span');
  forks.className = 'repo-card__forks';
  forks.textContent = `🍴 ${formatNumber(repo.forks_count)}`;
  footer.appendChild(forks);

  card.appendChild(footer);
  return card;
}
