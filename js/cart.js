/* ============================================================
   CART MODULE — localStorage-backed cart logic
   Feature: 008-perfume-static-site
   Contract: specs/008-perfume-static-site/contracts/cart-api.js
   ============================================================ */

const CART_KEY = 'perfume_cart';

function _saveCart(cart) {
  cart.updatedAt = new Date().toISOString();
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
}

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return { items: [], updatedAt: new Date().toISOString() };
  try {
    return JSON.parse(raw);
  } catch {
    return { items: [], updatedAt: new Date().toISOString() };
  }
}

function addToCart(productId, size, quantity) {
  const cart = getCart();
  const product = (window.PRODUCTS || []).find(p => p.id === productId);
  if (!product) return;

  const existing = cart.items.find(
    item => item.productId === productId && item.size === size
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      size,
      price: product.price,
      quantity
    });
  }
  _saveCart(cart);
}

function updateCartItemQuantity(productId, size, newQuantity) {
  const cart = getCart();
  const idx = cart.items.findIndex(
    item => item.productId === productId && item.size === size
  );
  if (idx === -1) return;

  if (newQuantity < 1) {
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].quantity = newQuantity;
  }
  _saveCart(cart);
}

function removeFromCart(productId, size) {
  const cart = getCart();
  cart.items = cart.items.filter(
    item => !(item.productId === productId && item.size === size)
  );
  _saveCart(cart);
}

function getCartItemCount() {
  return getCart().items.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  return getCart().items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  document.dispatchEvent(new CustomEvent('cart:updated', { detail: { items: [] } }));
}
