/* ============================================================
   UTILITIES — renderProductCard, formatPrice, renderStars
   Feature: 008-perfume-static-site
   ============================================================ */

function formatPrice(price) {
  return '$' + price.toFixed(2);
}

function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += `<span class="star${i <= Math.round(rating) ? '' : ' empty'}">★</span>`;
  }
  return stars;
}

/* ── Wishlist helpers ───────────────────────────── */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
}

function saveWishlist(list) {
  localStorage.setItem('wishlist', JSON.stringify(list));
}

function toggleWishlist(productId) {
  const list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx === -1) {
    list.push(productId);
  } else {
    list.splice(idx, 1);
  }
  saveWishlist(list);
  // Update all heart buttons for this product
  document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`).forEach(btn => {
    const wished = list.includes(productId);
    btn.textContent = wished ? '❤️' : '🤍';
    btn.setAttribute('aria-pressed', wished);
    btn.classList.toggle('wished', wished);
  });
}

/* ── Render product card with wishlist + new-arrival badge ── */
function renderProductCard(product, isNewArrival = false) {
  const defaultSize = product.sizes[0] || '';
  const wishlist = getWishlist();
  const wished = wishlist.includes(product.id);
  return `
    <a class="product-card" href="product.html?id=${product.id}" aria-label="${product.name}">
      <div class="product-card-img-wrap">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.src='assets/images/placeholder.svg'"
        />
        ${product.featured ? '<span class="product-card-badge">Featured</span>' : ''}
        ${isNewArrival ? '<span class="product-card-badge product-card-badge--new">New Arrival</span>' : ''}
        ${!product.featured && !isNewArrival && product.isBestSeller ? '<span class="product-card-badge product-card-badge--hot">Best Seller</span>' : ''}
        <button
          class="wishlist-btn${wished ? ' wished' : ''}"
          data-id="${product.id}"
          aria-label="Toggle wishlist for ${product.name}"
          aria-pressed="${wished}"
          onclick="event.preventDefault(); event.stopPropagation(); toggleWishlist(${product.id})"
        >${wished ? '❤️' : '🤍'}</button>
      </div>
      <div class="product-card-body">
        <div class="product-card-brand">${product.brand}</div>
        <div class="product-card-name">${product.name}</div>
        <div class="product-card-meta">
          <div class="star-rating" aria-label="Rating: ${product.rating} out of 5">
            ${renderStars(product.rating)}
          </div>
          <span class="review-count">(${product.reviewCount})</span>
        </div>
        <div class="product-card-footer">
          <span class="product-card-price">${formatPrice(product.price)}</span>
          <button
            class="btn-add-cart"
            data-product-id="${product.id}"
            data-size="${defaultSize}"
            onclick="event.preventDefault(); event.stopPropagation(); handleAddToCartAnimated(this, ${product.id}, '${defaultSize}', 1)"
            aria-label="Add ${product.name} to cart"
          >Add to Cart</button>
        </div>
      </div>
    </a>
  `;
}

function handleAddToCart(productId, size, quantity) {
  addToCart(productId, size, quantity);
  const product = (window.PRODUCTS || []).find(p => p.id === productId);
  const name = product ? product.name : 'Item';
  showToast(`${name} added to cart!`, 'success');
}

function handleAddToCartAnimated(btn, productId, size, quantity) {
  addToCart(productId, size, quantity);
  const product = (window.PRODUCTS || []).find(p => p.id === productId);
  const name = product ? product.name : 'Item';

  // Checkmark animation
  const original = btn.textContent;
  btn.textContent = '✓ Added';
  btn.style.background = 'var(--color-success)';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.disabled = false;
  }, 1500);

  showToast(`${name} added to cart!`, 'success');
}
