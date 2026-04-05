import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  student: mongoose.Types.ObjectId;
  name: string;
  type: string; // Resume, Marksheet, Certificate
  fileUrl: string;
  fileSize: number; // in bytes
  status: 'Pending' | 'Approved' | 'Rejected';
  uploadedAt: Date;
  expiryDate?: Date;
}

const DocumentSchema: Schema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  uploadedAt: { type: Date, default: Date.now },
  expiryDate: { type: Date }
}, { timestamps: true });

export default mongoose.model<IDocument>('Document', DocumentSchema);
