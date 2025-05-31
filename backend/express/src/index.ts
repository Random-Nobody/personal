import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { setupWebRTC } from './webrtc';
import { connectDB } from './config/storage';
import apiRoutes from './routes/api';
import testRoutes from './routes/test';
import { setupSession } from './middleware/session';

const app = express();
const httpServer = createServer(app);
const port = 3000; // Fixed port for Docker

// Initialize the server
async function initServer() {
  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to databases
  await connectDB();

  // Setup session handling
  app.use(setupSession());

  // Setup WebRTC signaling
  setupWebRTC(httpServer);

  // Mount API routes
  app.use('/api', apiRoutes)
    .use('/test', testRoutes)

    .use('/public', express.static(path.join(__dirname, '../public')))
    .use(express.static(path.join(__dirname, '../spa')))
    .use((req, res, next) => {
      if (req.path.includes('.')) return next();
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(__dirname, '../spa/index.html'));
    });

  // Start server
  httpServer.listen(port, () => console.log(`Server Start`));
}

initServer().catch(err => {
  console.error('Big error:', err);
  process.exit(1);
});
