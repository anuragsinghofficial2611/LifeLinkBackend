import mongoose from 'mongoose';

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    email_blood_requests: {
      type: Boolean,
      default: true
    },
    sms_emergency_alerts: {
      type: Boolean,
      default: true
    },
    push_notifications: {
      type: Boolean,
      default: true
    },
    donation_reminders: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.user;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      }
    }
  }
);

export const NotificationPreference = mongoose.model(
  'NotificationPreference',
  notificationPreferenceSchema
);
