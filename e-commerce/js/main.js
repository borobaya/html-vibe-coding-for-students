// ── Products — edit these to stock your shop! ──
const products = [
  { id: 1, name: 'Classic T-Shirt',   price: 18.99, category: 'clothing',    emoji: '👕' },
  { id: 2, name: 'Hoodie',            price: 34.99, category: 'clothing',    emoji: '🧥' },
  { id: 3, name: 'Baseball Cap',      price: 12.99, category: 'accessories', emoji: '🧢' },
  { id: 4, name: 'Sunglasses',        price: 9.99,  category: 'accessories', emoji: '🕶️' },
  { id: 5, name: 'Laptop Sticker',    price: 2.99,  category: 'stickers',    emoji: '💻' },
  { id: 6, name: 'Smiley Sticker',    price: 1.99,  category: 'stickers',    emoji: '😊' },
  { id: 7, name: 'Tote Bag',          price: 14.99, category: 'accessories', emoji: '👜' },
  { id: 8, name: 'Graphic Tee',       price: 22.99, category: 'clothing',    emoji: '👚' },
];

const cart = [];
let activeCategory = 'all';

// ── Render products ──
function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';

  const visible = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  for (const product of visible) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">${product.emoji}</div>
      <div class="product-info">
        <h3>${escapeHTML(product.name)}</h3>
        <p class="product-category">${escapeHTML(product.category)}</p>
        <p class="product-price">£${product.price.toFixed(2)}</p>
        <button class="add-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  }
}

// ── Cart ──
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    cart.push({ ...product });
    updateCart();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  countEl.textContent = cart.length;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    totalEl.textContent = '0.00';
    return;
  }

  itemsEl.innerHTML = '';
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <span class="cart-item-name">${item.emoji} ${escapeHTML(item.name)}</span><br>
        <span class="cart-item-price">£${item.price.toFixed(2)}</span>
      </div>
      <button class="remove-btn" data-index="${i}">✕</button>
    `;
    itemsEl.appendChild(row);
  });

  totalEl.textContent = total.toFixed(2);
}

// ── Events ──
document.getElementById('product-grid').addEventListener('click', (e) => {
  if (e.target.classList.contains('add-btn')) {
    addToCart(Number(e.target.dataset.id));
  }
});

document.getElementById('cart-items').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-btn')) {
    removeFromCart(Number(e.target.dataset.index));
  }
});

document.getElementById('cart-icon').addEventListener('click', () => {
  document.getElementById('cart-overlay').hidden = false;
});

document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart-overlay').hidden = true;
});

document.getElementById('cart-overlay').addEventListener('click', (e) => {
  if (e.target.id === 'cart-overlay') {
    document.getElementById('cart-overlay').hidden = true;
  }
});

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) return;
  alert('Thanks for your order! 🎉');
  cart.length = 0;
  updateCart();
  document.getElementById('cart-overlay').hidden = true;
});

document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category;
    renderProducts();
  });
});

// ── Safety ──
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Start ──
renderProducts();
