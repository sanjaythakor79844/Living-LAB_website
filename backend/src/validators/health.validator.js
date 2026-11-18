import { z } from 'zod';

/**
 * Health check endpoint validation schema (query parameters if any)
 */
export const healthQuerySchema = z.object({
  verbose: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
});

export default {
  healthQuerySchema,
};
