import mongoose from 'mongoose';
import { getNextSequence } from '../services/counter.service.js';

const donorRequestSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: null,
      trim: true
    },
    blood_group: {
      type: String,
      required: true,
      match: /^(A|B|AB|O)[+-]$/
    },
    age: {
      type: Number,
      required: true,
      min: 8,
      max: 99
    },
    sex: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

donorRequestSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('donor_request_id');
  }
  next();
});

export const DonorRequest = mongoose.model('DonorRequest', donorRequestSchema);
