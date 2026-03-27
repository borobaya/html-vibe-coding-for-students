// ── Your recipes — add your own! ──
const recipes = [
  {
    name: 'Scrambled Eggs on Toast',
    emoji: '🍳',
    tag: 'breakfast',
    time: '10 mins',
    ingredients: ['2 eggs', '1 slice of bread', 'Butter', 'Salt & pepper'],
    steps: ['Crack eggs into a bowl and whisk.', 'Melt butter in a pan over medium heat.', 'Pour in eggs and stir gently until just set.', 'Toast the bread and serve the eggs on top.'],
  },
  {
    name: 'Cheese Toastie',
    emoji: '🧀',
    tag: 'lunch',
    time: '8 mins',
    ingredients: ['2 slices of bread', 'Grated cheese', 'Butter'],
    steps: ['Butter the outside of both slices of bread.', 'Put cheese between the slices (butter side out).', 'Cook in a hot pan for 2–3 mins each side until golden and melty.'],
  },
  {
    name: 'Spaghetti Bolognese',
    emoji: '🍝',
    tag: 'dinner',
    time: '35 mins',
    ingredients: ['200g spaghetti', '250g mince', '1 tin chopped tomatoes', '1 onion, diced', '2 cloves garlic', 'Olive oil', 'Salt, pepper & herbs'],
    steps: ['Cook spaghetti according to the packet.', 'Fry onion and garlic in olive oil until soft.', 'Add mince and cook until browned.', 'Stir in chopped tomatoes, season, and simmer for 15 mins.', 'Serve sauce over spaghetti.'],
  },
  {
    name: 'Banana Smoothie',
    emoji: '🍌',
    tag: 'snack',
    time: '5 mins',
    ingredients: ['1 banana', '200ml milk', '1 tbsp honey', 'Ice cubes'],
    steps: ['Peel and chop the banana.', 'Add everything to a blender.', 'Blend until smooth and pour into a glass.'],
  },
  {
    name: 'Pancakes',
    emoji: '🥞',
    tag: 'breakfast',
    time: '20 mins',
    ingredients: ['150g flour', '1 egg', '300ml milk', 'Pinch of salt', 'Butter for frying'],
    steps: ['Mix flour, egg, milk and salt into a smooth batter.', 'Heat butter in a pan.', 'Pour a thin layer of batter and cook 1–2 mins each side.', 'Serve with your favourite toppings!'],
  },
  {
    name: 'Nachos',
    emoji: '🌮',
    tag: 'snack',
    time: '15 mins',
    ingredients: ['Tortilla chips', 'Grated cheese', 'Salsa', 'Sour cream', 'Jalapeños (optional)'],
    steps: ['Spread tortilla chips on a baking tray.', 'Top with grated cheese and jalapeños.', 'Grill for 3–5 mins until cheese is melted.', 'Serve with salsa and sour cream.'],
  },
];

let activeTag = 'all';

// ── Render recipe cards ──
function renderRecipes(filter = '') {
  const grid = document.getElementById('recipe-grid');
  grid.innerHTML = '';

  const visible = recipes.filter((r) => {
    const matchesTag = activeTag === 'all' || r.tag === activeTag;
    const matchesSearch = r.name.toLowerCase().includes(filter);
    return matchesTag && matchesSearch;
  });

  if (visible.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1">No recipes found.</p>';
    return;
  }

  for (const recipe of visible) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <div class="recipe-emoji">${recipe.emoji}</div>
      <div class="recipe-info">
        <h3>${escapeHTML(recipe.name)}</h3>
        <p class="recipe-time">⏱ ${escapeHTML(recipe.time)}</p>
        <span class="recipe-tag-label">${escapeHTML(recipe.tag)}</span>
      </div>
    `;
    card.addEventListener('click', () => openRecipe(recipe));
    grid.appendChild(card);
  }
}

// ── Show full recipe in modal ──
function openRecipe(recipe) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modal-content');

  const ingredientList = recipe.ingredients.map((i) => `<li>${escapeHTML(i)}</li>`).join('');
  const stepList = recipe.steps.map((s) => `<li>${escapeHTML(s)}</li>`).join('');

  content.innerHTML = `
    <div class="recipe-emoji">${recipe.emoji}</div>
    <h2>${escapeHTML(recipe.name)}</h2>
    <p class="recipe-time">⏱ ${escapeHTML(recipe.time)}</p>
    <h4>Ingredients</h4>
    <ul>${ingredientList}</ul>
    <h4>Steps</h4>
    <ol>${stepList}</ol>
  `;

  modal.hidden = false;
}

// ── Events ──
document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('modal').hidden = true;
});

document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    document.getElementById('modal').hidden = true;
  }
});

document.getElementById('search').addEventListener('input', (e) => {
  renderRecipes(e.target.value.toLowerCase());
});

document.getElementById('tags').addEventListener('click', (e) => {
  if (!e.target.classList.contains('tag')) return;
  document.querySelectorAll('.tag').forEach((t) => t.classList.remove('active'));
  e.target.classList.add('active');
  activeTag = e.target.dataset.tag;
  renderRecipes(document.getElementById('search').value.toLowerCase());
});

// ── Safety ──
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Start ──
renderRecipes();
