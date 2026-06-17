require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with .env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create the Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bvltra_relay_faults',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1000, crop: 'limit' }]
  },
});

// Tell multer to use Cloudinary instead of the local hard drive
const upload = multer({ storage: storage });
// ----------------------------

const User = require('./models/User');
const Fault = require('./models/Fault');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to the Vault (MongoDB)'))
  .catch(err => console.error('❌ Database connection failed:', err));

// --- AUTHENTICATION ROUTES (Unchanged) ---
app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, email, password, branch, role } = req.body;
    if (!name || !surname || !email || !password || !branch || !role) return res.status(400).json({ error: 'All fields are required.' });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered.' });
    const newUser = new User({ name, surname, email, passwordHash: password, branch, role });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Account created!', user: { name: newUser.name, surname: newUser.surname, email: newUser.email, branch: newUser.branch, role: newUser.role }, token: token });
  } catch (error) { res.status(500).json({ error: 'Internal server error.' }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: 'Invalid email or password.' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Authentication successful!', user: { name: user.name, surname: user.surname, email: user.email, branch: user.branch, role: user.role }, token: token });
  } catch (error) { res.status(500).json({ error: 'Internal server error.' }); }
});

// --- FAULT LOGGING ROUTES ---
app.get('/api/faults', auth, async (req, res) => {
  try {
    const faults = await Fault.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    res.status(200).json(faults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch faults.' });
  }
});

app.post('/api/faults', auth, upload.single('image'), async (req, res) => {
  try {
    const { equipment, description, priority, shift, area, dateRaised, tagType, actionToBeTaken } = req.body;

    const imageUrl = req.file ? req.file.path : '';

    const newFault = new Fault({
      userId: req.user.userId,
      equipment,
      description,
      priority,
      shift,
      area,
      dateRaised,
      tagType,
      actionToBeTaken,
      imageUrl
    });

    await newFault.save();
    res.status(201).json(newFault);
  } catch (error) {
    console.error("🔥 CRASH REPORT:", error);
    res.status(500).json({ error: 'Failed to log fault.' });
  }
});

// Local Development: Run as a standard server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local server listening on port ${PORT}`));
}

// Vercel Production: Export the app as a serverless function
module.exports = app;