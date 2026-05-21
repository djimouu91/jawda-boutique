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
    desc:'Breathable linen, universally flattering wrap silhouette. Available in 6 neutral tones. Machine washable.',
    price:89, orig:159, badge:'Best Seller',
    img:'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80',
    angle:'#1 TikTok Canada — "feels like wearing air"'
  },
  {
    id:'2', category:'clothing',
    name:'Oversized Cashmere-Feel Cardigan',
    desc:'Cloud-soft premium knit, oversized relaxed fit. The ultimate Canadian winter essential. One size fits most.',
    price:79, orig:139, badge:'New',
    img:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    angle:'Winter hero — "softer than my actual cashmere"'
  },
  {
    id:'3', category:'clothing',
    name:'Flowy Chiffon Maxi Dress',
    desc:'Lightweight, elegant drape — from beach to dinner in seconds. Adjustable tie waist, side slit. Free shipping.',
    price:75, orig:129, badge:'Sale',
    img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
    angle:'Summer viral — "beach to dinner" reel hook'
  },
  {
    id:'4', category:'clothing',
    name:'Wide-Leg Linen Trousers',
    desc:'Effortless quiet luxury. Breathable linen-blend, tailored wide leg, elastic waist. Available sizes XS–XL.',
    price:65, orig:110, badge:'New',
    img:'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80',
    angle:'"Quiet luxury" Pinterest winner — high ROAS 4.1x'
  },
  {
    id:'5', category:'clothing',
    name:'Silk-Look Slip Dress',
    desc:'Liquid-drape satin finish, adjustable straps, bias cut. Wear alone or layered. 5 colours. Free returns.',
    price:68, orig:115, badge:'Best Seller',
    img:'https://images.unsplash.com/photo-1594938298603-c8148c4b7c1c?w=600&q=80',
    angle:'Luxury feel, accessible price — converts at 4.2%'
  },
  {
    id:'6', category:'clothing',
    name:'Broderie Anglaise Blouse',
    desc:'Handcrafted eyelet embroidery, relaxed fit, V-neck with tie detail. The bohemian essential of summer 2026.',
    price:55, orig:95, badge:'Sale',
    img:'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80',
    angle:'"Looks 10x more expensive" — top UGC hook'
  },
  {
    id:'13', category:'clothing',
    name:'Oversized Teddy Shearling Coat',
    desc:'Ultra-plush sherpa coat, street-style statement. Drop shoulder, double-breasted. The viral winter coat of 2026.',
    price:115, orig:189, badge:'Hot 🔥',
    img:'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    angle:'Winter TikTok hero — "warm AND stylish" viral hook'
  },
  {
    id:'14', category:'clothing',
    name:'Linen Co-ord Set (Top + Wide Pants)',
    desc:'Matching linen set: cropped tie-front top + wide-leg pants. Effortless summer outfit, mix & match pieces.',
    price:92, orig:148, badge:'New',
    img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
    angle:'Matching sets trending hard — "two outfits in one" hook'
  },
  {
    id:'15', category:'clothing',
    name:'Minimal Crossbody Leather Bag',
    desc:'Genuine PU leather, gold hardware, adjustable strap. Fits phone + wallet + essentials. The everyday bag.',
    price:58, orig:98, badge:'New',
    img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    angle:'Accessories upsell winner — AOV booster +$58'
  },

  // ── HOME WINNERS ──────────────────────────────────────────────────────────
  {
    id:'7', category:'home',
    name:'Aesthetic Ceramic Vase Set (3pc)',
    desc:'Three sculptural matte ceramic vases in graduated sizes. Neutral earth tones. Perfect apartment decor.',
    price:68, orig:115, badge:'Best Seller',
    img:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    angle:'"Transform your shelf in 30s" — 2.1M TikTok views'
  },
  {
    id:'8', category:'home',
    name:'Luxury Soy Candle Set (4pc)',
    desc:'Hand-poured soy wax, premium fragrance oils. Scents: Amber & Sandalwood, Linen & Cedar, Rose & Oud, Vanilla.',
    price:55, orig:90, badge:'New',
    img:'https://images.unsplash.com/photo-1602607196742-5525e7b7499e?w=600&q=80',
    angle:'65% margin — top gifting product Canada 2026'
  },
  {
    id:'9', category:'home',
    name:'Woven Rattan Wall Mirror (60cm)',
    desc:'Hand-woven natural rattan frame, 60cm diameter. Instantly elevates any room. Comes with mounting hardware.',
    price:89, orig:149, badge:'New',
    img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    angle:'"Apartment transformation" — Pinterest viral 3.5x ROAS'
  },
  {
    id:'10', category:'home',
    name:'Stone-Washed Linen Cushion Set (4pc)',
    desc:'Pre-washed linen covers, 45x45cm, zipper close. Set of 4 in complementary neutrals. Machine washable.',
    price:49, orig:85, badge:'Sale',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    angle:'"Instantly elevated my sofa" — top TikTok Shop seller'
  },
  {
    id:'11', category:'home',
    name:'Handwoven Cotton Throw Blanket',
    desc:'Generously sized 130x170cm, hand-loomed cotton. Soft fringe finish. Keeps you warm all Canadian winter.',
    price:72, orig:120, badge:'Best Seller',
    img:'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80',
    angle:'Cozy season hero — 38% repeat buyer rate'
  },
  {
    id:'12', category:'home',
    name:'Minimalist Glass Candle Holders (Set of 3)',
    desc:'Ribbed borosilicate glass, 3 heights: 8cm, 12cm, 17cm. Creates instant ambiance for any occasion.',
    price:42, orig:72, badge:'Sale',
    img:'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&q=80',
    angle:'"Fancy dinner table for $42" — 5.1% conversion rate'
  },
  {
    id:'16', category:'home',
    name:'Aesthetic Bouclé Armchair Cover',
    desc:'Transform any plain chair into a designer piece. Stretch bouclé fabric, universal fit. Beige & ivory tones.',
    price:62, orig:105, badge:'Hot 🔥',
    img:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
    angle:'"$2000 chair look for $62" — viral TikTok Canada 2026'
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
