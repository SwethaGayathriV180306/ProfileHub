import mongoose, { Schema, Document } from 'mongoose';

export interface IPlacement extends Document {
  student: mongoose.Types.ObjectId;
  companyName: string;
  role: string;
  appliedDate: Date;
  status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';
  ctcOffered?: number;
  offerLetterUrl?: string;
  interviewDate?: Date;
  notes?: string;
}

const PlacementSchema: Schema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  appliedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'], 
    default: 'Applied' 
  },
  ctcOffered: { type: Number },
  offerLetterUrl: { type: String },
  interviewDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model<IPlacement>('Placement', PlacementSchema);
