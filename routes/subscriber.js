const express    = require('express');
const router     = express.Router();
const Subscriber = require('../models/subscriber');
const { sendEmail, welcomeSubscriberHtml } = require('../utils/mailer');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /subscribe
router.post('/subscribe', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  try {
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      if (existing.active) {
        return res.json({ success: true, message: "You're already subscribed! Check your inbox for our latest recipes." });
      }
      existing.active = true;
      await existing.save();
      sendEmail({
        to:      existing.email,
        subject: '🍳 Welcome back to Recipe Haven!',
        html:    welcomeSubscriberHtml(existing.email, existing.unsubscribeToken),
      }).catch(e => console.error('Email error:', e.message));
      return res.json({ success: true, message: "Welcome back! You've been re-subscribed. 🎉" });
    }

    const subscriber = await Subscriber.create({ email });
    sendEmail({
      to:      subscriber.email,
      subject: '🍳 Welcome to Recipe Haven Newsletter!',
      html:    welcomeSubscriberHtml(subscriber.email, subscriber.unsubscribeToken),
    }).catch(e => console.error('Email error:', e.message));

    res.json({ success: true, message: "You're subscribed! Check your inbox for a welcome email. 🎉" });

  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
});

// GET /unsubscribe/:token
router.get('/unsubscribe/:token', async (req, res) => {
  try {
    const subscriber = await Subscriber.findOne({ unsubscribeToken: req.params.token });
    if (!subscriber) {
      req.flash('error', 'Invalid or expired unsubscribe link.');
      return res.redirect('/listings');
    }
    subscriber.active = false;
    await subscriber.save();
    req.flash('success', "You've been unsubscribed from Recipe Haven newsletters.");
    res.redirect('/listings');
  } catch (err) {
    console.error('Unsubscribe error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/listings');
  }
});

module.exports = router;
