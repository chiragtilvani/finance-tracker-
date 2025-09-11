const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: '🧾' },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['cash', 'credit card', 'debit card', 'upi', 'bank transfer', 'other'],
    default: 'cash'
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);