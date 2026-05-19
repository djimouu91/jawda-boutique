// ═══════════════════════════════════════════════════════════
// JAWDA — WhatsApp Service
//
// MODE AUTO-DETECT:
//   TWILIO_ACCOUNT_SID configuré → messages envoyés automatiquement
//   Non configuré             → liens wa.me générés dans le CRM
// ═══════════════════════════════════════════════════════════

const TWILIO_SID   = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN  || '';
const FROM         = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
const OWNER_PHONE  = process.env.OWNER_PHONE || ''; // ex: +15141234567

const TWILIO_ENABLED = TWILIO_SID.startsWith('AC') && TWILIO_SID.length > 20
                    && !TWILIO_SID.includes('xxx');

const client = TWILIO_ENABLED
  ? require('twilio')(TWILIO_SID, TWILIO_TOKEN)
  : null;

// ── Génère un lien wa.me cliquable ──────────────────────────
function waLink(phone, message) {
  const clean = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${encoded}`;
}

// ── Envoie via Twilio OU logue le lien wa.me ────────────────
async function send(toPhone, body) {
  const to = toPhone.startsWith('whatsapp:') ? toPhone : `whatsapp:${toPhone}`;

  if (TWILIO_ENABLED) {
    try {
      await client.messages.create({ from: FROM, to, body });
      console.log(`✅ WhatsApp envoyé → ${toPhone}`);
    } catch (err) {
      console.warn(`⚠️  WhatsApp Twilio erreur: ${err.message}`);
    }
  } else {
    // Mode libre — affiche lien wa.me dans la console
    const phone = toPhone.replace('whatsapp:', '').trim();
    console.log(`\n📱 [WhatsApp — cliquer pour envoyer]\n${waLink(phone, body)}\n`);
  }
}

// ── Retourne l'URL wa.me pour le CRM (bouton vert) ──────────
function getWaLink(phone, message) {
  if (!phone) return null;
  const clean = phone.replace(/\D/g, '');
  if (!clean) return null;
  return waLink(clean, message);
}

// ══════════════════════════════════════════════════════
//  MESSAGES
// ══════════════════════════════════════════════════════

// 1. Alerte propriétaire — nouvelle commande
async function notifyOwnerNewOrder(order) {
  if (!OWNER_PHONE) {
    console.log('ℹ️  OWNER_PHONE non configuré dans .env — ajoutez votre numéro WhatsApp');
    return;
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

// ── Liens wa.me pour le CRM (sans Twilio) ──────────────────
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
  getCustomerWaLink,
  getOwnerWaLink,
  TWILIO_ENABLED
};
