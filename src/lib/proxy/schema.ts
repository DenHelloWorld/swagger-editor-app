import { z } from 'zod';

export const proxyPostRequestSchema = z.object({
  url: z.url(),
  method: z.string().min(1),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.string().optional(),
  endpoint: z.string().optional(),
});
