import mongoose from 'mongoose';
import { MONGO_URI } from './consts';

// MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Mongo Success');
  } catch (err) {
    console.error('Mongo Err:', err);
    process.exit(1);
  }
};

