// ═══════════════════════════════════════════════════════════
// JAWDA — WhatsApp Service (Meta WhatsApp Business API)
//
// MODE AUTO-DETECT:
//   META_WA_PHONE_ID + META_WA_TOKEN configurés → messages auto
//   Non configurés                              → liens wa.me dans CRM
// ═══════════════════════════════════════════════════════════

const https      = require('https');
const OWNER_PHONE = process.env.OWNER_PHONE || '';

const META_PHONE_ID = process.env.META_WA_PHONE_ID || '';
const META_TOKEN    = process.env.META_WA_TOKEN    || '';
const ORDER_TEMPLATE_NAME = process.env.META_WA_ORDER_TEMPLATE || 'jawda_new_order_alert';
const ORDER_TEMPLATE_LANG = process.env.META_WA_ORDER_TEMPLATE_LANG || 'fr_CA';

// Meta est activé seulement si les deux valeurs sont configurées.
// Sinon le CRM garde les liens wa.me comme plan B.
const META_ENABLED = Boolean(META_PHONE_ID && META_TOKEN && !META_TOKEN.includes('YOUR'));

// ── Génère un lien wa.me cliquable ──────────────────────────
function waLink(phone, message) {
  const clean   = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${encoded}`;
}

// ── Envoie via Meta Graph API ────────────────────────────────
function sendMetaMessage(toPhone, bodyText) {
  return new Promise((resolve, reject) => {
    // Nettoyer le numéro (enlever +, espaces)
    const to = toPhone.replace(/[^0-9]/g, '');

    const payload = JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: bodyText }
    });

    const options = {
      hostname: 'graph.facebook.com',
      path: `/v19.0/${META_PHONE_ID}/messages`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${META_TOKEN}`,
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log(`✅ WhatsApp (Meta) envoyé → +${to}`);
          resolve(parsed);
        } else {
          console.warn(`⚠️  WhatsApp Meta erreur [${res.statusCode}]:`, data);
          reject(new Error(data));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function sendMetaTemplate(toPhone, templateName = 'hello_world', languageCode = 'en_US', components = []) {
  return new Promise((resolve, reject) => {
    const to = toPhone.replace(/[^0-9]/g, '');

    const payload = JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        ...(components.length ? { components } : {})
      }
    });

    const options = {
      hostname: 'graph.facebook.com',
      path: `/v19.0/${META_PHONE_ID}/messages`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${META_TOKEN}`,
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log(`✅ WhatsApp template (${templateName}) envoyé → +${to}`, parsed);
          resolve(parsed);
        } else {
          console.warn(`⚠️  WhatsApp template erreur [${res.statusCode}]:`, data);
          reject(new Error(data));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ── Envoie via Meta OU logue le lien wa.me ──────────────────
async function send(toPhone, body) {
  if (META_ENABLED) {
    try {
      await sendMetaMessage(toPhone, body);
    } catch (err) {
      console.warn('⚠️  Meta WhatsApp échoué — fallback wa.me');
      const phone = toPhone.replace(/[^0-9]/g, '');
      console.log(`\n📱 [WhatsApp fallback]\n${waLink(phone, body)}\n`);
    }
  } else {
    const phone = toPhone.replace(/[^0-9]/g, '');
    console.log(`\n📱 [WhatsApp — cliquer pour envoyer]\n${waLink(phone, body)}\n`);
  }
}

async function sendOwnerTestMessage() {
  if (!OWNER_PHONE) {
    throw new Error('OWNER_PHONE non configuré dans .env');
  }

  const body =
`✅ Test WhatsApp Business API — JAWDA

Si tu reçois ce message, ton site JAWDA est bien lié à WhatsApp Business.

Les prochaines commandes pourront déclencher une notification automatique ici.`;

  await send(OWNER_PHONE, body);
}

async function sendOwnerTemplateTestMessage() {
  if (!OWNER_PHONE) {
    throw new Error('OWNER_PHONE non configuré dans .env');
  }
  await sendMetaTemplate(OWNER_PHONE, 'hello_world', 'en_US');
}

async function sendOwnerOrderTemplate(order) {
  if (!OWNER_PHONE) {
    throw new Error('OWNER_PHONE non configuré dans .env');
  }

  const c = order.customerData || order.customer || {};
  const items = (order.items || [])
    .map(i => `${i.name} x${i.qty}`)
    .join(', ')
    .slice(0, 900);
  const total = order.total || (order.items || [])
    .reduce((s, i) => s + Number(i.price || 0) * Number(i.qty || 1), 0)
    .toFixed(2);

  await sendMetaTemplate(OWNER_PHONE, ORDER_TEMPLATE_NAME, ORDER_TEMPLATE_LANG, [{
    type: 'body',
    parameters: [
      { type: 'text', parameter_name: 'order_ref',   text: order.ref || 'JWD-TEST' },
      { type: 'text', parameter_name: 'order_total', text: `CA$${total}` }
    ]
  }]);
}

async function sendOwnerOrderTemplateTestMessage() {
  await sendOwnerOrderTemplate({
    ref: 'JWD-TEMPLATE',
    total: '0.57',
    paymentMethod: 'Stripe',
    customer: {
      firstName: 'Client',
      lastName: 'Test',
      email: 'test@example.com',
      phone: OWNER_PHONE,
      city: 'Ottawa',
      country: 'Canada'
    },
    items: [{ name: 'Test Product', price: 0.5, qty: 1 }]
  });
}

// ── Retourne l'URL wa.me pour le CRM (bouton vert) ──────────
function getWaLink(phone, message) {
  if (!phone) return null;
  const clean = phone.replace(/\D/g, '');
  if (!clean) return null;
  return waLink(clean, message);
}

// ══════════════════════════════════════════════════════════════
//  MESSAGES
// ══════════════════════════════════════════════════════════════

// 1. Alerte propriétaire — nouvelle commande
async function notifyOwnerNewOrder(order) {
  if (!OWNER_PHONE) {
    console.log('ℹ️  OWNER_PHONE non configuré dans .env');
    return;
  }

  if (META_ENABLED && ORDER_TEMPLATE_NAME) {
    try {
      await sendOwnerOrderTemplate(order);
      return;
    } catch (err) {
      console.warn('Template WhatsApp commande échoué — fallback message libre:', err.message);
    }
  }

  const subtotal = (order.items || []).reduce((s, i) => s + i.price * i.qty, 0);
  const items    = (order.items || []).map(i => `  • ${i.name} ×${i.qty}`).join('\n');
  const c        = order.customerData || order.customer || {};

  const body =
`🛍️ *Nouvelle commande — JAWDA*
──────────────────
📋 Réf: *${order.ref}*
👤 ${c.firstName || ''} ${c.lastName || ''}
📧 ${c.email || ''}
📱 ${c.phone || 'Pas de téléphone'}
📍 ${c.city || ''}, ${c.country || c.province || 'CA'}
──────────────────
${items}
──────────────────
💰 Total: *CA$${order.total || subtotal.toFixed(2)}*
💳 Paiement: ${order.paymentMethod || ''}
──────────────────
📊 Dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;

  await send(OWNER_PHONE, body);
}

// 2. Confirmation automatique au client
async function confirmOrderToCustomer(order, customerPhone) {
  if (!customerPhone) return;
  const c = order.customerData || order.customer || {};

  const body =
`✅ *Commande confirmée — JAWDA*

Bonjour ${c.firstName || ''} ! 🎉
Votre commande *${order.ref}* est bien reçue.

💰 Total: *CA$${order.total || ''}*
📍 Livraison à: ${c.city || ''}

Nous vous préviendrons dès l'expédition!
Merci d'avoir choisi JAWDA 🛍️`;

  await send(customerPhone, body);
}

// 3. Notification expédition → client
async function notifyShipped(order, customerPhone) {
  if (!customerPhone) return;
  const c = order.customerData || order.customer || {};

  const body =
`📦 *Votre commande est en route! — JAWDA*

Bonjour ${c.firstName || ''} !
Votre commande *${order.ref}* a été expédiée 🚚

${order.trackingNumber ? `📬 Numéro de suivi: *${order.trackingNumber}*` : ''}
⏱️ Délai estimé: 3–7 jours ouvrables

Merci de votre confiance ✨`;

  await send(customerPhone, body);
}

// 4. Livraison confirmée → client
async function notifyDelivered(order, customerPhone) {
  if (!customerPhone) return;
  const c = order.customerData || order.customer || {};

  const body =
`🎉 *Commande livrée — JAWDA*

Bonjour ${c.firstName || ''} !
Votre commande *${order.ref}* a été livrée! 📬

Nous espérons que vous adorez vos achats 💛
Un petit avis nous ferait tellement plaisir!

— L'équipe JAWDA`;

  await send(customerPhone, body);
}

// 5. Alerte propriétaire — changement de statut
async function notifyOwnerStatusChange(order, newStatus) {
  if (!OWNER_PHONE) return;
  const emoji = { pending:'🕐', processing:'⚙️', shipped:'🚚', delivered:'✅', cancelled:'❌' };
  const c     = order.customerData || order.customer || {};

  const body =
`${emoji[newStatus] || '📋'} *Statut mis à jour — JAWDA*

📋 Réf: *${order.ref}*
👤 ${c.firstName || ''} ${c.lastName || ''}
🔄 Nouveau statut: *${newStatus.toUpperCase()}*`;

  await send(OWNER_PHONE, body);
}

// ── Liens wa.me pour le CRM (bouton vert) ───────────────────
function getCustomerWaLink(order) {
  const c     = order.customerData || order.customer || {};
  const phone = c.phone;
  if (!phone) return null;

  const msg =
`Bonjour ${c.firstName || ''} ! Ici JAWDA 👋
Concernant votre commande *${order.ref}*:
`;
  return getWaLink(phone, msg);
}

function getOwnerWaLink(order) {
  if (!OWNER_PHONE) return null;
  const c    = order.customerData || order.customer || {};
  const items = (order.items || []).map(i => `${i.name} ×${i.qty}`).join(', ');
  const msg  = `Nouvelle commande ${order.ref} — ${c.firstName} ${c.lastName} — ${items} — CA$${order.total}`;
  return getWaLink(OWNER_PHONE, msg);
}

module.exports = {
  notifyOwnerNewOrder,
  confirmOrderToCustomer,
  notifyShipped,
  notifyDelivered,
  notifyOwnerStatusChange,
  sendOwnerTestMessage,
  sendOwnerTemplateTestMessage,
  sendOwnerOrderTemplateTestMessage,
  getCustomerWaLink,
  getOwnerWaLink,
  META_ENABLED
};
