// ═══════════════════════════════════════════════════════════
// JAWDA — Checkout · Stripe Canada + PayPal
// ═══════════════════════════════════════════════════════════
//
// STRIPE SETUP (Canada):
//   1. Create account at https://dashboard.stripe.com
//   2. Replace STRIPE_PUBLISHABLE_KEY below with your pk_live_...
//   3. Enable payment methods in Stripe Dashboard:
//      - Cards (Visa, Mastercard, Amex) ✓
//      - Interac (for Canadian debit cards) ✓
//      - Apple Pay / Google Pay ✓
//      - Afterpay / Clearpay ✓
//   4. Set currency to "cad" in your backend
//
// PAYPAL SETUP:
//   Replace YOUR_PAYPAL_CLIENT_ID in index.html script tag
// ═══════════════════════════════════════════════════════════

const STRIPE_KEY   = 'pk_live_51TZEduE1hYEQBg1wkvGbRrUWh1UJUX9SzxOxLoAbjZNTohdqvQ8FuHY2GacfLYSKt9mr4ehzjGa70LJimue6VEzD00VadggbjJ';
const BACKEND_URL  = window.location.port === '3000' ? '' : 'http://localhost:3000';
const DEMO_MODE    = STRIPE_KEY.includes('YOUR');
const CURRENCY     = 'CAD';
const CURRENCY_SYM = 'CA$';

