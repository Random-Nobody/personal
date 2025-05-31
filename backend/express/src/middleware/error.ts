import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

export const errorLogger = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Server error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Don't expose internal error details to client
  res.status(500).json({
    error: 'Server error'
  });
};