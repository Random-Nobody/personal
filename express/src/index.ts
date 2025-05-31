import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/merndb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
import userRoutes from './routes/userRoutes';

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MERN asdfasdfStack API' });
});

// API routes
app.use('/api/users', userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
