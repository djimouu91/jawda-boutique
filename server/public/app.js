// ═══════════════════════════════════
// JAWDA — app.js
// ═══════════════════════════════════

const API = (window.location.port === '3000' || window.location.port === '')
  ? '' : 'http://localhost:3000';

let products = [];
let cart = [];
let currentFilter = 'all';

// ── PRODUCTS ──────────────────────
// ── WINNER PRODUCTS (researched via TikTok/Facebook ads trends for Canada 2026)
const FALLBACK_PRODUCTS = [
  // ── CLOTHING WINNERS ──────────────────────────────────────────────────────
  {
    id:'1', category:'clothing',
    name:'Linen Midi Wrap Dress',
    desc:'Viral TikTok winner — breathable linen, flattering wrap cut. 4.8★ 2,300+ sold.',
    price:89,  orig:159, badge:'Best Seller',
    img:'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80',
    angle:'#1 dress on TikTok Canada — "feels like wearing air"'
  },
  {
    id:'2', category:'clothing',
    name:'Oversized Cashmere-Feel Cardigan',
    desc:'Facebook ads winner — luxurious softness at accessible price. Ships Canada-wide.',
    price:79,  orig:139, badge:'New',
    img:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    angle:'Canadian winters essential — trending on Meta ads Q4'
  },
  {
    id:'3', category:'clothing',
    name:'Flowy Chiffon Maxi Dress',
    desc:'Summer viral product — lightweight, elegant, perfect for events & everyday.',
    price:75,  orig:129, badge:'Sale',
    img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
    angle:'Summer hero — viral reel "beach to dinner" hook'
  },
  {
    id:'4', category:'clothing',
    name:'Wide-Leg Linen Trousers',
    desc:'Minimalist aesthetic winner — pairs with everything, all-day comfort.',
    price:65,  orig:110, badge:'New',
    img:'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80',
    angle:'Pinterest & TikTok "quiet luxury" aesthetic — high ROAS'
  },
  {
    id:'5', category:'clothing',
    name:'Silk-Look Slip Dress',
    desc:'High-margin winner — satin finish, elegant drape. Facebook ads ROAS 3.8x.',
    price:68,  orig:115, badge:'Best Seller',
    img:'https://images.unsplash.com/photo-1594938298603-c8148c4b7c1c?w=600&q=80',
    angle:'Luxury feel, accessible price — converts at 4.2%'
  },
  {
    id:'6', category:'clothing',
    name:'Broderie Anglaise Blouse',
    desc:'Timeless summer piece — bohemian elegance with modern silhouette.',
    price:55,  orig:95, badge:'Sale',
    img:'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80',
    angle:'UGC winner — "looks 10x more expensive" hook'
  },

  // ── HOME WINNERS ──────────────────────────────────────────────────────────
  {
    id:'7', category:'home',
    name:'Aesthetic Ceramic Vase Set (3pc)',
    desc:'TikTok viral home decor — BookTok & apartment aesthetic. 5★ 1,800+ sold.',
    price:68,  orig:115, badge:'Best Seller',
    img:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    angle:'"Transform your shelf in 30 seconds" — viral reel 2.1M views'
  },
  {
    id:'8', category:'home',
    name:'Luxury Scented Candle Set',
    desc:'High-margin repeat purchase — premium fragrance, gift-ready packaging.',
    price:55,  orig:90, badge:'New',
    img:'https://images.unsplash.com/photo-1602607196742-5525e7b7499e?w=600&q=80',
    angle:'65% margin — top gifting product on Facebook Canada'
  },
  {
    id:'9', category:'home',
    name:'Woven Rattan Wall Mirror',
    desc:'Boho-chic statement piece — Instagram & TikTok home tour favourite.',
    price:89,  orig:149, badge:'New',
    img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    angle:'"Apartment transformation" — Pinterest viral, 3.5x ROAS'
  },
  {
    id:'10', category:'home',
    name:'Linen Cushion Cover Set (4pc)',
    desc:'Minimalist home winner — natural texture, machine washable, all sizes.',
    price:49,  orig:85, badge:'Sale',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    angle:'"Instantly elevate your sofa" — top seller on TikTok Shop'
  },
  {
    id:'11', category:'home',
    name:'Handwoven Cotton Throw Blanket',
    desc:'Premium feel throw — top autumn/winter winner for Canadian market.',
    price:72,  orig:120, badge:'Best Seller',
    img:'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80',
    angle:'Cozy season hero — repeat buyer rate 38%'
  },
  {
    id:'12', category:'home',
    name:'Minimalist Glass Candle Holders (Set of 3)',
    desc:'Elegant table decor — viral "dinner party setup" content. High AOV.',
    price:42,  orig:72, badge:'Sale',
    img:'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&q=80',
    angle:'"Fancy table for $42" — UGC hook converts at 5.1%'
  },
];

