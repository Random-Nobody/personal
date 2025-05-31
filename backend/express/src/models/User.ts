import mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface UserType extends Document {
  name: string;
  pass: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pass: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const User = mongoose.model<UserType>('User', userSchema);
