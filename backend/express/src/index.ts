import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { setupWebRTC } from './webrtc';
import { connectDB } from './config/db';
import apiRoutes from './routes/api';
import { setupStatic } from './middleware/static';

const app = express();
const httpServer = createServer(app);
const port = 3000; // Fixed port for Docker

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Setup WebRTC signaling
const io = setupWebRTC(httpServer);

// Mount API routes
app.use('/api', apiRoutes);

// Setup static files and SPA handler
setupStatic(app);

// Start server
httpServer.listen(port, () => console.log(`Server running on port ${port}`));
