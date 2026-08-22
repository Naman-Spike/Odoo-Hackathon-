import { z } from 'zod';

export const dateFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
