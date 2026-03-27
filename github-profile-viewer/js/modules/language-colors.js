/**
 * File: language-colors.js
 * Description: Maps programming language names to GitHub-standard dot colours
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  R: '#198CE7',
  Lua: '#000080',
  Perl: '#0298c3',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  'Vim Script': '#199f4b',
  'Objective-C': '#438eff',
  Vue: '#41b883',
  SCSS: '#c6538c',
  'Jupyter Notebook': '#DA5B0B',
  Makefile: '#427819',
  Dockerfile: '#384d54',
  PowerShell: '#012456',
  TeX: '#3D6117',
};

/**
 * Returns the colour for a given language name.
 * @param {string|null} language - Programming language name
 * @returns {string} Hex colour string
 */
export function getLanguageColor(language) {
  if (!language) return '#8b949e';
  return languageColors[language] || '#8b949e';
}