// ── PROVINCE / STATE DROPDOWN ──────────────────────────────
const REGIONS = {
  CA: [
    ['AB','Alberta'],['BC','British Columbia'],['MB','Manitoba'],
    ['NB','New Brunswick'],['NL','Newfoundland'],['NS','Nova Scotia'],
    ['NT','Northwest Territories'],['NU','Nunavut'],['ON','Ontario'],
    ['PE','Prince Edward Island'],['QC','Québec'],['SK','Saskatchewan'],['YT','Yukon']
  ],
  US: [
    ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],
    ['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],
    ['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],
    ['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],
    ['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
    ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],
    ['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],
    ['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],
    ['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],
    ['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
    ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],
    ['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],
    ['WI','Wisconsin'],['WY','Wyoming'],['DC','Washington D.C.']
  ]
};

function updateProvinceDropdown(country) {
  const sel   = document.getElementById('province');
  const label = document.getElementById('provinceLabel');
  const zip   = document.getElementById('zip');
  const zipLb = document.getElementById('zipLabel');
  if (!sel) return;

  if (country === 'CA') {
    label && (label.textContent = 'Province');
    zipLb  && (zipLb.textContent = 'Postal Code');
    zip    && (zip.placeholder = 'K1A 0A9', zip.maxLength = 7);
    sel.innerHTML = '<option value="">Select province...</option>' +
      REGIONS.CA.map(([v,l]) => `<option value="${v}">${l}</option>`).join('');
    sel.required = true; sel.style.display = '';
  } else if (country === 'US') {
    label && (label.textContent = 'State');
    zipLb  && (zipLb.textContent = 'ZIP Code');
    zip    && (zip.placeholder = '10001', zip.maxLength = 10);
    sel.innerHTML = '<option value="">Select state...</option>' +
      REGIONS.US.map(([v,l]) => `<option value="${v}">${l}</option>`).join('');
    sel.required = true; sel.style.display = '';
  } else {
    label && (label.textContent = 'Region');
    zipLb  && (zipLb.textContent = 'Postal / ZIP');
    zip    && (zip.placeholder = '', zip.maxLength = 15);
    sel.innerHTML = '<option value="">N/A</option>';
    sel.required = false;
  }
}

// Init on page load
document.addEventListener('DOMContentLoaded', () => updateProvinceDropdown('CA'));

let stripeInstance = null;
let cardElement    = null;

// ── OPEN / CLOSE ───────────────────────────────────────────
function openCheckout() {
  if (!cart.length) return;
  toggleCart();
  populateSummary();
  showStep(1);
  document.getElementById('checkoutOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (!DEMO_MODE && !stripeInstance) initStripe();
}

function closeCheckout(e) {
  if (e && e.target !== document.getElementById('checkoutOverlay')) return;
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── STEPS ──────────────────────────────────────────────────
function showStep(n) {
  document.querySelectorAll('.co-step').forEach(s => s.classList.add('hidden'));
  document.getElementById('co-step' + n).classList.remove('hidden');
}

function goStep2(e) {
  e.preventDefault();
  // Capture full shipping address
  window.shippingData = {
    firstName : document.getElementById('fn')?.value || '',
    lastName  : document.getElementById('ln')?.value || '',
    email     : document.getElementById('em')?.value || '',
    phone     : document.getElementById('ph')?.value || '',
    address   : document.getElementById('addr')?.value || '',
    apt       : document.getElementById('apt')?.value || '',
    city      : document.getElementById('city')?.value || '',
    postal    : document.getElementById('zip')?.value || '',
    province  : document.getElementById('province')?.value || '',
    country   : document.getElementById('country')?.value || 'CA',
  };
  // Show shipping summary on step 2
  const shipEl = document.getElementById('shippingPreview');
  if (shipEl) {
    const d = window.shippingData;
    const aptStr = d.apt ? `, ${d.apt}` : '';
    shipEl.innerHTML = `<strong>${d.firstName} ${d.lastName}</strong><br>
      ${d.address}${aptStr}, ${d.city}<br>
      ${d.province} ${d.postal}, ${d.country}<br>
      📧 ${d.email} &nbsp; 📞 ${d.phone}`;
  }
  populateSummary();
  showStep(2);
  initPayPalButton();
}

// ── SUMMARY ────────────────────────────────────────────────
function populateSummary() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const html  = cart.map(i => `
    <div class="co-summary-item">
      <span>${i.name} <span style="color:#8a7060">×${i.qty}</span></span>
      <span>${CURRENCY_SYM}${(i.price * i.qty).toFixed(2)}</span>
    </div>`).join('');

  ['coSummary', 'coSummary2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });

  const shipping = total >= 75 ? 0 : 8.99;
  const taxRate  = 0.13; // Ontario HST — adjust per province
  const tax      = total * taxRate;
  const grandTotal = total + shipping + tax;

  ['coTotal', 'coTotal2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `
      <div style="font-size:.82rem;color:#8a7060;margin-bottom:4px;">
        <div style="display:flex;justify-content:space-between"><span>Subtotal</span><span>${CURRENCY_SYM}${total.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between"><span>Shipping</span><span>${shipping === 0 ? 'Free' : CURRENCY_SYM + shipping.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between"><span>Tax (HST 13%)</span><span>${CURRENCY_SYM}${tax.toFixed(2)}</span></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-weight:700;font-size:1rem;border-top:1px solid #ddd0c0;padding-top:10px;margin-top:6px">
        <span>Total (${CURRENCY})</span><span>${CURRENCY_SYM}${grandTotal.toFixed(2)}</span>
      </div>`;
  });

  const pa = document.getElementById('payAmount');
  if (pa) pa.textContent = grandTotal.toFixed(2);
}

// ── STRIPE ─────────────────────────────────────────────────
function initStripe() {
  if (DEMO_MODE || stripeInstance) return;
  try {
    stripeInstance = Stripe(STRIPE_KEY);
    const elements = stripeInstance.elements({ locale: 'en-CA' });
    cardElement = elements.create('card', {
      style: {
        base: {
          fontFamily: '"Jost", sans-serif',
          fontSize: '15px',
          color: '#2a1a0e',
          '::placeholder': { color: '#b0a090' }
        }
      },
      hidePostalCode: false
    });
    const mount = document.getElementById('stripe-card-mount');
    if (mount) {
      document.getElementById('demo-card-fields').style.display = 'none';
      cardElement.mount('#stripe-card-mount');
    }
  } catch (err) {
    console.warn('Stripe init:', err);
  }
}

// ── PAYMENT METHODS ────────────────────────────────────────
function switchPM(tab, btn) {
  document.querySelectorAll('.pm-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('pm-card').classList.toggle('hidden', tab !== 'card');
  document.getElementById('pm-paypal').classList.toggle('hidden', tab !== 'paypal');
  document.getElementById('pm-interac').classList.toggle('hidden', tab !== 'interac');
}

// ── CARD PAYMENT ───────────────────────────────────────────
async function processPayment() {
  const btn = event?.currentTarget || document.querySelector('.btn-co');
  if (btn) { btn.disabled = true; btn.textContent = 'Processing…'; }

  if (DEMO_MODE) {
    await new Promise(r => setTimeout(r, 2000));
    showSuccess();
    if (btn) { btn.disabled = false; }
    return;
  }

  try {
    const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = total >= 75 ? 0 : 8.99;
    const tax      = total * 0.13;
    const grand    = Math.round((total + shipping + tax) * 100);

    const res = await fetch(`${BACKEND_URL}/create-payment-intent`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ amount: grand, currency: 'cad', items: cart })
    });
    const { clientSecret } = await res.json();

    const result = await stripeInstance.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name:  document.getElementById('cName')?.value,
          email: document.getElementById('em')?.value,
          address: {
            city:    document.getElementById('city')?.value,
            postal_code: document.getElementById('zip')?.value,
            country: document.getElementById('country')?.value || 'CA'
          }
        }
      }
    });

    if (result.error) {
      showToast('❌ ' + result.error.message);
      if (btn) { btn.disabled = false; btn.textContent = `Pay ${CURRENCY_SYM}${(grand/100).toFixed(2)}`; }
    } else {
      await saveOrder('Card');
      showSuccess();
    }
  } catch (err) {
    showToast('Connection error. Please try again.');
    if (btn) btn.disabled = false;
  }
}

// ── PAYPAL ─────────────────────────────────────────────────
let paypalRendered = false;

function initPayPalButton() {
  const container = document.getElementById('paypal-button-container');
  if (!container || paypalRendered) return;

  if (DEMO_MODE || typeof paypal_sdk === 'undefined') {
    container.innerHTML = `
      <button class="btn-paypal" onclick="demoPayPal()">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/100px-PayPal.svg.png"
          alt="PayPal" style="height:18px;vertical-align:middle;filter:brightness(0) invert(1);margin-right:8px"/>
        Pay with PayPal
      </button>`;
    return;
  }

  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total >= 75 ? 0 : 8.99;
  const tax      = total * 0.13;
  const grand    = (total + shipping + tax).toFixed(2);

  paypal_sdk.Buttons({
    style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' },
    createOrder: async () => {
      const r = await fetch(`${BACKEND_URL}/paypal/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grand, currency: 'CAD', items: cart })
      });
      return (await r.json()).orderID;
    },
    onApprove: async (data) => {
      const r = await fetch(`${BACKEND_URL}/paypal/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: data.orderID })
      });
      const cap = await r.json();
      if (cap.status === 'COMPLETED') { await saveOrder('PayPal'); showSuccess(); }
    },
    onError: () => showToast('PayPal error. Please try again.')
  }).render('#paypal-button-container');
  paypalRendered = true;
}

async function demoPayPal() {
  await new Promise(r => setTimeout(r, 1800));
  showSuccess();
}

// ── INTERAC (redirect flow) ─────────────────────────────────
async function processInterac() {
  if (DEMO_MODE) { await new Promise(r => setTimeout(r, 1800)); showSuccess(); return; }
  showToast('Interac redirect will open in live mode.');
}

// ── SAVE ORDER ─────────────────────────────────────────────
async function saveOrder(method) {
  try {
    await fetch(`${BACKEND_URL}/confirm-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerData: {
          firstName: document.getElementById('fn')?.value,
          lastName:  document.getElementById('ln')?.value,
          email:     document.getElementById('em')?.value,
          phone:     document.getElementById('ph')?.value,
          address:   document.getElementById('addr')?.value,
          city:      document.getElementById('city')?.value,
          zip:       document.getElementById('zip')?.value,
          country:   document.getElementById('country')?.value || 'CA'
        },
        items: cart,
        paymentMethod: method,
        currency: CURRENCY
      })
    });
  } catch (e) { console.warn('Order save failed:', e); }
}

// ── SUCCESS ─────────────────────────────────────────────────
function showSuccess() {
  const ref = 'JWD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const el  = document.getElementById('successEmail');
  const rel = document.getElementById('successRef');
  if (el)  el.textContent  = document.getElementById('em')?.value || 'your email';
  if (rel) rel.textContent = ref;
  showStep(3);
}

function resetCart() {
  cart = [];
  updateCartUI();
}

// ── FORMATTERS ─────────────────────────────────────────────
function fmtCard(i)   { let v = i.value.replace(/\D/g,'').substring(0,16); i.value = v.match(/.{1,4}/g)?.join(' ') || v; }
function fmtExpiry(i) { let v = i.value.replace(/\D/g,'').substring(0,4); if(v.length>=2) v=v.substring(0,2)+' / '+v.substring(2); i.value=v; }
