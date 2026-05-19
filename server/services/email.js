const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function itemsTable(items) {
  return items.map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ebe0;">${i.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ebe0;text-align:center;">×${i.qty}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ebe0;text-align:right;font-weight:600;">$${(i.price * i.qty).toFixed(2)}</td>
    </tr>`).join('');
}

async function sendOrderConfirmation(order) {
  const total = order.items.reduce((s, i) => s + i.price * i.qty, 0);

  const html = `
  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#5c4a32;padding:32px;text-align:center;">
      <h1 style="color:#fff;font-family:Georgia,serif;letter-spacing:4px;margin:0;">JAWDA</h1>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="color:#5c4a32;margin-top:0;">Order Confirmed ✓</h2>
      <p style="color:#7a6a58;">Hi <strong>${order.customer.firstName}</strong>, thank you for your purchase!</p>
      <p style="color:#7a6a58;">Your order reference is: <strong style="color:#5c4a32;">${order.ref}</strong></p>

      <div style="background:#f5f0e8;border-radius:12px;padding:24px;margin:28px 0;">
        <h3 style="margin:0 0 16px;color:#3a2e22;">Order Summary</h3>
        <table style="width:100%;border-collapse:collapse;color:#3a2e22;">
          <thead>
            <tr style="font-size:0.8rem;color:#7a6a58;text-transform:uppercase;letter-spacing:1px;">
              <th style="text-align:left;padding-bottom:8px;">Product</th>
              <th style="text-align:center;padding-bottom:8px;">Qty</th>
              <th style="text-align:right;padding-bottom:8px;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsTable(order.items)}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding-top:14px;font-weight:700;color:#5c4a32;">Total</td>
              <td style="padding-top:14px;font-weight:700;color:#5c4a32;text-align:right;">$${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="margin-bottom:28px;">
        <h3 style="color:#3a2e22;">Shipping To</h3>
        <p style="color:#7a6a58;margin:4px 0;">${order.customer.firstName} ${order.customer.lastName}</p>
        <p style="color:#7a6a58;margin:4px 0;">${order.customer.address}, ${order.customer.city} ${order.customer.zip}</p>
        <p style="color:#7a6a58;margin:4px 0;">${order.customer.country}</p>
      </div>

      <p style="color:#7a6a58;font-size:0.9rem;">We will notify you when your order ships. If you have any questions, reply to this email.</p>
    </div>
    <div style="background:#f5f0e8;padding:20px;text-align:center;">
      <p style="color:#7a6a58;font-size:0.8rem;margin:0;">© 2025 JAWDA Boutique · Quality in every detail.</p>
    </div>
  </div>`;

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || 'JAWDA Boutique <noreply@jawda.com>',
    to:      order.customer.email,
    subject: `✓ Order Confirmed — ${order.ref} | JAWDA`,
    html
  });
}

async function sendShippingNotification(order) {
  const html = `
  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#5c4a32;padding:32px;text-align:center;">
      <h1 style="color:#fff;font-family:Georgia,serif;letter-spacing:4px;margin:0;">JAWDA</h1>
    </div>
    <div style="padding:40px 32px;text-align:center;">
      <div style="font-size:3rem;margin-bottom:16px;">📦</div>
      <h2 style="color:#5c4a32;">Your Order Has Shipped!</h2>
      <p style="color:#7a6a58;">Hi <strong>${order.customer.firstName}</strong>, great news — your order <strong>${order.ref}</strong> is on its way!</p>
      ${order.trackingNumber ? `
      <div style="background:#f5f0e8;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="margin:0;color:#7a6a58;font-size:0.9rem;">Tracking Number</p>
        <p style="margin:8px 0 0;font-size:1.3rem;font-weight:700;color:#5c4a32;">${order.trackingNumber}</p>
        ${order.carrier ? `<p style="margin:4px 0 0;color:#7a6a58;font-size:0.85rem;">via ${order.carrier}</p>` : ''}
      </div>` : ''}
      <p style="color:#7a6a58;font-size:0.9rem;">Estimated delivery: <strong>3–7 business days</strong></p>
    </div>
    <div style="background:#f5f0e8;padding:20px;text-align:center;">
      <p style="color:#7a6a58;font-size:0.8rem;margin:0;">© 2025 JAWDA Boutique</p>
    </div>
  </div>`;

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      order.customer.email,
    subject: `📦 Your order ${order.ref} has shipped! | JAWDA`,
    html
  });
}

module.exports = { sendOrderConfirmation, sendShippingNotification };
