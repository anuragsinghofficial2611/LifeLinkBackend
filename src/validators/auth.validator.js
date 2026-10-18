import { z } from 'zod';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,128}$/;

export const userRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  phone: z.string().max(20).optional().nullable(),
  blood_group: z
    .string()
    .regex(/^(A|B|AB|O)[+-]$/, 'Blood group must be formatted as A+, A-, B+, B-, AB+, AB-, O+, or O-'),
  age: z
    .number()
    .int('Age must be an integer')
    .min(8, 'Age must be greater than 7')
    .max(99, 'Age must be 99 or less'),
  sex: z.string().min(1, 'Sex is required').trim(),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      passwordPattern,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character'
    )
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required')
});
