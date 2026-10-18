import { asyncHandler } from '../utils/asyncHandler.js';
import { NotificationPreference } from '../models/NotificationPreference.model.js';

export const getNotificationPreferences = asyncHandler(async (req, res) => {
  let pref = await NotificationPreference.findOne({ user: req.user._id });
  if (!pref) {
    pref = await NotificationPreference.create({
      user: req.user._id,
      email_blood_requests: true,
      sms_emergency_alerts: true,
      push_notifications: true,
      donation_reminders: true
    });
  }

  return res.status(200).json({
    email_blood_requests: pref.email_blood_requests,
    sms_emergency_alerts: pref.sms_emergency_alerts,
    push_notifications: pref.push_notifications,
    donation_reminders: pref.donation_reminders
  });
});

export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  let pref = await NotificationPreference.findOne({ user: req.user._id });
  if (!pref) {
    pref = new NotificationPreference({ user: req.user._id });
  }

  const {
    email_blood_requests,
    sms_emergency_alerts,
    push_notifications,
    donation_reminders
  } = req.body;

  if (email_blood_requests !== undefined && email_blood_requests !== null) {
    pref.email_blood_requests = email_blood_requests;
  }
  if (sms_emergency_alerts !== undefined && sms_emergency_alerts !== null) {
    pref.sms_emergency_alerts = sms_emergency_alerts;
  }
  if (push_notifications !== undefined && push_notifications !== null) {
    pref.push_notifications = push_notifications;
  }
  if (donation_reminders !== undefined && donation_reminders !== null) {
    pref.donation_reminders = donation_reminders;
  }

  await pref.save();

  return res.status(200).json({
    email_blood_requests: pref.email_blood_requests,
    sms_emergency_alerts: pref.sms_emergency_alerts,
    push_notifications: pref.push_notifications,
    donation_reminders: pref.donation_reminders
  });
});
