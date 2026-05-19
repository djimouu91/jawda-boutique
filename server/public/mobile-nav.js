// ═══════════════════════════════════════════════
// JAWDA — Mobile Navigation + UX enhancements
// ═══════════════════════════════════════════════

// ── Hamburger / Mobile Nav ──────────────────────
(function () {
  const NAV_HTML = `
    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <div class="mobile-nav" id="mobileNav" role="dialog" aria-label="Mobile navigation" aria-modal="true">
      <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">✕</button>
      <a href="#shop"     onclick="closeMobileNav()">Shop</a>
      <a href="#shop"     onclick="filterAndScroll('clothing');closeMobileNav()">Clothing</a>
      <a href="#shop"     onclick="filterAndScroll('home');closeMobileNav()">Home</a>
      <a href="#shop"     onclick="filterAndScroll('sale');closeMobileNav()">Sale</a>
      <a href="#about"    onclick="closeMobileNav()">About</a>
      <a href="#contact"  onclick="closeMobileNav()">Contact</a>
      <a href="#" style="margin-top:16px;font-size:.9rem;letter-spacing:.1em;opacity:.6" onclick="event.preventDefault();closeMobileNav();toggleCart()">🛍️ View Bag</a>
    </div>`;

  document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.header-nav');
    if (nav) nav.insertAdjacentHTML('afterbegin', NAV_HTML);

    document.getElementById('hamburgerBtn')?.addEventListener('click', openMobileNav);
    document.getElementById('mobileNavClose')?.addEventListener('click', closeMobileNav);
    document.getElementById('mobileNav')?.addEventListener('click', function (e) {
      if (e.target === this) closeMobileNav();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });

    // ── Lazy image load fade-in ──────────────────
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    imgs.forEach(img => {
      if (img.complete) img.classList.add('loaded');
      else img.addEventListener('load', () => img.classList.add('loaded'));
    });

    // ── Cart badge bump on add ───────────────────
    const origAdd = window.addToCart;
    if (origAdd) {
      window.addToCart = function (id) {
        origAdd(id);
        const badge = document.getElementById('cartBadge');
        if (badge) {
          badge.classList.remove('bump');
          void badge.offsetWidth;
          badge.classList.add('bump');
          setTimeout(() => badge.classList.remove('bump'), 350);
        }
      };
    }

    // ── Button loading state ─────────────────────
    const origProcess = window.processPayment;
    if (origProcess) {
      window.processPayment = async function () {
        const btn = event?.currentTarget;
        if (btn) btn.classList.add('btn-loading');
        await origProcess.call(this);
        if (btn) btn.classList.remove('btn-loading');
      };
    }
  });

  window.openMobileNav = function () {
    const btn = document.getElementById('hamburgerBtn');
    const nav = document.getElementById('mobileNav');
    if (!btn || !nav) return;
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    nav.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeMobileNav = function () {
    const btn = document.getElementById('hamburgerBtn');
    const nav = document.getElementById('mobileNav');
    if (!btn || !nav) return;
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  };
})();
