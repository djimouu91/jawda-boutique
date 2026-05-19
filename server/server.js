require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const { v4: uuid } = require('uuid');
const stripe   = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal   = require('@paypal/checkout-server-sdk');

const email       = require('./services/email');
const whatsapp    = require('./services/whatsapp');
const ordersSvc   = require('./services/orders');
const productsSvc = require('./services/products');

const app  = express();
const PORT = process.env.PORT || 3000;

// ===== PAYPAL =====
function getPayPalClient() {
  const env = process.env.PAYPAL_MODE === 'live'
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
  return new paypal.core.PayPalHttpClient(env);
}

// ===== MIDDLEWARE =====
app.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
// Serve CRM dashboard
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));
// Serve frontend (jawda boutique) — must be before app.get('/')
app.use(express.static(path.join(__dirname, 'public')));

// ===== HEALTH (API only) =====
app.get('/api/status', (req, res) => {
  res.json({
    status: 'JAWDA server running ✅',
    stripe: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'live' : 'test',
    paypal: process.env.PAYPAL_MODE || 'sandbox'
  });
});

// =============================================
// STRIPE
// =============================================
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'usd', items } = req.body;
  if (!amount || amount < 50) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const pi = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { source: 'JAWDA', items: JSON.stringify(items?.map(i => `${i.name} x${i.qty}`) ?? []) }
    });
    res.json({ clientSecret: pi.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function handleStripeWebhook(req, res) {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi    = event.data.object;
    const order = ordersSvc.updateOrderStatus(pi.metadata.orderRef, 'processing', 'Payment confirmed by Stripe');
    if (order) {
      await Promise.allSettled([
        email.sendOrderConfirmation(order),
        whatsapp.notifyOwnerNewOrder(order),
        whatsapp.confirmOrderToCustomer(order, order.customer.phone)
      ]);
    }
  }
  res.json({ received: true });
}

// =============================================
// PAYPAL
// =============================================
app.post('/paypal/create-order', async (req, res) => {
  const { amount, currency = 'USD', items } = req.body;
  if (!amount) return res.status(400).json({ error: 'Amount required' });

  const req2 = new paypal.orders.OrdersCreateRequest();
  req2.prefer('return=representation');
  req2.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: { currency_code: currency, value: parseFloat(amount).toFixed(2) },
      description: 'JAWDA Boutique Order'
    }]
  });

  try {
    const order = await getPayPalClient().execute(req2);
    res.json({ orderID: order.result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/paypal/capture-order', async (req, res) => {
  const { orderID, customerData, items } = req.body;
  if (!orderID) return res.status(400).json({ error: 'orderID required' });

  const req2 = new paypal.orders.OrdersCaptureRequest(orderID);
  req2.requestBody({});

  try {
    const capture = await getPayPalClient().execute(req2);
    if (capture.result.status === 'COMPLETED') {
      const order = await finalizeOrder({ customerData, items, paymentMethod: 'PayPal', paymentId: orderID });
      res.json({ status: 'COMPLETED', orderID, ref: order.ref });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// ORDER FINALIZATION (Stripe + PayPal share this)
// =============================================
async function finalizeOrder({ customerData, items, paymentMethod, paymentId }) {
  const ref   = 'JWD-' + uuid().substring(0, 8).toUpperCase();
  const order = ordersSvc.createOrder({ ref, customer: customerData, items, paymentMethod, paymentId });

  await Promise.allSettled([
    email.sendOrderConfirmation(order),
    whatsapp.notifyOwnerNewOrder(order),
    whatsapp.confirmOrderToCustomer(order, customerData.phone)
  ]);

  return order;
}

// Called from frontend after Stripe payment succeeds (non-webhook flow)
app.post('/confirm-order', async (req, res) => {
  const { customerData, items, paymentMethod, paymentId } = req.body;
  try {
    const order = await finalizeOrder({ customerData, items, paymentMethod: paymentMethod || 'Card', paymentId });
    res.json({ success: true, ref: order.ref });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// PRODUCTS API
// =============================================
app.get('/api/products', (req, res) => res.json(productsSvc.getActive()));
app.get('/api/products/all', (req, res) => res.json(productsSvc.getAll()));

app.post('/api/products', (req, res) => {
  const { name, price, category, img, badge } = req.body;
  if (!name || !price || !category) return res.status(400).json({ error: 'name, price and category required' });
  res.status(201).json(productsSvc.create({ name, price: parseFloat(price), category, img: img || '', badge: badge || null }));
});

app.put('/api/products/:id', (req, res) => {
  const product = productsSvc.update(req.params.id, req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
  if (!productsSvc.remove(req.params.id)) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

// =============================================
// CRM — ORDERS API
// =============================================
app.get('/api/orders', (req, res) => {
  const orders = ordersSvc.getOrders({ status: req.query.status, search: req.query.search });
  res.json(orders);
});

app.get('/api/orders/stats', (req, res) => {
  res.json(ordersSvc.getStats());
});

app.patch('/api/orders/:ref/status', async (req, res) => {
  const { status, note, trackingNumber, carrier } = req.body;
  const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const order = ordersSvc.updateOrderStatus(req.params.ref, status, note, { trackingNumber, carrier });
  if (!order) return res.status(404).json({ error: 'Order not found' });

  // Send WhatsApp + email notifications on key status changes
  if (status === 'shipped') {
    await Promise.allSettled([
      email.sendShippingNotification(order),
      whatsapp.notifyShipped(order, order.customer.phone),
      whatsapp.notifyOwnerStatusChange(order, status)
    ]);
  } else if (status === 'delivered') {
    await Promise.allSettled([
      whatsapp.notifyDelivered(order, order.customer.phone),
      whatsapp.notifyOwnerStatusChange(order, status)
    ]);
  } else {
    await Promise.allSettled([whatsapp.notifyOwnerStatusChange(order, status)]);
  }

  res.json(order);
});

// =============================================
// SSE — Real-time CRM updates
// =============================================
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  // Send initial stats
  res.write(`event: stats\ndata: ${JSON.stringify(ordersSvc.getStats())}\n\n`);

  ordersSvc.sseClients.add(res);
  req.on('close', () => ordersSvc.sseClients.delete(res));
});

// =============================================
// START
// =============================================
app.listen(PORT, () => {
  console.log(`\n🚀 JAWDA server  →  http://localhost:${PORT}`);
  console.log(`📊 CRM Dashboard →  http://localhost:${PORT}/dashboard`);
  console.log(`   Stripe : ${process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? '🟢 LIVE' : '🟡 TEST'}`);
  console.log(`   PayPal : ${process.env.PAYPAL_MODE === 'live' ? '🟢 LIVE' : '🟡 SANDBOX'}\n`);
});
