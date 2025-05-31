import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

// API status route
router.get('/', (req, res) => {
  res.json({
    message: 'WebRTC Signaling Server',
    socketIO: true,
    status: 'running'
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
