import express, { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

const router = express.Router();

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  let user = await User.findOne({ name: username });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.pass);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid password' })
      return;
    }
    user.lastLogin = new Date();
    await user.save();
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name: username,
      password: hashedPassword,
      lastLogin: new Date()
    });
  }
  req.session.name = user.name;
  req.session.authenticated = true;
  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.name,
      lastLogin: user.lastLogin
    }
  });
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  if (!req.session.authenticated) {
    res.status(401).json({ error: 'Not authenticated' });
    return
  }
  const user = await User.findById(req.session.userId);
  if (!user) {
    req.session.destroy(() => { });
    res.status(401).json({ error: 'User not found' });
    return
  }
  res.json({
    id: user._id,
    username: user.name,
    lastLogin: user.lastLogin
  });
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

export default router;
