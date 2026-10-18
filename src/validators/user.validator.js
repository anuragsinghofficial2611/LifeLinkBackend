import { z } from 'zod';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,128}$/;

export const userSettingsUpdateSchema = z.object({
  name: z.string().min(1).optional().nullable(),
  phone: z.string().max(20).optional().nullable()
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Old password is required'),
  new_password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      passwordPattern,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character'
    )
});
