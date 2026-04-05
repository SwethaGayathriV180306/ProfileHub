import mongoose, { Schema, Document } from 'mongoose';

export interface IInternship extends Document {
  student: mongoose.Types.ObjectId;
  companyName: string;
  role: string;
  duration: string; // e.g., "3 months"
  startDate: Date;
  endDate?: Date;
  stipend?: number;
  certificateUrl?: string;
  evaluationScore?: number;
  status: 'Ongoing' | 'Completed' | 'Terminated';
}

const InternshipSchema: Schema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  stipend: { type: Number },
  certificateUrl: { type: String },
  evaluationScore: { type: Number },
  status: { type: String, enum: ['Ongoing', 'Completed', 'Terminated'], default: 'Ongoing' }
}, { timestamps: true });

export default mongoose.model<IInternship>('Internship', InternshipSchema);
