require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
// Blueprints
const User = require('./models/User');
const Fault = require('./models/Fault');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure Multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Save to the uploads folder
  },
  filename: function (req, file, cb) {
    // Rename file to prevent overwriting (timestamp + original extension)
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

const User = require('./models/User');
const Fault = require('./models/Fault');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Expose upload folder so the frontend can request the images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(uri)
  .then(() => console.log('✅ Connected to the Vault (MongoDB)'))
  .catch(err => console.error('❌ Database connection failed:', err));

// --- AUTHENTICATION ROUTES ---

app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, email, password, branch, role } = req.body;

    if (!name || !surname || !email || !password || !branch || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const newUser = new User({ name, surname, email, passwordHash: password, branch, role });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully!',
      user: { 
        name: newUser.name, 
        surname: newUser.surname, 
        email: newUser.email, 
        branch: newUser.branch, 
        role: newUser.role 
      },
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

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const isMatch = await user.comparePassword(password); 
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Authentication successful!',
      user: { 
        name: user.name, 
        surname: user.surname, 
        email: user.email, 
        branch: user.branch, 
        role: user.role, 
        createdAt: user.createdAt 
      },
      token: token 
    });
  } catch (error) {
    console.error("🔥 CRASH REPORT:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
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
    
    // If a file was uploaded, save its local path
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newFault = new Fault({
      userId: 
      req.user.userId, 
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});