/* ============================================================
   CART PAGE — Render items, quantity controls, totals
   Feature: 008-perfume-static-site
   ============================================================ */

document.addEventListener('DOMContentLoaded', renderCartItems);
document.addEventListener('cart:updated', renderCartItems);

function renderCartItems() {
  const cart    = getCart();
  const items   = cart.items;
  const listEl  = document.getElementById('cart-items-list');
  const emptyEl = document.getElementById('cart-empty');
  const wrapEl  = document.getElementById('cart-items-wrapper');
  const countEl = document.getElementById('cart-count');

  if (!listEl) return;

  const totalItems = getCartItemCount();
  if (countEl) countEl.textContent = totalItems;

  if (!items.length) {
    if (emptyEl) emptyEl.style.display = 'flex';
    if (wrapEl)  wrapEl.style.display  = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (wrapEl)  wrapEl.style.display  = 'block';

  // Find product brand for display
  function getBrand(productId) {
    const p = (window.PRODUCTS || []).find(p => p.id === productId);
    return p ? p.brand : '';
  }

  listEl.innerHTML = items.map(item => `
    <div class="cart-item"
      data-product-id="${item.productId}"
      data-size="${item.size}"
    >
      <img
        class="cart-item-img"
        src="${item.image}"
        alt="${item.name}"
        onerror="this.src='assets/images/placeholder.svg'"
      />
      <div class="cart-item-info">
        <div class="cart-item-brand">${getBrand(item.productId)}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">Size: ${item.size}</div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn-sm btn-qty-minus" aria-label="Decrease quantity">−</button>
            <input
              class="qty-input-sm"
              type="number"
              value="${item.quantity}"
              min="1"
              max="20"
              aria-label="Quantity for ${item.name}"
            />
            <button class="qty-btn-sm btn-qty-plus" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn-remove" aria-label="Remove ${item.name} from cart">Remove</button>
        </div>
      </div>
      <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

  updateSummary();
  bindCartControls();
}

function updateSummary() {
  const subtotal = getCartSubtotal();
  const el = document.getElementById('summary-subtotal');
  const totEl = document.getElementById('summary-total');
  if (el) el.textContent = formatPrice(subtotal);
  if (totEl) totEl.textContent = formatPrice(subtotal);
}

function bindCartControls() {
  const list = document.getElementById('cart-items-list');
  if (!list) return;

  list.addEventListener('click', e => {
    const item = e.target.closest('.cart-item');
    if (!item) return;
    const productId = parseInt(item.dataset.productId, 10);
    const size = item.dataset.size;
    const input = item.querySelector('.qty-input-sm');
    const currentQty = parseInt(input?.value || '1', 10);

    if (e.target.matches('.btn-qty-minus')) {
      updateCartItemQuantity(productId, size, currentQty - 1);
    } else if (e.target.matches('.btn-qty-plus')) {
      updateCartItemQuantity(productId, size, currentQty + 1);
    } else if (e.target.matches('.btn-remove')) {
      removeFromCart(productId, size);
      showToast('Item removed from cart.', 'info');
    }
  });

  list.addEventListener('change', e => {
    if (!e.target.matches('.qty-input-sm')) return;
    const item = e.target.closest('.cart-item');
    if (!item) return;
    const productId = parseInt(item.dataset.productId, 10);
    const size = item.dataset.size;
    const newQty = parseInt(e.target.value, 10);
    if (newQty >= 1) updateCartItemQuantity(productId, size, newQty);
  });
}

// Checkout demo alert
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-checkout');
  if (btn) {
    btn.addEventListener('click', () => {
      showToast('This is a demo store. Checkout is not available.', 'info');
    });
  }
});
