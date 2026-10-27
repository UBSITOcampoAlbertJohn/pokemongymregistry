require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const GymLeader = require('./models/gym-leader');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('ERROR: MONGODB_URI is not defined in .env file.');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('Successfully connected to MongoDB Atlas.'))
  .catch((err) => {
    console.error('MongoDB connection failure:', err.message);
    process.exit(1);
  });

// REST API Endpoints

// GET /api/leaders - Read All
app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await GymLeader.find().sort({ createdAt: -1 });
    res.status(200).json(leaders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaders', error: error.message });
  }
});

// GET /api/leaders/:id - Read One
app.get('/api/leaders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Gym Leader not found (Invalid ID)' });
    }

    const leader = await GymLeader.findById(id);
    if (!leader) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }

    res.status(200).json(leader);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leader', error: error.message });
  }
});

// POST /api/leaders - Create
app.post('/api/leaders', async (req, res) => {
  try {
    const newLeader = new GymLeader(req.body);
    const savedLeader = await newLeader.save();
    res.status(201).json(savedLeader);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create leader', error: error.message });
  }
});

// PUT /api/leaders/:id - Update
app.put('/api/leaders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Gym Leader not found (Invalid ID)' });
    }

    const updatedLeader = await GymLeader.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedLeader) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }

    res.status(200).json(updatedLeader);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update leader', error: error.message });
  }
});

// DELETE /api/leaders/:id - Delete
app.delete('/api/leaders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Gym Leader not found (Invalid ID)' });
    }

    const deletedLeader = await GymLeader.findByIdAndDelete(id);
    if (!deletedLeader) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }

    res.status(200).json({ message: `Gym Leader '${deletedLeader.name}' successfully deleted.` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete leader', error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});