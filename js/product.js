/* ============================================================
   PRODUCT DETAIL PAGE
   Feature: 008-perfume-static-site
   ============================================================ */

let selectedSize = '';
let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const product = (window.PRODUCTS || []).find(p => p.id === id);
  if (!product) { window.location.href = 'shop.html'; return; }
  currentProduct = product;
  window._currentProductId = product.id;
  selectedSize = product.sizes[0] || '';
  populatePage(product);
  renderThumbnails(product);
  renderSizes(product);
  renderNotes(product);
  renderProfile(product);
  renderReviews(product);
  renderRelated(product);
  initQtyControls();
  initAddToCart(product);
  updateWishlistBtn(product.id);
});

function populatePage(p) {
  document.title = `${p.name} | Scent Luxe`;
  setText('detail-brand', p.brand);
  setText('detail-name', p.name);
  setText('detail-price', formatPrice(p.price));
  setText('detail-desc', p.description);
  setText('detail-rating-num', p.rating.toFixed(1));
  setText('detail-reviews', `(${p.reviewCount} reviews)`);
  setText('detail-category', p.category);
  setText('bc-product-name', p.name);
  const starsEl = document.getElementById('detail-stars');
  if (starsEl) starsEl.innerHTML = renderStars(p.rating);
  const tagsEl = document.getElementById('detail-tags');
  if (tagsEl) tagsEl.innerHTML = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  const badgeEl = document.getElementById('scent-family-badge');
  if (badgeEl) badgeEl.textContent = `${p.scentFamily} Fragrance`;
  const storyEl = document.getElementById('story-box-text');
  if (storyEl && p.story) storyEl.textContent = p.story;
  const storyBox = document.getElementById('product-story-box');
  if (storyBox && !p.story) storyBox.style.display = 'none';
  const mainImg = document.getElementById('main-img');
  if (mainImg) {
    mainImg.src = p.image;
    mainImg.alt = p.name;
    mainImg.onerror = () => { mainImg.src = 'assets/images/placeholder.svg'; };
  }
  // Big rating
  const bigRating = document.getElementById('reviews-big-rating');
  if (bigRating) bigRating.textContent = p.rating.toFixed(1);
  const bigStars = document.getElementById('reviews-stars-big');
  if (bigStars) bigStars.innerHTML = renderStars(p.rating);
  const totalReviews = document.getElementById('reviews-total');
  if (totalReviews) totalReviews.textContent = `Based on ${p.reviewCount} reviews`;
}

function renderThumbnails(p) {
  const strip = document.getElementById('thumbnail-strip');
  if (!strip) return;
  // Use the product's own image + 3 slightly different crops
  const thumbUrls = [
    p.image,
    p.image.includes('unsplash') ? p.image.replace('w=400&h=500', 'w=400&h=500&crop=top') : p.image + '&v=2',
    p.image.includes('unsplash') ? p.image.replace('w=400&h=500', 'w=400&h=500&crop=center') : p.image + '&v=3',
    p.image.includes('unsplash') ? p.image.replace('w=400&h=500', 'w=400&h=500&crop=bottom') : p.image + '&v=4',
  ];
  strip.innerHTML = thumbUrls.map((url, i) => `
    <button class="thumb-btn${i===0?' active':''}" data-src="${url}" aria-label="View image ${i+1}">
      <img src="${url}" alt="${p.name} view ${i+1}" onerror="this.src='assets/images/placeholder.svg'" />
    </button>
  `).join('');
  strip.addEventListener('click', e => {
    const btn = e.target.closest('.thumb-btn');
    if (!btn) return;
    const mainImg = document.getElementById('main-img');
    if (mainImg) { mainImg.style.opacity='0.5'; mainImg.src=btn.dataset.src; mainImg.onload=()=>{mainImg.style.opacity='1';}; }
    strip.querySelectorAll('.thumb-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
}

function renderSizes(p) {
  const container = document.getElementById('size-options');
  if (!container) return;
  container.innerHTML = p.sizes.map((size,i) => `
    <button class="size-btn${i===0?' selected':''}" data-size="${size}" aria-pressed="${i===0}">${size}</button>
  `).join('');
  container.addEventListener('click', e => {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;
    container.querySelectorAll('.size-btn').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});
    btn.classList.add('selected'); btn.setAttribute('aria-pressed','true');
    selectedSize = btn.dataset.size;
  });
}

function renderNotes(p) {
  if (!p.notes) { const s = document.getElementById('notes-section'); if(s) s.style.display='none'; return; }
  const render = (id, notes) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = (notes||[]).map(n=>`<span class="note-tag">${n}</span>`).join('');
  };
  render('notes-top', p.notes.top);
  render('notes-heart', p.notes.heart);
  render('notes-base', p.notes.base);
}

