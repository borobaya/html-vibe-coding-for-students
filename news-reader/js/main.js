// ── Your articles — edit or add your own! ──
const articles = [
  {
    title: 'Scientists Discover New Species in Deep Ocean',
    emoji: '🐙',
    category: 'science',
    date: '27 March 2026',
    summary: 'Researchers found a glowing jellyfish-like creature living 4,000 metres below the surface in the Pacific Ocean.',
  },
  {
    title: 'Student Builds App That Helps People Learn Sign Language',
    emoji: '🤟',
    category: 'tech',
    date: '26 March 2026',
    summary: 'A 16-year-old programmer has created a free app that uses your phone\'s camera to teach British Sign Language.',
  },
  {
    title: 'World Leaders Meet to Discuss Climate Action',
    emoji: '🌍',
    category: 'world',
    date: '25 March 2026',
    summary: 'Representatives from 190 countries are meeting this week to agree on new targets for reducing carbon emissions.',
  },
  {
    title: 'Underdog Team Wins National Championship',
    emoji: '🏆',
    category: 'sport',
    date: '24 March 2026',
    summary: 'After years of near-misses, the unranked team pulled off a stunning upset in the final to claim the title.',
  },
  {
    title: 'Mars Rover Finds Evidence of Ancient Water',
    emoji: '🔴',
    category: 'science',
    date: '23 March 2026',
    summary: 'NASA\'s latest rover has collected rock samples that contain mineral deposits only formed in the presence of water.',
  },
  {
    title: 'New Social Media Platform Lets You Share 3D Art',
    emoji: '🎨',
    category: 'tech',
    date: '22 March 2026',
    summary: 'A startup just launched a platform where users can create, share, and explore 3D sculptures in the browser.',
  },
  {
    title: 'Record-Breaking Heatwave Hits Southern Europe',
    emoji: '☀️',
    category: 'world',
    date: '21 March 2026',
    summary: 'Temperatures in Spain and Italy have exceeded 40°C for the fifth day in a row, breaking previous March records.',
  },
  {
    title: 'Teen Swimmer Breaks 50-Year-Old Record',
    emoji: '🏊',
    category: 'sport',
    date: '20 March 2026',
    summary: 'At just 15 years old, the swimmer smashed the 200m freestyle record that had stood since 1976.',
  },
];

let activeCat = 'all';

// ── Render featured article + grid ──
function renderArticles() {
  const featuredEl = document.getElementById('featured');
  const gridEl = document.getElementById('article-grid');

  const visible = activeCat === 'all'
    ? articles
    : articles.filter((a) => a.category === activeCat);

  featuredEl.innerHTML = '';
  gridEl.innerHTML = '';

  if (visible.length === 0) {
    gridEl.innerHTML = '<p style="color:#888;text-align:center;grid-column:1/-1">No articles in this category yet.</p>';
    return;
  }

  // First article is featured
  const featured = visible[0];
  featuredEl.innerHTML = `
    <div class="featured-card">
      <div class="featured-emoji">${featured.emoji}</div>
      <div class="featured-body">
        <span class="cat-label">${escapeHTML(featured.category)}</span>
        <h2>${escapeHTML(featured.title)}</h2>
        <p>${escapeHTML(featured.summary)}</p>
        <p class="date">${escapeHTML(featured.date)}</p>
      </div>
    </div>
  `;

  // Rest go in the grid
  for (let i = 1; i < visible.length; i++) {
    const a = visible[i];
    const card = document.createElement('article');
    card.className = 'article-card';
    card.innerHTML = `
      <div class="article-emoji">${a.emoji}</div>
      <div class="article-body">
        <span class="cat-label">${escapeHTML(a.category)}</span>
        <h3>${escapeHTML(a.title)}</h3>
        <p>${escapeHTML(a.summary)}</p>
        <p class="date">${escapeHTML(a.date)}</p>
      </div>
    `;
    gridEl.appendChild(card);
  }
}

// ── Category filter ──
document.getElementById('categories').addEventListener('click', (e) => {
  if (!e.target.classList.contains('cat-btn')) return;
  document.querySelectorAll('.cat-btn').forEach((b) => b.classList.remove('active'));
  e.target.classList.add('active');
  activeCat = e.target.dataset.cat;
  renderArticles();
});

// ── Safety ──
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Start ──
renderArticles();
