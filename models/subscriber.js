const mongoose = require('mongoose');
const crypto   = require('crypto');

const subscriberSchema = new mongoose.Schema({
  email: {
    type:     String,
    required: true,
    unique:   true,
    lowercase: true,
    trim:     true,
  },
  subscribedAt:     { type: Date,    default: Date.now },
  unsubscribeToken: { type: String,  default: () => crypto.randomBytes(32).toString('hex') },
  active:           { type: Boolean, default: true },
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
