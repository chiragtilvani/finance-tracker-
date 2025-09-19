// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Income = require('../models/Income');
// const verifyToken = require('../middleware/verifyToken'); 


// const router = express.Router();

// // Signup
// router.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.json({ success: false, message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     res.json({ success: true, message: 'User registered' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.json({ success: false, message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ success: true, token, user: { username: user.username, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });


// //user route
// router.get('/user', verifyToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select('username');
//     res.json({ success: true, user });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Failed to fetch user' });
//   }
// });


// // Add Income
// router.post('/income', async (req, res) => {
//   const { source, icon, amount, date } = req.body;
//   try {
//     const income = new Income({
//       user: req.userId,
//       source, icon, amount, date
//     });
//     const saved = await income.save();
//     res.status(201).json({ success: true, income:saved });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Failed to add income.' });
//   }
// });

// // Get User Incomes
// router.get('/income', async (req, res) => {
//   try {
//     const incomes = await Income.find({ user: req.userId }).sort({ date: -1 });
//     res.json({ success: true, incomes });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Failed to fetch incomes.' });
//   }
// });






// module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Income = require('../models/Income');
const verifyToken = require('../middleware/verifyToken'); 
const Expense = require('../models/Expense');


const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: 'User registered' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token, user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


//user route
router.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

// Add Income
// Add Income
router.post('/income', verifyToken, async (req, res) => {
  const { source, icon, amount, date } = req.body;

  try {
    const userDoc = await User.findById(req.userId); //Fetch user
    if (!userDoc) return res.status(404).json({ success: false, message: 'User not found' });

    const income = new Income({
      user: req.userId,
      username: userDoc.username,
      source,
      icon,
      amount,
      date
    });

    const saved = await income.save();
    res.status(201).json({ success: true, income: saved });
  } catch (err) {
    console.error('Error saving income:', err);
    res.status(500).json({ success: false, message: 'Failed to add income.' });
  }
});


// Get User Incomes
router.get('/income', verifyToken, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.userId }).sort({ date: -1 });
    res.json({ success: true, incomes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch incomes.' });
  }
});

// DELETE income by ID
router.delete('/income/:id', verifyToken, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    res.json({ success: true, message: 'Income deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update Income
router.put('/income/:id', verifyToken, async (req, res) => {
  try {
    const { source, icon, amount, date } = req.body;
    
    // Validate required fields
    if (!source || !amount || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const updatedIncome = await Income.findOneAndUpdate(
      { 
        _id: req.params.id, 
        user: req.userId // Ensure the income belongs to the requesting user
      },
      { 
        source, 
        icon: icon || '💰', 
        amount: Number(amount), 
        date: new Date(date) 
      },
      { new: true } // Return the updated document
    );

    if (!updatedIncome) {
      return res.status(404).json({ 
        success: false, 
        message: 'Income not found or not owned by user' 
      });
    }

    res.json({ 
      success: true, 
      income: updatedIncome 
    });
  } catch (err) {
    console.error('Error updating income:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating income',
      error: err.message 
    });
  }
});

// Add Expense
router.post('/expense', verifyToken, async (req, res) => {
  const { category, icon, amount, date, paymentMethod } = req.body;

  try {
    const userDoc = await User.findById(req.userId);
    if (!userDoc) return res.status(404).json({ success: false, message: 'User not found' });

    const expense = new Expense({
      user: req.userId,
      username: userDoc.username,
      category,
      icon,
      amount,
      date,
      paymentMethod
    });

    const saved = await expense.save();
    res.status(201).json({ success: true, expense: saved });
  } catch (err) {
    console.error('Error saving expense:', err);
    res.status(500).json({ success: false, message: 'Failed to add expense.' });
  }
});

// Get User Expenses
router.get('/expense', verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
    res.json({ success: true, expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch expenses.' });
  }
});

// Update Expense
router.put('/expense/:id', verifyToken, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, expense });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update expense.' });
  }
});

// DELETE Expense by ID
router.delete('/expense/:id', verifyToken, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router; 