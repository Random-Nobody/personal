import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { setupWebRTC } from './webrtc';
import { connectDB } from './config/storage';
import apiRoutes from './routes/api';
import testRoutes from './routes/test';
import { setupSession } from './middleware/session';
import { errorLogger } from './middleware/error';
import { PORT } from './config/consts';

const app = express();
const httpServer = createServer(app);

async function initServer() {
  // middleware
  app.use(cors());
  app.use(express.json());

  // setup
  await connectDB();
  app.use(setupSession());
  setupWebRTC(httpServer);

  // routes
  app.use('/api', apiRoutes)
    .use('/test', testRoutes)
    .use('/public', express.static(path.join(__dirname, '../public')))
    .use(express.static(path.join(__dirname, '../spa')))
    .use((req, res, next) => {
      if (req.path.includes('.')) return next();
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(__dirname, '../spa/index.html'));
    });

  // todo: real error handling. This one just logs.
  app.use(errorLogger);

  httpServer.listen(PORT, () => console.log(`Server Start`));
}

initServer().catch(err => {
  console.error('Big error:', err);
  process.exit(1);
});
