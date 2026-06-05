const Razorpay = require('razorpay');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amount, currency = 'USD', receipt } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    if (error.statusCode === 401) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    return res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};
