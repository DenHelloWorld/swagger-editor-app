import { z } from 'zod';

const httpUrlSchema = z.url();

/** Returns true if the value is a valid absolute HTTP/HTTPS URL. */
export function isHttpUrl(value: string): boolean {
  return httpUrlSchema.safeParse(value).success;
}
