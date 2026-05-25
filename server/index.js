require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import blueprints
const User = require('./models/User');
const Fault = require('./models/Fault'); 
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log('✅ Connected to the Vault (MongoDB)'))
  .catch(err => console.error('❌ Database connection failed:', err));

// --- AUTHENTICATION ROUTES ---

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body; 

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const newUser = new User({ name, email, passwordHash: password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully!',
      user: { name: newUser.name, email: newUser.email, createdAt: newUser.createdAt, updatedAt: newUser.updatedAt },
      token: token 
    });
  } catch (error) {
    console.error("🔥 CRASH REPORT:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password); // Standard password check
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Authentication successful!',
      user: { name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt },
      token: token 
    });
  } catch (error) {
    console.error("🔥 CRASH REPORT:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// UPDATE PROFILE
app.put('/api/user/name', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name cannot be empty.' });

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, { name: name }, { new: true });
    res.status(200).json({ message: 'Profile updated.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// --- FAULT LOGGING ROUTES (Replaced Notes) ---

// FETCH ALL FAULTS
app.get('/api/faults', auth, async (req, res) => {
  try {
    const faults = await Fault.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    res.status(200).json(faults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch faults.' });
  }
});

// CREATE NEW FAULT
app.post('/api/faults', auth, async (req, res) => {
  try {
    const { equipment, description, priority } = req.body;

    const newFault = new Fault({
      userId: req.user.userId,
      equipment: equipment || 'Unknown Equipment',
      description: description || 'No description provided',
      priority: priority || 'Medium'
    });

    await newFault.save();
    res.status(201).json(newFault);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log fault.' });
  }
});

// UPDATE EXISTING FAULT
app.put('/api/faults/:id', auth, async (req, res) => {
  try {
    const { equipment, description, status, priority } = req.body;

    const updatedFault = await Fault.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { equipment, description, status, priority },
      { new: true } 
    );

    res.status(200).json(updatedFault);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fault.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});