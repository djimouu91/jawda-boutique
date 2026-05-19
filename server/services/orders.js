const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'orders.json');

// SSE clients subscribed to real-time updates
const sseClients = new Set();

function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

function readOrders() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeOrders(orders) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2));
}

function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(res => {
    try { res.write(msg); } catch (_) { sseClients.delete(res); }
  });
}

function createOrder(orderData) {
  const orders = readOrders();
  const order  = {
    ...orderData,
    status:    'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [{ status: 'pending', date: new Date().toISOString(), note: 'Order placed' }]
  };
  orders.unshift(order);
  writeOrders(orders);
  broadcast('new-order', order);
  return order;
}

function updateOrderStatus(ref, status, note = '', extra = {}) {
  const orders = readOrders();
  const idx    = orders.findIndex(o => o.ref === ref);
  if (idx === -1) return null;

  orders[idx].status    = status;
  orders[idx].updatedAt = new Date().toISOString();
  orders[idx].timeline.push({ status, date: new Date().toISOString(), note });
  Object.assign(orders[idx], extra);

  writeOrders(orders);
  broadcast('order-updated', orders[idx]);
  return orders[idx];
}

function getOrders(filters = {}) {
  let orders = readOrders();
  if (filters.status) orders = orders.filter(o => o.status === filters.status);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    orders = orders.filter(o =>
      o.ref.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(q)
    );
  }
  return orders;
}

function getStats() {
  const orders = readOrders();
  const total  = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.price * i.qty, 0), 0);
  return {
    total:      orders.length,
    pending:    orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped:    orders.filter(o => o.status === 'shipped').length,
    delivered:  orders.filter(o => o.status === 'delivered').length,
    cancelled:  orders.filter(o => o.status === 'cancelled').length,
    revenue:    parseFloat(total.toFixed(2))
  };
}

module.exports = { createOrder, updateOrderStatus, getOrders, getStats, sseClients, broadcast };
