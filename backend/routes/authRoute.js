import express from 'express';
import { register, login,getMe,approveUser ,getPendingUsers } from '../controllers/authController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateUser, getMe);
router.get('/pending-users', authenticateUser, authorizeRole(['agent']), getPendingUsers);
router.post('/approve', authenticateUser, authorizeRole(['agent']), approveUser);
export default router;
