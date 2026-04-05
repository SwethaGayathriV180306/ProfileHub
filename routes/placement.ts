import express from 'express';
import { getPlacements, addPlacement, getInternships, addInternship, calculateResumeStrength } from '../controllers/placementController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/placements', protect, getPlacements);
router.post('/placements', protect, addPlacement);
router.get('/internships', protect, getInternships);
router.post('/internships', protect, addInternship);
router.get('/resume-strength', protect, calculateResumeStrength);

export default router;
