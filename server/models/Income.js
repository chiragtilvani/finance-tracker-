
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  source: { type: String, required: true },
  icon: { type: String, default: '💰' },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Income', incomeSchema);