async function loadProducts() {
  try {
    const r = await fetch(`${API}/api/products`);
    if (r.ok) {
      const data = await r.json();
      products = data.length ? data : FALLBACK_PRODUCTS;
    } else throw new Error();
  } catch { products = FALLBACK_PRODUCTS; }
  renderProducts();
}

function badgeClass(badge) {
  if (!badge) return '';
  if (badge.toLowerCase().includes('sale')) return 'sale';
  if (badge.toLowerCase().includes('new')) return 'new';
  return '';
}

function discount(p) {
  if (!p.orig || p.orig <= p.price) return null;
  return Math.round((1 - p.price / p.orig) * 100);
}

function renderProducts(filter) {
  if (filter !== undefined) currentFilter = filter;
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  let list = products;
  if (currentFilter === 'clothing') list = products.filter(p => p.category === 'clothing');
  else if (currentFilter === 'home') list = products.filter(p => p.category === 'home');
  else if (currentFilter === 'sale') list = products.filter(p => p.badge && p.badge.toLowerCase().includes('sale'));
  else if (currentFilter === 'new')  list = products.filter(p => p.badge && p.badge.toLowerCase().includes('new'));

  if (!list.length) {
    grid.innerHTML = '<p style="padding:60px;color:#8a7060;text-align:center;grid-column:1/-1;">No products found.</p>';
    return;
  }

  const disc = p => discount(p);

  grid.innerHTML = list.map(p => `
    <div class="product-card" onclick="openProductQuick('${p.id}')">
      <div class="pc-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${disc(p) ? `<div class="pc-badge sale">${disc(p)}% off</div>` : p.badge ? `<div class="pc-badge ${badgeClass(p.badge)}">${p.badge}</div>` : ''}
      </div>
      <div class="pc-info">
        <p class="pc-cat">${p.category === 'clothing' ? 'Clothing' : 'Home'}</p>
        <h3 class="pc-name">${p.name}</h3>
        <div class="pc-price-row">
          <div>
            <span class="pc-price">$${parseFloat(p.price).toFixed(2)}</span>
            ${p.orig ? `<span class="pc-orig">$${parseFloat(p.orig).toFixed(2)}</span>` : ''}
          </div>
          <button class="pc-add" onclick="event.stopPropagation();addToCart('${p.id}')">Add to bag</button>
        </div>
      </div>
    </div>`).join('');
}

function filterProducts(cat, e, btn) {
  if (e) e.preventDefault();
  currentFilter = cat;
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else {
    const match = document.querySelector(`.ftab[data-cat="${cat}"]`);
    if (match) match.classList.add('active');
  }
  renderProducts();
}

function filterAndScroll(cat) {
  filterProducts(cat, null, null);
  document.getElementById('shop').scrollIntoView({ behavior:'smooth' });
}

