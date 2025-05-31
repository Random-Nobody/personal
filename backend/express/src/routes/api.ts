import express from 'express';
import userRoutes from './userRoutes';

const router = express.Router();

// API status route
router.get('/', (req, res) => {
  res.json({
    message: 'WebRTC Signaling Server',
    socketIO: true,
    status: 'running'
  });
});

// User routes
router.use('/users', userRoutes);

export default router;
