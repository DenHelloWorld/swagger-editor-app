/**
 * What the proxy collects after "Try-It-Out" (without `id` and `userId`)
 */
export type RequestRecordInput = {
  method: string;
  url: string;
  endpoint: string;
  statusCode: number;
  durationMs: number;
  requestSize: number;
  responseSize: number;
  errorDetails?: string;
  timestamp: string;
};
/**
 * What is stored in the database and arrives in History
 */
export type RequestRecord = RequestRecordInput & {
  id: string;
  userId: string;
};
/**
 * userId it must be obtained from the function getUserIdFromSession
 */
export type SavedSchema = {
  userId: string;
  content: string;
  format: 'json' | 'yaml';
  updatedAt: string;
};
