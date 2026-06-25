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
export type RequestRecord = RequestRecordInput & {
  id: string;
  userId: string;
};
export type SavedSchema = {
  userId: string;
  content: string;
  updatedAt: string;
};
