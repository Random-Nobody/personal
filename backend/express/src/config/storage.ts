import mongoose from 'mongoose';
import { MONGO_URI } from './consts.js';
import logger from '../utils/logger.js';

// MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    logger.error('Mongo Err:', err);
    process.exit(1);
  }
};

