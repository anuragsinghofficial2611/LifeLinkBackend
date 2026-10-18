import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getNextSequence } from '../services/counter.service.js';

const hospitalSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ['Private', 'Government'],
      required: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    alternative_phone1: {
      type: String,
      default: null,
      trim: true
    },
    alternative_phone2: {
      type: String,
      default: null,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    site: {
      type: String,
      default: null,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    zipcode: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    district: {
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
    password: {
      type: String,
      required: true
    },
    is_verified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: 'hospital'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

hospitalSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('hospital_id');
  }

  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

hospitalSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Hospital = mongoose.model('Hospital', hospitalSchema);
