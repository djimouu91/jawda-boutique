# JAWDA — Women's Clothing & Home Accessories

> Boutique e-commerce canadienne · Clothing & Home · Built with Node.js + Stripe + PayPal

![JAWDA](https://img.shields.io/badge/JAWDA-Boutique-3b2314?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v24-green?style=for-the-badge&logo=node.js)
![Stripe](https://img.shields.io/badge/Stripe-Canada-635bff?style=for-the-badge&logo=stripe)

## ✨ Features

- 🛍️ **12 winner products** — TikTok/Facebook Canada 2026 (clothing + home accessories)
- 💳 **3 payment methods** — Stripe (Visa/MC/Amex), PayPal, Interac e-Transfer
- 📊 **Real-time CRM Dashboard** — Orders, products, SSE live updates
- 📱 **WhatsApp notifications** — Auto-alert on new orders (Twilio or wa.me)
- 📧 **Email confirmations** — Nodemailer (Gmail SMTP)
- 🇨🇦 **Canadian-first** — CAD currency, HST 13% tax, free shipping over CA$75
- 📱 **Mobile responsive** — Hamburger nav, touch-optimized

## 🚀 Quick Start

```bash
cd server
npm install
cp .env.example .env   # fill in your API keys
node server.js
```

Open: http://localhost:3000
CRM: http://localhost:3000/dashboard

Or double-click **restart-server.bat**

## ⚙️ Configuration

Edit `server/.env`:

| Variable | Description |
|----------|-------------|
| `OWNER_PHONE` | Your WhatsApp number (e.g. +15141234567) |
| `STRIPE_SECRET_KEY` | From dashboard.stripe.com → Developers → API Keys |
| `PAYPAL_CLIENT_ID` | From developer.paypal.com |
| `EMAIL_USER` | Gmail address |
| `EMAIL_PASS` | Gmail App Password |

## 💰 How Payments Work

| Method | Settlement | Fee |
|--------|-----------|-----|
| Stripe (card) | 2 business days → your bank | 2.9% + 30¢ |
| PayPal | Transfer when you want | 3.49% + fixed |
| Interac | Instant (Auto-Deposit) | Free |

## 📁 Project Structure

```
jawda/
├── index.html          # Main storefront
├── style.css           # Brand styles (beige/brown palette)
├── ux-improvements.css # UX audit fixes (cursor, focus, touch, a11y)
├── app.js              # Products + cart logic
├── checkout.js         # Stripe CA + PayPal + Interac
├── mobile-nav.js       # Hamburger menu + UX enhancements
├── logo.svg            # Brand logo (geometric Islamic motif)
├── favicon.svg         # Browser icon
└── server/
    ├── server.js       # Express backend
    ├── services/
    │   ├── orders.js   # Order management + SSE
    │   ├── products.js # Product CRUD
    │   ├── email.js    # Nodemailer
    │   └── whatsapp.js # Twilio / wa.me links
    ├── dashboard/      # CRM (orders + products)
    └── public/         # Frontend copy (served by Express)
```

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS, Cormorant Garamond + Jost
- **Backend**: Node.js + Express
- **Payments**: Stripe Elements (CAD, en-CA locale), PayPal JS SDK
- **Notifications**: Twilio WhatsApp API + Nodemailer
- **Data**: JSON file database (orders.json, products.json)
- **Real-time**: Server-Sent Events (SSE)

---

Made with ❤️ in Canada
