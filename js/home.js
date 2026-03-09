/* ============================================================
   HOME PAGE — Featured products & categories
   Feature: 008-perfume-static-site
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedProducts();
  renderFullCollection();   // ← ADD THIS
  renderCategories();
  renderNewArrivals();
  renderBestSellers();
  initScrollReveal();
  initTypingEffect();
  initNewsletterForm();
  initStatsCounters();
});

/* ── Scroll Reveal ───────────────────────────────── */
function initScrollReveal() {
  // Add reveal class to key sections dynamically
  const revealTargets = [
    '#featured',
    '#new-arrivals',
    '#best-sellers',
    '#categories',
    '#cta-banner',
    '#why-us',
    '#testimonials',
    '#newsletter'
  ];
  revealTargets.forEach(sel => {
    const el = document.querySelector(sel);
    if (el && !el.classList.contains('reveal')) el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Typing Effect ───────────────────────────────── */
function initTypingEffect() {
  const el = document.getElementById('hero-typing');
  if (!el) return;
  const phrases = ['Floral Elegance', 'Woody Warmth', 'Fresh Citrus', 'Oriental Mystique', 'Artisan Creations'];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 300;
    }
    setTimeout(type, speed);
  }
  setTimeout(type, 800);
}

/* ── Newsletter Form ─────────────────────────────── */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value.trim();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Welcome to the Scent Luxe Inner Circle! 🌹', 'success');
    form.reset();
  });
}

/* ── Stats Counters ──────────────────────────────── */
function initStatsCounters() {
  const nums = document.querySelectorAll('.stat-bar-num[data-target]');
  if (!nums.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(el => observer.observe(el));
}

function renderFeaturedProducts() {
  const grid = document.querySelector('.featured-grid');
  if (!grid) return;

  const featured = (window.PRODUCTS || []).filter(p => p.featured);
  if (!featured.length) {
    grid.innerHTML = '<p style="color:var(--color-text-muted);grid-column:1/-1;text-align:center">No featured products found.</p>';
    return;
  }
  grid.innerHTML = featured.map((p, i) => renderProductCard(p, i < 2)).join('');
}

function renderCategories() {
  const grid = document.querySelector('.categories-grid');
  if (!grid) return;

  const products = window.PRODUCTS || [];
  const categories = [
    {
      name: "Women's",
      filter: 'Women',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=800&fit=crop&q=80',
      label: "Women"
    },
    {
      name: "Men's",
      filter: 'Men',
      image: 'https://images.unsplash.com/photo-1619994121345-b61cd610c5a6?w=600&h=800&fit=crop&q=80',
      label: "Men"
    },
    {
      name: 'Unisex',
      filter: 'Unisex',
      image: 'https://images.unsplash.com/photo-1593467685267-f6c456e12e52?w=600&h=800&fit=crop&q=80',
      label: "Unisex"
    }
  ];

  grid.innerHTML = categories.map(cat => {
    const count = products.filter(p => p.category === cat.filter).length;
    return `
      <a class="category-card" href="shop.html?cat=${cat.filter}" aria-label="Browse ${cat.label} fragrances">
        <img
          src="${cat.image}"
          alt="${cat.label} fragrances"
          loading="lazy"
          onerror="this.src='assets/images/placeholder.svg'"
        />
        <div class="category-card-overlay">
          <div class="category-card-label">${cat.label}</div>
          <div class="category-card-count">${count} Fragrances</div>
        </div>
      </a>
    `;
  }).join('');
}

function renderFullCollection() {
  const grid = document.querySelector('.collection-grid');
  if (!grid) return;
  const products = window.PRODUCTS || [];
  if (!products.length) return;
  grid.innerHTML = products.map(p => renderProductCard(p, false)).join('');
}

function renderNewArrivals() {
  const grid = document.querySelector('.new-arrivals-grid');
  if (!grid) return;
  const newProducts = (window.PRODUCTS || []).filter(p => p.isNew);
  if (!newProducts.length) return;
  grid.innerHTML = newProducts.map(p => renderProductCard(p, true)).join('');
}

function renderBestSellers() {
  const grid = document.querySelector('.bestsellers-grid');
  if (!grid) return;
  const best = (window.PRODUCTS || []).filter(p => p.isBestSeller);
  if (!best.length) return;
  grid.innerHTML = best.map(p => renderProductCard(p, false)).join('');
}
