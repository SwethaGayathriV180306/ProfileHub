import express from 'express';
import { getStudentProfile, updateStudentProfile, getPublicProfile, getNotifications, markNotificationsRead, uploadProfilePhoto } from '../controllers/studentController';
import { protect } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + extension);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();


router.get('/profile', protect, getStudentProfile);
router.put('/profile', protect, updateStudentProfile);
router.post('/profile/photo', protect, upload.single('photo'), uploadProfilePhoto);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);
router.get('/public/:username', getPublicProfile);

export default router;
