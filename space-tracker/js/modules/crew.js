/**
 * File: crew.js
 * Description: Renders the ISS crew list panel
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Renders crew members who are aboard the ISS.
 * @param {Array<{name: string, craft: string}>} people - All astronauts in space
 * @param {HTMLElement} container - Target element to populate
 */
export function renderCrew(people, container) {
  const issCrew = people.filter((p) => p.craft === 'ISS');
  container.innerHTML = '';

  if (issCrew.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'crew-panel__empty';
    empty.textContent = 'No crew data available.';
    container.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'crew-panel__list';

  issCrew.forEach((member) => {
    const li = document.createElement('li');
    li.className = 'crew-panel__member';

    const icon = document.createElement('span');
    icon.className = 'crew-panel__icon';
    icon.textContent = '👨‍🚀';
    icon.setAttribute('aria-hidden', 'true');

    const name = document.createElement('span');
    name.className = 'crew-panel__name';
    name.textContent = member.name;

    li.appendChild(icon);
    li.appendChild(name);
    list.appendChild(li);
  });

  container.appendChild(list);
}

/**
 * Shows skeleton placeholders while crew data loads.
 * @param {HTMLElement} container - Target element
 * @param {number} [count=7] - Number of skeleton items
 */
export function showCrewSkeleton(container, count = 7) {
  container.innerHTML = '';

  const list = document.createElement('ul');
  list.className = 'crew-panel__list';
  list.setAttribute('aria-label', 'Loading crew data');

  for (let i = 0; i < count; i++) {
    const li = document.createElement('li');
    li.className = 'crew-panel__member crew-panel__member--skeleton';

    const dot = document.createElement('span');
    dot.className = 'crew-panel__icon crew-panel__icon--skeleton';

    const bar = document.createElement('span');
    bar.className = 'crew-panel__name crew-panel__name--skeleton';

    li.appendChild(dot);
    li.appendChild(bar);
    list.appendChild(li);
  }

  container.appendChild(list);
}
