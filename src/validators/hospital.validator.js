import { z } from 'zod';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,128}$/;

export const hospitalBaseSchema = z.object({
  name: z.string().min(1, 'Hospital name is required').trim(),
  type: z.enum(['Private', 'Government'], {
    errorMap: () => ({ message: "Hospital type must be 'Private' or 'Government'" })
  }),
  phone: z.string().min(1, 'Phone number is required').trim(),
  alternative_phone1: z.string().optional().nullable(),
  alternative_phone2: z.string().optional().nullable(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  site: z
    .string()
    .regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'Invalid website URL format')
    .optional()
    .nullable(),
  city: z.string().min(1, 'City is required').trim(),
  zipcode: z.string().min(1, 'Zipcode is required').trim(),
  state: z.string().min(1, 'State is required').trim(),
  address: z.string().min(1, 'Address is required').trim(),
  district: z.string().min(1, 'District is required').trim(),
  longitude: z.number({ required_error: 'Longitude is required' }),
  latitude: z.number({ required_error: 'Latitude is required' }),
  geohash_64_bits: z.string().min(1, 'Geohash is required').trim(),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      passwordPattern,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character'
    )
});

export const hospitalLoginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required')
});
