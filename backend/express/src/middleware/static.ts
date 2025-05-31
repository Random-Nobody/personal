import express from 'express';
import path from 'path';

export const setupStatic = (app: express.Application) => {
  // Serve static files from public directory
  app.use(express.static(path.join(__dirname, '../../public')));
  
  // Serve the SPA and its assets
  app.use(express.static(path.join(__dirname, '../../public/app')));

  // SPA route handler for client-side routing
  app.use((req, res, next) => {
    if (req.path.includes('.')) return next();
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../../public/app/index.html'));
  });
};
