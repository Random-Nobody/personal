import mongoose, { Document, Schema, Types } from 'mongoose';

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  pass: string;
  lastLogin: Date;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
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

export const User = mongoose.model<IUser>('User', userSchema);
