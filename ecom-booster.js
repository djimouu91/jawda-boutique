// ═══════════════════════════════════════════════════════════
// JAWDA — E-Commerce Booster
// Features: Free shipping bar, upsell, urgency, exit-intent,
//           recently viewed, bundle discount, review stars
// ═══════════════════════════════════════════════════════════

const JAWDA_BOOSTER = {
  FREE_SHIP_THRESHOLD: 75,
  BUNDLE_DISCOUNT: 0.10,   // 10% off when 2+ items
  CURRENCY: 'CA$',

  // ── FREE SHIPPING PROGRESS BAR ────────────────────────
  initShippingBar() {
    const footer = document.getElementById('cartFooter');
    if (!footer) return;
    if (!document.getElementById('shippingBar')) {
      const bar = document.createElement('div');
      bar.id = 'shippingBar';
      bar.className = 'shipping-bar';
      bar.innerHTML = `
        <div class="shipping-bar-text" id="shippingBarText"></div>
        <div class="shipping-bar-track">
          <div class="shipping-bar-fill" id="shippingBarFill"></div>
        </div>`;
      footer.insertBefore(bar, footer.firstChild);
    }
    this.updateShippingBar();
  },

  updateShippingBar() {
    const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const fill     = document.getElementById('shippingBarFill');
    const text     = document.getElementById('shippingBarText');
    if (!fill || !text) return;
    const pct      = Math.min((total / this.FREE_SHIP_THRESHOLD) * 100, 100);
    const remaining = Math.max(this.FREE_SHIP_THRESHOLD - total, 0);
    fill.style.width = pct + '%';
    if (remaining > 0) {
      text.innerHTML = `Add <strong>${this.CURRENCY}${remaining.toFixed(2)}</strong> more for <strong>Free Shipping!</strong>`;
      fill.style.background = '#8a7060';
    } else {
      text.innerHTML = `🎉 You've unlocked <strong>Free Shipping!</strong>`;
      fill.style.background = 'var(--brown)';
    }
  },

  // ── UPSELL / CROSS-SELL in cart ───────────────────────
  renderUpsell() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems || !cart.length || !products.length) return;
    const inCart = new Set(cart.map(i => i.id));
    const suggestions = products
      .filter(p => !inCart.has(p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    if (!suggestions.length) return;

    const existing = document.getElementById('cartUpsell');
    if (existing) existing.remove();
    const upsell = document.createElement('div');
    upsell.id = 'cartUpsell';
    upsell.className = 'cart-upsell';
    upsell.innerHTML = `
      <p class="upsell-title">✨ You might also love</p>
      ${suggestions.map(p => `
        <div class="upsell-item">
          <img src="${p.img}" alt="${p.name}" loading="lazy"/>
          <div class="upsell-info">
            <p>${p.name}</p>
            <span>${this.CURRENCY}${parseFloat(p.price).toFixed(2)}</span>
          </div>
          <button class="upsell-add" onclick="addToCart('${p.id}')">+ Add</button>
        </div>`).join('')}`;
    cartItems.appendChild(upsell);
  },

  // ── BUNDLE DISCOUNT ───────────────────────────────────
  applyBundleDiscount() {
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    const banner   = document.getElementById('bundleBanner');
    if (totalQty >= 2) {
      if (!banner) {
        const b = document.createElement('div');
        b.id = 'bundleBanner';
        b.className = 'bundle-banner';
        b.innerHTML = `🎁 Bundle deal active: <strong>10% off</strong> your order!`;
        document.getElementById('cartFooter')?.prepend(b);
      }
    } else {
      banner?.remove();
    }
  },

  // ── URGENCY BADGES on products ────────────────────────
  addUrgencyBadges() {
    const urgencyMap = {
      '1': { label: '🔥 Trending', class: 'urgency-hot' },
      '2': { label: '⚡ Low Stock', class: 'urgency-low' },
      '5': { label: '🔥 Trending', class: 'urgency-hot' },
      '7': { label: '⭐ Fan Fav',  class: 'urgency-fav' },
      '11': { label: '🎁 Gift Pick', class: 'urgency-gift' },
    };
    document.querySelectorAll('.product-card').forEach(card => {
      const btn = card.querySelector('.pc-add');
      if (!btn) return;
      const onclick = btn.getAttribute('onclick') || '';
      const idMatch = onclick.match(/'([^']+)'/);
      if (!idMatch) return;
      const id = idMatch[1];
      if (urgencyMap[id] && !card.querySelector('.urgency-badge')) {
        const badge = document.createElement('div');
        badge.className = `urgency-badge ${urgencyMap[id].class}`;
        badge.textContent = urgencyMap[id].label;
        card.querySelector('.pc-img')?.appendChild(badge);
      }
    });
  },

  // ── REVIEW STARS on product cards ─────────────────────
  addReviewStars() {
    const reviews = {
      '1': { stars: 4.8, count: 2300 },
      '2': { stars: 4.6, count: 890  },
      '3': { stars: 4.7, count: 1120 },
      '4': { stars: 4.5, count: 560  },
      '5': { stars: 4.9, count: 1800 },
      '6': { stars: 4.4, count: 340  },
      '7': { stars: 4.9, count: 1200 },
      '8': { stars: 4.7, count: 780  },
      '9': { stars: 4.6, count: 650  },
      '10': { stars: 4.8, count: 920 },
      '11': { stars: 4.9, count: 2100},
      '12': { stars: 4.7, count: 480 },
    };
    document.querySelectorAll('.product-card').forEach(card => {
      const btn = card.querySelector('.pc-add');
      if (!btn) return;
      const onclick = btn.getAttribute('onclick') || '';
      const idMatch = onclick.match(/'([^']+)'/);
      if (!idMatch) return;
      const id = idMatch[1];
      const r = reviews[id];
      if (!r || card.querySelector('.pc-stars')) return;
      const info = card.querySelector('.pc-name');
      if (!info) return;
      const stars = document.createElement('div');
      stars.className = 'pc-stars';
      stars.innerHTML = `
        <span class="star-icons">${this.renderStars(r.stars)}</span>
        <span class="star-count">${r.stars} (${r.count.toLocaleString()})</span>`;
      info.insertAdjacentElement('afterend', stars);
    });
  },

  renderStars(rating) {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  },

  // ── RECENTLY VIEWED ────────────────────────────────────
  trackRecentlyViewed(productId) {
    let rv = JSON.parse(localStorage.getItem('jawda_rv') || '[]');
    rv = [productId, ...rv.filter(id => id !== productId)].slice(0, 6);
    localStorage.setItem('jawda_rv', JSON.stringify(rv));
  },

  renderRecentlyViewed() {
    const rv = JSON.parse(localStorage.getItem('jawda_rv') || '[]');
    if (rv.length < 2) return;
    const section = document.getElementById('recentlyViewed');
    if (!section) return;
    const items = rv.map(id => products.find(p => p.id === id)).filter(Boolean);
    if (!items.length) return;
    section.style.display = 'block';
    document.getElementById('rvGrid').innerHTML = items.map(p => `
      <div class="rv-card" onclick="addToCart('${p.id}')">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        <p class="rv-name">${p.name}</p>
        <p class="rv-price">${this.CURRENCY}${parseFloat(p.price).toFixed(2)}</p>
      </div>`).join('');
  },

  // ── EXIT INTENT POPUP ──────────────────────────────────
  initExitIntent() {
    if (localStorage.getItem('jawda_exit_seen')) return;
    let triggered = false;
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 10 && !triggered && !cart.length) {
        triggered = true;
        this.showExitPopup();
      }
    });
    // Mobile: show after 30s on page
    setTimeout(() => {
      if (!triggered && !localStorage.getItem('jawda_exit_seen')) {
        triggered = true;
        this.showExitPopup();
      }
    }, 30000);
  },

  showExitPopup() {
    document.getElementById('exitPopup')?.classList.add('open');
  },

  hideExitPopup() {
    document.getElementById('exitPopup')?.classList.remove('open');
    localStorage.setItem('jawda_exit_seen', '1');
  },

  // ── INIT ──────────────────────────────────────────────
  init() {
    // Patch updateCartUI to trigger booster updates
    const orig = window.updateCartUI;
    window.updateCartUI = () => {
      orig?.();
      this.initShippingBar();
      this.updateShippingBar();
      this.renderUpsell();
      this.applyBundleDiscount();
    };

    // Patch renderProducts to add badges + stars
    const origRender = window.renderProducts;
    window.renderProducts = (filter) => {
      origRender?.(filter);
      setTimeout(() => {
        this.addUrgencyBadges();
        this.addReviewStars();
      }, 50);
    };

    // Track recently viewed on product click
    const origOpen = window.openProductQuick;
    window.openProductQuick = (id) => {
      this.trackRecentlyViewed(id);
      origOpen?.(id);
    };

    // Render recently viewed after products load
    const origLoad = window.loadProducts;
    window.loadProducts = async () => {
      await origLoad?.();
      this.renderRecentlyViewed();
    };

    // Exit intent
    this.initExitIntent();

    // Initial call
    setTimeout(() => {
      this.addUrgencyBadges();
      this.addReviewStars();
    }, 500);
  }
};

