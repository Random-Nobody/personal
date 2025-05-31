import express from 'express';
import { loginUser, getCurrentUser, logoutUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/me', getCurrentUser);
router.post('/logout', logoutUser);

export default router;
