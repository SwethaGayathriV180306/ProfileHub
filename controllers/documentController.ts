import { Request, Response } from 'express';
import Document from '../models/Document';
import AuditLog from '../models/AuditLog';

export const uploadDocument = async (req: any, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const extension = req.file.originalname.split('.').pop() || 'pdf';
  // Derive name from body, or fallback to the original file name
  const documentName = req.body.name || req.file.originalname;

  // Use a local URL so the file can be downloaded/viewed
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}.${extension}`;

  const document = new Document({
    student: req.user._id,
    name: documentName,
    type: req.body.type,
    fileUrl,
    fileSize: req.file.size,
    status: 'Pending',
  });

  const createdDocument = await document.save();

  const formattedDoc = {
    id: createdDocument._id,
    name: createdDocument.name,
    type: createdDocument.type,
    fileType: extension,
    size: createdDocument.fileSize,
    url: createdDocument.fileUrl,
    uploadDate: createdDocument.uploadedAt,
    status: createdDocument.status
  };

  await AuditLog.create({
    action: 'DOCUMENT_UPLOAD',
    performedBy: req.user._id,
    details: `Uploaded document: ${documentName}`,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(201).json(formattedDoc);
};

export const getDocuments = async (req: any, res: Response) => {
  const { search, status, sort } = req.query;
  const query: any = { student: req.user._id };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (status) {
    query.status = status;
  }

  let documents = Document.find(query);

  if (sort === 'date') {
    documents = documents.sort({ uploadedAt: -1 });
  } else if (sort === 'name') {
    documents = documents.sort({ name: 1 });
  }

  const result = await documents;
  
  const formattedDocs = result.map(doc => {
    // try to get extension from the URL if possible, otherwise default to 'pdf'
    const match = doc.fileUrl.match(/\.([a-zA-Z0-9]+)$/);
    const extension = match ? match[1] : 'pdf';
    
    return {
      id: doc._id,
      name: doc.name,
      type: doc.type,
      fileType: extension,
      size: doc.fileSize,
      url: doc.fileUrl,
      uploadDate: doc.uploadedAt,
      status: doc.status
    };
  });
  
  res.json(formattedDocs);
};

export const deleteDocument = async (req: any, res: Response) => {
  const document = await Document.findById(req.params.id);

  if (document) {
    if (document.student.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await document.deleteOne();
    res.json({ message: 'Document removed' });
  } else {
    res.status(404).json({ message: 'Document not found' });
  }
};
