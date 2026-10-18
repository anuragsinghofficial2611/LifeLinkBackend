import { z } from 'zod';

export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(500, 'Message cannot exceed 500 characters'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'bot']),
        text: z.string().max(1000)
      })
    )
    .max(10, 'History cannot exceed 10 turns')
    .optional()
    .nullable()
});
