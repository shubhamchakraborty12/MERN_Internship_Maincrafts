const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();
const BASE_PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

app.post('/api/add', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Task text is required' });
    }

    const task = new Task({ text: text.trim() });
    await task.save();

    res.status(201).json({ message: 'Task added successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add task', error: error.message });
  }
});

app.get('/tasks', (req, res) => {
  res.redirect('/api/tasks');
});

app.post('/add', (req, res) => {
  res.redirect(307, '/api/add');
});

app.get('/', (req, res) => {
  res.send('Task API is running');
});

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.warn('MONGODB_URI is not set. Using in-memory MongoDB for local verification. Set your Atlas URI in backend/.env for production.');
      const memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();
    }

    await mongoose.connect(mongoUri, { autoIndex: true });
    console.log('MongoDB connected');

    const tryListen = (port) => {
      const server = app.listen(port, () => {
        console.log(`Backend running on http://localhost:${port}`);
      });

      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is busy. Trying ${port + 1} instead...`);
          server.close();
          tryListen(port + 1);
          return;
        }

        console.error('Failed to start server:', error.message);
        process.exit(1);
      });
    };

    tryListen(BASE_PORT);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
