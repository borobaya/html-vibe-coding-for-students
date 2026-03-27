/**
 * File: ui.js
 * Description: DOM rendering for cards, results, counter, dots, and done screen
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/** Cached DOM references */
let els = {};

/**
 * Caches all required DOM elements
 */
export function cacheElements() {
  els = {
    counterText: document.getElementById('counter-text'),
    counterDots: document.getElementById('counter-dots'),
    cardA: document.getElementById('card-a'),
    cardB: document.getElementById('card-b'),
    cardAText: document.getElementById('card-a-text'),
    cardBText: document.getElementById('card-b-text'),
    resultsA: document.getElementById('results-a'),
    resultsB: document.getElementById('results-b'),
    progressA: document.getElementById('progress-a'),
    progressB: document.getElementById('progress-b'),
    percentageA: document.getElementById('percentage-a'),
    percentageB: document.getElementById('percentage-b'),
    votesA: document.getElementById('votes-a'),
    votesB: document.getElementById('votes-b'),
    btnNext: document.getElementById('btn-next'),
    btnReset: document.getElementById('btn-reset'),
    doneScreen: document.getElementById('done-screen'),
    dilemmaSection: document.getElementById('dilemma-section'),
    controls: document.querySelector('.controls'),
    totalAnswered: document.getElementById('total-answered')
  };
}

/**
 * Renders a question onto the cards
 * @param {{ id: string, optionA: string, optionB: string }} question
 * @param {boolean} alreadyVoted
 * @param {{ a: number, b: number }|null} existingVotes
 */
export function renderQuestion(question, alreadyVoted, existingVotes) {
  els.cardAText.textContent = question.optionA;
  els.cardBText.textContent = question.optionB;

  // Reset card states
  els.cardA.classList.remove('card--selected', 'card--dimmed', 'card--voted');
  els.cardB.classList.remove('card--selected', 'card--dimmed', 'card--voted');
  els.resultsA.classList.remove('card__results--visible');
  els.resultsB.classList.remove('card__results--visible');
  els.resultsA.setAttribute('aria-hidden', 'true');
  els.resultsB.setAttribute('aria-hidden', 'true');
  els.progressA.style.width = '0%';
  els.progressB.style.width = '0%';
  els.percentageA.textContent = '0%';
  els.percentageB.textContent = '0%';
  els.votesA.textContent = '';
  els.votesB.textContent = '';

  if (alreadyVoted && existingVotes) {
    els.cardA.classList.add('card--voted');
    els.cardB.classList.add('card--voted');
  }
}

/**
 * Reveals vote results with animated bars
 * @param {{ a: number, b: number }} votes
 * @param {{ a: number, b: number }} percentages
 * @param {'a'|'b'} userChoice
 */
export function showResults(votes, percentages, userChoice) {
  const selectedCard = userChoice === 'a' ? els.cardA : els.cardB;
  const dimmedCard = userChoice === 'a' ? els.cardB : els.cardA;

  selectedCard.classList.add('card--selected');
  dimmedCard.classList.add('card--dimmed');
  els.cardA.classList.add('card--voted');
  els.cardB.classList.add('card--voted');

  // Reveal results after a short delay
  setTimeout(() => {
    els.resultsA.classList.add('card__results--visible');
    els.resultsB.classList.add('card__results--visible');
    els.resultsA.setAttribute('aria-hidden', 'false');
    els.resultsB.setAttribute('aria-hidden', 'false');

    // Animate progress bars
    els.progressA.style.width = `${percentages.a}%`;
    els.progressB.style.width = `${percentages.b}%`;

    // Count up percentages
    animateCountUp(els.percentageA, percentages.a);
    animateCountUp(els.percentageB, percentages.b);

    els.votesA.textContent = `${votes.a} vote${votes.a !== 1 ? 's' : ''}`;
    els.votesB.textContent = `${votes.b} vote${votes.b !== 1 ? 's' : ''}`;
  }, 300);
}

/**
 * Animates a number counting up from 0 to target
 * @param {HTMLElement} el
 * @param {number} target
 */
function animateCountUp(el, target) {
  const duration = 800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(progress * target);
    el.textContent = `${current}%`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

/**
 * Updates the question counter text
 * @param {number} current - 1-based
 * @param {number} total
 */
export function updateCounter(current, total) {
  els.counterText.textContent = `Question ${current} of ${total}`;
}

/**
 * Renders navigation dots below the counter
 * @param {number} total
 * @param {number} currentIndex - 0-based
 * @param {Set<string>} answeredIds
 * @param {Array} orderedQuestions
 */
export function renderDots(total, currentIndex, answeredIds, orderedQuestions) {
  els.counterDots.innerHTML = '';

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'counter__dot';
    if (i === currentIndex) dot.classList.add('counter__dot--active');
    if (answeredIds.has(orderedQuestions[i].id)) dot.classList.add('counter__dot--done');
    els.counterDots.appendChild(dot);
  }
}

/** Shows the completion screen */
export function showDoneScreen() {
  els.doneScreen.classList.add('done-screen--visible');
  els.doneScreen.setAttribute('aria-hidden', 'false');
  els.dilemmaSection.style.display = 'none';
  els.controls.style.display = 'none';
}

/** Hides the completion screen */
export function hideDoneScreen() {
  els.doneScreen.classList.remove('done-screen--visible');
  els.doneScreen.setAttribute('aria-hidden', 'true');
  els.dilemmaSection.style.display = '';
  els.controls.style.display = '';
}

/**
 * Updates the footer answered count
 * @param {number} answeredCount
 */
export function updateFooter(answeredCount) {
  els.totalAnswered.textContent = answeredCount;
}

/**
 * Animates card transition
 * @param {'in'|'out'} direction
 * @returns {Promise<void>}
 */
export function animateCardTransition(direction) {
  return new Promise(resolve => {
    const section = els.dilemmaSection;

    if (direction === 'out') {
      section.style.opacity = '0';
      section.style.transform = 'translateY(-20px)';
      setTimeout(resolve, 300);
    } else {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        section.style.transition = 'opacity 300ms ease, transform 300ms ease';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        setTimeout(resolve, 300);
      });
    }
  });
}

/**
 * Sets the Next button enabled/disabled state
 * @param {boolean} enabled
 */
export function setNextButtonState(enabled) {
  els.btnNext.disabled = !enabled;
}
