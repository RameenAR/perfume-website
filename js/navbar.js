/* ============================================================
   SHARED NAVBAR — Injected into every page
   Feature: 008-perfume-static-site
   ============================================================ */

(function () {
  const NAVBAR_HTML = `
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="navbar-inner">
        <a href="index.html" class="navbar-logo">
          <span class="logo-icon">✦</span> Scent Luxe
        </a>

        <div class="navbar-links" id="nav-links">
          <a href="index.html"   class="nav-link" data-page="home">Home</a>
          <a href="shop.html"    class="nav-link" data-page="shop">Shop</a>
          <a href="blog.html"    class="nav-link" data-page="blog">Journal</a>
          <a href="about.html"   class="nav-link" data-page="about">About</a>
          <a href="contact.html" class="nav-link" data-page="contact">Contact</a>
        </div>

        <div class="navbar-cart">
          <a href="cart.html" class="cart-icon-btn" aria-label="View cart">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span class="cart-badge" id="cart-badge" aria-label="0 items in cart">0</span>
          </a>
          <button class="hamburger" id="hamburger-btn" aria-label="Toggle navigation" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  `;

  const FOOTER_HTML = `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand-name">✦ Scent Luxe</div>
            <p class="footer-desc">Curating the world's finest fragrances for those who appreciate the art of scent. Every bottle tells a story.</p>
            <div class="footer-social">
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="Pinterest">📌</a>
              <a href="#" aria-label="Facebook">👤</a>
              <a href="#" aria-label="Twitter">🐦</a>
            </div>
          </div>
          <div>
            <div class="footer-heading">Explore</div>
            <div class="footer-links">
              <a href="index.html">Home</a>
              <a href="shop.html">Shop All</a>
              <a href="blog.html">The Journal</a>
              <a href="about.html">Our Story</a>
              <a href="contact.html">Contact</a>
            </div>
          </div>
          <div>
            <div class="footer-heading">Collections</div>
            <div class="footer-links">
              <a href="shop.html?cat=Women">Women</a>
              <a href="shop.html?cat=Men">Men</a>
              <a href="shop.html?cat=Unisex">Unisex</a>
              <a href="shop.html?scent=Oriental">Oriental</a>
              <a href="shop.html?scent=Floral">Floral</a>
              <a href="shop.html?scent=Woody">Woody</a>
            </div>
          </div>
          <div>
            <div class="footer-heading">Help &amp; Info</div>
            <div class="footer-links">
              <a href="contact.html">Help Centre</a>
              <a href="contact.html">Returns &amp; Refunds</a>
              <a href="#">Shipping Info</a>
              <a href="#">Fragrance Guide</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Scent Luxe. All rights reserved.</span>
          <div class="footer-badges">
            <span class="footer-badge">🔒 SSL Secure</span>
            <span class="footer-badge">🌿 Cruelty Free</span>
            <span class="footer-badge">🚚 Free Shipping $75+</span>
          </div>
        </div>
      </div>
    </footer>
  `;

  const ANNOUNCEMENT_HTML = `
    <div class="announcement-bar" role="banner" aria-label="Promotions">
      <span>✦ Free Shipping Over $75</span>
      <span>|</span>
      <span>Use <strong>LUXE15</strong> for 15% Off Your First Order</span>
      <span>|</span>
      <span>✦ New Collection: Spring 2026</span>
    </div>
  `;

  function injectNavbar() {
    const container = document.getElementById('navbar');
    if (container) container.innerHTML = ANNOUNCEMENT_HTML + NAVBAR_HTML;
  }

  function injectFooter() {
    const container = document.getElementById('footer');
    if (container) container.innerHTML = FOOTER_HTML;
  }

  function injectExtras() {
    document.body.insertAdjacentHTML('beforeend', '<button id="scroll-top-btn" aria-label="Back to top">↑</button>');
    document.body.insertAdjacentHTML('beforeend', '<div id="toast-container" aria-live="polite"></div>');
  }

  function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const count = typeof getCartItemCount === 'function' ? getCartItemCount() : 0;
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
    badge.setAttribute('aria-label', `${count} item${count !== 1 ? 's' : ''} in cart`);
  }

  function setActivePage() {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const page = link.dataset.page;
      const isActive =
        (filename === 'index.html' && page === 'home') ||
        (filename === '' && page === 'home') ||
        filename.startsWith(page);
      link.classList.toggle('active', isActive);
    });
  }

  function initHamburger() {
    const btn   = document.getElementById('hamburger-btn');
    const links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
      const isOpen = links.classList.toggle('nav-open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
    });

    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('nav-open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initScrollTop() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 300));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectNavbar();
    injectFooter();
    injectExtras();
    updateCartBadge();
    setActivePage();
    initHamburger();
    initScrollTop();
  });

  document.addEventListener('cart:updated', updateCartBadge);
})();

/* ── Toast Utility ──────────────────────────────── */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}
