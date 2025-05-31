import { Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({}, { pass: 0 });
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, pass } = req.body;
    const user = new User({ name, email, pass });
    await user.save();
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { name, pass } = req.body;
  
  if (!name) {
    return void res.status(400).json({ error: 'Name is required' });
  }

  let user = await User.findOne({ name: name });
  if (user) {
    const isMatch = await bcrypt.compare(pass || '', user.pass);
    if (!isMatch)
      return void res.status(401).json({ error: 'Invalid pass' });
    
    user.lastLogin = new Date();
    await user.save();
  } else {
    const hashedPass = await bcrypt.hash(pass, 10);
    user = await User.create({
      name: name,
      pass: hashedPass,
      lastLogin: new Date()
    });
  }

  req.session.userId = user._id;
  req.session.name = user.name;
  req.session.authenticated = true;

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      lastLogin: user.lastLogin
    }
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.session.authenticated)
    return void res.status(401).json({ error: 'Not authenticated' });

  const user = await User.findById(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return void res.status(401).json({ error: 'User not found' });
  }

  res.json({
    id: user._id,
    name: user.name,
    lastLogin: user.lastLogin
  });
};

export const logoutUser = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
};