function renderProfile(p) {
  const s = document.getElementById('profile-section');
  if (!p.longevity) { if(s) s.style.display='none'; return; }
  setText('profile-longevity', p.longevity || '—');
  setText('profile-sillage', p.sillage || '—');
  const seasonEl = document.getElementById('profile-season');
  if (seasonEl) seasonEl.textContent = (p.season||[]).join(', ') || '—';
  const occEl = document.getElementById('profile-occasion');
  if (occEl) occEl.textContent = (p.occasion||[]).join(', ') || '—';
}

function renderReviews(p) {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;
  const reviews = generateReviews(p);
  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-card-header">
        <div style="display:flex;align-items:center;gap:var(--space-md)">
          <div class="review-avatar">${r.name[0]}</div>
          <div class="review-author">
            <div class="review-name">${r.name}</div>
            <div class="review-location">${r.location}</div>
          </div>
        </div>
        <div class="review-stars">${'★'.repeat(r.stars)}</div>
      </div>
      <div class="review-title">${r.title}</div>
      <p class="review-body">"${r.body}"</p>
      <div class="review-verified">✓ Verified Purchase · ${r.date}</div>
    </div>
  `).join('');
}

function generateReviews(p) {
  const pool = [
    {name:"Sophia Laurent",location:"Paris, France",stars:5,title:"Absolutely divine",body:`This is the most beautiful fragrance I have ever worn. ${p.name} is poetry in a bottle — complex, luxurious, and impossible to forget. I receive compliments every single time.`,date:"March 2026"},
    {name:"James Whitmore",location:"London, UK",stars:5,title:"My signature scent",body:`I have tried hundreds of fragrances over the years and ${p.name} is the one I keep returning to. The longevity is outstanding and the sillage is perfectly balanced.`,date:"February 2026"},
    {name:"Aisha Khalid",location:"Dubai, UAE",stars:5,title:"Worth every penny",body:`Luxury in every sense. ${p.name} opens beautifully and the dry-down is even better. The packaging alone made me feel like I was opening a gift from the finest parfumeur in Paris.`,date:"January 2026"},
    {name:"Marco Rossi",location:"Milan, Italy",stars:4,title:"Sophisticated and unique",body:`A truly refined scent. ${p.name} is elegant without being boring — it has character and depth that I haven't found elsewhere. Highly recommend for those with serious taste.`,date:"March 2026"},
  ];
  return pool;
}

function initQtyControls() {
  const input=document.getElementById('qty-input'), minBtn=document.getElementById('qty-minus'), maxBtn=document.getElementById('qty-plus');
  if(!input) return;
  function setQty(v){const c=Math.max(1,Math.min(10,parseInt(v)||1));input.value=c;}
  if(minBtn) minBtn.addEventListener('click',()=>setQty(+input.value-1));
  if(maxBtn) maxBtn.addEventListener('click',()=>setQty(+input.value+1));
  input.addEventListener('change',()=>setQty(input.value));
}

function initAddToCart(product) {
  const btn = document.getElementById('btn-add-detail');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const qty = parseInt(document.getElementById('qty-input')?.value||'1',10);
    addToCart(product.id, selectedSize, qty);
    btn.textContent = '✓ Added to Cart!';
    btn.style.background='var(--color-success)';
    setTimeout(()=>{btn.textContent='🛍 Add to Cart';btn.style.background='';},1800);
    showToast(`${product.name} (${selectedSize}) added to cart!`,'success');
  });
}

function updateWishlistBtn(productId) {
  const btn = document.getElementById('btn-wishlist');
  if (!btn) return;
  const wished = getWishlist().includes(productId);
  btn.textContent = wished ? '❤️ Wishlisted' : '🤍 Wishlist';
  document.addEventListener('click', e => {
    if (e.target === btn || btn.contains(e.target)) {
      toggleWishlist(productId);
      const w = getWishlist().includes(productId);
      btn.textContent = w ? '❤️ Wishlisted' : '🤍 Wishlist';
    }
  });
}

function renderRelated(product) {
  const grid = document.getElementById('related-grid');
  if (!grid) return;
  const related = (window.PRODUCTS||[]).filter(p=>p.category===product.category&&p.id!==product.id).slice(0,3);
  if (!related.length) { const s=document.getElementById('related-products'); if(s) s.style.display='none'; return; }
  grid.innerHTML = related.map(p=>renderProductCard(p)).join('');
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