// ── EXIT POPUP HTML (injected on load) ────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Add exit popup
  document.body.insertAdjacentHTML('beforeend', `
    <div id="exitPopup" class="exit-popup-overlay">
      <div class="exit-popup">
        <button class="exit-popup-close" onclick="JAWDA_BOOSTER.hideExitPopup()">✕</button>
        <div class="exit-popup-badge">EXCLUSIVE OFFER</div>
        <h2>Wait — before you go!</h2>
        <p>Join the JAWDA circle and get <strong>10% off</strong> your first order.</p>
        <form class="exit-popup-form" onsubmit="JAWDA_BOOSTER.subscribeExitPopup(event)">
          <input type="email" placeholder="your@email.com" required/>
          <button type="submit">Claim My 10% Off</button>
        </form>
        <p class="exit-popup-skip" onclick="JAWDA_BOOSTER.hideExitPopup()">No thanks, I'll pay full price</p>
      </div>
    </div>

    <!-- Recently Viewed Section -->
    <section id="recentlyViewed" style="display:none;padding:60px 48px;background:var(--white)">
      <div class="section-header"><h2>Recently Viewed</h2></div>
      <div id="rvGrid" class="rv-grid"></div>
    </section>`);

  JAWDA_BOOSTER.init();
});

JAWDA_BOOSTER.subscribeExitPopup = function(e) {
  e.preventDefault();
  showToast('Welcome! Your 10% discount code: JAWDA10');
  JAWDA_BOOSTER.hideExitPopup();
};
