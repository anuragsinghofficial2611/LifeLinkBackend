import mongoose from 'mongoose';
import { getNextSequence } from '../services/counter.service.js';

const communityPostSchema = new mongoose.Schema(
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
    user_name: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 100,
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

communityPostSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('community_post_id');
  }
  next();
});

export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
