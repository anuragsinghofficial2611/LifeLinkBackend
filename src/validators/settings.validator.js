import { z } from 'zod';

export const notificationPreferenceUpdateSchema = z.object({
  email_blood_requests: z.boolean().optional().nullable(),
  sms_emergency_alerts: z.boolean().optional().nullable(),
  push_notifications: z.boolean().optional().nullable(),
  donation_reminders: z.boolean().optional().nullable()
});