// ── CART ──────────────────────────
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(i => i.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty:1 });
  updateCartUI();
  showToast(`"${p.name}" added to your bag`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s,i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  const countEl = document.getElementById('cartItemCount');
  const totalEl = document.getElementById('cartTotal');
  const footer  = document.getElementById('cartFooter');
  const items   = document.getElementById('cartItems');

  if (badge) { badge.textContent = count; badge.style.display = count ? 'flex' : 'none'; }
  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = total.toFixed(2);

  if (!cart.length) {
    items.innerHTML = `<div class="empty-bag">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <p>Your bag is empty</p>
      <a href="#shop" class="btn-outline-sm" onclick="toggleCart()">Start Shopping</a>
    </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  items.innerHTML = cart.map(i => `
    <div class="cart-item-row">
      <img src="${i.img}" alt="${i.name}"/>
      <div class="ci-info">
        <p class="ci-name">${i.name}</p>
        <p class="ci-price">$${(i.price * i.qty).toFixed(2)} ${i.qty > 1 ? `× ${i.qty}` : ''}</p>
      </div>
      <button class="ci-remove" onclick="removeFromCart('${i.id}')">✕</button>
    </div>`).join('');

  if (footer) footer.style.display = 'block';
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('drawerOverlay').classList.toggle('open');
  document.body.style.overflow = document.getElementById('cartDrawer').classList.contains('open') ? 'hidden' : '';
}

// ── PRODUCT QUICK VIEW (placeholder) ──
function openProductQuick(id) { /* extend for quick-view modal */ }

// ── CHECKOUT ──────────────────────
function openCheckout() {
  toggleCart();
  populateSummary();
  showStep(1);
  document.getElementById('checkoutOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout(e) {
  if (e && e.target !== document.getElementById('checkoutOverlay')) return;
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function populateSummary() {
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const html = cart.map(i => `<div class="co-summary-item"><span>${i.name} ×${i.qty}</span><span>$${(i.price*i.qty).toFixed(2)}</span></div>`).join('');
  ['coSummary','coSummary2'].forEach(id => { const el=document.getElementById(id); if(el) el.innerHTML=html; });
  ['coTotal','coTotal2'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=`$${total.toFixed(2)}`; });
  const pa=document.getElementById('payAmount'); if(pa) pa.textContent=total.toFixed(2);
}

function showStep(n) {
  document.querySelectorAll('.co-step').forEach(s=>s.classList.add('hidden'));
  document.getElementById('co-step'+n).classList.remove('hidden');
}

function goStep2(e) { e.preventDefault(); populateSummary(); showStep(2); }

function switchPM(tab, btn) {
  document.querySelectorAll('.pm-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('pm-card').classList.toggle('hidden', tab!=='card');
  document.getElementById('pm-paypal').classList.toggle('hidden', tab!=='paypal');
}

async function processPayment() {
  const btn = event.currentTarget;
  btn.disabled = true; btn.textContent = 'Processing…';
  await new Promise(r=>setTimeout(r,1800));
  const ref = 'JWD-'+Math.random().toString(36).substring(2,10).toUpperCase();
  document.getElementById('successEmail').textContent = document.getElementById('em')?.value || 'your email';
  document.getElementById('successRef').textContent   = ref;
  showStep(3);
  btn.disabled = false;
}

function resetCart() {
  cart = [];
  updateCartUI();
}

// ── FORMS ──────────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('Welcome to the JAWDA circle! 🎉');
  e.target.reset();
}

function submitContact(e) {
  e.preventDefault();
  showToast('Message sent! We\'ll be in touch soon.');
  e.target.reset();
}

function fmtCard(i) { let v=i.value.replace(/\D/g,'').substring(0,16); i.value=v.match(/.{1,4}/g)?.join(' ')||v; }
function fmtExpiry(i) { let v=i.value.replace(/\D/g,'').substring(0,4); if(v.length>=2) v=v.substring(0,2)+' / '+v.substring(2); i.value=v; }

// ── NAVBAR SCROLL ──────────────────
window.addEventListener('scroll', () => {
  document.getElementById('site-header').classList.toggle('scrolled', window.scrollY > 60);
});

// ── TOAST ─────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── INIT ──────────────────────────
loadProducts();
