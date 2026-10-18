import mongoose from 'mongoose';
import { getNextSequence } from '../services/counter.service.js';

const bloodRequestSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true
    },
    patient_name: {
      type: String,
      required: true,
      trim: true
    },
    guardian_name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    additional_phone: {
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
    quantity: {
      type: String,
      required: true,
      trim: true
    },
    longitude: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    geohash_64_bits: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      default: 'pending',
      trim: true
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

bloodRequestSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('blood_request_id');
  }
  next();
});

export const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
