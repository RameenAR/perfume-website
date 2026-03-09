/* ============================================================
   BLOG PAGE — Category filter + scroll reveal + newsletter
   Feature: 008-perfume-static-site
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBlogFilter();
  initScrollReveal();
  initNewsletterForm();
  initLoadMore();
});

/* ── Category Filter ────────────────────────────── */
function initBlogFilter() {
  const pills    = document.querySelectorAll('.blog-filter-btn');
  const featured = document.querySelector('.blog-featured');
  const articles = document.querySelectorAll('.article-card');

  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.dataset.cat;

      // Featured article visibility
      if (featured) {
        const featuredCat = featured.dataset.cat;
        featured.style.display = (cat === 'all' || cat === featuredCat) ? '' : 'none';
      }

      // Article cards
      articles.forEach(article => {
        const articleCat = article.dataset.cat;
        const show = cat === 'all' || cat === articleCat;
        article.style.display = show ? '' : 'none';
        if (show) {
          // Re-trigger reveal animation
          article.classList.remove('revealed');
          requestAnimationFrame(() => {
            setTimeout(() => article.classList.add('revealed'), 50);
          });
        }
      });
    });
  });
}

/* ── Scroll Reveal ──────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ── Newsletter Form ────────────────────────────── */
function initNewsletterForm() {
  const form = document.getElementById('blog-newsletter-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const email = input?.value?.trim();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    input.value = '';
    showToast('You\'ve joined the inner circle! Welcome to The Scent Journal.', 'success');
  });
}

/* ── Load More ──────────────────────────────────── */
function initLoadMore() {
  const btn = document.getElementById('load-more-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    showToast('More articles coming soon — stay tuned!', 'info');
  });
}
