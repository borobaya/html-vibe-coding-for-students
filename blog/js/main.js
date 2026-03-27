// ── Your blog posts — add, edit, or remove these! ──
const posts = [
  {
    title: 'My First Blog Post',
    date: '27 March 2026',
    tag: 'life',
    body: 'Hello world! This is my very first blog post. I\'m excited to start writing and sharing my thoughts here. Stay tuned for more!',
  },
  {
    title: 'Things I Learned This Week',
    date: '25 March 2026',
    tag: 'school',
    body: 'This week I learned about how the internet works, what HTML tags do, and how to style a page with CSS. It\'s amazing how much you can create with just a few lines of code.',
  },
  {
    title: 'My Favourite Apps Right Now',
    date: '22 March 2026',
    tag: 'tech',
    body: 'Here are the apps I\'ve been loving lately — from music to note-taking, these are the ones I use every single day.',
  },
];

let activeTag = null;

// ── Show posts on the page ──
function renderPosts(filter = '', tag = null) {
  const container = document.getElementById('posts');
  container.innerHTML = '';

  const filtered = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(filter) || p.body.toLowerCase().includes(filter);
    const matchesTag = !tag || p.tag === tag;
    return matchesSearch && matchesTag;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p style="color:#777">No posts found.</p>';
    return;
  }

  for (const post of filtered) {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.innerHTML = `
      <h2>${escapeHTML(post.title)}</h2>
      <div class="post-meta">${escapeHTML(post.date)}<span class="post-tag">${escapeHTML(post.tag)}</span></div>
      <p>${escapeHTML(post.body)}</p>
      <a href="#" class="read-more">Read more →</a>
    `;
    container.appendChild(card);
  }
}

// ── Search ──
document.getElementById('search').addEventListener('input', (e) => {
  renderPosts(e.target.value.toLowerCase(), activeTag);
});

// ── Tag filter ──
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
    link.classList.add('active');
    activeTag = link.dataset.tag || null;
    renderPosts(document.getElementById('search').value.toLowerCase(), activeTag);
  });
});

// ── Safety ──
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Start ──
renderPosts();
