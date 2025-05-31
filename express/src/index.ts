import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { setupWebRTC } from './webrtc';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/merndb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Setup WebRTC signaling
const io = setupWebRTC(httpServer);

// Routes
import userRoutes from './routes/userRoutes';

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'WebRTC Signaling Server',
    socketIO: true,
    status: 'running'
  });
});

// API routes
app.use('/api/users', userRoutes);

// Start server
httpServer.listen(port, () => {
  console.log(`WebRTC Signaling Server is running on port ${port}`);
});
