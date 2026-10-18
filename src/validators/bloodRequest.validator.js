import { z } from 'zod';

export const bloodRequestCreateSchema = z.object({
  patient_name: z.string().min(1, 'Patient name is required').trim(),
  guardian_name: z.string().min(1, 'Guardian name is required').trim(),
  phone: z.string().min(1, 'Phone number is required').trim(),
  additional_phone: z.string().optional().nullable(),
  blood_group: z
    .string()
    .regex(/^(A|B|AB|O)[+-]$/, 'Blood group must be formatted as A+, A-, B+, B-, AB+, AB-, O+, or O-'),
  age: z
    .number()
    .int('Age must be an integer')
    .min(8, 'Age must be greater than 7')
    .max(99, 'Age must be 99 or less'),
  sex: z.string().min(1, 'Sex is required').trim(),
  quantity: z.string().min(1, 'Quantity in ml is required').trim(),
  longitude: z.number({ required_error: 'Longitude is required' }),
  latitude: z.number({ required_error: 'Latitude is required' }),
  geohash_64_bits: z.string().min(1, 'Geohash is required').trim()
});

export const bloodRequestUpdateSchema = z.object({
  status: z.string().min(1, 'Status is required').trim()
});
