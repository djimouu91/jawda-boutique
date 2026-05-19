const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'products.json');

const DEFAULT_PRODUCTS = [
  { id: '1', category: 'clothing', name: 'Linen Wrap Dress',       price: 89.00,  badge: 'New',         img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', active: true },
  { id: '2', category: 'clothing', name: 'Classic Beige Blazer',   price: 120.00, badge: 'Best Seller',  img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b7c1c?w=600&q=80', active: true },
  { id: '3', category: 'clothing', name: 'Silk Midi Skirt',        price: 74.00,  badge: null,           img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80', active: true },
  { id: '4', category: 'clothing', name: 'Cotton Knit Sweater',    price: 65.00,  badge: 'New',          img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80', active: true },
  { id: '5', category: 'home',     name: 'Ceramic Vase Set',       price: 48.00,  badge: 'New',          img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', active: true },
  { id: '6', category: 'home',     name: 'Woven Throw Blanket',    price: 55.00,  badge: 'Best Seller',  img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', active: true },
  { id: '7', category: 'home',     name: 'Scented Candle Collection', price: 32.00, badge: null,         img: 'https://images.unsplash.com/photo-1602607196742-5525e7b7499e?w=600&q=80', active: true },
  { id: '8', category: 'home',     name: 'Rattan Storage Basket',  price: 42.00,  badge: 'New',          img: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&q=80', active: true }
];

function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_PRODUCTS, null, 2));
}

function getAll()  { ensureDB(); return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
function save(arr) { ensureDB(); fs.writeFileSync(DB_PATH, JSON.stringify(arr, null, 2)); }

function getActive() { return getAll().filter(p => p.active !== false); }

function create(data) {
  const all = getAll();
  const product = { ...data, id: Date.now().toString(), active: true };
  all.push(product);
  save(all);
  return product;
}

function update(id, data) {
  const all = getAll();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...data, id };
  save(all);
  return all[idx];
}

function remove(id) {
  const all = getAll();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return false;
  all.splice(idx, 1);
  save(all);
  return true;
}

module.exports = { getAll, getActive, create, update, remove };
