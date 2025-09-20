const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/Auth');

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// ✅ MUST COME BEFORE ROUTES
app.use(express.json());

// ✅ Now routes will receive req.body correctly
app.use('/api/auth', authRoutes);

// DB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(5000, () => console.log('✅ Server running on http://localhost:5000', 'cors origin: ', process.env.FRONTEND_URL));
})
.catch(err => console.error('❌ MongoDB Error:', err.message));
