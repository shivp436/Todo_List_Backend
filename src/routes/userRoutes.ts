import express from 'express';
import { registerUser, loginUser, getMyProfile } from '../controllers/userControllers';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMyProfile);

export default router;