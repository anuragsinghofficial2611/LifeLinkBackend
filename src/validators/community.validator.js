import { z } from 'zod';

export const communityPostCreateSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(100, 'Message cannot exceed 100 characters')
    .trim()
});
