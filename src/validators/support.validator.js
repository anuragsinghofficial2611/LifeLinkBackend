import { z } from 'zod';

export const supportReportCreateSchema = z.object({
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(150, 'Subject must not exceed 150 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
});
