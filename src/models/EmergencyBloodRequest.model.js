import mongoose from 'mongoose';
import { getNextSequence } from '../services/counter.service.js';

const emergencyBloodRequestSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true
    },
    source: {
      type: String,
      enum: ['user', 'hospital'],
      required: true
    },
    blood_group: {
      type: String,
      required: true,
      trim: true
    },
    additional_remark: {
      type: String,
      default: null,
      trim: true
    },
    notes: {
      type: String,
      default: null,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null
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

emergencyBloodRequestSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('emergency_blood_request_id');
  }
  next();
});

export const EmergencyBloodRequest = mongoose.model(
  'EmergencyBloodRequest',
  emergencyBloodRequestSchema
);
