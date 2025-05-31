import mongoose from 'mongoose';

// Using fixed Docker Compose values
const MONGO_URI = 'mongodb://mongo:27017/merndb';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
