import mongoose from 'mongoose';
import { getNextSequence } from '../services/counter.service.js';

const supportReportSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 150,
      trim: true
    },
    description: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 2000,
      trim: true
    },
    status: {
      type: String,
      default: 'pending',
      trim: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

supportReportSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('support_report_id');
  }
  next();
});

export const SupportReport = mongoose.model('SupportReport', supportReportSchema);
