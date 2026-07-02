import { z } from 'zod';
import { proxyPostRequestSchema } from '@/lib/proxy/schema';

/** Payload sent by the client to the proxy route */
export type ProxyRequestBody = z.infer<typeof proxyPostRequestSchema>;

/** Response returned by the proxy route to the client */
export type ProxyResponseBody = {
  status: number;
  headers: Record<string, string>;
  body: string;
};
