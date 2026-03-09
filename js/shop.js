/* ============================================================
   SHOP PAGE — Product grid + filter/sort logic
   Feature: 008-perfume-static-site
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  readURLParams();
  renderProducts(window.PRODUCTS || []);
  initFilters();
  initFilterToggle();
  initQuickFilters();
});

/* ── Render ─────────────────────────────────────── */
function renderProducts(productList) {
  const grid    = document.getElementById('products-grid');
  const noRes   = document.getElementById('no-results');
  const counter = document.getElementById('product-count');

  if (!grid) return;

  if (!productList.length) {
    grid.innerHTML = '';
    if (noRes) noRes.style.display = 'block';
    if (counter) counter.textContent = '0 products';
    return;
  }

  if (noRes) noRes.style.display = 'none';
  if (counter) counter.textContent = `${productList.length} product${productList.length !== 1 ? 's' : ''}`;
  grid.innerHTML = productList.map(p => renderProductCard(p)).join('');
}

/* ── Filters ────────────────────────────────────── */
function getActiveFilters() {
  const categories = [...document.querySelectorAll('.filter-cat:checked')].map(el => el.value);
  const scents     = [...document.querySelectorAll('.filter-scent:checked')].map(el => el.value);
  const priceRange = document.querySelector('.filter-price:checked')?.value || 'all';
  const sort       = document.getElementById('filter-sort')?.value || 'featured';
  return { categories, scents, priceRange, sort };
}

function applyFilters() {
  let products = [...(window.PRODUCTS || [])];
  const { categories, scents, priceRange, sort } = getActiveFilters();

  if (categories.length) {
    products = products.filter(p => categories.includes(p.category));
  }
  if (scents.length) {
    products = products.filter(p => scents.includes(p.scentFamily));
  }
  if (priceRange !== 'all') {
    products = products.filter(p => {
      if (priceRange === 'under-50')  return p.price < 50;
      if (priceRange === '50-100')    return p.price >= 50 && p.price <= 100;
      if (priceRange === '100-200')   return p.price > 100 && p.price <= 200;
      if (priceRange === 'over-200')  return p.price > 200;
      return true;
    });
  }

  // Sort
  if (sort === 'price-asc')  products.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
  if (sort === 'rating')     products.sort((a, b) => b.rating - a.rating);
  if (sort === 'featured')   products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  renderProducts(products);
}

function initFilters() {
  document.querySelectorAll('.filter-cat, .filter-scent, .filter-price').forEach(input => {
    input.addEventListener('change', () => {
      // Reset quick filter pills when sidebar is used
      document.querySelectorAll('.quick-filter-btn').forEach(b => b.classList.remove('active'));
      const allBtn = document.querySelector('.quick-filter-btn[data-quick-cat="all"]');
      if (allBtn) allBtn.classList.add('active');
      applyFilters();
    });
  });
  const sortEl = document.getElementById('filter-sort');
  if (sortEl) sortEl.addEventListener('change', applyFilters);

  const clearBtn = document.getElementById('filters-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-cat, .filter-scent').forEach(el => el.checked = false);
      const allPrice = document.getElementById('price-all');
      if (allPrice) allPrice.checked = true;
      if (sortEl) sortEl.value = 'featured';
      renderProducts(window.PRODUCTS || []);
    });
  }
}

function initFilterToggle() {
  const btn     = document.getElementById('filters-toggle-btn');
  const sidebar = document.querySelector('.filters-sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    btn.textContent = open ? 'Hide Filters ▲' : 'Show Filters ▼';
  });
}

/* ── Quick Filter Pills ──────────────────────────── */
function initQuickFilters() {
  const buttons = document.querySelectorAll('.quick-filter-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.quickCat;
      // Also sync the sidebar checkboxes
      document.querySelectorAll('.filter-cat').forEach(cb => cb.checked = false);
      if (cat !== 'all') {
        const cb = document.querySelector(`.filter-cat[value="${cat}"]`);
        if (cb) cb.checked = true;
      }
      applyFilters();
    });
  });
}

/* ── Read URL params (e.g. ?cat=Women) ──────────── */
function readURLParams() {
  const params = new URLSearchParams(window.location.search);
  const cat    = params.get('cat');
  const scent  = params.get('scent');
  if (cat) {
    const cb = document.querySelector(`.filter-cat[value="${cat}"]`);
    if (cb) cb.checked = true;
    // Sync quick filter pill
    const qb = document.querySelector(`.quick-filter-btn[data-quick-cat="${cat}"]`);
    if (qb) {
      document.querySelectorAll('.quick-filter-btn').forEach(b => b.classList.remove('active'));
      qb.classList.add('active');
    }
  }
  if (scent) {
    const cb = document.querySelector(`.filter-scent[value="${scent}"]`);
    if (cb) cb.checked = true;
  }
}
