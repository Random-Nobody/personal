import { Request, Response, NextFunction } from 'express';

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Don't expose internal error details to client
  res.status(500).json({
    error: 'Server error'
  });
};