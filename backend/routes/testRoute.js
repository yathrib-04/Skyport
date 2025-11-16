import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/protected', authenticateUser, (req, res) => {
  res.json({
    message: `Hello ${req.user.fullName}, you are authorized!`,
    user: req.user
  });
});

export default router;
