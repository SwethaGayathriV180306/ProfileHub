import express from 'express';
import { getStudentAnalytics, getAdminAnalytics } from '../controllers/analyticsController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/student', protect, getStudentAnalytics);
router.get('/admin', protect, admin, getAdminAnalytics);

export default router;
