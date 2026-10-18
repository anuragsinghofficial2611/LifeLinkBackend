import { z } from 'zod';

export const emergencyBloodRequestSchema = z.object({
  blood_group: z.string().min(1, 'Blood group is required').trim(),
  additional_remark: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export const paginationQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(50)
});
