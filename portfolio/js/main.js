// ── Your projects — edit these to show off your work! ──
const myProjects = [
  {
    title: 'My First Website',
    description: 'A simple page I built while learning HTML and CSS.',
    link: '#'
  },
  {
    title: 'Cool Quiz',
    description: 'A fun personality quiz I made with JavaScript.',
    link: '#'
  },
  {
    title: 'Coming Soon…',
    description: 'I\'m working on something new — watch this space!',
    link: '#'
  }
];

// ── Show project cards on the page ──
function showProjects() {
  const grid = document.getElementById('project-grid');

  for (const project of myProjects) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <h3>${escapeHTML(project.title)}</h3>
      <p>${escapeHTML(project.description)}</p>
      <a href="${escapeHTML(project.link)}">View →</a>
    `;
    grid.appendChild(card);
  }
}

// ── Handle the contact form ──
function setupForm() {
  const form = document.getElementById('contact-form');
  const response = document.getElementById('form-response');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    response.textContent = 'Thanks for your message! 🎉';
    response.hidden = false;
    form.reset();
  });
}

// ── Keep things safe ──
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Start ──
showProjects();
setupForm();
