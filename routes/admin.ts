import express from 'express';
import { getAllStudents, getAuditLogs, bulkApproveStudents, getSuspiciousFiles, getPendingDocuments, verifyDocument, updateStudent, resetStudentPassword } from '../controllers/adminController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/students', protect, admin, getAllStudents);
router.get('/audit-logs', protect, admin, getAuditLogs);
router.post('/bulk-approve', protect, admin, bulkApproveStudents);
router.get('/suspicious-files', protect, admin, getSuspiciousFiles);
router.get('/documents/pending', protect, admin, getPendingDocuments);
router.put('/documents/:id/verify', protect, admin, verifyDocument);
router.put('/students/:id', protect, admin, updateStudent);
router.post('/students/:id/reset-password', protect, admin, resetStudentPassword);

export default router;
