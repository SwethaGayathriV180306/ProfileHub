import express from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/documentController';
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

router.post('/', protect, upload.single('file'), uploadDocument);
router.get('/', protect, getDocuments);
router.delete('/:id', protect, deleteDocument);

export default router;
