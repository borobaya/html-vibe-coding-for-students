/**
 * File: router.js
 * Description: Simple view router — switches between intro, quiz, and result views
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export class Router {
  constructor() {
    this.views = {
      intro: document.getElementById('view-intro'),
      quiz: document.getElementById('view-quiz'),
      result: document.getElementById('view-result')
    };
    this.currentView = 'intro';
  }

  /**
   * Transitions to a named view
   * @param {'intro'|'quiz'|'result'} viewName
   */
  showView(viewName) {
    // Exit current views
    for (const [name, el] of Object.entries(this.views)) {
      if (name !== viewName) {
        el.classList.remove('active');
        el.classList.add('exit');
        el.setAttribute('hidden', '');

        // Clean up exit class after animation
        const exitEl = el;
        setTimeout(() => {
          exitEl.classList.remove('exit');
        }, 600);
      }
    }

    // Enter target view
    const target = this.views[viewName];
    target.removeAttribute('hidden');

    // Force reflow so CSS transition triggers
    void target.offsetHeight;

    target.classList.add('active');
    this.currentView = viewName;
  }
}
