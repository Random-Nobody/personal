import express, { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ name: username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.pass);
      if (!isMatch)
        return res.status(401).json({ error: 'Invalid password' })
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

    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.name,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  if (!req.session.authenticated) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy(() => { });
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.name,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

export default router;
